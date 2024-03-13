import { Currency } from './constants';

export type CurrencyValue = (typeof Currency)[keyof typeof Currency];

export type CurrencyValues = CurrencyValue[];

export type ClientOptions = Readonly<{
    url: string;
    token: string;
}>;

export type GetLatestCurrencyRequest = Readonly<{
    symbols: CurrencyValues;
    base: CurrencyValue
}>

export type GetLatestCurrencyResponse = Readonly<{
    base: CurrencyValue;
    date: string
    rates: {
        [key: string]: string;
    }
}>