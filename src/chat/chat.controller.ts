import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport'; // El Guard de JWTnpm run dev

@Controller('chat')
@UseGuards(AuthGuard('jwt')) // 🔒 PROTEGIDO: Solo usuarios logueados
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Req() req, @Body() body: { message: string; conversationId?: string }) {
    // req.user.userId viene del JWT Strategy que configuramos antes
    return this.chatService.sendMessage(req.user.userId, body.message, body.conversationId);
  }

  @Get('history')
  async getUserHistory(@Req() req) {
    return this.chatService.getConversations(req.user.userId);
  }
}

