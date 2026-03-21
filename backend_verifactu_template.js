/**
 * --------------------------------------------------------------------------
 * VERIFACTU BACKEND TEMPLATE (Node.js) - AEAT ESPAÑA
 * --------------------------------------------------------------------------
 * Este es un servidor listo para usarse una vez tengáis el certificado digital
 * (ej: certificado.p12 o .pfx).
 * 
 * Requisitos:
 * 1. Instalar NodeJS en un servidor (render.com, fly.io o Supabase Edge Functions).
 * 2. npm install express cors axios xmldom node-forge uuid
 * 3. Reemplazar 'CERTIFICADO.p12' y 'PASSWORD' con los valores reales.
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const crypto = require('crypto');
// Notas: En producción deberás usar una librería como 'node-forge' o 'xml-crypto' 
// para construir la firma XAdES que exige la Agencia Tributaria.

const app = express();
app.use(cors());
app.use(express.json());

// ==================================
// CONFIGURACIÓN DE ENTORNO AEAT
// ==================================
// URL de pruebas (Test) de la Agencia Tributaria para envío de registros de alta (VeriFactu)
const AEAT_URL_TEST = "https://prewww1.aeat.es/wlpl/TIKE/cont/ws/SistemaFacturacion/AltaSistemasFacturacion/v1.0";
// URL de Producción (Real)
const AEAT_URL_PROD = "https://www1.aeat.es/wlpl/TIKE/cont/ws/SistemaFacturacion/AltaSistemasFacturacion/v1.0";

// Ruta al certificado (p12/pem). No lo expulses al frontend de React NUNCA.
const RUTA_CERTIFICADO = process.env.CERT_PATH || './certificado_empresa.p12';
const PASS_CERTIFICADO = process.env.CERT_PASS || '1234';

// ==================================
// 1. GENERACIÓN DEL XML ESTRUCTURADO
// ==================================
function generarXMLVerifactu(payload) {
    const { emisor, receptor, factura, lineas } = payload;
    const now = new Date();
    // Estructura simplificada del XML de FacturaE/Suministro de Información AEAT:
    // (Nota: El esquema XSD oficial de AEAT debe ser mapeado exactamente aquí)

    // Hash encadenado: Requiere el hash de la última factura enviada.
    const ultimoHash = "HASH_ANTERIOR_AQUI";

    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:sii="https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/SuministroInformacion.xsd"
                  xmlns:VeriFactu="https://www2.agenciatributaria.gob.es/static_files/common/internet/dep/aplicaciones/es/aeat/tike/cont/ws/AltaF.xsd">
   <soapenv:Header/>
   <soapenv:Body>
      <VeriFactu:AltaSistemasFacturacion>
         <sii:Cabecera>
            <sii:ObligadoEmision>
               <sii:NombreRazon>${emisor.razon_social}</sii:NombreRazon>
               <sii:NIF>${emisor.nif}</sii:NIF>
            </sii:ObligadoEmision>
         </sii:Cabecera>
         <VeriFactu:RegistroAlta>
            <sii:RegistroFacturacion>
               <sii:EmisorFactura>
                  <sii:NIF>${emisor.nif}</sii:NIF>
               </sii:EmisorFactura>
               <sii:CabeceraFactura>
                  <sii:IDFactura>
                     <sii:NumSerieFacturaEmisor>${factura.numero}</sii:NumSerieFacturaEmisor>
                     <sii:FechaExpedicionFactura>${factura.fecha.split('/').reverse().join('-')}</sii:FechaExpedicionFactura>
                  </sii:IDFactura>
                  <sii:TipoFactura>F1</sii:TipoFactura> <!-- F1=Factura normal -->
               </sii:CabeceraFactura>
               <sii:DatosFactura>
                  <sii:ImporteTotal>${factura.total.toFixed(2)}</sii:ImporteTotal>
               </sii:DatosFactura>
               <sii:Desglose>
                  <sii:DetalleDesglose>
                     <!-- Detalles del iva del 21% -->
                     <sii:BaseImponible>${factura.subtotal.toFixed(2)}</sii:BaseImponible>
                     <sii:TipoImpositivo>21.00</sii:TipoImpositivo>
                     <sii:CuotaRepercutida>${factura.iva.toFixed(2)}</sii:CuotaRepercutida>
                  </sii:DetalleDesglose>
               </sii:Desglose>
            </sii:RegistroFacturacion>
            <!-- Aquí iría la firma digital del XML y el Nodo de Encadenamiento -->
         </VeriFactu:RegistroAlta>
      </VeriFactu:AltaSistemasFacturacion>
   </soapenv:Body>
</soapenv:Envelope>`;
}

// ==================================
// 2. ENDPOINT DE ENVÍO
// ==================================
app.post('/api/verifactu/emitir', async (req, res) => {
    console.log("-> Recibida solicitud para emitir a VeriFactu.");
    const payload = req.body;

    try {
        // 1. Construir XML
        const xml = generarXMLVerifactu(payload);

        // 2. Firmar XML (Requiere certificado P12/PEM y librería node-forge/xml-crypto)
        // En este template lo omitimos porque requiere el archivo físico.
        console.log("-> Construyendo y firmando XML (Simulado)...");
        const xmlFirmado = xml;

        // 3. Crear certificado de cliente o MTLS (Mutual TLS) para conectar con la API de Hacienda
        // Si no tienes el archivo P12 real y la contraseña, Axios fallará.
        /*
        const httpsAgent = new https.Agent({
            pfx: fs.readFileSync(RUTA_CERTIFICADO),
            passphrase: PASS_CERTIFICADO
        });
        */

        // 4. Hacer el envío a la URL elegida
        const url_destino = payload.entorno === 'produccion' ? AEAT_URL_PROD : AEAT_URL_TEST;
        console.log("-> Enviando a:", url_destino);

        /* DESCOMENTAR PARA HACER EL PING REAL A HACIENDA:
        const response = await axios.post(url_destino, xmlFirmado, {
            headers: { 'Content-Type': 'text/xml' },
            httpsAgent: httpsAgent 
        });
        // Transformar la respuesta y reenviar a React
        */

        // RESPUESTA MOCK (Prueba temporal para React)
        res.json({
            estado: 'Aceptada',
            codigoSeguroVerificacion: 'CSV-1234-ABCD-5678-EFGH',
            timeStamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error en servidor Node:", error.message);
        res.status(500).json({ error: error.message, stack: error.stack });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend de VeriFactu corriendo en puerto ${PORT}`);
    console.log(`Listo para recibir facturas y conectarse con la AEAT.`);
});
