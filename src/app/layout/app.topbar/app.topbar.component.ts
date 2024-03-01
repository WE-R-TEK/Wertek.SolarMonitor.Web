import { Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../services/app.layout.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { Auth, User, authState } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, MenuModule],
  templateUrl: './app.topbar.component.html',
  styleUrl: './app.topbar.component.less'
})
export class AppTopbarComponent implements OnDestroy {
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;
  items!: MenuItem[];
  itemsmu: MenuItem[] = [];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    private readonly router: Router
  ) {
    this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
      this.itemsmu = [
        {
          label: aUser?.displayName ?? '',
          items:[
            {
              label: 'Configurações',
              command: () => {
                this.router.navigate(['user-settings']);
              }
            },
            {
              label: 'Sair',
              command: () => {
                this.auth.signOut();
                this.router.navigate(['login']);
              }
            }
          ]
        }
      ]
    });
  }

  ngOnDestroy() {
    this.authStateSubscription.unsubscribe();
  }
}
