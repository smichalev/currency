import { HttpService } from '@nestjs/axios';
import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as qs from 'qs';

import { CURRENCY_FREAKS_CLIENT_OPTIONS } from './constants';
import {
    ClientOptions,
    GetLatestCurrencyRequest,
    GetLatestCurrencyResponse
} from './types';

@Injectable()
export class CurrencyFreaksService {
    constructor(
        @Inject(CURRENCY_FREAKS_CLIENT_OPTIONS)
        private readonly options: ClientOptions,
        private readonly httpService: HttpService
    ) {}

    private get url() {
        return this.options.url;
    }

    private get token() {
        return this.options.token;
    }

    public async getLatestCurrency({ symbols, base }: GetLatestCurrencyRequest): Promise<GetLatestCurrencyResponse> {
        const queryString = qs.stringify({
            apikey: this.token,
            symbols: symbols.join(','),
            base
        });

        const { data, status } = await firstValueFrom(
            this.httpService.request<GetLatestCurrencyResponse>({
                method: 'GET',
                url: `${this.url}rates/latest?${ queryString }`
            })
        );

        if (status !== 200) {
            throw new BadRequestException('Failed to get exchange rate');
        }

        return data;
    }
}