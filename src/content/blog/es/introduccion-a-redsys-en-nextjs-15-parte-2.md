---
title: 'Redsys con Next.js 15, parte 2: notificaciones de pago'
date: 2025-03-21
dateModified: 2026-10-22
excerpt: 'Gestionar notificaciones de Redsys en Next.js 15: la ruta de notificación, validación de firma, idempotencia y por qué el pedido sale de tu base de datos.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'en/redsys-implementation-on-nextjs-15-part-2'
tags: ['nextjs', 'payments', 'redsys']
---

## Manejo eficiente de notificaciones de pago

### El reto: el navegador no es la fuente de verdad

Un pago con Redsys ocurre en tres sitios: tu servidor crea el formulario firmado, el banco toma el control en su propia página y el resultado llega después. Dos cosas fallan cuando tratas la vuelta a tu web como confirmación:

- El usuario cierra la pestaña en la página del banco. El pago se hizo, pero tu web no se entera.
- El usuario llega a tu página de éxito con parámetros editados. No se pagó nada, pero la página dice que sí.

La solución es la URL de notificación. Redsys llama a tu servidor directamente, de servidor a servidor, con el resultado firmado. Esa llamada, no la redirección del navegador, es la que marca el pedido como pagado.

### Configurar la URL de notificación

`DS_MERCHANT_MERCHANTURL` debe ser una URL absoluta, pública y en HTTPS. Una ruta relativa no sirve y falla en silencio: Redsys no puede resolverla, así que nunca te notifica.

```ts
const form = createRedirectForm({
	...merchantInfo,
	// Redsys envía aquí el resultado firmado, aunque el usuario no vuelva
	DS_MERCHANT_MERCHANTURL: `${process.env.NEXT_PUBLIC_URL}/api/redsys/notification`,
});
```

Mantén también `DS_MERCHANT_URLOK` y `DS_MERCHANT_URLKO`, pero con otro papel: deciden qué página ve el usuario, nunca qué pedido está pagado.

### Crear la ruta de notificación

La ruta recibe un `POST` con tres campos: `Ds_SignatureVersion`, `Ds_Signature` y `Ds_MerchantParameters`. Decodifícalos con la misma clave secreta que usaste para firmar la petición. `redsys-easy` valida la firma al decodificar, así que una firma inválida lanza una excepción y la petición se rechaza antes de tocar la base de datos.

```ts
import type { ResponseJSONSuccess } from 'redsys-easy';
import { processRestNotification } from '@/lib/clients/redsys';
import { NextResponse } from 'next/server';
import { markOrderAsPaid } from '@/lib/orders';

export async function POST(req: Request) {
	const notificationParams: ResponseJSONSuccess = {
		Ds_SignatureVersion: req.headers.get('Ds_SignatureVersion') as string,
		Ds_Signature: req.headers.get('Ds_Signature') as string,
		Ds_MerchantParameters: req.headers.get('Ds_MerchantParameters') as string,
	};

	try {
		const {
			Ds_Order: orderId,
			Ds_Response: responseCode,
			Ds_Amount: amount,
		} = processRestNotification(notificationParams);

		// La notificación es la única fuente fiable: carga el pedido, no lo reconstruyas
		await markOrderAsPaid({ orderId, responseCode, amount });

		return NextResponse.json({ ok: true });
	} catch {
		// Firma inválida o carga malformada: rechaza y no escribas nada
		return NextResponse.json({ ok: false }, { status: 400 });
	}
}
```

Tres reglas hacen segura esta ruta:

1. **Valida la firma antes de leer el contenido.** Los parámetros van en base64, no cifrados. Cualquiera puede fabricarlos; solo la firma demuestra que vienen de Redsys.
2. **Carga el pedido por `Ds_Order` y compara `Ds_Amount` con el total guardado.** Redsys firma el importe, así que una diferencia significa que el pedido cambió después de crear el formulario. Márcalo para revisión en lugar de aceptarlo.
3. **Hazla idempotente.** Redsys reintenta cuando tu servidor no responde con un 2xx. `markOrderAsPaid` debe tolerar la misma notificación dos veces, por ejemplo con una actualización condicional o una restricción única sobre el id del pedido.

Responde rápido con `200` cuando el estado esté escrito. El trabajo pesado, como enviar el correo de confirmación o generar la factura, va en una cola o en un job en segundo plano, no dentro del handler.

### Por qué no pasar el pedido por la URL

Un atajo habitual es meter el id de usuario, los productos y el total en la URL de retorno para que la página de éxito reconstruya el pedido. Parece cómodo y crea tres problemas: el total se puede editar a mano, el carrito queda expuesto en logs e historial del navegador, y los datos desaparecen igual si el usuario cierra la pestaña.

Pasa solo el id del pedido, que es un identificador aleatorio sin autoridad por sí mismo, y lee el resto de la base de datos:

```ts
'use server';

const orderRedirectUrl = (page: string, orderId: string) =>
	`${process.env.NEXT_PUBLIC_URL}/${page}?orderId=${orderId}`;

const form = createRedirectForm({
	...merchantInfo,
	DS_MERCHANT_MERCHANTURL: `${process.env.NEXT_PUBLIC_URL}/api/redsys/notification`,
	DS_MERCHANT_URLOK: orderRedirectUrl('success', orderId),
	DS_MERCHANT_URLKO: orderRedirectUrl('failure', orderId),
});
```

La página de éxito lee el pedido por id y muestra el estado que guardó la ruta de notificación. Si la notificación aún no ha llegado, puede mostrar "procesando" y consultar de nuevo, en vez de adivinar.

### Probar el flujo

Redsys ofrece un entorno de pruebas con tarjetas de test. Antes de publicar, cubre estos cuatro casos:

- Pago correcto y el usuario vuelve: el pedido se marca como pagado una sola vez.
- Pago correcto y el usuario cierra la pestaña: la notificación marca igualmente el pedido como pagado.
- Pago cancelado: el pedido sigue pendiente y la página de fallo no anuncia éxito.
- Notificación repetida: la segunda llamada responde `200` sin duplicar el cambio de estado.

## Conclusión

La redirección a tu web es un detalle de navegación. La notificación es el pago. Valida su firma, carga el pedido desde tu base de datos, comprueba el importe y haz el handler idempotente. Todo lo demás, incluido lo que muestra la página de éxito, sale de ese registro.

Si aún no tienes el cliente montado, empieza por la [Parte 1](/es/blog/introduccion-a-redsys-en-nextjs-15/), donde cubro el formulario firmado y el cliente de Redsys.
