import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Events {

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column({nullable: false})
    public date: Date;

    @Column({nullable: false, default: "Pending"})
    public eventStatus?: 'Pending' | 'Accepted' | 'Declined'
    
    @Column({nullable: false})
    public eventType: 'RemoteWork' | 'PaidLeave';

    @Column({nullable: true})
    public eventDescription: string;

    @Column({nullable: false, type: "uuid"})
    public userId: string;

    @ManyToOne(() => User, user => user.events)
    @JoinColumn({ name: 'userId' })
    public user: User;
}