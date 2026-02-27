import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema.js';
import { PantryItem } from './pantryItem.schema.js';

@Injectable()
export class PantryService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async addItem(userId: string, item: PantryItem) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.pantry.push(item);
    await user.save();

    return user.pantry;
  }

  async addItems(userId: string, items: PantryItem[]) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userModel.findByIdAndUpdate(
      userId,
      { $push: { pantry: { $each: items } } },
      { new: true },
    );

    return user.pantry;
  }

  async getPantry(userId: string) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.pantry;
  }
}
