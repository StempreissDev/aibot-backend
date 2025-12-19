import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { PassportModule } from '@nestjs/passport/dist/passport.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // 1. Importa el repositorio de la entidad User
    TypeOrmModule.forFeature([User]), 
    PassportModule.register({ defaultStrategy: 'jwt' }), // <--- 2. REGISTRA PASSPORT
    // 2. Importa el JwtModule (configúralo según tus necesidades)
    JwtModule.register({
      secret: 'tu_secreto_aqui',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
 providers: [AuthService, JwtStrategy], // <--- 3. ¡AGRÉGALO AQUÍ! Si falta, falla.
  exports: [PassportModule, JwtStrategy, AuthService],
})
export class AuthModule {}
