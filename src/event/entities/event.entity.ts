import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Event {
    @PrimaryGeneratedColumn('uuid')
    public id!: string;

    public date!: Date;

    @Column({ default: 'Pending' })
    public eventStatus?: 'Pending' | 'Approved' | 'Declined';
    
    public eventType!: 'RemoteWork' | 'PaidLeave';
    
    public eventDescription?: string;

    public userId!: string;
}
