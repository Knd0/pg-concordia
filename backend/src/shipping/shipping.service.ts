import { Injectable } from '@nestjs/common';
import { AndreaniService } from './providers/andreani.service';
import { OcaService } from './providers/oca.service';
import { ShippingQuote } from './interfaces/shipping-provider.interface';

@Injectable()
export class ShippingService {
  constructor(
    private andreaniService: AndreaniService,
    private ocaService: OcaService
  ) {}

  async calculateCost(zipCode: string): Promise<{ quotes: ShippingQuote[] }> {
    // Default weight and volume for now
    const weight = 1; 
    const volume = 0.1;

    const [andreaniQuote, ocaQuote] = await Promise.all([
      this.andreaniService.getQuote(zipCode, weight, volume),
      this.ocaService.getQuote(zipCode, weight, volume)
    ]);

    const quotes: ShippingQuote[] = [];
    if (andreaniQuote) quotes.push(andreaniQuote);
    if (ocaQuote) quotes.push(ocaQuote);

    return { quotes };
  }
}
