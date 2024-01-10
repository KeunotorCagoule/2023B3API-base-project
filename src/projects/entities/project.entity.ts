import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Project {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    @Column({ nullable: false })
    public name!: string;

    @Column({ nullable: false })
    public referringEmployeeId!: string;

    @ManyToOne(() => User, {nullable: false, cascade: true, eager: true})
    @JoinColumn({name : 'referringEmployeeId'})
    referringEmployee!: User
}
