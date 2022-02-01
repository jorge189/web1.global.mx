import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'url'
})
export class UrlPipe implements PipeTransform {

  constructor(private dom: DomSanitizer) {}

  transform(value:string, tipo: string): any {
    
    let url = "https://sistema.globalpaq.net/";
    if(tipo == "fedex"){
     url += "fedex/guias/";
    }else if(tipo == "dhl"){
      url += "dhl/guias/";
    }else if(tipo == "estafeta"){
      url += "estafeta/guias/";
    }else{
      return this.dom.bypassSecurityTrustResourceUrl(value);
    }

    return this.dom.bypassSecurityTrustResourceUrl(url + value);
  }

}
