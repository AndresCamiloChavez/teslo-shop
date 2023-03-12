import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from '.';

@Entity({
  name: "products"
})
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

  @Column('text', {
    array: true,
    default: []
  })

  tags: string[];

  @OneToMany( // es una relación
    () => ProductImage,
    (productImage) => productImage.product,
    {cascade: true, eager: true} // va a carga las imagenes
  )
  images?: ProductImage[];

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

  @BeforeUpdate()
  updateAndCheckSlug() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
