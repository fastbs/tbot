import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Telegraf } from 'telegraf';

import { DachaUpdate } from './dacha.update';
import { DachaService } from './dacha.service';
import { Camera } from '@/entity/camera.entity';
import { Device } from '@/entity/device.entity';
import { Sensor } from '@/entity/sensor.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Camera, Device, Sensor])],
  providers: [DachaUpdate, DachaService, Telegraf], //, RandomNumberScene],
})
export class DachaModule { }
