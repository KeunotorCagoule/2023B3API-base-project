import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectUser {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({nullable: false})
  public startDate!: Date;
  
  @Column({nullable: false})
  public endDate!: Date;

  @Column({nullable: false})
  public projectId!: string;

  @Column({nullable: false})
  public userId!: string;
}
