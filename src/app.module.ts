import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Conversation } from './conversations/entities/conversation.entity';
import { Message } from './messages/entities/message.entity';
import { AuthModule } from './auth/auth.module';
import { OpenAiService } from './chat/openai/openai.service';
import { ChatModule } from './chat/chat.module';



@Module({
  imports: [UsersModule, ConversationsModule, MessagesModule, ChatModule, ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, 
      entities: [User, Conversation, Message],
      synchronize: false, 
    }),
    AuthModule],
  controllers: [AppController],
  providers: [AppService, OpenAiService],
})
export class AppModule {}
