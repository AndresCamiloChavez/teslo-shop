import { join } from 'path';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path))
      throw new BadGatewayException(`No product found with ${imageName} `);
    return path;
  }
}
