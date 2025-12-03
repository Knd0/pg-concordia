import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { BuilderService } from '../../services/builder';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  items: any[] = [];
  shippingOptions: any[] = [];
  selectedShippingOption: any = null;
  zipCode: string = '';
  customer = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: ''
  };
  loading = false;

  constructor(
    private cartService: CartService,
    private builderService: BuilderService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    const cartItems = this.cartService.getCheckoutItems();
    const builderItems = this.builderService.getCheckoutItems();
    this.items = [...cartItems, ...builderItems];

    if (this.items.length === 0) {
      this.router.navigate(['/']);
    }
  }

  get subtotal() {
    return this.items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);
  }

  get total() {
    return this.subtotal + (this.selectedShippingOption?.cost || 0);
  }

  async calculateShipping() {
    if (this.zipCode.length >= 4) {
      this.paymentService.calculateShipping(this.zipCode).subscribe({
        next: (res) => {
          this.shippingOptions = res.quotes;
          if (this.shippingOptions.length > 0) {
            this.selectedShippingOption = this.shippingOptions[0];
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  pay() {
    if (!this.selectedShippingOption) {
      alert('Por favor selecciona una opción de envío');
      return;
    }

    this.loading = true;
    this.paymentService.createPreference(this.items, this.selectedShippingOption.cost).subscribe({
      next: (res) => {
        window.location.href = res.init_point;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        alert('Error al iniciar el pago');
      }
    });
  }
}
