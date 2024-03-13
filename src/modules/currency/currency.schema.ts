import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Currency {
    @Prop()
    from!: string;

    @Prop()
    to!: string;

    @Prop()
    price!: number;

    @Prop({ default: () => new Date() })
    timestamp!: Date;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);