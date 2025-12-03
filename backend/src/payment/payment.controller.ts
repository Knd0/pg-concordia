import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly configService: ConfigService
  ) {}

  @Get('auth')
  async getAuthUrl() {
    const url = await this.paymentService.getAuthUrl();
    return { url };
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string, @Res() res: Response) {
    await this.paymentService.handleCallback(code);
    // Redirect to frontend admin settings
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:4200';
    return res.redirect(`${frontendUrl}/admin/settings?status=success`); 
  }

  @Post('preference')
  async createPreference(@Body() body: { items: any[], shippingCost: number }) {
    return this.paymentService.createPreference(body.items, body.shippingCost);
  }
  
  @Get('status')
  async getStatus() {
      const settings = await this.paymentService.getSettings();
      return { linked: !!settings?.mercadoPagoAccessToken };
  }
}
