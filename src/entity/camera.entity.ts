import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("cameras")
export class Camera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  short_name: string;

  @Column()
  main: string;

  @Column()
  second: string;
}
