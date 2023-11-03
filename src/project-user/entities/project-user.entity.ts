import { PrimaryGeneratedColumn } from "typeorm";

export class ProjectUser {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    public startDate!: Date;
    public endDate!: Date;

    public projectId!: string;

    public userId!: string;
}
