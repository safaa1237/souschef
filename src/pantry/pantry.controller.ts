import { PantryService } from './pantry.service.js';
import { Body, Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { PantryItem } from './pantryItem.schema.js';
import { AuthGuard } from '@nestjs/passport';

export class PantryItemResponseDto {
  id?: string;
  name: string;
  quantity?: number;
  unit?: string;
}

@Controller('pantry')
@UseGuards(AuthGuard('jwt'))
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Post('/item')
  async addItem(@Req() req, @Body() pantryItem: PantryItem): Promise<PantryItem[]> {
    console.log(pantryItem);
    return await this.pantryService.addItem(req.user.userId, pantryItem);
  }

  @Get()
  async getPantry(@Req() req): Promise<PantryItemResponseDto[]> {
    const pantry = await this.pantryService.getPantry(req.user.userId);

    return pantry.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
    }));
  }
}
