import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
  PROJECT_MANAGER = 'ProjectManager'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id!: string;

  @Column({ nullable: false, unique: true })
  readonly username!: string;

  @Column({ nullable: false, unique: true })
  readonly email!: string;

  @Column({ nullable: false })
  @Exclude({ toPlainOnly: true })
  readonly password!: string;

  @Column({ default: UserRole.EMPLOYEE, nullable: false })
  readonly role?: UserRole;
}
