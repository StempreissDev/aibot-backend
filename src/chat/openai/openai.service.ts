import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async generateResponse(userMessage: string, history: any[]): Promise<string> {
    // SYSTEM PROMPT: Aquí defines la personalidad de ventas
    const systemMessage = {
      role: 'system',
      content: `Eres un Asistente de Ventas experto y amable. 
                Tu objetivo es vender Lienzos fotograficos personalizados.
                Responde de forma concisa, persuasiva y siempre intenta cerrar una reunión.
                Si el usuario pregunta algo fuera de tema, redirígelo a nuestros servicios.`
    };

    // Convertimos tu historial de DB al formato de OpenAI
    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Modelo rápido y barato
      messages: [
        systemMessage as any, 
        ...formattedHistory, // Le pasamos contexto (últimos 5-10 mensajes)
        { role: 'user', content: userMessage }
      ],
    });

    return completion.choices[0].message.content || 'Lo siento, no pude procesar eso.';
  }
}
