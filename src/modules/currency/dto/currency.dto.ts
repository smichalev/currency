import { IsDateString, IsString, IsIn } from 'class-validator';
import { Currency } from '../../../providers/currency-freaks/constants';
import {CurrencyValue} from "../../../providers";

export class CurrencyByTimestampDto {
    @IsDateString()
    public readonly timestamp!: string;
}

export class CurrencyByFromAndToDto {
    @IsString()
    @IsIn([Currency.JPY, Currency.EUR, Currency.RUB, Currency.USD])
    public readonly from!: CurrencyValue;

    @IsString()
    @IsIn([Currency.JPY, Currency.EUR, Currency.RUB, Currency.USD])
    public readonly to!: CurrencyValue;
}