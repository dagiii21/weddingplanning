# Chapa Payment Integration Guide

This guide explains how to set up and configure the Chapa payment system for the wedding planning platform.

## Prerequisites

Before you begin, ensure you have:

1. A Chapa merchant account (sign up at [https://chapa.co](https://chapa.co))
2. Access to your Chapa dashboard to obtain API keys
3. Configured webhooks in your Chapa dashboard

## Environment Variables

Add the following environment variables to your `.env` file:

```
# Chapa API Configuration
CHAPA_SECRET_KEY=YOUR_SECRET_KEY_HERE
CHAPA_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET_HERE
BACKEND_URL=https://your-backend-url.com
```

- `CHAPA_SECRET_KEY`: Your secret key from the Chapa dashboard
- `CHAPA_WEBHOOK_SECRET`: The webhook secret you set in the Chapa dashboard
- `BACKEND_URL`: The public URL of your backend server (needed for webhooks)

## Webhook Configuration

1. Log in to your Chapa dashboard
2. Navigate to Settings > Developers > Webhooks
3. Add a new webhook with the URL: `https://your-backend-url.com/api/client/payment/webhook`
4. Set a secure webhook secret and copy it to your `.env` file
5. Select the events you want to receive: `payment.success`, `payment.failed`, `payment.pending`

## Bank Account Configuration

For vendor subaccounts, the system uses the following bank codes:

- Commercial Bank of Ethiopia (CBE): 961
- Dashen Bank: 945
- Awash Bank: 942
- Zemen Bank: 946

When creating vendor accounts, ensure they provide:

1. Their bank name
2. A valid account number for their bank
3. The business name matching their bank account name

## Payment Flow

1. Client initiates payment for a booking
2. System creates a transaction with Chapa
3. Client is redirected to Chapa payment page
4. After payment, client is redirected to the success/failure page
5. Webhook updates payment status in the database
6. Bookings are automatically confirmed when payment is completed

## Testing

To test the payment system:

1. Use Chapa's test mode (enabled by default in development)
2. Use these test card details:
   - Card Number: 4242 4242 4242 4242
   - Expiry Date: Any future date
   - CVV: Any 3 digits
   - PIN: Any 4 digits

## Troubleshooting

Common issues:

1. **Webhook not receiving events**:

   - Verify your webhook URL is correctly set in the Chapa dashboard
   - Ensure your server is publicly accessible
   - Check the webhook secret matches between Chapa and your `.env` file

2. **Payment initiation fails**:

   - Verify your CHAPA_SECRET_KEY is correct
   - Ensure the vendor has a valid subaccount created
   - Check the request parameters (amount, email, etc.)

3. **Subaccount creation fails**:
   - Verify the bank code is correct
   - Ensure account numbers follow the format required by the bank
   - Check that the business name and account name are valid

## Production Deployment

For production:

1. Switch to Chapa's live mode in the dashboard
2. Update the `CHAPA_SECRET_KEY` with your live key
3. Update webhook URLs to point to your production server
4. Test a real transaction with a small amount before going fully live

## Support

For issues with Chapa integration:

- Chapa support: support@chapa.co
- Developer documentation: https://developer.chapa.co/docs
