import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
//import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { TelegrafModule } from "nestjs-telegraf";
import { DachaModule } from "./dacha/dacha.module";

import { LoggerMiddleware } from "./logger.middleware";

import { Camera } from "./entity/camera.entity";
import { Device } from "./entity/device.entity";
import { Sensor } from "./entity/sensor.entity";
import { Control } from "./entity/control.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: process.env.DATABASE,
      entities: [Camera, Device, Sensor, Control],
      synchronize: true,
    }),
    TelegrafModule.forRoot({
      token: process.env.BOT_TOKEN,
      include: [DachaModule],
    }),
    DachaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
