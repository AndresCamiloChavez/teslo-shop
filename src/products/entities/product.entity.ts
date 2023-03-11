import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true, // ya no dos proudctos no pueden tener el mismo nombre
  })
  title: string;

  @Column('float', {
    default: 0, // defecto
  })
  price: number;

  @Column({
    type: 'text',
    nullable: true, // acepta nulos
  })
  description: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('text', {
    array: true,
  })
  sizes: string[];

  @Column('text')
  gender: string;

  @BeforeInsert() // es un método que se ejecuta antes de insertar
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

//   @BeforeUpdate()
}
