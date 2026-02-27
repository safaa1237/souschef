import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PantryItem {
  @Prop({ required: true })
  name: string;

  @Prop()
  quantity: number;

  @Prop()
  unit: string;
}

export const PantryItemSchema = SchemaFactory.createForClass(PantryItem);
