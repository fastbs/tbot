import { Column, Entity, PrimaryGeneratedColumn, OneToMany, Relation, JoinColumn } from "typeorm";
import { Sensor } from "./sensor.entity";
import { Control } from "./control.entity";

@Entity("devices")
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ha_name: string;

  @Column()
  entry_id: string;

  @OneToMany(() => Sensor, (sensor) => sensor.device)
  @JoinColumn()
  sensors: Relation<Sensor>[];

  @OneToMany(() => Control, (control) => control.device)
  @JoinColumn()
  controls: Relation<Control>[];
}
