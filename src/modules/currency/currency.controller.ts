import {Controller, Get, Query} from "@nestjs/common";

import { CurrencyRepository } from './currency.repository';
import { CurrencyByTimestampDto, CurrencyByFromAndToDto } from './dto';

@Controller('currency')
export class CurrencyController {
    constructor(
        private currencyRepository: CurrencyRepository,
    ) {}

    @Get()
    async getCurrenciesByFromAndTo(@Query() currencyByFromAndToDto: CurrencyByFromAndToDto) {
        return this.currencyRepository.getCurrenciesByFromAndTo(currencyByFromAndToDto.from, currencyByFromAndToDto.to);
    }

    @Get('by-timestamp')
    async getByTimestamp(@Query() currencyByTimestampDto: CurrencyByTimestampDto) {
        return this.currencyRepository.getCurrenciesByTimestamp(currencyByTimestampDto.timestamp);
    }
}