import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import moment from 'moment';
import { Socket } from 'ngx-socket-io';
import { Subscription, map } from 'rxjs';
import { PowerDataService } from '../../services/power-data.service';
import { PowerTaxValueService } from '../../services/power-tax-value.service';

@Component({
  selector: 'app-resumo-consumo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumo-consumo.component.html',
  styleUrl: './resumo-consumo.component.less',
})
export class ResumoConsumoComponent implements OnInit, OnDestroy, OnChanges {

  @Input({required: false}) date?: Date;

  consHoje = 0;
  consHojeMoney = 0;
  injHoje = 0;
  injHojeMoney = 0;
  gerMes = 0;
  consMes = 0;
  consMesMoney = 0;
  injMes = 0;
  injMesMoney = 0;
  gerHoje = 0;
  powerTax = 1;
  solarTax = 1;
  wsSubscription: Subscription;

  constructor(
    private readonly websocketService: Socket,
    private readonly powerDataService: PowerDataService,
    private readonly powerTaxValueService: PowerTaxValueService
  ) {
    this.wsSubscription = this.websocketService.fromEvent('events').pipe(map((receivedMessage: any) => {
      console.log('Received message from websocket: ', receivedMessage);
      this.retrieveSumData();
    })).subscribe();
  }

  ngOnInit(): void {
    this.getPeriodPowerTaxValue();
    this.retrieveSumData();
  }

  getPeriodPowerTaxValue() {
    const year = this.date ? moment(this.date).year() : moment.tz('America/Sao_Paulo').year();
    const month = this.date ? moment(this.date).month() + 1 : moment.tz('America/Sao_Paulo').month() + 1;
    this.powerTaxValueService.getByMonth(year, month).subscribe((data: any) => {
      if (data) {
        this.powerTax = data.tusd_fornecida + data.te_fornecida;
        this.solarTax = data.tusd_injetada + data.te_injetada;
        console.log('Power Tax: ', this.powerTax);
        console.log('Solar Tax: ', this.solarTax);
      }
    });
  }

  retrieveSumData() {

    const startDay = this.date ? moment(this.date).startOf('day').utc().toISOString() : moment.tz('America/Sao_Paulo').startOf('day').utc().toISOString();
    const endDay = this.date ? moment(this.date).endOf('day').utc().toISOString() : moment.tz('America/Sao_Paulo').endOf('day').utc().toISOString();
    const startMonth = this.date ? moment(this.date).startOf('month').utc().toISOString() : moment.tz('America/Sao_Paulo').startOf('month').utc().toISOString();
    const endMonth = this.date ? moment(this.date).endOf('month').utc().toISOString() : moment.tz('America/Sao_Paulo').endOf('month').utc().toISOString();

    this.powerDataService.getDifferenceDataPeriod(startDay, endDay, 'ept_c').subscribe((data: any) => {
      this.consHoje = data;
      this.recalculateMoney();
    });
    this.powerDataService.getDifferenceDataPeriod(startDay, endDay, 'ept_g').subscribe((data: any) => {
      this.injHoje = data;
      this.recalculateMoney();
    });
    this.powerDataService.getDifferenceDataPeriod(startMonth, endMonth, 'ept_c').subscribe((data: any) => {
      this.consMes = data;
      this.recalculateMoney();
    });
    this.powerDataService.getDifferenceDataPeriod(startMonth, endMonth, 'ept_g').subscribe((data: any) => {
      this.injMes = data;
      this.recalculateMoney();
    });
    this.powerDataService.getGeradoTotalPeriod(startDay, endDay).subscribe((data: any) => {
      this.gerHoje = data;
    });
    this.powerDataService.getGeradoTotalPeriod(startMonth, endMonth).subscribe((data: any) => {
      this.gerMes = data;
    });
  }

  recalculateMoney() {
    this.consHojeMoney = this.consHoje * this.powerTax;
    this.injHojeMoney = this.injHoje * this.solarTax;
    this.consMesMoney = this.consMes * this.powerTax;
    this.injMesMoney = this.injMes * this.solarTax;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getPeriodPowerTaxValue();
    this.retrieveSumData();
  }

  ngOnDestroy() {
    this.wsSubscription.unsubscribe();
  }
}
