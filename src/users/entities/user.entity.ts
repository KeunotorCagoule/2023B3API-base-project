import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: false, unique: true })
  public username!: string;

  @Column({ nullable: false, unique: true })
  public email!: string;

  @Column({ nullable: false, select: false })
  public password!: string;

  @Column({ default: 'Employee' })
  public role?: 'Employee' | 'Admin' | 'ProjectManager';
}
