import { PrimaryGeneratedColumn } from "typeorm";

export class Project {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;
    public name!: string;
    public referringEmployeeId!: string;
}
