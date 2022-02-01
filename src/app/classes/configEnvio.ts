import { Validators } from '@angular/forms';

export const configEnvio = (paqueteria: string) => {
    switch (paqueteria) {
        case 'fedex':
            return {
                nombre: [Validators.required, Validators.maxLength(29), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                compania: [Validators.required, Validators.maxLength(35), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                calle: [Validators.required, Validators.maxLength(35), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                ciudad: [Validators.required, Validators.maxLength(35)],
                cp: [Validators.required],
                colonia: [Validators.required],
                estado: [Validators.required],
                telefono: [Validators.required, Validators.minLength(1), Validators.max(9999999999)],
                contenido: [Validators.maxLength(30)],
                comentario: [Validators.maxLength(30)]
            }
        case 'dhl':
            return {
                nombre: [Validators.required, Validators.maxLength(29), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                compania: [Validators.required, Validators.maxLength(35), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                calle: [Validators.required, Validators.maxLength(35), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                ciudad: [Validators.required, Validators.maxLength(35)],
                cp: [Validators.required],
                colonia: [Validators.required],
                estado: [Validators.required],
                telefono: [Validators.required, Validators.minLength(1), Validators.max(9999999999)],
                referencia1: [Validators.maxLength(30)],
                referencia2: [Validators.maxLength(30)],
                correo: [Validators.required, Validators.email],
                contenido: [Validators.required, Validators.maxLength(25)]
            }
        case 'estafeta':
            return {
                nombre: [Validators.required, Validators.maxLength(30), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                compania: [Validators.required, Validators.maxLength(50), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                calle: [Validators.required, Validators.maxLength(30), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                ciudad: [Validators.required, Validators.maxLength(50)],
                cp: [Validators.required],
                colonia: [Validators.required],
                estado: [Validators.required],
                telefono: [Validators.required, Validators.minLength(1), Validators.max(9999999999)],
                contenido: [Validators.required, Validators.maxLength(25)]
            }
        case 'redpack':
            return {
                nombre: [Validators.required, Validators.maxLength(100), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                compania: [Validators.required, Validators.maxLength(35), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                calle: [Validators.required, Validators.maxLength(200), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                ciudad: [Validators.required, Validators.maxLength(50)],
                cp: [Validators.required],
                colonia: [Validators.required],
                estado: [Validators.required],
                telefono: [Validators.required, Validators.minLength(1), Validators.max(9999999999)],
                numero: [Validators.required]
            }
        case 'globalpaq':
            return {
                nombre: [Validators.required, Validators.maxLength(29), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                compania: [Validators.required, Validators.maxLength(35), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                calle: [Validators.required, Validators.maxLength(35), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                ciudad: [Validators.required, Validators.maxLength(35)],
                cp: [Validators.required],
                colonia: [Validators.required],
                estado: [Validators.required],
                telefono: [Validators.required, Validators.minLength(1), Validators.max(9999999999)],
                contenido: [Validators.maxLength(30)]
            }
        case 'paquetexpress':
            return {
                nombre: [Validators.required, Validators.maxLength(29), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                compania: [Validators.required, Validators.maxLength(35), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                calle: [Validators.required, Validators.maxLength(35), Validators.pattern(/^([^\s])([\sa-zA-Z0-9_\-]*)([^\s])$/)],
                ciudad: [Validators.required, Validators.maxLength(35)],
                cp: [Validators.required],
                colonia: [Validators.required],
                estado: [Validators.required],
                telefono: [Validators.required, Validators.minLength(1), Validators.max(9999999999)],
                contenido: [Validators.maxLength(30)],
                correo: [Validators.required, Validators.email]
            }
    }
}