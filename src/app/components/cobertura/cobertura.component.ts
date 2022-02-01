import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GlobalpaqService } from 'src/app/services/globalpaq.service';

@Component({
  selector: 'app-cobertura',
  templateUrl: './cobertura.component.html',
  styleUrls: ['./cobertura.component.css']
})
export class CoberturaComponent implements OnInit {

  forma: FormGroup;
  loading: boolean = false;
  view: boolean = false;
  cobFedex: any;
  cobDhl: any;
  cobEstafeta: any;
  cobPaquetexpress: any;
  cobGlobalpaq: any;
  cobRedpack: any;
  carga: boolean = false;
  errorFedex: boolean = false;
  errorDhl: boolean = false;
  errorEstafeta: boolean = false;
  errorRedpack: boolean = false;
  errorGlobalpaq: boolean = false;
  errorPaquetexpress: boolean = false;


  constructor(private gp: GlobalpaqService) {
    this.forma = new FormGroup({
      'origen': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
      'destino': new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)])
    });
    this.carga = true;
  }

  ngOnInit() {
  }
  async getCobertura() {
    this.loading = true;
    this.view = false

    await new Promise((resolve, reject) => {
      this.gp.getCobertura(this.forma.value.origen, this.forma.value.destino, 'fedex').subscribe((data: any) => {
        if (data.error) {
          this.errorFedex = true;
        } else {
          this.errorFedex = false;
          this.cobFedex = data.data;

        }
        resolve(true)
      });
    });
    await new Promise((resolve) => {
      this.gp.getCobertura(this.forma.value.origen, this.forma.value.destino, 'dhl').subscribe((data: any) => {
        if (data.error) {
          this.errorDhl = true;
        } else {
          this.errorDhl = false;
          this.cobDhl = data.data;
        }
        resolve(true)
      });
    });
    await new Promise((resolve) => {
      this.gp.getCobertura(this.forma.value.origen, this.forma.value.destino, 'estafeta').subscribe((data: any) => {
        if (data.error) {
          this.errorEstafeta = true;
        } else {
          this.errorEstafeta = false;
          this.cobEstafeta = data.data;
        }
        resolve(true)
      });
    });
    await new Promise((resolve) => {
      this.gp.getCobertura(this.forma.value.origen, this.forma.value.destino, 'paquetexpress').subscribe((data: any) => {
        if (data.error) {
          this.errorPaquetexpress = true;
        } else {
          this.errorPaquetexpress = false;
          this.cobPaquetexpress = data.data;
        }
        resolve(true)
      });
    });
    await new Promise((resolve) => {
      this.gp.getCobertura(this.forma.value.origen, this.forma.value.destino, 'globalpaq').subscribe((data: any) => {
        if (data.error) {
          this.errorGlobalpaq = true;
        } else {
          this.errorGlobalpaq = false;
          this.cobGlobalpaq = data.data;
        }
        resolve(true)
      });
    });
    await new Promise((resolve) => {
      this.gp.getCobertura(this.forma.value.origen, this.forma.value.destino, 'redpack').subscribe((data: any) => {
        if (data.error) {
          this.errorRedpack = true;
        } else {
          this.errorRedpack = false;
          this.cobRedpack = data.data;
        }
        resolve(true)
      });
    });
    this.view = true;
    this.loading = false;
  }
}
