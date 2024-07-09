import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource, Not, IsNull } from "typeorm";

import { Camera } from "@/entity/camera.entity";
import { Device } from "@/entity/device.entity";
import { Sensor } from "@/entity/sensor.entity";
import { Control } from "@/entity/control.entity";

@Injectable()
export class DachaService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Camera)
    private camerasRepository: Repository<Camera>,
    @InjectRepository(Device)
    private devicesRepository: Repository<Device>,
    @InjectRepository(Sensor)
    private sensorsRepository: Repository<Sensor>,
    @InjectRepository(Control)
    private controlsRepository: Repository<Control>,
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
        controls: true,
      },
    });
  }

  async findAllSensoredDevices(): Promise<Device[]> {
    const devices = this.devicesRepository
      .createQueryBuilder("device")
      .leftJoinAndSelect("device.sensors", "sensor")
      .where("sensor.id IS NOT NULL")
      .getMany();

    return devices;
  }

  async findAllControlledDevices(): Promise<Device[]> {
    /*     const ds = await this.devicesRepository.find({
          relations: {
            controls: true,
          },
          where: {
            controls: {
              id: Not(IsNull())
            },
        },
        }); */
    const devices = this.devicesRepository
      .createQueryBuilder("device")
      .leftJoinAndSelect("device.controls", "control")
      .where("control.id IS NOT NULL")
      .getMany();

    return devices;
  }

  async getDevice(id: number): Promise<Device | null> {
    return this.devicesRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        sensors: true,
        controls: true,
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

  async getSensor(id: number): Promise<Sensor | null> {
    return this.sensorsRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        device: true,
      },
    });
  }
  async findAllControls(): Promise<Control[]> {
    const controls = this.controlsRepository
      .createQueryBuilder("controls")
      .leftJoinAndSelect("controls.device", "device")
      //.select("controls.device")
      .distinctOn(["controls.device"])
      //.where("device.controls IS NOT NULL")
      .getMany();

    return controls;
  }

  async getControl(id: number): Promise<Control | null> {
    return this.controlsRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        device: true,
      },
    });
  }

  echo(text: string): string {
    return `Echo: ${text}`;
  }
}
