import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#0a0a0a] font-sans">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px]"></div>
        <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px]"></div>
      </div>

      <div class="bg-[#111] p-10 rounded-3xl border border-white/5 shadow-2xl w-full max-w-md relative z-10">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-white mb-2 tracking-tight">Bienvenido</h2>
          <p class="text-gray-500 text-sm">Acceso administrativo al sistema</p>
        </div>
        
        <form (ngSubmit)="login()" class="space-y-6">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 absolute left-3 top-3.5 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              <input 
                type="email" 
                [(ngModel)]="email" 
                name="email"
                class="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="admin@pgconcordia.com"
              >
            </div>
          </div>
          
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Contraseña</label>
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 absolute left-3 top-3.5 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <input 
                type="password" 
                [(ngModel)]="password" 
                name="password"
                class="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
              >
            </div>
          </div>

          <button 
            type="submit" 
            class="w-full bg-purple-600 text-white font-bold py-3.5 rounded-xl hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-600/20 mt-2"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(
    private router: Router, 
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.notificationService.success('Bienvenido Admin');
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.notificationService.error('Credenciales inválidas');
        console.error(err);
      }
    });
  }
}
