import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../services/api';
import { BuilderService, BuildState } from '../../services/builder';
import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pc-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-[#0a0a0a] text-gray-200 pt-24 pb-12 px-6 font-sans">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Configurador de PC</h1>
          <p class="text-gray-400 max-w-2xl mx-auto">Diseñá tu equipo ideal paso a paso con componentes compatibles.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Selection Area -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Steps -->
            <div class="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
              <button *ngFor="let step of steps" 
                      (click)="currentStep = step.key"
                      [class.bg-purple-600]="currentStep === step.key"
                      [class.text-white]="currentStep === step.key"
                      [class.bg-[#111]]="currentStep !== step.key"
                      [class.text-gray-400]="currentStep !== step.key"
                      [class.border-purple-500]="currentStep === step.key"
                      [class.border-white_5]="currentStep !== step.key"
                      class="px-5 py-2.5 rounded-xl whitespace-nowrap font-medium text-sm transition-all border hover:border-purple-500/50 flex items-center gap-2">
                <span [class.text-purple-300]="currentStep !== step.key" class="text-xs opacity-70">
                  {{ buildState[step.key] ? '✓' : '○' }}
                </span>
                {{ step.label }}
              </button>
            </div>

            <!-- Products Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div *ngFor="let product of getProductsByType(currentStep)" 
                   class="group relative p-5 rounded-2xl bg-[#111] border border-white/5 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 flex flex-col">
                
                <div class="aspect-[16/9] mb-5 rounded-xl bg-black/50 overflow-hidden relative">
                  <img [src]="product.imageUrl" [alt]="product.name" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                  <div *ngIf="buildState[currentStep]?.id === product.id" class="absolute inset-0 bg-purple-600/20 flex items-center justify-center backdrop-blur-[1px]">
                    <span class="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">SELECCIONADO</span>
                  </div>
                </div>
                
                <div class="flex-1">
                  <h3 class="text-lg font-bold mb-2 text-white leading-tight">{{ product.name }}</h3>
                  <div class="flex justify-between items-end mt-4">
                    <p class="text-xl font-bold text-white font-mono">$ {{ product.price }}</p>
                    <button (click)="selectProduct(product)"
                            [class.bg-purple-600]="buildState[currentStep]?.id === product.id"
                            [class.bg-white_5]="buildState[currentStep]?.id !== product.id"
                            class="px-4 py-2 rounded-lg text-sm font-bold transition-colors hover:bg-purple-500 hover:text-white">
                      {{ buildState[currentStep]?.id === product.id ? 'Seleccionado' : 'Agregar' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary Sidebar -->
          <div class="lg:col-span-1">
            <div class="sticky top-24 p-6 rounded-2xl bg-[#111] border border-white/5 shadow-2xl">
              <h2 class="text-xl font-bold mb-6 text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-purple-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 17.25v-1.007" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12V7a6 6 0 0 1 12 0v5" />
                </svg>
                Tu Configuración
              </h2>
              
              <div class="space-y-3 mb-8">
                <div *ngFor="let step of steps" class="flex justify-between items-start py-3 border-b border-white/5 last:border-0">
                  <span class="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">{{ step.label }}</span>
                  <div class="text-right max-w-[60%]">
                    <div *ngIf="buildState[step.key] as item" class="font-medium text-sm text-white">
                      {{ item.name }}
                      <div class="text-xs text-purple-400 font-mono mt-0.5">$ {{ item.price }}</div>
                    </div>
                    <span *ngIf="!buildState[step.key]" class="text-xs text-gray-600 italic">Pendiente</span>
                  </div>
                </div>
              </div>

              <div class="flex justify-between items-center text-lg font-bold mb-8 pt-4 border-t border-white/10">
                <span class="text-white">Total Estimado</span>
                <span class="text-green-400 font-mono">$ {{ totalPrice }}</span>
              </div>

              <div class="space-y-4 mb-6">
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

              <button (click)="consultar()" 
                 [disabled]="!isValid() || loading"
                 class="block w-full py-4 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-center font-bold rounded-xl transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2">
                <span *ngIf="!loading">Consultar por WhatsApp</span>
                <span *ngIf="loading">Procesando...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PcBuilderComponent implements OnInit {
  currentStep: keyof BuildState = 'cpu';
  products: Product[] = [];
  buildState: BuildState = {
    cpu: null, gpu: null, ram: null, motherboard: null, storage: null, psu: null, case: null
  };
  totalPrice = 0;
  whatsAppLink = '';

  steps: { key: keyof BuildState; label: string }[] = [
    { key: 'cpu', label: 'Procesador' },
    { key: 'motherboard', label: 'Motherboard' },
    { key: 'ram', label: 'Memoria RAM' },
    { key: 'gpu', label: 'Placa de Video' },
    { key: 'storage', label: 'Almacenamiento' },
    { key: 'psu', label: 'Fuente' },
    { key: 'case', label: 'Gabinete' }
  ];

  customer = {
    name: '',
    phone: '',
    email: ''
  };

  loading = false;

  constructor(
    private apiService: ApiService,
    private builderService: BuilderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.apiService.getProducts().subscribe(products => {
      this.products = products;
    });

    this.builderService.buildState$.subscribe(state => {
      this.buildState = state;
      this.totalPrice = this.builderService.getTotalPrice();
    });
  }

  getProductsByType(type: string) {
    return this.products.filter(p => p.type === type);
  }

  selectProduct(product: Product) {
    this.builderService.selectComponent(this.currentStep, product);
  }

  isValid() {
    return this.customer.name && 
           this.isValidPhone(this.customer.phone) && 
           this.isValidEmail(this.customer.email) && 
           this.totalPrice > 0;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone: string): boolean {
    return /^\d{7,15}$/.test(phone.replace(/\D/g, ''));
  }

  consultar() {
    if (!this.isValid()) return;
    this.loading = true;

    const items = Object.values(this.buildState)
      .filter(item => item !== null)
      .map(item => ({
        productId: item.id,
        quantity: 1
      }));

    const orderData = {
      items,
      customerName: this.customer.name,
      customerContact: `${this.customer.phone} | ${this.customer.email}`,
      type: 'BUILDER'
    };

    this.apiService.createOrder(orderData).subscribe({
      next: () => {
        const link = this.builderService.generateWhatsAppLink(this.customer);
        window.open(link, '_blank');
        this.notificationService.success('Consulta registrada y WhatsApp abierto!');
        this.loading = false;
      },
      error: (err) => {
        this.notificationService.error('Error al registrar la consulta. Intente nuevamente.');
        console.error(err);
        this.loading = false;
      }
    });
  }
}
