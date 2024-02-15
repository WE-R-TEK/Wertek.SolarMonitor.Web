import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../services/app.layout.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, MenuModule],
  templateUrl: './app.topbar.component.html',
  styleUrl: './app.topbar.component.less'
})
export class AppTopbarComponent {
  items!: MenuItem[];
  itemsmu: MenuItem[] = [
    {
      label: 'Sair',
      command: () => {
        this.authService.logout();
      }
    }
  ];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    private readonly authService: AuthService,
  ) { }
}
