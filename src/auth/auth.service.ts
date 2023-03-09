import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserInput } from './dto/login-user.input';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private userservice:UsersService,private jwtService : JwtService){}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userservice.findOne(username);
        if (user && user.password === password) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

      async login(loginUserInput: LoginUserInput){
        const user = await this.userservice.findOne(loginUserInput.username)

        const {password, ...result} = user;

        return{
          access_token : this.jwtService.sign(
            {username : user.username,
              sub : user.id
            }),
         user
      }
   }

   async signup(loginUserInput : LoginUserInput){
    const user = await this.userservice.findOne(loginUserInput.username);

    

    if(user){
      throw new Error('User already exists!');
      
    }
    const password = await bcrypt.hash(loginUserInput.password,10)

    return this.userservice.create({
      ...loginUserInput,
      password
    })
   }
}
