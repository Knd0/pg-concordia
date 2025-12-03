import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <a routerLink="/" class="text-2xl font-bold text-white tracking-wider flex items-center gap-2">
          <span class="text-purple-500">PG</span> CONCORDIA
        </a>
        
        <div class="hidden md:flex items-center gap-8">
          <a routerLink="/" routerLinkActive="text-purple-400" [routerLinkActiveOptions]="{exact: true}" class="text-gray-300 hover:text-white transition-colors duration-300 font-medium">Inicio</a>
          <a routerLink="/builder" routerLinkActive="text-purple-400" class="text-gray-300 hover:text-white transition-colors duration-300 font-medium">Armá tu PC</a>
          <a routerLink="/products" routerLinkActive="text-purple-400" class="text-gray-300 hover:text-white transition-colors duration-300 font-medium">Componentes</a>
          <a href="#" class="text-gray-300 hover:text-white transition-colors duration-300 font-medium">Contacto</a>
          
          <button (click)="openCart()" class="relative text-gray-300 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span *ngIf="(cartCount$ | async) as count" class="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {{ count }}
            </span>
          </button>
          
          <ng-container *ngIf="isAdmin$ | async; else loginBtn">
            <a routerLink="/admin" routerLinkActive="text-purple-400" class="text-gray-300 hover:text-white transition-colors duration-300 font-medium">Panel Admin</a>
            <button (click)="logout()" class="px-4 py-2 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-full transition-colors text-sm font-medium backdrop-blur-sm border border-red-500/20">
              Cerrar Sesión
            </button>
          </ng-container>
          <ng-template #loginBtn>
            <a routerLink="/login" class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm font-medium backdrop-blur-sm border border-white/10">
              Iniciar Sesión
            </a>
          </ng-template>
        </div>

        <button class="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </nav>
  `,
  styles: []
})
export class NavbarComponent {
  isAdmin$;
  cartCount$;

  constructor(private authService: AuthService, private cartService: CartService) {
    this.isAdmin$ = this.authService.isAdmin$;
    this.cartCount$ = this.cartService.cartItems$.pipe(
      map(items => items.reduce((acc, item) => acc + item.quantity, 0))
    );
  }

  logout() {
    this.authService.logout();
  }

  openCart() {
    this.cartService.openCart();
  }
}
