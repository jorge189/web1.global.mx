import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'imgtips'
})
export class ImgtipsPipe implements PipeTransform {

  constructor(private domSanitizer:DomSanitizer) {}

  transform(img: any): any {
    let url ="https://plantillas.globalpaq.mx/panel_php/";
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url+img);
  }

}
