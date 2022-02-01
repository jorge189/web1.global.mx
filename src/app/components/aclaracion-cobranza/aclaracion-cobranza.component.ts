import { ClassMethod } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AcobranzaService } from 'src/app/services/acobranza.service';
import { DialogoCobranzaComponent } from '../dialogos/dialogo-cobranza/dialogo-cobranza.component';

@Component({
    selector: 'app-aclaracion-cobranza',
    templateUrl: './aclaracion-cobranza.component.html',
    styleUrls: ['./aclaracion-cobranza.component.css']
})
export class AclaracionCobranzaComponent implements OnInit {

    men: string = "nueva";
    metodo: string = "fecha";
    paqueteria: string = 'FEDEX';
    trackingSearch: string;
    selectCantidad: string;
    totalPaginas: number;
    paginaActiva: number = 1;
    paginas: any[] = [];
    aclaraciones: any[];
    init: boolean = false;
    cantidad: number = 4;
    seleccionados: any[] = [];
    busqueda: string = '';
    comentario: string = '';
    btnAcl: boolean = false;
    constructor(private wsAclaracion: AcobranzaService, public dialog: MatDialog, private _snackBar: MatSnackBar) { }

    ngOnInit() {

    }

    cambiarMenu(men: any) {
        this.men = men;
    }
    changeMetodo(value) {
        this.metodo = value;
    }
    buscar(pagina: number = 1) {
        let x = '';
        if (this.metodo == 'tracking') {
            this.wsAclaracion.getAclaracionesTracking(pagina, this.cantidad, this.busqueda, this.trackingSearch, this.paqueteria.toLocaleLowerCase()).subscribe((data: any) => {
                if (data.error) {
                    return;
                }
                if (data.total == 0) {
                    this._snackBar.open('Ningun Registro Obtenido', 'Cerrar', {
                        duration: 5000,
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                    });

                }
                this.aclaraciones = data.data; 
                for (let index = 0; index < data.data.length; index++) {
                    this.aclaraciones[index]['ancho1'] = Number(this.aclaraciones[index]['ancho']);
                    this.aclaraciones[index]['largo1'] = Number(this.aclaraciones[index]['largo']);
                    this.aclaraciones[index]['alto1'] = Number(this.aclaraciones[index]['alto']);
                    this.aclaraciones[index]['pesoguia1'] = Number(this.aclaraciones[index]['pesoguia']);

                    this.aclaraciones[index]['anchoNew'] = Number(this.aclaraciones[index]['ancho'])
                    this.aclaraciones[index]['largoNew'] = Number(this.aclaraciones[index]['largo'])
                    this.aclaraciones[index]['pesoNew'] = Number(this.aclaraciones[index]['pesoguia'])
                    this.aclaraciones[index]['altoNew'] = Number(this.aclaraciones[index]['alto'])

                    let busc = this.seleccionados.findIndex((element) => element.tracking == data.data[index]['tracking'])
                    if (busc != -1) {
                        this.aclaraciones[index]['seleccionado'] = true;
                    } else {
                        data.data[index]['seleccionado'] = false;
                    }
                    data.data[index]['peso_volumetrico'] = Math.ceil((data.data[index]['ancho'] * data.data[index]['largo'] * data.data[index]['ancho']) / 5000);
                }
                this.totalPaginas = Math.ceil(data.total / this.cantidad);
                this.paginas = [];
                for (let i = 1; i <= this.totalPaginas; i++) {
                    if (i > 5) {
                        return;
                    }
                    this.paginas.push(i);
                }
            });
        } else {
            this.wsAclaracion.getAclaracionesDias(pagina, this.cantidad, this.busqueda, this.selectCantidad, this.paqueteria.toLocaleLowerCase()).subscribe((data: any) => {
                if (data.total == 0) {
                    this._snackBar.open('Ningun Registro Obtenido', 'Cerrar', {
                        duration: 5000,
                        horizontalPosition: 'end',
                        verticalPosition: 'bottom',
                    });

                }
                if (data.error) {
                    return;
                }
                this.aclaraciones = data.data;
                for (let index = 0; index < data.data.length; index++) {
                    this.aclaraciones[index]['ancho1'] = Number(this.aclaraciones[index]['ancho']);
                    this.aclaraciones[index]['largo1'] = Number(this.aclaraciones[index]['largo']);
                    this.aclaraciones[index]['alto1'] = Number(this.aclaraciones[index]['alto']);
                    this.aclaraciones[index]['pesoguia1'] = Number(this.aclaraciones[index]['pesoguia']);

                    this.aclaraciones[index]['anchoNew'] = Number(this.aclaraciones[index]['ancho'])
                    this.aclaraciones[index]['largoNew'] = Number(this.aclaraciones[index]['largo'])
                    this.aclaraciones[index]['pesoNew'] = Number(this.aclaraciones[index]['pesoguia'])
                    this.aclaraciones[index]['altoNew'] = Number(this.aclaraciones[index]['alto'])

                    let busc = this.seleccionados.findIndex((element) => element.tracking == data.data[index]['tracking'])
                    if (busc != -1) {
                        this.aclaraciones[index]['seleccionado'] = true;
                    } else {
                        data.data[index]['seleccionado'] = false;
                    }
                    data.data[index]['peso_volumetrico'] = Math.ceil((data.data[index]['ancho'] * data.data[index]['largo'] * data.data[index]['ancho']) / 5000);
                }
                this.totalPaginas = Math.ceil(data.total / this.cantidad);
                this.paginas = [];
                for (let i = 1; i <= this.totalPaginas; i++) {
                    if (i > 5) {
                        return;
                    }
                    this.paginas.push(i);
                }
            });
        }


    };
    verPagina(pagina) {
        if (this.paginaActiva == pagina) {
            return;
        }
        this.paginaActiva = pagina;
        this.buscar(pagina);
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
    onClick(object, i, mod = false) {
        if (mod) {
            if (!this.aclaraciones[i]['seleccionado']) {
                this.aclaraciones[i]['seleccionado'] = !this.aclaraciones[i]['seleccionado'];
            } else {
                let busc = this.seleccionados.findIndex((element) => element.tracking == this.aclaraciones[i]['tracking'])
                this.seleccionados.splice(busc, 1)
            }
        } else {
            this.aclaraciones[i]['seleccionado'] = !this.aclaraciones[i]['seleccionado'];
        }
        if (this.aclaraciones[i]['seleccionado']) {
            this.seleccionados.push({
                pagina: this.paginaActiva,
                tracking: this.aclaraciones[i]['tracking'],
                data: object
            })
        } else {
            let busc = this.seleccionados.findIndex((element) => element.tracking == this.aclaraciones[i]['tracking'])
            this.seleccionados.splice(busc, 1)
        }
        if (this.seleccionados.length > 0) {
            this.btnAcl = true;
        }else{this.btnAcl = false;}
    }
    verMas(object: any) {
        const dialogRef = this.dialog.open(DialogoCobranzaComponent, {
            data: {
                'modificar': false,
                data: object,
                paqueteria: this.paqueteria.toLocaleLowerCase()
            },
            width: "800px"
        });

        dialogRef.afterClosed().subscribe(result => {
            // this.cambiarPaqueteria(this.paqueteria);
        });

    }
    search(busc) {
        this.busqueda = busc;
        this.buscar(1);
    }
    modificar(indice) {
        const dialogRef = this.dialog.open(DialogoCobranzaComponent, {
            data: {
                'modificar': true,
                peso_old: Number(this.aclaraciones[indice].pesoguia),
                ancho_old: Number(this.aclaraciones[indice].ancho),
                alto_old: Number(this.aclaraciones[indice].alto),
                largo_old: Number(this.aclaraciones[indice].largo),
            },
            width: "400px"
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result.modificado) {
                this.aclaraciones[indice]['pesoNew'] = result.peso_old
                this.aclaraciones[indice]['pesoguia1'] = result.peso_old
                this.aclaraciones[indice]['anchoNew'] = result.ancho_old
                this.aclaraciones[indice]['ancho1'] = result.ancho_old
                this.aclaraciones[indice]['altoNew'] = result.alto_old
                this.aclaraciones[indice]['alto1'] = result.alto_old
                this.aclaraciones[indice]['largoNew'] = result.largo_old
                this.aclaraciones[indice]['largo1'] = result.largo_old
                this.onClick(this.aclaraciones[indice], indice, true);
            }
        });

    }
    nuevaAclaracion() {
        if (this.comentario == '') {
            this._snackBar.open('Debe de escribir un comentario para poder darle un mejor servicio', 'Cerrar', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'bottom',
            });
            return;
        }
        if (this.seleccionados.length == 0) {
            this._snackBar.open('No ha seleccionado ninguna guia para su aclaracion', 'Cerrar', {
                duration: 5000,
                horizontalPosition: 'end',
                verticalPosition: 'bottom',
            });
            return;
        }
        let newAclaracion = new Array();
        let shippmentClean = new Array();
        let peso_old = 0;
        let ancho_old = 0;
        let alto_old = 0;
        let largo_old = 0;
        let anchoNew = 0;
        let largoNew = 0;
        let pesoNew = 0;
        let altoNew = 0;




