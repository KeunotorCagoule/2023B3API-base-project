import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  date: Date;

  eventDescription?: string;

  @IsNotEmpty()
  eventType!: 'RemoteWork' | 'PaidLeave';
}
