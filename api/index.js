const fetch = require('node-fetch');
const cheerio = require('cheerio');

// Ambil server key dari environment variable
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_BASE_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions';

// Tambahkan log untuk debug env
console.log('MIDTRANS_SERVER_KEY:', MIDTRANS_SERVER_KEY);

const base64ServerKey = Buffer.from(MIDTRANS_SERVER_KEY + ':').toString('base64');

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    // Endpoint tes koneksi
    return res.status(200).json({ status: 'ok', message: 'Midtrans backend ready' });
  }

  if (req.method === 'POST') {
    try {
      const { order_id, gross_amount, customer_name, customer_email } = req.body;
      if (!order_id || !gross_amount || !customer_name || !customer_email) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields' });
      }

      const payload = {
        transaction_details: {
          order_id,
          gross_amount: Number(gross_amount),
        },
        customer_details: {
          first_name: customer_name,
          email: customer_email,
        },
        credit_card: {
          secure: true
        }
      };

      console.log('MIDTRANS_SERVER_KEY:', MIDTRANS_SERVER_KEY);

      const response = await fetch(MIDTRANS_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${base64ServerKey}`
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.status === 201) {
        return res.status(200).json({ status: 'success', token: data.token, redirect_url: data.redirect_url });
      } else {
        return res.status(500).json({ status: 'error', message: data });
      }
    } catch (error) {
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }

  // Method not allowed
  return res.status(405).json({ status: 'error', message: 'Method not allowed' });
}; 