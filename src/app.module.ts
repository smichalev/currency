import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { CurrencyFreaksModule } from './providers';
import { CurrencyModule } from './modules';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      ScheduleModule.forRoot(),
      MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          // TODO не стал усложнять, сделал без авторизации для демо хватит
          useFactory: async (config: ConfigService) => ({
              uri: `mongodb://${config.get<string>(
                  'MONGODB_HOST'
              )}:${config.get<string>('MONGODB_PORT')}/${config.get<string>(
                  'MONGODB_DATABASE'
              )}`
          })
      }),
      CurrencyFreaksModule,
      CurrencyModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
