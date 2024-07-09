import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Relation } from "typeorm";
import { Device } from "./device.entity";

@Entity("sensors")
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ha_name: string;

  @Column()
  object_id: string;

  @Column()
  unit_of_measurement: string;

  @ManyToOne(() => Device, (device) => device.sensors)
  device: Relation<Device>
}