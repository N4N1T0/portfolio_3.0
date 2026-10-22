---
title: 'Redsys with Next.js 15, Part 2: Payment Notifications'
date: 2025-03-21
dateModified: 2026-10-22
excerpt: 'Handle Redsys notifications in Next.js 15: the notification route, signature checks, idempotency and why the order must come from your database.'
author: 'Adrian "Nano" Alvarez'
counterpartId: 'es/introduccion-a-redsys-en-nextjs-15-parte-2'
tags: ['nextjs', 'payments', 'redsys']
---

## Handling Payment Notifications Efficiently

### The challenge: the browser is not the source of truth

A Redsys payment happens in three places: your server creates the signed form, the bank takes over in its own page, and the result arrives later. Two things go wrong when you treat the redirect back to your site as confirmation:

- The user closes the tab on the bank page. The payment succeeded, your site never hears about it.
- The user lands on your success page with edited query parameters. Nothing was paid, but the page says it was.

The fix is the notification URL. Redsys calls your server directly, server to server, with the signed result. That call, not the browser redirect, is what marks an order as paid.

### Configuring the notification URL

`DS_MERCHANT_MERCHANTURL` must be an absolute, publicly reachable HTTPS URL. A relative path is silently useless: Redsys cannot resolve it, so it never notifies you.

```ts
const form = createRedirectForm({
	...merchantInfo,
	// Redsys posts the signed result here, even if the user never comes back
	DS_MERCHANT_MERCHANTURL: `${process.env.NEXT_PUBLIC_URL}/api/redsys/notification`,
});
```

Keep `DS_MERCHANT_URLOK` and `DS_MERCHANT_URLKO` as well, but treat them as navigation only: they decide which page the user sees, never which order is paid.

### Creating the notification route

The route receives a `POST` with three fields: `Ds_SignatureVersion`, `Ds_Signature` and `Ds_MerchantParameters`. Decode them with the same secret key used to sign the request. `redsys-easy` validates the signature while decoding, so an invalid signature throws and the request can be rejected before it touches the database.

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

		// The notification is the only trusted source: load the order, do not rebuild it
		await markOrderAsPaid({ orderId, responseCode, amount });

		return NextResponse.json({ ok: true });
	} catch {
		// Invalid signature or malformed payload: reject, do not write anything
		return NextResponse.json({ ok: false }, { status: 400 });
	}
}
```

Three rules make this route safe:

1. **Validate the signature before reading the payload.** The parameters are base64, not encrypted. Anyone can craft them; only the signature proves they came from Redsys.
2. **Load the order by `Ds_Order` and compare `Ds_Amount` with the stored total.** Redsys signs the amount, so a mismatch means the order changed after the form was created. Mark it for review instead of accepting it.
3. **Make it idempotent.** Redsys retries when your server does not answer with a 2xx. `markOrderAsPaid` must tolerate the same notification twice, for example with a conditional update or a unique constraint on the order id.

Answer quickly with `200` once the state is written. Heavy work, such as sending the confirmation email or generating the invoice, belongs in a queue or a background job, not inside the notification handler.

### Why not pass the order in the URL

A common shortcut is to put the user id, the products and the total in the redirect URL so the success page can rebuild the order. It looks convenient and it creates three problems: the total can be edited by hand, the cart is exposed in logs and browser history, and the data still disappears if the user closes the tab.

Pass only the order id, which is a random identifier with no authority by itself, and read everything else from the database:

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

The success page then reads the order by id and shows the status stored by the notification route. If the notification has not arrived yet, it can show "processing" and poll, instead of guessing.

### Testing the flow

Redsys provides a test environment with test cards. Exercise these four cases before going live:

- Successful payment, user returns: the order is paid once.
- Successful payment, user closes the tab: the notification still marks the order as paid.
- Cancelled payment: the order stays pending and the failure page does not claim success.
- Replayed notification: the second call returns `200` without duplicating the state change.

## Conclusion

The redirect back to your site is a navigation detail. The notification is the payment. Verify its signature, load the order from your database, check the amount and make the handler idempotent. Everything else, including what the success page displays, derives from that record.

If you have not set up the client yet, start with [Part 1](/en/blog/redsys-implementation-on-nextjs-15/), which covers the signed form and the Redsys client.
