import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AcobranzaService } from 'src/app/services/acobranza.service';
import { DialogoCobranzabComponent } from '../../dialogos/dialogo-cobranzab/dialogo-cobranzab.component';

@Component({
  selector: 'app-tabla-aclaracion-cobranza',
  templateUrl: './tabla-aclaracion-cobranza.component.html',
  styleUrls: ['./tabla-aclaracion-cobranza.component.css']
})
export class TablaAclaracionCobranzaComponent implements OnInit {

  paginaActiva: number = 1;
  paginas: any[] = [];
  totalPaginas: number;
  cantidad: number = 4;
  aclaraciones: any[] = [];

  constructor(private wsAcobranza: AcobranzaService, private wsDialog: MatDialog) { }

  ngOnInit() {
    this.getAclaraciones(this.cantidad, 1, '');
  }

  getAclaraciones(cantidad, pagina, search) {
    this.wsAcobranza.getAclaraciones(cantidad, pagina, search).subscribe((data: any) => {
      if (data.error) {
        return;
      }
      this.aclaraciones = data.data;
      this.totalPaginas = Math.ceil(data.total / this.cantidad);
      this.paginas = [];

      for (let i = 1; i <= this.totalPaginas; i++) {
        if (i > 5) {
          return;
        }
        this.paginas.push(i);
      }
    })
  }

  verPagina(pagina) {
    if (this.paginaActiva == pagina) {
      return;
    }
    this.paginaActiva = pagina;
    this.getAclaraciones(this.cantidad, pagina, '');
    if (this.totalPaginas <= 5) {
      return;
    }
    this.paginas = [];
    if (pagina >= 3 && this.totalPaginas > 5 && pagina < this.totalPaginas - 1) {
      for (let i = pagina - 2; i <= pagina + 2; i++) {
        this.paginas.push(i);
      }
    }
    if (pagina >= 3 && this.totalPaginas > 5 && pagina == this.totalPaginas - 1) {
      for (let i = pagina - 3; i <= pagina + 1; i++) {
        this.paginas.push(i);
      }
    }
    if (pagina == 2 && this.totalPaginas > 5 && pagina < this.totalPaginas - 1) {
      for (let i = pagina - 1; i <= pagina + 3; i++) {
        this.paginas.push(i);
      }
    }

    if (pagina == this.totalPaginas && this.totalPaginas > 5) {
      for (let i = pagina - 4; i <= pagina; i++) {
        this.paginas.push(i);
      }
    }

    if (pagina == 1 && this.totalPaginas > 5) {
      for (let i = pagina; i <= pagina + 4; i++) {
        this.paginas.push(i);
      }
    }
  }

  buscar(value) {
    this.paginaActiva = 1;
    this.getAclaraciones(this.cantidad, 1, value);

  }
  verMas(indice) {
    const dialogRef = this.wsDialog.open(DialogoCobranzabComponent, {
      data: {
        data: this.aclaraciones[indice]
      },
      width: "800px"
    });

    dialogRef.afterClosed().subscribe(result => {
      // this.cambiarPaqueteria(this.paqueteria);
    });
  }
}
