import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApisService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-material-envio',
  templateUrl: './material-envio.component.html',
  styleUrls: ['./material-envio.component.css']
})
export class MaterialEnvioComponent implements OnInit {
  array: any = [
    {
      img: "assets/images/1.jpg",
      nombre: "DESCRIPCIÓN",
      descripcion: "Canguro ideal para realizar tus traslados, que puedes adquirir con nosotros, somos líderes en el mercado. Los canguros pueden no venir rotulados.",

    },
    {
      img: "assets/images/2.jpg",
      nombre: "DESCRIPCIÓN",
      descripcion: "Canguro ideal para realizar tus traslados, que puedes adquirir con nosotros, somos líderes en el mercado. Los canguros pueden no venir rotulados.",

    }, {
      img: "assets/images/3.jpg",
      nombre: "DESCRIPCIÓN",
      descripcion: "Canguro ideal para realizar tus traslados, que puedes adquirir con nosotros, somos líderes en el mercado. Los canguros pueden no venir rotulados.",

    }, {
      img: "assets/images/4.jpg",
      nombre: "DESCRIPCIÓN",
      descripcion: "Sobre ideal para realizar tus traslados, que puedes adquirir con nosotros, somos líderes en el mercado.",

    }, {
      img: "assets/images/5.jpg",
      nombre: "DESCRIPCIÓN",
      descripcion: "Sobre ideal para realizar tus traslados, que puedes adquirir con nosotros, somos líderes en el mercado.",

    }, {
      img: "assets/images/6.jpg",
      nombre: "DESCRIPCIÓN",
      descripcion: "Sobre ideal para realizar tus traslados, que puedes adquirir con nosotros, somos líderes en el mercado.",

    }, {
      img: "assets/images/7.jpg",
      nombre: "DESCRIPCIÓN",
      descripcion: "Bolsa ideal para realizar tus operaciones que puedes adquirir con nosotros, somos líderes en el mercado.",

    }, {
      img: "assets/images/8.jpg",
      nombre: "DESCRIPCIÓN",
      descripcion: "Bolsa ideal para realizar tus operaciones que puedes adquirir con nosotros, somos líderes en el mercado.",

    }, {
      img: "assets/images/9.jpg",
      nombre: "DESCRIPCIÓN",
      descripcion: "Bolsa ideal para realizar tus operaciones que puedes adquirir con nosotros, somos líderes en el mercado.",

    }, {
      img: "assets/images/10.jpg",
      nombre: "CINTA CANELA",
      descripcion: "CARACTERÍSTICAS Ancho: 48 mm Empaque: Encogible Espesor: 0.040 mm Longitud: 150 m Cinta de fácil aplicación mantiene un buen sellado y cierre de cajas de cartón corrugado. Adhesivo de alta calidad.",

    }, {
      img: "assets/images/11.jpg",
      nombre: "CINTA FRAGIL",
      descripcion: "CARACTERÍSTICAS Ancho: 48 mm Longitud: 150 m Cinta de fácil aplicación mantiene un buen sellado y cierre de cajas de cartón corrugado. Adhesivo acrílico base agua que conserva sus propiedades por largos periodos.",

    }, {
      img: "assets/images/12.jpg",
      nombre: "ETQUETA FRAGIL",
      descripcion: "CARACTERÍSTICAS Ancho: 10.2 cm Longitud: 12.5 cm Etiquetas de Fragil, Protección Paquete de 500 piezas Para empaques y traslados. Etiquetes autoadheribles de gran calidad.",

    },
  ]
  material: Array<any> = [];
  paqueteria: string = "fedex";
  cantidad: number = 0;
  // selectTipo: string = "";
  // destinario: string = "";
  // cantidad: number = 0;
  // agregar = true;
  // action: string = "CERRAR";
  // status: string = ""
  // vista: boolean = false;
  // envio: any[] = [];
  // bandera: number;
  // mat2: string = ""
  // slc: boolean = true;
  forma: FormGroup;
  lista: Array<any> = [];
  // material2:any=[ "Sobres"
  // , "Bolsa chica"
  // , "Bolsa grande"
  // , "Caja chica"
  // , "Caja mediana"
  // , "Caja grande"
  // , "Canguros"
  // , "Sobre burbuja"
  // , "Cinta canela"
  // , "Cinta fragil"
  // , "Etiqueta fragil"]
  constructor(private _snackBar: MatSnackBar, private Material: ApisService) {
    this.forma = new FormGroup({
      'destinatario': new FormControl('', [Validators.required, Validators.minLength(10)]),
      'idarticulo': new FormControl('', Validators.required),
      'cantidad': new FormControl('', Validators.required),
      'material': new FormControl('')
    })
  }

  ngOnInit() {

    this.cambiarPaqueteria('fedex');

  }

  cambiarPaqueteria(paqueteria: any) {
    this.lista = [];
    this.paqueteria = paqueteria;
    this.getMaterialPaqueteria();
  }

  validateCantidad(control: FormControl): { [s: string]: boolean } {
    if (control.value > this.cantidad) {
      return { max: true }
    }
    return null;
  }

  changeMaterial() {
    let mat = this.material.find(element => element.idarticulo == this.forma.value.idarticulo);
    this.cantidad = mat.disponible;
    this.forma.get('cantidad').setValidators([Validators.required, this.validateCantidad.bind(this)]);
    this.forma.get('material').setValue(mat.articulo);
    this.forma.get('cantidad').updateValueAndValidity();
  }

