import { Controller, Get, Query } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Get('calculate')
  calculate(@Query('zipCode') zipCode: string) {
    const cost = this.shippingService.calculateCost(zipCode);
    return { cost };
  }
}
