import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      // Handle successful payment
      console.log('Payment successful:', session.id)
      break
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription
      // Handle subscription update
      console.log('Subscription updated:', subscription.id)
      break
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription
      // Handle subscription cancellation
      console.log('Subscription cancelled:', deletedSubscription.id)
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
```

---

## 🔧 **ADD THESE TO VERCEL ENVIRONMENT VARIABLES:**

Go to Vercel Dashboard → Settings → Environment Variables and add:
```
OPENAI_API_KEY = your-openai-key-here
STRIPE_SECRET_KEY = your-stripe-secret-key-here
STRIPE_WEBHOOK_SECRET = your-stripe-webhook-secret-here
NEXT_PUBLIC_URL = https://craudiovizai.com
