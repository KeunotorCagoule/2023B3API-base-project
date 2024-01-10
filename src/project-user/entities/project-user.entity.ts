import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ nullable: false })
  public startDate!: Date;

  @Column({ nullable: false })
  public endDate!: Date;

  @Column({ nullable: false })
  public projectId!: string;

  @Column({ nullable: false })
  public userId!: string;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => Project, { nullable: false, cascade: true, eager: true })
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => User, { nullable: false, cascade: true, eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User;
}
