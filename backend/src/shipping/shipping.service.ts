import { Injectable } from '@nestjs/common';

@Injectable()
export class ShippingService {
  calculateCost(zipCode: string): number {
    const zip = parseInt(zipCode, 10);

    if (isNaN(zip)) {
      return 0;
    }

    // Mock Logic:
    // Concordia (3200) -> Free
    // Entre Rios (3000-3300) -> $5000
    // Rest of country -> $8000
    
    if (zip === 3200) {
      return 0;
    }

    if (zip >= 3000 && zip <= 3300) {
      return 5000;
    }

    return 8000;
  }
}
