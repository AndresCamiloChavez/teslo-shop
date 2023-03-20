import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
     
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: ( configService: ConfigService) =>  // cuando se intente registrar de manera asincrona el modulo
      {
        // console.log('Valor secret', process.env.JWT_SECRET);
        console.log('Valor secret', configService.get('JWT_SECRET'));
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }

        }
      }
    })
  ],
  exports: [
    TypeOrmModule, // exportar el usuario la entidad
  ],
})
export class AuthModule {}
