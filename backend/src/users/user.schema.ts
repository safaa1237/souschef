import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PantryItem } from '../pantry/pantryItem.schema.js';
import * as bcrypt from 'bcrypt';

export const PantryItemSchema = SchemaFactory.createForClass(PantryItem);

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: [PantryItemSchema], default: [] })
  pantry: PantryItem[];

  @Prop({ default: [] })
  cuisinePreferences: string[];
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