        for (let index = 0; index < this.seleccionados.length; index++) {

            for (let i = 0; i < this.aclaraciones.length; i++) {
                let busc = this.seleccionados.findIndex((element) => element.tracking == this.aclaraciones[i]['tracking'])
                if (busc >= 0) {
                    peso_old = Number(this.aclaraciones[i].pesoguia);
                    ancho_old = Number(this.aclaraciones[i].ancho);
                    alto_old = Number(this.aclaraciones[i].alto);
                    largo_old = Number(this.aclaraciones[i].largo);
                    anchoNew = this.aclaraciones[i].anchoNew
                    largoNew = this.aclaraciones[i].largoNew
                    pesoNew = this.aclaraciones[i].pesoNew
                    altoNew = this.aclaraciones[i].altoNew

                    this.aclaraciones[i].seleccionado = false;
                    this.aclaraciones[i].disponible = false;
                }


            }

            if (this.paqueteria == 'FEDEX') {
                shippmentClean.push({
                    "id_historial": this.seleccionados[index].data.idhistorial,
                    "diferencia": this.seleccionados[index].data.diferencia,
                    "pesodeclarado": this.seleccionados[index].data.pesodeclarado,
                    "pesoCobradoPaqueteria": this.seleccionados[index].data.pesoCobradoPaqueteria,
                    "fecha": this.seleccionados[index].data.fecha,
                    "tracking": this.seleccionados[index].tracking,
                    "row": {
                        "peso_old": peso_old,
                        "ancho_old": ancho_old,
                        "alto_old": alto_old,
                        "largo_old": largo_old,
                        "peso_new": pesoNew,
                        "ancho_new": anchoNew,
                        "alto_new": altoNew,
                        "largo_new": largoNew
                    },
                    "cargo_valor_declarado": this.seleccionados[index].data.cargo_valor_declarado,
                    "entrega_extendida": this.seleccionados[index].data.entrega_extendida,
                    "recoleccion_sabado": this.seleccionados[index].data.recoleccion_sabado,
                    "paquete_extragrande": this.seleccionados[index].data.paquete_extragrande,
                    "recoleccion_extendida": this.seleccionados[index].data.recoleccion_extendida,
                    "devolucion_pospago": this.seleccionados[index].data.devolucion_pospago,
                    "embarque_pesado": this.seleccionados[index].data.embarque_pesado,
                    "cargo_add_sobrepeso": this.seleccionados[index].data.cargo_add_sobrepeso,
                    "cargo_reembalado": this.seleccionados[index].data.cargo_reembalado,
                    "extralargo_terr": this.seleccionados[index].data.extralargo_terr,
                    "extralargo_dh": this.seleccionados[index].data.extralargo_dh
                })
            }
            if (this.paqueteria == 'DHL') {
                shippmentClean.push({
                    "id_historial": this.seleccionados[index].data.idhistorial,
                    "diferencia": this.seleccionados[index].data.diferencia,
                    "pesodeclarado": this.seleccionados[index].data.pesodeclarado,
                    "pesoCobradoPaqueteria": this.seleccionados[index].data.pesoguia,
                    "fecha": this.seleccionados[index].data.fecha,
                    "tracking": this.seleccionados[index].data.tracking,
                    "row": {
                        "peso_old": peso_old,
                        "ancho_old": ancho_old,
                        "alto_old": alto_old,
                        "largo_old": largo_old,
                        "peso_new": pesoNew,
                        "ancho_new": anchoNew,
                        "alto_new": altoNew,
                        "largo_new": largoNew
                    },
                    "seguro": this.seleccionados[index].data.seguro,
                    "seguro2": this.seleccionados[index].data.seguro2,
                    "sobrepeso": this.seleccionados[index].data.sobrepeso,
                    "cobertura_extendida": this.seleccionados[index].data.cobertura_extendida,
                    "dimension_excedida": this.seleccionados[index].data.dimension_excedida,
                    "manejo_especial": this.seleccionados[index].data.manejo_especial,
                    "multiguia": this.seleccionados[index].data.multiguia,
                    "rec_zona_extendida": this.seleccionados[index].data.rec_zona_extendida,
                    "devolucion": this.seleccionados[index].data.devolucion,
                    "entrega_sabatina": this.seleccionados[index].data.entrega_sabatina,
                    "correcion_direccion": this.seleccionados[index].data.correcion_direccion,
                    "sello_aduanal": this.seleccionados[index].data.sello_aduanal
                }
                )
            }



        }

        newAclaracion.push({
            'paqueteria': this.paqueteria,
            'comentario': this.comentario,
            'guias': JSON.stringify(shippmentClean)
        });

        this.wsAclaracion.setAclaracion(newAclaracion[0]).subscribe((data: any) => {
            if (data.error) {
                this._snackBar.open(data.data, 'Cerrar', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'bottom',
                });
                for (let i = 0; i < this.aclaraciones.length; i++) {
                    let busc = this.seleccionados.findIndex((element) => element.tracking == this.aclaraciones[i]['tracking'])
                    if (busc >= 0) {
                        this.aclaraciones[i].seleccionado = false;
                        this.aclaraciones[i].disponible = false;
                    }


                }

            } else {
                this._snackBar.open('Su Aclaracion fue enviada correctamente', 'Cerrar', {
                    duration: 5000,
                    horizontalPosition: 'end',
                    verticalPosition: 'bottom',
                });
                this.comentario = ''
            }
            this.seleccionados = []
            this.btnAcl = false;
        })
    }
}