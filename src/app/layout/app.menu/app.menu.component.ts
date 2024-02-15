import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../services/app.layout.service';
import { AppMenuitemComponent } from '../app.menuitem/app.menuitem.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [AppMenuitemComponent, CommonModule],
  templateUrl: './app.menu.component.html',
  styleUrl: './app.menu.component.less'
})
export class AppMenuComponent implements OnInit{
  model: any[] = [];

  constructor(public layoutService: LayoutService) { }

  ngOnInit() {
    this.model = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                { label: 'Leituras', icon: 'pi pi-fw pi-home', routerLink: ['/home'] },
                { label: 'Grandezas', icon: 'pi pi-fw pi-home', routerLink: ['/grandezas-eletricas'] }
            ]
        }
    ];
  }

}
