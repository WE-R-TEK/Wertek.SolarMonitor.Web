import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { PowerTaxValueService } from '../../services/power-tax-value.service';
import moment from 'moment';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CalendarModule, FormsModule, InputNumberModule, ButtonModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.less'
})
export class UserSettingsComponent implements OnInit {
  private _month: Date = new Date();
  tusd_fornecida: number = 0;
  te_fornecida: number = 0;
  tusd_injetada: number = 0;
  te_injetada: number = 0;
  id: number | null = null;
  maxDate = new Date();

  get month(): Date {
    return this._month;
  }

  set month(value: Date) {
    this._month = value;
    this.loadMonthData();
  }

  constructor(
    private readonly powerTaxValueService: PowerTaxValueService
  ) { }

  ngOnInit(): void {
    this.loadMonthData();
  }

  loadMonthData() {
    const year = this._month.getFullYear();
    const month = this._month.getMonth() + 1;
    this.powerTaxValueService.getByMonth(year, month).subscribe((data: any) => {
      if (data === null) {
        this.tusd_fornecida = 0;
        this.te_fornecida = 0;
        this.tusd_injetada = 0;
        this.te_injetada = 0;
        this.id = null;
        return;
      }
      this.tusd_fornecida = data.tusd_fornecida ?? 0;
      this.te_fornecida = data.te_fornecida ?? 0;
      this.tusd_injetada = data.tusd_injetada ?? 0;
      this.te_injetada = data.te_injetada ?? 0;
      this.id = data.id;
    });
  }

  updateMonthData() {
    const year = this._month.getFullYear();
    const month = this._month.getMonth() + 1;
    const value = {
      tusd_fornecida: this.tusd_fornecida,
      te_fornecida: this.te_fornecida,
      tusd_injetada: this.tusd_injetada,
      te_injetada: this.te_injetada,
      year: year,
      month: month,
      date: moment.utc().toDate(),
      id: this.id
    };
    if (this.id === null) {
      this.powerTaxValueService.insert(value).subscribe();
      return;
    }
    this.powerTaxValueService.update(this.id, value).subscribe();
  }

}
