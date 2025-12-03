import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ShippingProvider, ShippingQuote } from '../interfaces/shipping-provider.interface';

@Injectable()
export class AndreaniService implements ShippingProvider {
  constructor(private configService: ConfigService) {}

  async getQuote(zipCode: string, weight: number, volume: number): Promise<ShippingQuote | null> {
    const username = this.configService.get('ANDREANI_USERNAME');
    const password = this.configService.get('ANDREANI_PASSWORD');

    // TODO: Implement real API call when credentials are available
    // For now, return a mock quote
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simple mock logic based on distance (zip code)
    const baseCost = 4500;
    const distanceFactor = Math.abs(parseInt(zipCode) - 3200) / 100; // 3200 is Concordia
    const cost = Math.round(baseCost + (distanceFactor * 50));

    return {
      provider: 'andreani',
      name: 'Andreani Estándar',
      cost: cost,
      deliveryEstimate: '3-5 días hábiles'
    };
  }
}
