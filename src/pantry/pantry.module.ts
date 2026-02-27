import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/user.schema.js';
import { PantryService } from './pantry.service.js';
import { PantryController } from './pantry.controller.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [PantryService],
  controllers: [PantryController],
  exports: [PantryService],
})
export class PantryModule {}
