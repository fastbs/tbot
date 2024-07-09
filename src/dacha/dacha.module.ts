import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Telegraf } from "telegraf";

import { DachaUpdate } from "./dacha.update";
import { DachaService } from "./dacha.service";
import { HAService } from "./ha.service";
import { Camera } from "@/entity/camera.entity";
import { Device } from "@/entity/device.entity";
import { Sensor } from "@/entity/sensor.entity";
import { Control } from "@/entity/control.entity";


@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Camera, Device, Sensor, Control])],
  providers: [DachaUpdate, DachaService, HAService, Telegraf], //, RandomNumberScene],
})
export class DachaModule { }
