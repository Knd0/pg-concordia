import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Product } from '../../services/api';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  searchTerm: string = '';
  selectedType: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  
  private searchSubject = new Subject<string>();

  constructor(
    private apiService: ApiService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.loadProducts();
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  loadProducts() {
    const filters: any = {};
    if (this.searchTerm) filters.search = this.searchTerm;
    if (this.selectedType) filters.type = this.selectedType;
    if (this.minPrice !== null) filters.minPrice = this.minPrice;
    if (this.maxPrice !== null) filters.maxPrice = this.maxPrice;

    this.apiService.getProducts(filters).subscribe(products => {
      this.products = products;
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.notificationService.success(`Agregado al carrito: ${product.name}`);
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedType = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.loadProducts();
  }
}
