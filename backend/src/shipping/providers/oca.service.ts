import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShippingProvider, ShippingQuote } from '../interfaces/shipping-provider.interface';

@Injectable()
export class OcaService implements ShippingProvider {
  constructor(private configService: ConfigService) {}

  async getQuote(zipCode: string, weight: number, volume: number): Promise<ShippingQuote | null> {
    const cuit = this.configService.get('OCA_CUIT');
    const operativa = this.configService.get('OCA_OPERATIVA');

    // TODO: Implement real API call when credentials are available
    // For now, return a mock quote

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 600));

    // Simple mock logic
    const baseCost = 4200;
    const distanceFactor = Math.abs(parseInt(zipCode) - 3200) / 100;
    const cost = Math.round(baseCost + (distanceFactor * 45));

    return {
      provider: 'oca',
      name: 'OCA Prioritario',
      cost: cost,
      deliveryEstimate: '2-4 días hábiles'
    };
  }
}
