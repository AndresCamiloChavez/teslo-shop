import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetUser, RawHeaders } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
    @Post('register')
    create(@Body() createUserDto: CreateUserDto) {
      return this.authService.create(createUserDto);
    }
  
    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto) {
      return this.authService.login(loginUserDto);
    }

    @Get()
    @UseGuards( AuthGuard()) // realiza la validación del usuario por los headers

    testingPrivateRoute(
      @GetUser() user: User,
      @GetUser('fullName') userEmail: User,
      @RawHeaders() rawHeaders: string[]
      // @Req() request: Express.Request,
      ){

      console.log(user);
      
      return {
        ok: true,
        message: user,
        email: userEmail,
        rawHeaders
      }
    }


  
}
