import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Company } from "./Company";

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Column({ nullable: false, unique: true })
  @IsNotEmpty()
  @IsNumber()
  staffId: number;

  @ManyToOne(() => Company, (company) => company.employees)
  @JoinColumn({ name: "companyId" })
  company: Company;

  @Column()
  departments: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  address: string;
}
