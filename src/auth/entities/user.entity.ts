import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email', type: 'text', unique: true })
  email: string;

  @Column({ name: 'password', type: 'text', select: false }) // cuando se realiza un find no obtiene la contraseña
  password: string;

  @Column({ name: 'fullName', type: 'text' })
  fullName: string;

  @Column({ name: 'isActive', type: 'bool', default: true })
  isActive: boolean;

  @Column({ type: 'text', array: true, default: ['user'] })
  rol: string[];

  @BeforeInsert()
  checkFieldBeforeInsert(){
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate(){
    this.checkFieldBeforeInsert();
  }
}
