import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Toast } from '../../services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="fixed top-24 right-6 z-50 flex flex-col gap-4 pointer-events-none">
      <div *ngFor="let toast of toasts$ | async" 
           [@toastAnimation]
           class="pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-2xl backdrop-blur-md border border-white/10 flex items-center gap-3"
           [ngClass]="{
             'bg-green-600/90 text-white': toast.type === 'success',
             'bg-red-600/90 text-white': toast.type === 'error',
             'bg-blue-600/90 text-white': toast.type === 'info'
           }">
        
        <span class="text-2xl">
          <ng-container [ngSwitch]="toast.type">
            <span *ngSwitchCase="'success'">✅</span>
            <span *ngSwitchCase="'error'">❌</span>
            <span *ngSwitchCase="'info'">ℹ️</span>
          </ng-container>
        </span>
        
        <p class="font-medium">{{ toast.message }}</p>
        
        <button (click)="remove(toast.id)" class="ml-auto text-white/70 hover:text-white">
          ✕
        </button>
      </div>
    </div>
  `
})
export class ToastComponent {
  toasts$;

  constructor(private notificationService: NotificationService) {
    this.toasts$ = this.notificationService.toasts$;
  }

  remove(id: number) {
    this.notificationService.remove(id);
  }
}
