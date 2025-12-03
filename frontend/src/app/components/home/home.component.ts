import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <!-- Background Effects -->
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[150px]"></div>
        <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[150px]"></div>
        <div class="absolute inset-0 bg-[url('/assets/grid.svg')] opacity-[0.03]"></div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 text-center px-6 max-w-5xl mx-auto mt-[-5vh]">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm animate-fade-in-up">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Hardware de Alta Gama</span>
        </div>
        
        <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tight text-white animate-fade-in-up delay-100">
          PRESTIGE <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">GAMING</span>
        </h1>
        
        <p class="text-lg md:text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
          Especialistas en hardware de alto rendimiento y armado de PCs profesionales en Concordia.
          Llevamos tu experiencia de juego al siguiente nivel.
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
          <a routerLink="/builder" class="group relative px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider rounded-full overflow-hidden transition-all hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:scale-105">
            <span class="relative z-10 flex items-center gap-2">
              Armá tu PC
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </a>
          
          <a routerLink="/products" class="px-8 py-4 border border-white/10 text-gray-300 hover:text-white font-bold text-sm uppercase tracking-wider rounded-full hover:bg-white/5 transition-all backdrop-blur-sm cursor-pointer hover:border-white/20">
            Ver Catálogo
          </a>
        </div>
      </div>

      <!-- Features Grid -->
      <div class="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 px-6 max-w-7xl mx-auto w-full">
        <div class="group p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-purple-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/10">
          <div class="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 17.25v-1.007" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12V7a6 6 0 0 1 12 0v5" />
            </svg>
          </div>
          <h3 class="text-lg font-bold mb-3 text-white">Hardware Premium</h3>
          <p class="text-sm text-gray-500 leading-relaxed">Selección exclusiva de componentes de las marcas más reconocidas del mercado global.</p>
        </div>

        <div class="group p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-blue-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold mb-3 text-white">Armado Profesional</h3>
          <p class="text-sm text-gray-500 leading-relaxed">Ensamblaje meticuloso con gestión de cables premium y optimización de flujo de aire.</p>
        </div>

        <div class="group p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-green-500/20 transition-all duration-300 hover:shadow-2xl hover:shadow-green-900/10">
          <div class="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
          </div>
          <h3 class="text-lg font-bold mb-3 text-white">Envíos a Todo el País</h3>
          <p class="text-sm text-gray-500 leading-relaxed">Logística segura y asegurada para que recibas tu equipo listo para usar.</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {}
