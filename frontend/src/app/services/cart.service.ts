import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './api';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();

  toggleCart() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  openCart() {
    this.isOpenSubject.next(true);
  }

  addToCart(product: Product) {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.cartItemsSubject.next([...currentItems]);
    } else {
      this.cartItemsSubject.next([...currentItems, { product, quantity: 1 }]);
    }
  }

  removeFromCart(productId: string) {
    const currentItems = this.cartItemsSubject.value;
    this.cartItemsSubject.next(currentItems.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number) {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(i => i.product.id === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cartItemsSubject.next([...currentItems]);
      }
    }
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => {
      const price = item.product.isOffer && item.product.offerPrice ? item.product.offerPrice : item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }

  generateWhatsAppLink(customer: { name: string; phone: string; email: string }): string {
    const items = this.cartItemsSubject.value;
    const phone = '5493454201722';
    let message = 'Hola! Me gustaría realizar el siguiente pedido:\n\n';

    message += `*Cliente:* ${customer.name}\n`;
    message += `*Teléfono:* ${customer.phone}\n`;
    message += `*Email:* ${customer.email}\n\n`;
    message += '*Detalle del Pedido:*\n';

    items.forEach(item => {
      const price = item.product.isOffer && item.product.offerPrice ? item.product.offerPrice : item.product.price;
      message += `- ${item.product.name} (x${item.quantity}): $${price * item.quantity}\n`;
    });

    message += `\n*Total a Pagar: $${this.getTotalPrice()}*`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  getCheckoutItems() {
    return this.cartItemsSubject.value.map(item => ({
      id: item.product.id,
      title: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.isOffer && item.product.offerPrice ? item.product.offerPrice : item.product.price
    }));
  }
}
