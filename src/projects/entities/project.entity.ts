import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column({ nullable: false, unique: true })
    public name!: string;

    @Column({ nullable: false })
    public referringEmployeeId!: string;
}
