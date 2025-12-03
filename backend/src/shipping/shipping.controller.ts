import { Controller, Get, Query } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('calculate')
  async calculate(@Query('zipCode') zipCode: string) {
    return this.shippingService.calculateCost(zipCode);
  }
}
