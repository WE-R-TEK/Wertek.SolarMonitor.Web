import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { AccordionModule } from 'primeng/accordion';
import { PowerDataService } from './services/power-data.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToolbarModule,
    ButtonModule,
    ChartModule,
    CardModule,
    TableModule,
    PanelModule,
    AccordionModule,
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent implements OnInit{

  constructor(private powerDataService: PowerDataService) {}

  ngOnInit(): void {
    this.resetAllData();
  }

  resetAllData() {
    this.powerDataService.resetAllData();
  }
}
