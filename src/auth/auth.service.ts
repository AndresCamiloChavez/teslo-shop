import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRespository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRespository.save(user);

      delete user.password; // eliminando la propiedad del objeto

      return { user, token: this.getJWT({ email: user.email, user: user.id }) };
      //TODO: retornar el Jsontoken
    } catch (error) {
      this.handleDBError(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRespository.findOne({
      where: { email: email.toLowerCase().trim() },
      select: { email: true, password: true, id: true }, // realizando la consulta, para que solo obtenga el email, contraseña
    });

    if (!user)
      throw new UnauthorizedException('Credentials are no valid (email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are no valid (password)');

    delete user.password;
    const responseUser = {
      user,
      token: this.getJWT({ email: user.email, user: user.id }),
    };
    return responseUser;
    //TODO: retornar token
  }

  private getJWT(payload: JWTPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBError(error: any): never {
    if ((error.code = '23505')) {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Please check server logs');
  }
}
