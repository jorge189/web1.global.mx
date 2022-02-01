import * as moment from "moment"
import { environment } from "src/environments/environment"

export const guia = (data) => {
    return {
        guia_tipo: data.datos.pesoguia.split('-')[0],
        guia_peso: data.datos.pesoguia.split('-')[1],
        guia_tipo_papel: data.adicional.papel,
        guia_rec: 'no',
        shipper_nombre: data.remitente.nombre,
        shipper_compania: data.remitente.compania,
        shipper_telefono: data.remitente.telefono,
        shipper_calle: data.remitente.calle,
        shipper_calle2: data.remitente.colonia,
        shipper_ciudad: data.remitente.ciudad,
        shipper_estado: data.remitente.estado,
        shipper_cp: data.remitente.cp,
        shipper_email: data.remitente.correo,
        shipper_referencia1: data.remitente.referencia1,
        shipper_referencia2: data.remitente.referencia2,
        shipper_num_ext: data.remitente.numero,
        shipper_tipo: data.remitente.tipo,
        recipient_nombre: data.destinatario.nombre,
        recipient_compania: data.destinatario.compania,
        recipient_telefono: data.destinatario.telefono,
        recipient_calle: data.destinatario.calle,
        recipient_calle2: data.destinatario.colonia,
        recipient_ciudad: data.destinatario.ciudad,
        recipient_estado: data.destinatario.estado,
        recipient_cp: data.destinatario.cp,
        recipient_email: data.destinatario.correo,
        recipient_referencia1: data.destinatario.referencia1,
        recipient_referencia2: data.destinatario.referencia2,
        recipient_num_ext: data.destinatario.numero,
        recipient_tipo: data.destinatario.tipo,
        packageLineItem_valor: data.paquete.seguro,
        packageLineItem_peso: data.paquete.peso,
        packageLineItem_largo: data.paquete.largo,
        packageLineItem_ancho: data.paquete.ancho,
        packageLineItem_alto: data.paquete.alto,
        packageLineItem_contenido: data.paquete.contenido,
        packageLineItem_comentario: data.paquete.comentario,
        additional_papel: data.adicional.papel,
        additional_cofirmation: data.adicional.correo,
        additional_confirmation_add: data.adicional.adicional,
        additional_follow: data.adicional.seguimiento,
        additional_follow_add: data.adicional.seguimientoAdicional,
        metodo: 'newWeb'
    }
}

export const guiaRobot = (data, ciudadRem, ciudadDest) => {
    return {
        client_id: localStorage.getItem('idasociado'),
        client_hijo: null,
        client_tipoguia: data.datos.pesoguia.split('-')[0],
        client_valor_peso: data.datos.pesoguia.split('-')[1],
        declaredValue: data.paquete.seguro,
        shipper_nombre: data.remitente.nombre,
        shipper_compania: data.remitente.compania,
        shipper_telefono: data.remitente.telefono,
        shipper_calle: data.remitente.calle,
        shipper_calle2: data.remitente.referencia1 || '',
        shipper_calle3: data.remitente.referencia2 || '',
        shipper_colonia: data.remitente.colonia,
        shipper_ciudad: ciudadRem,
        shipper_estado: data.remitente.estado,
        shipper_cp: `${data.remitente.cp}`,
        shipper_email: data.remitente.correo,
        shipper_tipo: data.remitente.tipo,
        recipient_nombre: data.destinatario.nombre,
        recipient_compania: data.destinatario.compania,
        recipient_telefono: data.destinatario.telefono,
        recipient_calle: data.destinatario.calle,
        recipient_calle2: data.destinatario.referencia1 || '',
        recipient_calle3: data.destinatario.referencia2 || '',
        recipient_colonia: data.destinatario.colonia,
        recipient_ciudad: ciudadDest,
        recipient_estado: data.destinatario.estado,
        recipient_cp: `${data.destinatario.cp}`,
        recipient_email: data.destinatario.correo,
        recipient_referencia1: data.destinatario.referencia1,
        recipient_referencia2: data.destinatario.referencia2,
        recipient_tipo: data.destinatario.tipo,
        package_valor: data.paquete.seguro || 0,
        package_peso: `${data.paquete.peso}`,
        package_largo: `${data.paquete.largo}`,
        package_ancho: `${data.paquete.ancho}`,
        package_alto: `${data.paquete.alto}`,
        package_contenido: `${data.paquete.contenido}`,
    }
}

export const recoleccion = (data, tracking) => {
    return {
        shipper_nombre: data.remitente.nombre,
        shipper_compania: data.remitente.compania,
        shipper_telefono: data.remitente.telefono,
        shipper_calle: data.remitente.calle,
        shipper_colonia: data.remitente.colonia,
        shipper_ciudad: data.remitente.ciudad,
        shipper_estado: data.remitente.estado,
        shipper_cp: data.remitente.cp,
        shipper_instructions: data.recoleccion.indicaciones,
        shiperr_num_ext: data.remitente.numero,
        packageLineItem_peso: data.paquete.peso,
        packageLineItem_largo: data.paquete.largo,
        packageLineItem_ancho: data.paquete.ancho,
        packageLineItem_alto: data.paquete.alto,
        date_pickup: moment(data.recoleccion.fecha).format('YYYY-MM-DD'),
        package_time_ready: data.recoleccion.horaBefore,
        last_available_hour: data.recoleccion.horaAfter,
        tracking: tracking
    }
}

export const paqueteAdicional = (data:any) => {
    return {
        packageLineItem_peso: data.peso,
        packageLineItem_largo: data.largo,
        packageLineItem_ancho: data.ancho,
        packageLineItem_alto: data.alto,
        packageLineItem_valor: data.seguro
    }
}