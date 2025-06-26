import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { GraphicsService } from '../../core/services/graphics/graphics.service';
import { GeneralService } from '../../core/services/general/general.service';
import { SpinerComponent } from '../spiner/spiner.component';
import { NativeBannerComponent } from '../native-banner/native-banner.component';

@Component({
  selector: 'app-graphics',
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardHeader,
    SpinerComponent,
    NativeBannerComponent
],
  templateUrl: './graphics.component.html',
  styleUrl: './graphics.component.scss'
})
export class GraphicsComponent implements OnChanges, OnInit {

  @ViewChild('chart') chart!: ChartComponent;
  // @Input() yearData: any;
  // @Input() montData: any;

  _graphics: GraphicsService = inject(GraphicsService);
  _general: GeneralService = inject(GeneralService);
  dataStorage: any;
  spinnerShow: boolean = false;
  dataResult: any;
  public chartOptions: ApexOptions = {
    series: [],
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: true,
        tools: {
          download: true,  // Habilita la opción de descarga en la toolbar
        }
      }
    },
    // colors: ["#1f77b4", "#ff7f0e", "#2ca02c"], // Colores para cada serie
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "30%",
        borderRadius: 30,
        borderRadiusApplication: 'around',
        //  distributed: true // Aplica colores individuales a cada barra
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['#3A82B6', '#E91E63', '#FFC107', '#4CAF50'], // Un color por barra
    },
    xaxis: {
      categories: [],
      labels: {
        style: {
          colors: "#333",
          fontSize: "12px",
        }
      }
    },
    yaxis: {
      title: {
        text: '',
        style: {
          color: "#333",
          fontSize: "14px",
        }
      },
      labels: {
        style: {
          colors: "#666",
          fontSize: "12px"
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.99,
        inverseColors: false,
        gradientToColors: ["#3A82B6FF", "#3A82B6FF", "#3A82B6FF"],
        stops: [0, 100],
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        }
      },
      theme: "dark"
    }
  };

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this._getUserStorage();
  }

  ngOnChanges(): void {
    this._getUserStorage();
  }


  private _getUserStorage(): any {
    this.dataStorage = this._general.getStorage();
    this.returnDataGraphicsBar();
  }

  returnDataGraphicsBar(): void {
    this.spinnerShow = true;
    let expenses: any;
    let presuspuestos: any;

    this._graphics.getGruposConCantidadMiembros(this.dataStorage?.userID).then((response: any) => {

      this.dataResult = response;
      presuspuestos = response.map((item: any) => Number(item.presupuestoPorPersona));
      expenses = response.map((item: any) => Number(item.gastosTotales));

      this.chartOptions.series = [
        {
          name: 'Presupuestos',
          data: presuspuestos,
          color: '#2ca02c'
        },
        {
          name: 'Gastos',
          data: expenses,
          color: '#ff7f0e'
        },
      ];

    }).finally(() => { this.spinnerShow = false })

    const meses = ['En', 'Fe', 'Ma', 'Ab', 'Ma', 'Ju', 'Jul', 'Ag', 'Se', 'Ob', 'No', 'Di'];

    if (Array.isArray(meses)) {
      this.chartOptions = {
        ...this.chartOptions,
        xaxis: {
          ...this.chartOptions.xaxis,
          categories: meses
        }
      };

      // Forzar la detección de cambios
      this.cdr.detectChanges();
    } else {
      console.error("data.mes no es un array válido", meses);
    }
  }

  getNombreMes(fecha: any): any {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Obtubre',
      'Noviembre',
      'Diciembre'
    ];

    const mesNumero = fecha.split('-')[1]; // "08"

    const index = parseInt(mesNumero, 10) - 1;
    return meses[index] || 'Mes inválido';
  }
}
