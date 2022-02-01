import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class Articulo{

    public cambiarNombre(articulo:string){
        articulo = articulo.replace('GUIA ELEC', '');
        articulo = articulo.replace('NACIONAL REC', '');
        articulo = articulo.replace('FEDEX', `<strong class="text-purple">FEDEX</strong>`);
        articulo = articulo.replace('DHL', `<strong class="text-warning">DHL</strong>`);
        articulo = articulo.replace('ESTAFETA', `<strong class="text-danger">ESTAFETA</strong>`);
        articulo = articulo.replace('REDPACK', `<strong class="text-secondary">REDPACK</strong>`);
        
        return articulo;

    }

}
