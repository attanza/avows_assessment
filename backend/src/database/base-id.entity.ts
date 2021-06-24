import { BaseEntity, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
abstract class BaseIdEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  _id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default BaseIdEntity;
