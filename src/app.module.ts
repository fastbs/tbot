import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TelegrafModule } from 'nestjs-telegraf';
import { EchoModule } from './echo/echo.module';



@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '7085725957:AAHKa6f7Zt10gE1w2AsMeyYaKzuKidPmtyA',
      include: [EchoModule],
    }),
    EchoModule,

],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule implements NestModule {

  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
