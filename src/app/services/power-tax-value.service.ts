import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PowerTaxValueService {

  private api = 'https://api-power.we-rtek.com';

  constructor(
    private readonly http: HttpClient
  ) { }

  getByMonth(year: number, month: number): Observable<any> {
    return this.http.get(`${this.api}/power-tax-value/year/${year}/month/${month}`);
  }

  update(year: number, month: number, value: any): Observable<any> {
    return this.http.post(`${this.api}/power-tax-value/year/${year}/month/${month}`, value);
  }
}
