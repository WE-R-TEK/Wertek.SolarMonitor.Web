import { Component, OnInit } from '@angular/core';
import { PowerDataService } from '../../services/power-data.service';
import { map } from 'rxjs';
import { CardModule } from 'primeng/card';
import { AccordionModule } from 'primeng/accordion';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grandezas-eletrica',
  standalone: true,
  imports: [ CardModule, AccordionModule, CommonModule],
  templateUrl: './grandezas-eletrica.component.html',
  styleUrl: './grandezas-eletrica.component.less'
})
export class GrandezasEletricaComponent implements OnInit{
  nowData: any = {};

  constructor(
    private powerDataService: PowerDataService
  ) {}

  ngOnInit(): void {
    this.retrieveData();
}

retrieveData() {
  this.powerDataService.getNowData().valueChanges().pipe(
    map((data: any) => {
      this.nowData = data;
    })
  ).subscribe();
}
}
