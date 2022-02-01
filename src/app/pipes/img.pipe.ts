import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'img'
})
export class ImgPipe implements PipeTransform {

  transform(value: string): string {
    
    if(value.indexOf('DHL') >= 0 && value.indexOf('DIA SIG') >= 0){
      return `../../../assets/img/dhl-express.png`;
    }

    if(value.indexOf('DHL') >= 0 && value.indexOf('TERR') >= 0){
      return `../../../assets/img/dhl-economy.png`;
    }

    if(value.indexOf('FEDEX') >= 0 && value.indexOf('DIA SIG') >= 0){
      return `../../../assets/img/fedex-express.png`;
    }

    if(value.indexOf('FEDEX') >= 0 && value.indexOf('TERR') >= 0){
      return `../../../assets/img/fedex-economy.png`;
    }

    if(value.indexOf('ESTAFETA') >= 0 && value.indexOf('DIA SIG') >= 0){
      return `../../../assets/img/estafeta.png`;
    }

    if(value.indexOf('ESTAFETA') >= 0 && value.indexOf('TERR') >= 0){
      return `../../../assets/img/estafeta.png`;
    }

    if(value.indexOf('REDPACK') >= 0 ){
      return `../../../assets/img/Redpack.png`;
    }
    
    if(value.indexOf('CAJA') >= 0){
      return `../../../assets/img/caja.jpg`;
    }
    
    if(value.indexOf('POSPAGO') >= 0){
      return `../../../assets/img/pospago.png`;
    }

    if(value.indexOf('GLOBALPAQ') >= 0){
      return `../../../assets/img/globalpaq-express.png`;
    }

    if(value.indexOf('PAQ. EXPRESS') >= 0){
      return `../../../assets/img/paquetexpress.png`;
    }

    if(value.indexOf('SALDO') >= 0){
      return `../../../assets/img/saldo.png`;
    }

    return null;
  }

}
