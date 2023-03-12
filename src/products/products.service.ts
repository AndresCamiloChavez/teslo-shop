import { NotFoundException } from '@nestjs/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Logger } from '@nestjs/common/services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';
import { url } from 'inspector';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService'); // para manejar los logs

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(
          (img) => this.productImageRepository.create({ url: img }), // TYPEORM infiere y relaciona la imagen con el producto
        ),
      }); // se guarda en momoria
      await this.productRepository.save(product); // ya se, tanto el producto como las imágenes guarda en base datos
      return { ...product, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginatioDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginatioDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true, // se puede especificar los campos en las opciones
      },
    });

    return products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      // product = await this.productRepository.findOneBy({ slug: term });
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`title ILIKE :title or slug ILIKE :slug`, {
          title: term,
          slug: term,
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
    if (!product) throw new NotFoundException(`Product with ${term} not found`);
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.preload({
        // buscate un producto por el id y agregale las propiedades del dto
        id: id,
        ...updateProductDto,
        images: [],
      });

      if (!product) throw new NotFoundException(`No found product with ${id}`);

      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async findOneClean(term: string){
    const {images = [], ...product} = await this.findOne(term);

    return {
      ...product,
      images: images.map(img => img.url)
    };
  }

  private handleDBExceptions(error: any) {
    if (error.code == '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
