import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { InfluxDB } from '@influxdata/influxdb-client';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PowerDataService {
  private readonly allDataPath = '/user_identity';
  private readonly basePath = '/user_identity/now';

  private readonly url = 'http://52.40.160.15:8086';
  private readonly token = 'ZgzULOOA4gARxR7mxs3qGEwpC_rUzZkunLaxPTcA6iTl1yWpu0Mob_CYxHKLCAFqUyZE8WfcjAnY9c73St_9Kg==';
  private readonly org = 'wertek';

  private client;
  private queryClient;

  nowDataRef: AngularFireObject<any>;

  constructor(
    private readonly db: AngularFireDatabase
  ) {
    this.nowDataRef = db.object(this.basePath);
    this.client = new InfluxDB({ url: this.url, token: this.token });
    this.queryClient = this.client.getQueryApi(this.org);
  }

  getNowData() {
    return this.nowDataRef;
  }

  getSumData() {
    return this.db.object(this.getSumDataPath());
  }

  getSumMonthData() {
    return this.db.object(this.getSumMonthDataPath());
  }

  getTodayListData() {
    return this.db.list(this.getTodayListDataPath(), ref => ref.limitToLast(100));
  }

  resetAllData() {
    this.db.object(this.allDataPath).remove();
  }

  getSumDataPath() {
    console.log('getSumDataPath');
    const momentum = moment().tz('America/Sao_Paulo');
    const year = momentum.format('YYYY');
    const month = momentum.format('YYYY-MM');
    const day = momentum.format('YYYY-MM-DD');

    console.log(`${this.allDataPath}/${year}/${month}/${day}/sum`)

    return `${this.allDataPath}/${year}/${month}/${day}/sum`;
  }

  getSumMonthDataPath() {
    const momentum = moment().tz('America/Sao_Paulo');
    const year = momentum.format('YYYY');
    const month = momentum.format('YYYY-MM');

    return `${this.allDataPath}/${year}/${month}/sum`;
  }

  getTodayListDataPath() {
    const momentum = moment().tz('America/Sao_Paulo');
    const year = momentum.format('YYYY');
    const month = momentum.format('YYYY-MM');
    const day = momentum.format('YYYY-MM-DD');

    return `${this.allDataPath}/${year}/${month}/${day}`;
  }

  getPotenciaAtivaData(start: string, end: string): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `from(bucket: "solarmonitor")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r._measurement == "powerdata")
        |> filter(fn: (r) => r._field == "pa" or
        r._field == "pb" or
        r._field == "pc" or
        r._field == "pt")
      |> aggregateWindow(every: 5m, fn: mean)
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"])`;

      const data:any[] = [];

      this.queryClient.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const tableObject = tableMeta.toObject(row);
          data.push(tableObject);
        },
        error: (error) => {
          observer.error(error);
        },
        complete: () => {
          observer.next(data);
          observer.complete();
        },
      });
    });
    return returnData;
  }

  getCorrenteData(start: string, end: string): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `from(bucket: "solarmonitor")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r._measurement == "powerdata")
        |> filter(fn: (r) => r._field == "iarms" or
        r._field == "ibrms" or
        r._field == "icrms" or
        r._field == "itrms")
      |> aggregateWindow(every: 5m, fn: mean)
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"])`;

      const data:any[] = [];

      this.queryClient.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const tableObject = tableMeta.toObject(row);
          data.push(tableObject);
        },
        error: (error) => {
          observer.error(error);
        },
        complete: () => {
          observer.next(data);
          observer.complete();
        },
      });
    });
    return returnData;
  }

  getTensaoData(start: string, end: string): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `from(bucket: "solarmonitor")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r._measurement == "powerdata")
        |> filter(fn: (r) => r._field == "uarms" or
        r._field == "ubrms" or
        r._field == "ucrms")
      |> aggregateWindow(every: 5m, fn: mean)
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> sort(columns: ["_time"])`;

      const data:any[] = [];

      this.queryClient.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const tableObject = tableMeta.toObject(row);
          data.push(tableObject);
        },
        error: (error) => {
          observer.error(error);
        },
        complete: () => {
          observer.next(data);
          observer.complete();
        },
      });
    });
    return returnData;
  }

  getConsumoData(start: string, end: string): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `base = () =>
      from(bucket: "solarmonitor")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r._measurement == "powerdata")
        |> filter(fn: (r) => r._field == "epa_c" or
          r._field == "epb_c" or
          r._field == "epc_c" or
          r._field == "ept_c")


      first = base()
        |> sort(columns: ["_time"])
        |> first()
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> tableFind(fn: (key) => true)
        |> getRecord(idx: 0)

      base()
        |> aggregateWindow(every: 5m, fn: max)
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> map(fn: (r) => ({r with
          epa_c: r.epa_c - first.epa_c,
          epb_c: r.epb_c - first.epb_c,
          epc_c: r.epc_c - first.epc_c,
          ept_c: r.ept_c - first.ept_c
        }))
        |> sort(columns: ["_time"])`;

      const data:any[] = [];

      this.queryClient.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const tableObject = tableMeta.toObject(row);
          data.push(tableObject);
        },
        error: (error) => {
          observer.error(error);
        },
        complete: () => {
          observer.next(data);
          observer.complete();
        },
      });
    });
    return returnData;
  }

  getGeracaoData(start: string, end: string): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `base = () =>
      from(bucket: "solarmonitor")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r._measurement == "powerdata")
        |> filter(fn: (r) => r._field == "epa_g" or
          r._field == "epb_g" or
          r._field == "epc_g" or
          r._field == "ept_g")


      first = base()
        |> sort(columns: ["_time"])
        |> first()
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> tableFind(fn: (key) => true)
        |> getRecord(idx: 0)

      base()
        |> aggregateWindow(every: 5m, fn: max)
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> map(fn: (r) => ({r with
          epa_g: r.epa_g - first.epa_g,
          epb_g: r.epb_g - first.epb_g,
          epc_g: r.epc_g - first.epc_g,
          ept_g: r.ept_g - first.ept_g
        }))
        |> sort(columns: ["_time"])`;

      const data:any[] = [];

      this.queryClient.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const tableObject = tableMeta.toObject(row);
          data.push(tableObject);
        },
        error: (error) => {
          observer.error(error);
        },
        complete: () => {
          observer.next(data);
          observer.complete();
        },
      });
    });
    return returnData;
  }

  getDifferenceDataPeriod(start: string, end: string, field: string): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `data = () => from(bucket: "solarmonitor")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r._measurement == "powerdata" and r._field == "${field}")

        first = data() |> first()
        last = data() |> last()

        union(tables: [first, last])
          |> difference()`;

      console.log(fluxQuery);

      this.queryClient.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const tableObject = tableMeta.toObject(row);
          observer.next(tableObject['_value']);
        },
        error: (error) => {
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });
    });
    return returnData;
  }

  getLastData(): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `from (bucket: "solarmonitor")
      |> range(start: -15m)
      |> filter(fn: (r) => r._measurement == "powerdata")
      |> sort(columns: ["_time"])
      |> last()
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`;

      this.queryClient.queryRows(fluxQuery, {
        next: (row, tableMeta) => {
          const tableObject = tableMeta.toObject(row);
          observer.next(tableObject);
        },
        error: (error) => {
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });
    });
    return returnData;
  }
}
