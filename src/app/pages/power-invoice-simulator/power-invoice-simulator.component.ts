import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { PowerDataService } from '../../services/power-data.service';
import moment from 'moment';
import { PowerTaxValueService } from '../../services/power-tax-value.service';

@Component({
  selector: 'app-power-invoice-simulator',
  standalone: true,
  imports: [CardModule, FieldsetModule, CalendarModule, FormsModule, CommonModule, TableModule],
  templateUrl: './power-invoice-simulator.component.html',
  styleUrl: './power-invoice-simulator.component.less'
})
export class PowerInvoiceSimulatorComponent implements OnInit{
  maxDate: Date = new Date();
  startDate: Date = new Date();
  endDate: Date = new Date();
  startDateShow: Date = new Date();
  endDateShow: Date = new Date();
  simulationData: any[] = [];
  total: number = 0;
  totalConsumido: number = 0;
  totalGerado: number = 0;
  totalInjetado: number = 0;
  consumoReal: number = 0;
  geradoReal: number = 0;
  saldo: number = 0;
  lucro: boolean = false;

  constructor(
    private readonly powerDataService: PowerDataService,
    private readonly powerTaxValueService: PowerTaxValueService
  ) {
    this.startDate.setDate(this.startDate.getDate() - 30);
  }

  ngOnInit(): void {
    this.simulate();
  }

  simulate() {
    const startDay = moment(this.startDate).startOf('day').utc().toISOString();
    const endDay = moment(this.endDate).endOf('day').utc().toISOString();
    this.startDateShow = this.startDate;
    this.endDateShow = this.endDate;
    this.simulationData = [];
    const fornecidoTusd = {
      description: 'Enegia Fornecida - TUSD',
      quantity: 0,
      rate: 0,
      value: 0
    };
    const fornecidoTe = {
      description: 'Enegia Fornecida - TE',
      quantity: 0,
      rate: 0,
      value: 0
    };
    const injetadaTusd = {
      description: 'Enegia Injetada - TUSD',
      quantity: 0,
      rate: 0,
      value: 0
    };
    const injetadaTe = {
      description: 'Enegia Injetada - TE',
      quantity: 0,
      rate: 0,
      value: 0
    };
    this.powerDataService.getGeradoTotalPeriod(startDay, endDay).subscribe((data: any) => {
      this.totalGerado = data;
    });
    this.powerDataService.getDifferenceDataPeriod(startDay, endDay, 'ept_c').subscribe((data: any) => {
      fornecidoTusd.quantity = data;
      fornecidoTe.quantity = data;
      this.totalConsumido = data;
      this.updateCalc(fornecidoTusd);
      this.updateCalc(fornecidoTe);
    });
    this.powerDataService.getDifferenceDataPeriod(startDay, endDay, 'ept_g').subscribe((data: any) => {
      injetadaTusd.quantity = data * -1;
      injetadaTe.quantity = data * -1;
      this.totalInjetado = data;
      this.updateCalc(injetadaTusd);
      this.updateCalc(injetadaTe);
    });
    this.powerTaxValueService.getByMonth(moment(this.endDate).year(), moment(this.endDate).month() + 1).subscribe((data: any) => {
      if (data) {
        fornecidoTusd.rate = data.tusd_fornecida;
        fornecidoTe.rate = data.te_fornecida;
        injetadaTusd.rate = data.tusd_injetada;
        injetadaTe.rate = data.te_injetada;
        this.updateCalc(fornecidoTusd);
        this.updateCalc(fornecidoTe);
        this.updateCalc(injetadaTusd);
        this.updateCalc(injetadaTe);
      }
    });
    this.simulationData.push(fornecidoTusd, fornecidoTe, injetadaTusd, injetadaTe);
  }

  updateCalc(data: any) {
    data.value = data.quantity * data.rate;
    this.total = this.simulationData.reduce((acc, item) => acc + item.value, 0);
    this.consumoReal = this.totalConsumido + (this.totalGerado - this.totalInjetado > 0 ? this.totalGerado - this.totalInjetado : 0);
    this.geradoReal = this.totalGerado < this.totalInjetado ? this.totalInjetado : this.totalGerado;
    if (this.consumoReal > this.geradoReal) {
      this.lucro = false;
      this.saldo = this.consumoReal - this.geradoReal;
    }
    else {
      this.lucro = true;
      this.saldo = this.geradoReal - this.consumoReal;
    }
  }
}
