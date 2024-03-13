import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CurrencyService } from './currency.service';
import { CurrencyRepository } from './currency.repository';
import { CurrencyController } from './currency.controller';
import { CurrencyFreaksModule, NatsClientModule } from '../../providers';

import { CurrencySchema } from './currency.schema';

@Module({
    exports: [],
    imports: [
        MongooseModule.forFeature([{ name: 'Currency', schema: CurrencySchema }]),
        CurrencyFreaksModule,
        NatsClientModule
    ],
    controllers: [CurrencyController],
    providers: [CurrencyService, CurrencyRepository]
})
export class CurrencyModule {}