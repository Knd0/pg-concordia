import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { ApiService } from '../../services/api';
import { NotificationService } from '../../services/notification.service';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div *ngIf="isOpen$ | async" class="fixed inset-0 z-50 flex justify-end font-sans">
      <!-- Backdrop -->
      <div [@fadeIn] (click)="close()" class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      <!-- Sidebar -->
      <div [@slideInOut] class="relative w-full max-w-md bg-[#111] h-full shadow-2xl border-l border-white/5 flex flex-col">
        
        <!-- Header -->
        <div class="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h2 class="text-xl font-bold text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-purple-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            Tu Carrito
          </h2>
          <button (click)="close()" class="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Items -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div *ngIf="(cartItems$ | async)?.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mb-4 opacity-50">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <p class="text-lg font-medium">Tu carrito está vacío</p>
            <p class="text-sm">¡Agregá productos para comenzar!</p>
          </div>

          <div *ngFor="let item of cartItems$ | async" class="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
            <div class="w-20 h-20 rounded-xl bg-black/50 overflow-hidden flex-shrink-0 border border-white/5">
              <img [src]="item.product.imageUrl" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <h3 class="font-bold text-white text-sm leading-tight mb-1">{{ item.product.name }}</h3>
                <p class="text-xs text-gray-400 uppercase tracking-wider">{{ item.product.type }}</p>
              </div>
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center gap-3 bg-black/30 rounded-lg p-1">
                  <button (click)="updateQuantity(item, item.quantity - 1)" class="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-gray-300 transition-colors">-</button>
                  <span class="text-white text-sm font-medium w-4 text-center">{{ item.quantity }}</span>
                  <button (click)="updateQuantity(item, item.quantity + 1)" class="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-xs text-gray-300 transition-colors">+</button>
                </div>
                <p class="font-bold text-purple-400 font-mono text-sm">
                  $ {{ (item.product.isOffer && item.product.offerPrice ? item.product.offerPrice : item.product.price) * item.quantity }}
                </p>
              </div>
            </div>
            <button (click)="removeItem(item)" class="self-start text-gray-600 hover:text-red-400 transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Footer / Checkout -->
        <div class="p-6 border-t border-white/5 bg-black/20 space-y-6">
          <div class="flex justify-between items-center text-lg font-bold text-white">
            <span>Total</span>
            <span class="text-green-400 font-mono text-xl">$ {{ getTotal() }}</span>
          </div>

          <div class="space-y-4">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <input type="text" [(ngModel)]="customer.name" placeholder="Tu Nombre Completo" 
                class="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors">
            </div>

            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <input type="tel" [(ngModel)]="customer.phone" placeholder="Teléfono" 
                class="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors"
                [class.border-red-500]="customer.phone && !isValidPhone(customer.phone)">
            </div>

            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <input type="email" [(ngModel)]="customer.email" placeholder="Email" 
                class="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-purple-500 focus:outline-none transition-colors"
                [class.border-red-500]="customer.email && !isValidEmail(customer.email)">
            </div>
          </div>

          <button (click)="checkout()" 
            [disabled]="!isValid() || loading"
            class="w-full py-4 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
            <span *ngIf="!loading">Confirmar Pedido</span>
            <span *ngIf="loading">Procesando...</span>
          </button>
        </div>

      </div>
    </div>
  `
})
export class CartComponent {
  cartItems$;
  isOpen$;
  customer = { name: '', phone: '', email: '' };
  loading = false;

  constructor(
    private cartService: CartService,
    private apiService: ApiService,
    private notificationService: NotificationService
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.isOpen$ = this.cartService.isOpen$;
  }

  close() { this.cartService.toggleCart(); }

  updateQuantity(item: CartItem, qty: number) {
    this.cartService.updateQuantity(item.product.id, qty);
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.product.id);
  }

  getTotal() {
    return this.cartService.getTotalPrice();
  }

  isValid() {
    return this.customer.name && 
           this.isValidPhone(this.customer.phone) && 
           this.isValidEmail(this.customer.email) && 
           this.cartService.getTotalPrice() > 0;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone: string): boolean {
    return /^\d{7,15}$/.test(phone.replace(/\D/g, ''));
  }

  checkout() {
    if (!this.isValid()) return;
    this.loading = true;

    this.cartItems$.pipe(take(1)).subscribe(items => {
      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        customerName: this.customer.name,
        customerContact: `${this.customer.phone} | ${this.customer.email}`,
        type: 'CART'
      };

      this.apiService.createOrder(orderData).subscribe({
        next: () => {
          const link = this.cartService.generateWhatsAppLink(this.customer);
          window.open(link, '_blank');
          this.cartService.clearCart();
          this.notificationService.success('Pedido registrado y WhatsApp abierto!');
          this.close();
          this.loading = false;
        },
        error: (err) => {
          this.notificationService.error('Error al registrar el pedido. Intente nuevamente.');
          console.error(err);
          this.loading = false;
        }
      });
    });
  }
}
