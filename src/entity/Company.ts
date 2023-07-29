import { IsNotEmpty, IsString } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Employee } from "./Employee";

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  email: string;

  @Column()
  address: string;

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];
}
