import { supabase } from './supabaseClient';
import type { Factura } from './store';

/**
 * SERVICIO VERIFACTU (FRONTEND)
 * 
 * Este archivo prepara el lado del cliente (React) para comunicarse con el futuro
 * servidor Backend que implemente la firma XML y el envío a la Agencia Tributaria.
 */

// URL del futuro Backend (Node.js/Supabase Edge Function)
const VERIFACTU_BACKEND_URL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/verifactu' // Entorno local
    : 'https://mi-backend-urbano.onrender.com/api/verifactu'; // URL de Producción

/**
 * Función que se llamará desde React cuando el usuario pulse "Registrar en VeriFactu"
 * @param factura Objeto de factura de Supabase
 */
export async function emitirFacturaVerifactu(factura: Factura) {
    try {
        // 1. Obtener la información completa para poder generar el XML FacturaE
        const { data: cliente } = await supabase.from('clientes').select('*').eq('id', factura.cliente_id).single();
        const { data: lineas } = await supabase.from('lineas_factura').select('*').eq('factura_id', factura.id);
        const { data: empresa } = await supabase.from('empresa').select('*').single();

        if (!cliente || !empresa) {
            throw new Error("Faltan datos del cliente o la empresa para generar VeriFactu");
        }

        const payload = {
            emisor: empresa,
            receptor: cliente,
            factura: factura,
            lineas: lineas || [],
            // 'entorno' puede ser 'pruebas' o 'produccion'
            entorno: 'pruebas'
        };

        // 2. Enviar a nuestro servicio Backend de Node.js (porque React no puede firmar .p12)
        const response = await fetch(`${VERIFACTU_BACKEND_URL}/emitir`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Aquí podrías añadir un token Bearer para seguridad
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errBody = await response.json();
            throw new Error(errBody.error || "Fallo HTTP del Backend");
        }

        const resultadoAEAT = await response.json();

        // 3. Evaluar respuesta de la AEAT
        if (resultadoAEAT.estado === 'Aceptada') {
            // Guardar en base de datos la confirmación
            await supabase.from('facturas').update({
                estado_aeat: 'aceptada', // Necesitarás añadir este campo a la BBDD
                csv_aeat: resultadoAEAT.codigoSeguroVerificacion // Código de validación para el PDF
            }).eq('id', factura.id);

            return {
                exito: true,
                mensaje: "VeriFactu aceptó la factura correctamente."
            };
        } else {
            console.error("Rechazada por AEAT:", resultadoAEAT.errores);
            return {
                exito: false,
                mensaje: `AEAT rechazó la factura: ${resultadoAEAT.errores.join(', ')}`
            };
        }

    } catch (error: any) {
        console.error("Error global VeriFactu:", error);
        return {
            exito: false,
            mensaje: `Fallo de conexión: ${error.message}`
        };
    }
}
