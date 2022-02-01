import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'style'
})
export class StylePipe implements PipeTransform {
  
  constructor(private wsDOm:DomSanitizer){

  }
  transform(value: any): any {
    return this.wsDOm.bypassSecurityTrustStyle(value);
  }

}
