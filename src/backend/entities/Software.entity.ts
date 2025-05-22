
// TODO: Implement with TypeORM when available
// This is a placeholder for the Software entity

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany
} from 'typeorm'; // Import when TypeORM is available

// import { AccessRequest } from './AccessRequest.entity';

/*
@Entity('software')
export class Software {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('simple-array')
  accessLevels: string[];

  @OneToMany(() => AccessRequest, request => request.software)
  requests: AccessRequest[];
}
*/

// Placeholder export to avoid TypeScript errors
export const SoftwareEntity = {};
