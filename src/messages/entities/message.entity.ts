import { Conversation } from '../../conversations/entities/conversation.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';

export enum MessageRole {
  USER = 'user',
  BOT = 'bot',
}

@Entity('messages')
// 🔥 PHOENIX INDEX (Índice Compuesto):
// Esto crea un índice físico en la base de datos.
// Cuando busques "mensajes de la conversación X ordenados por fecha",
// PostgreSQL irá directo al grano sin escanear toda la tabla.
@Index(['conversation', 'createdAt']) 
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: MessageRole,
  })
  role: MessageRole;

  // Relación: El mensaje pertenece a una Conversación específica
  @ManyToOne(() => Conversation, (conversation: Conversation) => conversation.messages, { onDelete: 'CASCADE' })
  conversation: Conversation;

  @CreateDateColumn()
  createdAt: Date;
}


