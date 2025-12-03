import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './api';

export interface BuildState {
  cpu: Product | null;
  gpu: Product | null;
  ram: Product | null;
  motherboard: Product | null;
  storage: Product | null;
  psu: Product | null;
  case: Product | null;
}

@Injectable({
  providedIn: 'root'
})
export class BuilderService {
  private initialState: BuildState = {
    cpu: null,
    gpu: null,
    ram: null,
    motherboard: null,
    storage: null,
    psu: null,
    case: null
  };

  private buildStateSubject = new BehaviorSubject<BuildState>(this.initialState);
  buildState$ = this.buildStateSubject.asObservable();

  constructor() { }

  selectComponent(type: keyof BuildState, product: Product) {
    const currentState = this.buildStateSubject.value;
    this.buildStateSubject.next({ ...currentState, [type]: product });
  }

  removeComponent(type: keyof BuildState) {
    const currentState = this.buildStateSubject.value;
    this.buildStateSubject.next({ ...currentState, [type]: null });
  }

  getTotalPrice(): number {
    const state = this.buildStateSubject.value;
    return Object.values(state).reduce((total, product) => total + (product?.price || 0), 0);
  }

  generateWhatsAppLink(customer?: { name: string; phone: string; email: string }): string {
    const state = this.buildStateSubject.value;
    const phone = '5493454095399';
    let message = 'Hola! Me gustaría consultar por el siguiente armado de PC:\n\n';

    if (customer) {
      message += `*Cliente:* ${customer.name}\n`;
      message += `*Teléfono:* ${customer.phone}\n`;
      message += `*Email:* ${customer.email}\n\n`;
      message += '*Componentes:*\n';
    }

    if (state.cpu) message += `- Procesador: ${state.cpu.name}\n`;
    if (state.motherboard) message += `- Motherboard: ${state.motherboard.name}\n`;
    if (state.ram) message += `- RAM: ${state.ram.name}\n`;
    if (state.gpu) message += `- Placa de Video: ${state.gpu.name}\n`;
    if (state.storage) message += `- Almacenamiento: ${state.storage.name}\n`;
    if (state.psu) message += `- Fuente: ${state.psu.name}\n`;
    if (state.case) message += `- Gabinete: ${state.case.name}\n`;

    message += `\n*Total Estimado: $${this.getTotalPrice()}*`;

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
}
