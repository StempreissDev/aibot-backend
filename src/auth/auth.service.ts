import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
    // 1. REGISTRO (Para el formulario del Frontend)
  async register(email: string, pass: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);
    const user = this.usersRepository.create({ 
      email, 
      password: hashedPassword 
    });
    return this.usersRepository.save(user);
  }

  // 2. LOGIN (Valida y devuelve Token)
  async login(email: string, pass: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Contraseña incorrecta');

    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user_id: user.id // Útil para el frontend
    };
  }
}


