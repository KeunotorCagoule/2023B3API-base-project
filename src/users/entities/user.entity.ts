import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Events } from '../../event/entities/event.entity';

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

  @OneToMany(() => Events, event => event.user)
    public events: Events[];
}
