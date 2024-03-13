import {Injectable, OnModuleInit} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {CurrencyValue, GetLatestCurrencyResponse} from '../../providers';
import {Currency} from '../../providers/currency-freaks/constants';
import { CurrencyFreaksService } from '../../providers';
import { CurrencyRepository } from './currency.repository';

type Pairs = Array<{ from: CurrencyValue; to: CurrencyValue, price?: number; }>;
type PairsWithPrice = Array<{ from: CurrencyValue; to: CurrencyValue, price: number; }>;

@Injectable()
export class CurrencyService implements OnModuleInit {
    constructor(
        private currencyFreaksService: CurrencyFreaksService,
        private currencyRepository: CurrencyRepository
    ) {
    }

    async onModuleInit() {
        await this.currencyRepository.deleteAll();

        const actualRates = await this.getActualRates();

        await Promise.all(actualRates.map(({ from, to, price }) => this.currencyRepository.createCurrency(from, to, price)));
    }

    @Cron('0 0 * * *')
    private async updateCurrencies() {
        const actualRates = await this.getActualRates();

        await Promise.all(actualRates.map(({ from, to, price }) => this.currencyRepository.updateCurrency(from, to, price)));
    }


    private getActivePairs(): Pairs {
        const values = Object.keys(Currency);

        return values.reduce((acc: Array<{ from: CurrencyValue; to: CurrencyValue; }>, value: CurrencyValue) => {
            values.forEach((item) => {
                acc.push({
                    from: item as CurrencyValue,
                    to: value as CurrencyValue
                });
            });

            return acc;
        }, []);
    }

    private mapRates(activePairs: Pairs, latestCurrency: GetLatestCurrencyResponse): PairsWithPrice {
        return activePairs.map((item) => {
            if (item.from === item.to) {
                return {
                    ...item,
                    price: 1
                };
            }

            if (item.from === Currency.USD) {
                return {
                    ...item,
                    price: +latestCurrency.rates[item.to]
                }
            }

            if (item.to === Currency.USD) {
                return {
                    ...item,
                    price: 1 / +latestCurrency.rates[item.from]
                }
            }

            return {
                ...item,
                price: (1 / +latestCurrency.rates[item.from]) / (1 / +latestCurrency.rates[item.to])
            }
        })
    }

    private async getActualRates(): Promise<PairsWithPrice> {
        const latestCurrency = await this.currencyFreaksService.getLatestCurrency({
            base: Currency.USD,
            symbols: [
                Currency.JPY,
                Currency.EUR,
                Currency.RUB
            ]
        });

        const activePairs = this.getActivePairs();

        return this.mapRates(activePairs, latestCurrency);
    }
}