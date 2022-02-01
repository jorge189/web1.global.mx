
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
selector: '[appNumbersOnly]'
})
export class NumbersOnlyDirective {

constructor(private _el: ElementRef) { }

@HostListener('input', ['$event']) onInputChange(event){
const initalValue = this._el.nativeElement.value;
this._el.nativeElement.value = initalValue.replace(/[^0-9\n]*/g, '');
if(initalValue !== this._el.nativeElement.value){
event.stopPropagation();
}
}

}