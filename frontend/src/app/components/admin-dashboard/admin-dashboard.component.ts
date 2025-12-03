import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../services/api';
import { PaymentService } from '../../services/payment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'stock' | 'offers' | 'create' | 'orders' | 'settings' = 'stock';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  orders: any[] = [];
  mpLinked = false;

  // Filters
  filterType = 'all';
  filterStock = 'all';

  constructor(
    private apiService: ApiService, 
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadData();
    this.checkMpStatus();
    
    this.route.queryParams.subscribe(params => {
        if (params['status'] === 'success') {
            this.activeTab = 'settings';
            this.notificationService.success('Mercado Pago vinculado correctamente');
        }
    });
  }

  checkMpStatus() {
      this.paymentService.getStatus().subscribe(res => {
          this.mpLinked = res.linked;
      });
  }

  linkMercadoPago() {
      this.paymentService.getAuthUrl().subscribe(res => {
          window.location.href = res.url;
      });
  }

  loadData() {
    this.apiService.getProducts().subscribe(products => {
      this.products = products;
      this.applyFilters();
    });
    this.apiService.getOrders().subscribe(orders => this.orders = orders);
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const typeMatch = this.filterType === 'all' || p.type === this.filterType;
      let stockMatch = true;
      if (this.filterStock === 'low') stockMatch = p.stock < 5 && p.stock > 0;
      if (this.filterStock === 'out') stockMatch = p.stock === 0;
      return typeMatch && stockMatch;
    });
  }

  updateStock(product: Product, newStock: number) {
    this.apiService.updateProduct(product.id, { stock: newStock }).subscribe(() => {
      this.notificationService.success('Stock actualizado correctamente');
      this.loadData();
    });
  }

  toggleOffer(product: Product) {
    const isOffer = !product.isOffer;
    this.apiService.updateProduct(product.id, { isOffer }).subscribe(() => {
      this.notificationService.info(`Oferta ${isOffer ? 'activada' : 'desactivada'}`);
      this.loadData();
    });
  }

  updateOfferPrice(product: Product, price: number) {
    this.apiService.updateProduct(product.id, { offerPrice: price }).subscribe(() => {
      this.notificationService.success('Precio de oferta actualizado');
      this.loadData();
    });
  }

  // Order Management
  selectedOrder: any = null;
  showOrderModal = false;

  viewOrderDetails(order: any) {
    this.selectedOrder = { ...order }; // Clone
    this.showOrderModal = true;
  }

  closeOrderModal() {
    this.selectedOrder = null;
    this.showOrderModal = false;
  }

  saveOrderChanges() {
    if (!this.selectedOrder) return;
    
    this.apiService.updateOrder(this.selectedOrder.id, {
      customerName: this.selectedOrder.customerName,
      customerContact: this.selectedOrder.customerContact,
      status: this.selectedOrder.status,
      description: this.selectedOrder.description
    }).subscribe({
      next: () => {
        this.notificationService.success('Pedido actualizado');
        this.loadData();
        this.closeOrderModal();
      },
      error: (err) => this.notificationService.error('Error al actualizar pedido')
    });
  }

  deleteOrder(orderId: string) {
    if (confirm('¿Estás seguro de eliminar este pedido?')) {
      this.apiService.deleteOrder(orderId).subscribe({
        next: () => {
          this.notificationService.success('Pedido eliminado');
          this.loadData();
          if (this.selectedOrder && this.selectedOrder.id === orderId) {
            this.closeOrderModal();
          }
        },
        error: (err) => this.notificationService.error('Error al eliminar pedido')
      });
    }
  }

  finalizeOrder(orderId: string) {
    if (confirm('¿Finalizar pedido y descontar stock?')) {
      this.apiService.finalizeOrder(orderId).subscribe({
        next: () => {
          this.notificationService.success('Pedido finalizado correctamente');
          this.loadData();
          if (this.selectedOrder && this.selectedOrder.id === orderId) {
             this.selectedOrder.status = 'COMPLETED';
          }
        },
        error: (err) => this.notificationService.error('Error: ' + err.error.message)
      });
    }
  }

  // Product Management
  selectedProduct: Product | null = null;
  showProductModal = false;

  editProduct(product: Product) {
    this.selectedProduct = { ...product };
    this.showProductModal = true;
  }

  closeProductModal() {
    this.selectedProduct = null;
    this.showProductModal = false;
  }

  saveProductChanges() {
    if (!this.selectedProduct) return;
    this.apiService.updateProduct(this.selectedProduct.id, this.selectedProduct).subscribe({
      next: () => {
        this.notificationService.success('Producto actualizado');
        this.loadData();
        this.closeProductModal();
      },
      error: (err) => this.notificationService.error('Error al actualizar producto')
    });
  }

  logout() {
    this.authService.logout();
    this.notificationService.info('Sesión cerrada');
  }

  newProduct = {
    name: '',
    type: 'cpu',
    price: 0,
    imageUrl: '',
    stock: 0
  };

  createProduct() {
    this.apiService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.notificationService.success('Producto creado exitosamente');
        this.newProduct = { name: '', type: 'cpu', price: 0, imageUrl: '', stock: 0 };
        this.loadData();
        this.activeTab = 'stock';
      },
      error: (err) => this.notificationService.error('Error al crear producto: ' + err.message)
    });
  }
}
