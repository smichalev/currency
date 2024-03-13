import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { CurrencyFreaksService } from './currency-freaks.service';
import { ClientOptions } from './types';
import { CURRENCY_FREAKS_CLIENT_OPTIONS } from './constants';

@Module({
    exports: [CurrencyFreaksService],
    imports: [HttpModule],
    providers: [
        CurrencyFreaksService,
        {
            inject: [ConfigService],
            provide: CURRENCY_FREAKS_CLIENT_OPTIONS,
            useFactory: (configService: ConfigService): ClientOptions => ({
                token: configService.getOrThrow('CURRENCY_FREAKS_TOKEN'),
                url: configService.getOrThrow('CURRENCY_FREAKS_URL')
            })
        }
    ]
})
export class CurrencyFreaksModule {}