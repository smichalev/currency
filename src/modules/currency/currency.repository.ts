import {Injectable, Inject, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { Model } from 'mongoose';

import { Currency } from './currency.schema';
import {CurrencyValue} from "../../providers";

@Injectable()
export class CurrencyRepository {
    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy,
        @InjectModel(Currency.name) private readonly currencyModel: Model<Currency>
    ) {}

    public async getCurrenciesByFromAndTo(from: CurrencyValue, to: CurrencyValue): Promise<Currency> {
        const startDate = new Date();
        startDate.setUTCHours(0, 0, 0, 0)

        const endDate = new Date();
        endDate.setUTCHours(23, 59, 59, 999)

        const row = await this.currencyModel.findOne({
            from,
            to,
            timestamp: {
                $gt: startDate.toISOString(),
                $lt: endDate.toISOString()
            }
        }).exec();

        if (!row) {
            throw new NotFoundException('Currency not found');
        }

        return {
            from: row.from,
            to: row.to,
            price: row.price,
            timestamp: row.timestamp
        }
    }

    public async getCurrenciesByTimestamp(date: string): Promise<Currency[]> {
        const startDate = new Date(date);
        startDate.setUTCHours(0, 0, 0, 0)

        const endDate = new Date(date);
        endDate.setUTCHours(23, 59, 59, 999)

        const rows = await this.currencyModel.find({
            timestamp: {
                $gt: startDate.toISOString(),
                $lt: endDate.toISOString()
            }
        }).exec();

        if (!rows.length) {
            throw new NotFoundException('Currencies not found');
        }

        return rows.map(({ from, to, timestamp, price }) => ({ from, to, timestamp, price }));
    }

    public async createCurrency(from: CurrencyValue, to: CurrencyValue, price: number): Promise<Currency> {
        const createdCurrency = await this.currencyModel.create({
            from,
            to,
            price
        });

        this.natsClient.emit('currency-updated', createdCurrency);

        return createdCurrency;
    }

    public async updateCurrency(from: CurrencyValue, to: CurrencyValue, price: number): Promise<Currency> {
        const currency = await this.currencyModel.findOne({
            from,
            to
        }).exec();

        if (!currency) {
            throw new NotFoundException('Currency not found');
        }

        await this.currencyModel.updateOne({
            from,
            to
        }, {
            price,
            timestamp: new Date()
        }).exec();

        const updatedCurrency = await this.currencyModel.findOne({
            from,
            to
        }).exec();

        this.natsClient.emit('currency-updated', updatedCurrency);

        return updatedCurrency;
    }

    public async deleteAll() {
        await this.currencyModel.deleteMany({}).exec();
    }
}