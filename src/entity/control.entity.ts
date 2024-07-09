import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Relation } from "typeorm";
import { Device } from "./device.entity";

@Entity("controls")
export class Control {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  entity_id: string;

  @Column()
  type: string;

  @ManyToOne(() => Device, (device) => device.controls)
  device: Relation<Device>
}