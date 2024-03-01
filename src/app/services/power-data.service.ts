import { Injectable } from '@angular/core';
import { InfluxDB } from '@influxdata/influxdb-client';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';
import * as Highcharts from 'highcharts';

@Injectable({
  providedIn: 'root'
})
export class PowerDataService {

  private readonly url = 'https://influx-power.we-rtek.com';
  private readonly token = 'ZgzULOOA4gARxR7mxs3qGEwpC_rUzZkunLaxPTcA6iTl1yWpu0Mob_CYxHKLCAFqUyZE8WfcjAnY9c73St_9Kg==';
  private readonly org = 'wertek';

  private client;
  private queryClient;

  constructor() {
    this.client = new InfluxDB({ url: this.url, token: this.token });
    this.queryClient = this.client.getQueryApi(this.org);
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
      |> fill(column: "_value", value: 0.0)
      |> aggregateWindow(every: 5m, fn: mean)
      |> fill(column: "_value", value: 0.0)
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
      |> fill(column: "_value", value: 0.0)
      |> aggregateWindow(every: 5m, fn: mean)
      |> fill(column: "_value", value: 0.0)
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
      |> fill(column: "_value", value: 0.0)
      |> aggregateWindow(every: 5m, fn: mean)
      |> fill(column: "_value", value: 0.0)
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
        |> fill(usePrevious: true)
        |> aggregateWindow(every: 5m, fn: max)
        |> fill(usePrevious: true)
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

  getInjetadaData(start: string, end: string): Observable<any> {
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
        |> fill(usePrevious: true)
        |> aggregateWindow(every: 5m, fn: max)
        |> fill(usePrevious: true)
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

  getGeracaoData(start: string, end: string): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `base = () =>
      from(bucket: "solarmonitor")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r._measurement == "solardata")
        |> filter(fn: (r) => r._field == "total")


      first = base()
        |> sort(columns: ["_time"])
        |> first()
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> tableFind(fn: (key) => true)
        |> getRecord(idx: 0)

      base()
        |> fill(usePrevious: true)
        |> aggregateWindow(every: 5m, fn: max)
        |> fill(usePrevious: true)
        |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
        |> map(fn: (r) => ({r with
          total: r.total - first.total
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

  getGeracaoPerData(start: string, end: string): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `from(bucket: "solarmonitor")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r._measurement == "solardata")
      |> filter(fn: (r) => r._field == "ger_per")
      |> filter(fn: (r) => r._value > 0)
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

  getDifferenceDataPeriod(start: string, end: string, field: string): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `data = () => from(bucket: "solarmonitor")
        |> range(start: ${start}, stop: ${end})
        |> filter(fn: (r) => r._measurement == "powerdata" and r._field == "${field}")

        first = data() |> first()
        last = data() |> last()

        union(tables: [first, last])
          |> difference()`;


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

  getGeradoTotalPeriod(start: string, end: string): Observable<any> {
    const returnData = new Observable((observer) => {
      const fluxQuery = `data = () => from(bucket: "solarmonitor")
      |> range(start: ${start}, stop: ${end})
      |> filter(fn: (r) => r._measurement == "solardata" and r._field == "total")

      first = data() |> first()
      last = data() |> last()

      union(tables: [first, last])
        |> difference()`;


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

  getGaugeOptions(title: string, label: string, min: number, max: number, value: number): Highcharts.Options {
    return {
      chart: {
        type: 'solidgauge',
      },
      title: {
        text: title
      },
      pane: {
        center: ['50%', '70%'],
        size: '100%',
        startAngle: -90,
        endAngle: 90,
        background: [{
          backgroundColor: Highcharts.defaultOptions.legend?.backgroundColor || '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }],
      },
      exporting: {
        enabled: false
      },
      tooltip: {
        enabled: false
      },
      yAxis: {
        stops: [
          [0.1, '#55BF3B'],
          [0.5, '#DDDF0D'],
          [0.9, '#DF5353']
        ],
        lineWidth: 0,
        tickWidth: 0,
        minorTickInterval: 'auto',
        tickAmount: 2,
        title: {
          y: -70
        },
        labels: {
          y: 16
        },
        min: min,
        max: max
      },
      plotOptions: {
        solidgauge: {
          dataLabels: {
            y: 10,
            borderWidth: 0,
            useHTML: true
          }
        }
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Potencia A',
        data: [value],
        type: 'solidgauge',
        dataLabels: {
          format: '<div style="text-align:center">' +
          '<span style="font-size:16px">{y}</span><br/>' +
          '<span style="font-size:10px;opacity:0.4">'+label+'</span>' +
          '</div>'
        },
        tooltip: {
          valueSuffix: label
        }
      }]
    };
  }

  getChartAreaOptions(title: string, label: string, color: string, data: any[]): Highcharts.Options {
    return {
      chart: {
        type: 'area'
      },
      title: {
        text: title
      },
      yAxis: {
        title: {
          text: label
        }
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Hora'
        },
        labels: {
          format: '{value:%H:%M}'
        }
      },
      time: {
        timezone: 'America/Sao_Paulo'
      },
      series: [
        {
          data: data,
          type: 'area',
          color: color,
        }
      ],
      legend: {
        enabled: false
      },
    };
  }

  getChartLineOptions(title: string, label: string, data: {title: string, color: string, values: any[]}[]): Highcharts.Options {
    return {
      chart: {
        type: 'line'
      },
      title: {
        text: title
      },
      yAxis: {
        title: {
          text: label
        }
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Hora'
        },
        labels: {
          format: '{value:%H:%M}'
        }
      },
      time: {
        timezone: 'America/Sao_Paulo'
      },
      series: data.map((d) => {
        return {
          data: d.values,
          type: 'line',
          color: d.color,
          name: d.title
        };
      }),
      legend: {
        enabled: true
      },
    };
  }
}
