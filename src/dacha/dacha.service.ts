import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Camera } from '@/entity/camera.entity';
import { Device } from '@/entity/device.entity';
import { Sensor } from '@/entity/sensor.entity';

@Injectable()
export class DachaService {
  constructor(
    @InjectRepository(Camera)
    private camerasRepository: Repository<Camera>,
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
    @InjectRepository(Sensor)
    private sensorsRepository: Repository<Sensor>,
  ) { }

  async findAllCameras(): Promise<Camera[]> {
    return this.camerasRepository.find();
  }

  async getCamera(id: number): Promise<Camera | null> {
    return this.camerasRepository.findOneBy({ id });
  }

  async findAllDevices(): Promise<Device[]> {
    return this.devicesRepository.find({
      relations: {
        sensors: true,
      },
    });
  }

  async getDevice(id: number): Promise<Device | null> {
    return this.devicesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        sensors: true,
      },
    });
  }

  async findAllSensors(): Promise<Sensor[]> {
    return this.sensorsRepository.find({
      relations: {
        device: true,
      },
    });
  }

  echo(text: string): string {
    return `Echo: ${text}`;
  }
}
