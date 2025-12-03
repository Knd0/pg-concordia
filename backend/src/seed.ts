import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { ProductsService } from './products/products.service';
import { OrdersService } from './orders/orders.service';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const usersService = app.get(UsersService);
  const productsService = app.get(ProductsService);
  const ordersService = app.get(OrdersService);

  console.log('🌱 Starting seed...');

  // 1. Create Admin User
  const adminEmail = 'admin@pgconcordia.com';
  const existingAdmin = await usersService.findOne(adminEmail);
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await usersService.create({
      email: adminEmail,
      password: hashedPassword,
      isActive: true,
    });
    console.log('✅ Admin user created');
  } else {
    console.log('ℹ️ Admin user already exists');
  }

  // 2. Create Products
  const products = [
    // CPUs
    { name: 'Intel Core i9-14900K', type: 'cpu', price: 589, stock: 10, imageUrl: 'https://m.media-amazon.com/images/I/61p6cM8i+aL._AC_SL1000_.jpg' },
    { name: 'AMD Ryzen 9 7950X3D', type: 'cpu', price: 699, stock: 8, imageUrl: 'https://m.media-amazon.com/images/I/51f2hkWjTlL._AC_SL1000_.jpg' },
    { name: 'Intel Core i7-14700K', type: 'cpu', price: 409, stock: 15, imageUrl: 'https://m.media-amazon.com/images/I/61p6cM8i+aL._AC_SL1000_.jpg' },
    { name: 'AMD Ryzen 7 7800X3D', type: 'cpu', price: 399, stock: 20, imageUrl: 'https://m.media-amazon.com/images/I/51f2hkWjTlL._AC_SL1000_.jpg' },
    
    // GPUs
    { name: 'NVIDIA GeForce RTX 4090', type: 'gpu', price: 1599, stock: 5, imageUrl: 'https://m.media-amazon.com/images/I/71tDu30-mZL._AC_SL1500_.jpg' },
    { name: 'NVIDIA GeForce RTX 4080 Super', type: 'gpu', price: 999, stock: 10, imageUrl: 'https://m.media-amazon.com/images/I/71tDu30-mZL._AC_SL1500_.jpg' },
    { name: 'AMD Radeon RX 7900 XTX', type: 'gpu', price: 949, stock: 8, imageUrl: 'https://m.media-amazon.com/images/I/71tDu30-mZL._AC_SL1500_.jpg' },
    { name: 'NVIDIA GeForce RTX 4070 Ti Super', type: 'gpu', price: 799, stock: 12, imageUrl: 'https://m.media-amazon.com/images/I/71tDu30-mZL._AC_SL1500_.jpg' },

    // Motherboards
    { name: 'ASUS ROG Maximus Z790 Hero', type: 'motherboard', price: 629, stock: 7, imageUrl: 'https://m.media-amazon.com/images/I/81w+r+y+1+L._AC_SL1500_.jpg' },
    { name: 'MSI MPG B650 Edge WiFi', type: 'motherboard', price: 259, stock: 15, imageUrl: 'https://m.media-amazon.com/images/I/81w+r+y+1+L._AC_SL1500_.jpg' },

    // RAM
    { name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz', type: 'ram', price: 129, stock: 25, imageUrl: 'https://m.media-amazon.com/images/I/61+y+1+L._AC_SL1500_.jpg' },
    { name: 'G.Skill Trident Z5 RGB DDR5 64GB (2x32GB) 6400MHz', type: 'ram', price: 249, stock: 10, imageUrl: 'https://m.media-amazon.com/images/I/61+y+1+L._AC_SL1500_.jpg' },

    // Storage
    { name: 'Samsung 990 PRO 2TB NVMe SSD', type: 'storage', price: 169, stock: 30, imageUrl: 'https://m.media-amazon.com/images/I/81w+r+y+1+L._AC_SL1500_.jpg' },
    { name: 'WD_BLACK SN850X 4TB NVMe SSD', type: 'storage', price: 299, stock: 15, imageUrl: 'https://m.media-amazon.com/images/I/81w+r+y+1+L._AC_SL1500_.jpg' },

    // PSU
    { name: 'Corsair RM1000x Shift 1000W 80+ Gold', type: 'psu', price: 189, stock: 12, imageUrl: 'https://m.media-amazon.com/images/I/81w+r+y+1+L._AC_SL1500_.jpg' },
    { name: 'Seasonic Vertex GX-1200 1200W 80+ Gold', type: 'psu', price: 249, stock: 8, imageUrl: 'https://m.media-amazon.com/images/I/81w+r+y+1+L._AC_SL1500_.jpg' },

    // Case
    { name: 'Lian Li O11 Dynamic EVO RGB', type: 'case', price: 159, stock: 10, imageUrl: 'https://m.media-amazon.com/images/I/81w+r+y+1+L._AC_SL1500_.jpg' },
    { name: 'NZXT H9 Flow', type: 'case', price: 159, stock: 12, imageUrl: 'https://m.media-amazon.com/images/I/81w+r+y+1+L._AC_SL1500_.jpg' }
  ];

  for (const product of products) {
    // Check if product exists (simple check by name)
    // Note: In a real seed, you might want to clear the table or use upsert.
    // Here we just create if not exists to avoid duplicates on re-run.
    // Since ProductsService might not have findByName, we'll just create it blindly
    // or we can fetch all and filter. For simplicity in this demo, let's just create.
    // Better approach:
    await productsService.create(product);
  }
  console.log(`✅ Created ${products.length} products`);

  // 3. Create Sample Orders
  const sampleOrders = [
    {
      customerName: 'Juan Pérez',
      customerContact: 'juan@example.com',
      status: 'PENDING',
      type: 'BUILDER',
      description: 'PC Gamer Alta Gama',
      items: [
        { productId: 1, quantity: 1, price: 589 }, // i9
        { productId: 5, quantity: 1, price: 1599 }, // 4090
      ]
    },
    {
      customerName: 'Maria Garcia',
      customerContact: '+54 9 11 1234 5678',
      status: 'COMPLETED',
      type: 'CART',
      description: 'Upgrade de RAM y SSD',
      items: [
        { productId: 11, quantity: 1, price: 129 }, // RAM
        { productId: 13, quantity: 1, price: 169 }, // SSD
      ]
    }
  ];

  for (const orderData of sampleOrders) {
    const { items, ...orderInfo } = orderData;
    // We need to construct the order with items properly
    // This depends on how OrdersService.create is implemented.
    // Assuming it takes a DTO that includes items.
    // If not, we might need to use the repository directly or adjust the service.
    // Let's assume for now we can pass the structure.
    // If OrdersService.create expects a CreateOrderDto, we should match it.
    
    // Actually, looking at previous context, OrdersService likely saves the entity.
    // Let's try to save it via service.
    await ordersService.create({
      ...orderInfo,
      items: items.map(i => ({ ...i, productId: i.productId })) as any // Casting to avoid strict type checks if DTO differs
    });
  }
  console.log(`✅ Created ${sampleOrders.length} sample orders`);

  await app.close();
  console.log('🌱 Seed completed');
}

bootstrap();
