export class CreateProductDto {
  name: string;
  type: string;
  price: number;
  imageUrl: string;
  stock: number;
  isOffer?: boolean;
  offerPrice?: number;
}
