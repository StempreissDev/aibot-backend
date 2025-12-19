import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Message } from 'src/messages/entities/message.entity';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { OpenAiService } from './openai/openai.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    // 1. Aquí registramos las Entidades para que TypeORM las inyecte en los servicios
    TypeOrmModule.forFeature([Conversation, Message]),
    AuthModule
  ],
  controllers: [ChatController], // 2. Registramos el controlador (rutas)
  providers: [ChatService, OpenAiService], // 3. Registramos los servicios (lógica)
})
export class ChatModule {}
