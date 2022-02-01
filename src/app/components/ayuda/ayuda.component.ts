import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
   styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent implements OnInit {
 hide:string
  over(hide:string){
    console.log(hide);
    this.hide = hide;
    //let element = $('#1');
    //$(this).closest('div').parent().remove();
    //$('.icon-attention-circled').addClass('display:block')
    // let closestElement = document.firstChild.element
    //let closestElement = element.closest('i-ho');
    
    return hide
  }

  out(show:string){
    console.log(show);
  }
  constructor() { }

  ngOnInit() {
  }

}
