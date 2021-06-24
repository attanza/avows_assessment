import { hash } from 'argon2';
import { Exclude } from 'class-transformer';
import BaseIdEntity from 'src/database/base-id.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';

@Entity('users')
class User extends BaseIdEntity {
  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  @Exclude()
  public password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password);
  }
}

export default User;
