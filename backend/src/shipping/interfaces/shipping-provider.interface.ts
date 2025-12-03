export interface ShippingQuote {
  provider: string;
  name: string;
  cost: number;
  deliveryEstimate: string;
}

export interface ShippingProvider {
  getQuote(zipCode: string, weight: number, volume: number): Promise<ShippingQuote | null>;
}
