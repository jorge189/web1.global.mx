import { Component, Input, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MultiusuarioService } from 'src/app/services/multiusuario.service';

@Component({
  selector: 'app-asignaciones-usuario',
  templateUrl: './asignaciones-usuario.component.html',
  styleUrls: ['./asignaciones-usuario.component.css']
})
export class AsignacionesUsuarioComponent implements OnInit, OnChanges {

  @Input() paqueteria: string = '';
  @Input() idusuario: number = 0;
  @Output() cambiosPaq: EventEmitter<any> = new EventEmitter();
  disponibles: any[] = [];
  aux: any[] = [];
  forma: FormGroup;
  cantidad: number = 0;
  idtipoguia: number = 0;
  peso: number = 0;
  idarticulo: number = 0;

  constructor(private wsMulti: MultiusuarioService) {
    this.forma = new FormGroup({
      'tipo': new FormControl('DIA SIG', Validators.required),
      'guia': new FormControl('', Validators.required),
      'cantidad': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.paqueteria != '') {
      this.getGuiasDisponibles();
    }
  }

  changeTipo() {
    console.log('cambiando')
    this.disponibles = this.aux.filter(element => element.descripcion.includes(this.forma.value.tipo));

  }

  changeGuia() {
    this.idtipoguia = this.forma.value.guia.split('-')[0];
    this.peso = this.forma.value.guia.split('-')[1];
    this.idarticulo = this.forma.value.guia.split('-')[2];
    let guia = this.disponibles.find(element => element.idtipoguia = this.idtipoguia && element.peso == this.peso);
    this.cantidad = guia.disponibles;
    this.forma.get('cantidad').setValidators([Validators.required, this.validateCantidad.bind(this)]);
    this.forma.get('cantidad').updateValueAndValidity();
  }

  getGuiasDisponibles() {
    this.forma.reset();
    this.wsMulti.getDisponibles(this.paqueteria).subscribe((data: any) => {
      console.log(data);
      if (data.error) {
        return;
      }
      this.aux = data.data.filter(element => element.disponibles > 0);
      this.aux = this.aux.sort((a, b) => b.activo - a.activo);
      this.changeTipo();
    })
  }

  validateCantidad(control: FormControl): { [s: string]: boolean } {
    if (control.value > this.cantidad) {
      return { max: true }
    }
    return null;
  }

  agregar() {
    let sendData = {
      idtipoguia: this.idtipoguia,
      peso: this.peso,
      cantidad: this.forma.value.cantidad,
      idusuario: this.idusuario,
      idarticulo: this.idarticulo
    }
    this.wsMulti.agregarGuia(sendData).subscribe((data: any) => {
      console.log(data);
      if (data.error) {
        return;
      }
      this.cambiosPaq.emit('ok');
    });
  }

}
