import { Module } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { EchoUpdate } from './echo.update';
import { EchoService } from './echo.service';
//import { RandomNumberScene } from '../greeter/scenes/random-number.scene';

@Module({
    providers: [EchoUpdate, EchoService, Telegraf], //, RandomNumberScene],
})
export class EchoModule { }