  // seldes(des) {
  //   console.log(des.length);
  //   if (des.length > 10) {
  //     this.slc = false
  //   } else {
  //     this.slc = true
  //   }
  // }

  // notificacion() {
  //   this._snackBar.open("El destinatario debe tener mas de 10 caracteres", this.action, {
  //     duration: 5000,
  //   });
  // }

  // cargar(mat, cant, destiny) {
  //   if (mat && cant && destiny) {
  //     this.agregar = false;
  //   }
  //   if (!destiny) {
  //     this._snackBar.open("Primero debe selecionar el destino", this.action, {
  //       duration: 3000,
  //     });
  //     return

  //   }
  // }

  // Select(select) {
  //   // console.log(select);
  //   if (!select || select.length < 10) {
  //     this._snackBar.open("El destinatario  debe contener mas de 10 caracteres", this.action, {
  //       duration: 3000,
  //     });
  //     return
  //   }
  // }

  // agregarProducto(cant, mat, destino) {
  //   destino = destino.trim();
  //   this.mat2 = mat
  //   this.bandera = this.material.length;


  //   if (cant > 999) {
  //     this._snackBar.open("La cantidad no debe exceder de 999", this.action, {
  //       duration: 3000,
  //     });
  //     return
  //   }
  //   if (!this.mat2 || !cant || !destino || destino.length < 10) {
  //     this._snackBar.open("Debes seleccionar el material y cantidad y llenar correctamente el destino", this.action, {
  //       duration: 3000,
  //     });
  //     return
  //   }
  //   if (this.mat2 && cant && destino && destino.length > 10) {
  //     var i = this.material.indexOf(this.mat2);
  //     if (i !== -1) {
  //       this.material.splice(i, 1);
  //     }
  //     this.vista = true;
  //     if (this.bandera > this.material.length) {
  //       this.envio.push({ material: this.mat2, cantidad: cant })
  //     }
  //     console.log(this.envio);
  //   }

  //   if (this.bandera == this.material.length) {
  //     this._snackBar.open("Seleccione el nuevo material", this.action, {
  //       duration: 3000,
  //     });

  //   }

  // }

  // solicitar(cant) {
  //   this.destinario = cant.trim();

  //   if (this.envio.length == 0) {
  //     this._snackBar.open("No se puede mandar petición vacía", this.action, {
  //       duration: 3000,
  //     });

  //     return
  //   } else {
  //     this.Material.sendMaterial({ datos: this.envio, destinatario: this.destinario, paqueteria: this.paqueteria }).subscribe((data: any) => {
  //       console.log(data.data);
  //       this.status = data.data
  //       this._snackBar.open(this.status, this.action, {
  //         duration: 3000,
  //       });
  //       this.envio = [];
  //       this.vista = false;
  //       // this.material=this.material2
  //     });

  //   }
  // }

  // eliminar(indice, mat) {
  //   this.envio.splice(indice, 1);
  //   this.material.unshift(mat);
  //   console.log(this.envio);
  //   if (this.envio.length == 0) {
  //     this.vista = false;
  //   }
  // }

  // openSnackBar(message: string, action: string) {
  //   this._snackBar.open(message, action, {
  //     duration: 3000,
  //   });
  // }

  // nuevaCantidad(mat, nuevaCant) {
  //   console.log(nuevaCant);
  //   if (nuevaCant == "" || nuevaCant > 999 || nuevaCant <= 0) {
  //     this._snackBar.open("La Cantidad no debe ser vacia,0 o mayor a 999", this.action, {
  //       duration: 5000,
  //     });
  //     this.agregar = true;
  //     return
  //   }
  //   else {
  //     this.envio[mat].cantidad = nuevaCant
  //     this.agregar = false;
  //   }
  //   // console.log(mat," ",nuevaCant)
  //   console.log(this.envio[mat]);
  // }

  getMaterialPaqueteria() {
    this.Material.getMaterial(this.paqueteria).subscribe((data: any) => {
      console.log(data);
      if (data.error) {
        return;
      }
      this.material = data.data;
    });
  }

  agregarMaterial() {
    let index = this.lista.findIndex(element => element.idarticulo == this.forma.value.idarticulo);
    if (index >= 0) {
      this._snackBar.open("El material ya fue agregado", 'Ok', {
        duration: 5000,
      });
      return;
    }
    this.lista.push(this.forma.value);
    this.forma.reset({
      destinatario: this.forma.value.destinatario
    });
  }

  eliminar(index:number) {
    this.lista.splice(index, 1);
  }

  enviar() {
    let sendData = {
      destinatario: this.forma.value.destinatario,
      paqueteria: this.paqueteria,
      datos: this.lista
    }
    this.Material.sendMaterial(sendData).subscribe((data:any) => {
      console.log(data);
      if(data.error){
        this._snackBar.open('No se logro procesar el envio', 'Ok', {
          duration: 3000,
        });
        return;
      }
      this.cantidad = 0;
      this.lista = [];
      this._snackBar.open('La petición se envío correctamente', 'Ok', {
        duration: 3000,
      });
    });
  }

}
// 09700 20188 id
