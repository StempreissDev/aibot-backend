import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageRole } from '../messages/entities/message.entity';
import { Conversation } from '../conversations/entities/conversation.entity';
import { OpenAiService } from './openai/openai.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation) private conversationRepo: Repository<Conversation>,
    @InjectRepository(Message) private messageRepo: Repository<Message>,
    private openAiService: OpenAiService,
  ) {}

  async sendMessage(userId: string, content: string, conversationId?: string) {
    let conversation;

    // 1. GESTIÓN DE CONVERSACIÓN
    if (conversationId) {
      conversation = await this.conversationRepo.findOne({ where: { id: conversationId } });
      if (!conversation) throw new NotFoundException('Conversación no encontrada');
    } else {
      // Crear nueva si no existe
      conversation = this.conversationRepo.create({ 
        user: { id: userId } 
      });
      await this.conversationRepo.save(conversation);
    }

    // 2. GUARDAR MENSAJE USUARIO
    const userMsg = this.messageRepo.create({
      content,
      role: MessageRole.USER,
      conversation
    });
    await this.messageRepo.save(userMsg);

    // 3. OBTENER HISTORIAL (Para contexto de IA)
    // Obtenemos los últimos 5 mensajes para no gastar tantos tokens
    const history = await this.messageRepo.find({
      where: { conversation: { id: conversation.id } },
      order: { createdAt: 'DESC' },
      take: 5
    });

    // 4. LLAMAR A OPENAI
    const aiResponseText = await this.openAiService.generateResponse(content, history.reverse());

    // 5. GUARDAR MENSAJE BOT
    const botMsg = this.messageRepo.create({
      content: aiResponseText,
      role: MessageRole.BOT,
      conversation
    });
    await this.messageRepo.save(botMsg);

    return { 
      conversationId: conversation.id, 
      userMessage: userMsg, 
      botResponse: botMsg 
    };
  }

  async getConversations(userId: string) {
    return this.conversationRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['messages'] // Ojo: si son muchos mensajes, mejor no traerlos todos aquí
    });
  }
}

