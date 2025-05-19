import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type AccessKeyDocument = AccessKey & Document;

@Schema({ timestamps: true })
export class AccessKey {
  @Prop()
  id: string;

  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true, unique: true, default: () => uuidv4() })
  apiKey: string;

  @Prop({ required: true })
  rateLimit: number;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const AccessKeySchema = SchemaFactory.createForClass(AccessKey);

// Create indexes
AccessKeySchema.index({ userId: 1 });
AccessKeySchema.index({ apiKey: 1 });
