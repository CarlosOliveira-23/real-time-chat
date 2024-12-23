import mongoose, { Document, Schema } from 'mongoose';

// Interface para mensagens
export interface IMessage extends Document {
  sender: string;
  message: string;
  timestamp: Date;
}

// Schema para mensagens
const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: String,
      required: [true, 'O remetente é obrigatório'], // Mensagem de validação personalizada
      trim: true, // Remove espaços em branco no início e no final
    },
    message: {
      type: String,
      required: [true, 'A mensagem é obrigatória'], // Mensagem de validação personalizada
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now, // Define a data e hora atual como padrão
      immutable: true, // Impede alterações após a criação
    },
  },
  {
    timestamps: true, // Adiciona automaticamente os campos createdAt e updatedAt
    versionKey: false, // Remove o campo __v
  }
);

// Índices para melhorar a busca
messageSchema.index({ sender: 1, timestamp: -1 }); // Índice para busca eficiente por remetente e ordem de tempo

// Model para mensagens
const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
