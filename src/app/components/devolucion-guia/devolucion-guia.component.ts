import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DevolucionGuiaService } from 'src/app/services/devolucion-guia.service';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';
import { DevolucionesComponent } from '../dialogos/devoluciones/devoluciones.component';

@Component({
    selector: 'app-devolucion-guia',
    templateUrl: './devolucion-guia.component.html',
    styleUrls: ['./devolucion-guia.component.css']
})
export class DevolucionGuiaComponent implements OnInit {
    paqueteria: string = "fedex";
    men: string = "disponibles";
    devoluciones = [];
    paginaActiva: number = 1;
    paginaActiva2: number = 1;
    paginas: any[] = [];
    paginas2: any[] = [];
    init: boolean = false;
    init2: boolean = false;
    totalPaginas: number;
    totalPaginas2: number;
    cantidad = 4;
    cantidad1 = 4;
    disponibles: any[] = [];
    auxiliar;
    disponiblesSig = [];
    disponiblesTerr = [];
    constructor(public dialog: MatDialog, private wsdevolucion: DevolucionGuiaService, private wsGlobalpaq: GlobalpaqService) { }

    ngOnInit() {
        this.cambiarPaqueteria('fedex');
        this.cambiarMenu('disponibles');
        this.getDevoluciones(1, 4, '');



    }
    cambiarPaqueteria(paqueteria: any) {
        this.paqueteria = paqueteria;
        this.paginaActiva2 = 1;
        this.disponibles = []
        this.getDisponibles(paqueteria);
    }
    cambiarMenu(men: any) {
        this.men = men;
    }

    getDisponibles(paqueteria) {
        let dispaq;
        dispaq = this.wsGlobalpaq.getGuiasDisponibles(paqueteria);
        dispaq.subscribe((data: any) => {
            this.disponiblesSig = data.diaSig;
            this.disponiblesTerr = data.terrestre;
            let union = [...data.diaSig, ...data.terrestre];
            this.auxiliar = [];
            this.auxiliar = union;
            console.log(union);
            // if (this.init2 == false) {
            // this.init2 = true;
            this.totalPaginas2 = Math.ceil(this.auxiliar.length / this.cantidad);
            console.log(this.totalPaginas2);
            this.paginas2 = [];
            // } else {
            //     return;
            // }
            for (let i = 1; i <= this.totalPaginas2; i++) {
                if (i > 5) {
                    break;
                }
                this.paginas2.push(i);

            }
            let elementos = (this.auxiliar.length < this.cantidad) ? this.auxiliar.length : this.cantidad
            for (let i = 0; i < elementos; i++) {
                this.disponibles.push(this.auxiliar[i]);
            }
        });
    }


    getDevoluciones(pagina: number = 1, cantidad, search) {
        this.wsdevolucion.getDevoluciones(pagina, cantidad, search).subscribe((data: any) => {
            if (data.error) {
                return;
            }
            this.devoluciones = data.data;
                this.totalPaginas = Math.ceil(data.total / this.cantidad1);
                this.paginas = [];
                
            for (let i = 1; i <= this.totalPaginas; i++) {
                if (i > 5) {
                    return;
                }
                this.paginas.push(i);
            }

        });
    }
    verPagina(pagina) {
        if (this.paginaActiva == pagina) {
            return;
        }
        this.paginaActiva = pagina;
        this.getDevoluciones(pagina, this.cantidad1, '');
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
    verPagina2(pagina) {
        if (this.paginaActiva2 == pagina) {
            return;
        }
        this.paginaActiva2 = pagina;
        this.disponibles = [];
        let inicio = (this.cantidad * this.paginaActiva2) - this.cantidad;
        for (let i = inicio; i < this.auxiliar.length; i++) {
            if (i > inicio + (this.cantidad - 1)) {
                break;
            }
            this.disponibles.push(this.auxiliar[i]);
        }
        console.log('total paginas', this.totalPaginas2)
        if (this.totalPaginas2 <= 5) {
            return;
        }
        this.paginas2 = [];
        if (pagina >= 3 && this.totalPaginas2 > 5 && pagina < this.totalPaginas2 - 1) {
            for (let i = pagina - 2; i <= pagina + 2; i++) {
                this.paginas2.push(i);
            }
        }
        if (pagina >= 3 && this.totalPaginas2 > 5 && pagina == this.totalPaginas2 - 1) {
            for (let i = pagina - 3; i <= pagina + 1; i++) {
                this.paginas2.push(i);
            }
        }
        if (pagina == 2 && this.totalPaginas2 > 5 && pagina < this.totalPaginas2 - 1) {
            for (let i = pagina - 1; i <= pagina + 3; i++) {
                this.paginas2.push(i);
            }
        }

        if (pagina == this.totalPaginas2 && this.totalPaginas2 > 5) {
            for (let i = pagina - 4; i <= pagina; i++) {
                this.paginas2.push(i);
            }
        }

        if (pagina == 1 && this.totalPaginas2 > 5) {
            for (let i = pagina; i <= pagina + 4; i++) {
                this.paginas2.push(i);
            }
        }

    }

    devolverGuia(descripcion, peso, disponibles, tipo, idarticulo, usadas) {
        const dialogRef = this.dialog.open(DevolucionesComponent, {
            data: {
                tipoVista: 'Devolucion de Guia',
                titulo: true,
                descripcion: descripcion,
                peso: peso,
                disponibles: disponibles,
                tipo: tipo,
                idarticulo: idarticulo,
                paqueteria: this.paqueteria,
                usadas: usadas

            },
            width: "800px"
        });

        dialogRef.afterClosed().subscribe(result => {
            this.cambiarPaqueteria(this.paqueteria);
        });
    }
}
