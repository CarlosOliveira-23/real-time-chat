import mongoose, { Document } from 'mongoose';

export interface IMessage extends Document {
  sender: string;
  message: string;
  timestamp: Date;
}

const messageSchema = new mongoose.Schema<IMessage>({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
