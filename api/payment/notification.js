module.exports = async (req, res) => {
  try {
    // Log notification data dari Midtrans
    console.log('🔔 Payment Notification Received');
    console.log('Query params:', req.query);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);

    // Ambil data dari body (notification biasanya dikirim via POST)
    const {
      order_id,
      transaction_status,
      status_code,
      gross_amount,
      payment_type,
      signature_key,
      transaction_id,
      fraud_status,
      transaction_time,
      finish_redirect_url
    } = req.body;

    // Log detail notification
    console.log('📊 Notification Details:');
    console.log('  Order ID:', order_id);
    console.log('  Status:', transaction_status);
    console.log('  Status Code:', status_code);
    console.log('  Amount:', gross_amount);
    console.log('  Payment Type:', payment_type);
    console.log('  Transaction ID:', transaction_id);
    console.log('  Fraud Status:', fraud_status);
    console.log('  Transaction Time:', transaction_time);
    console.log('  Finish Redirect URL:', finish_redirect_url);

    // Verifikasi signature key (implementasi sesuai kebutuhan)
    // const isValidSignature = verifySignature(req.body, signature_key);
    // if (!isValidSignature) {
    //   console.log('❌ Invalid signature key');
    //   return res.status(400).json({ status: 'error', message: 'Invalid signature' });
    // }

    // Proses berdasarkan status transaksi
    switch (transaction_status) {
      case 'capture':
      case 'settlement':
        console.log('✅ Payment successful');
        // await processSuccessfulPayment(req.body);
        break;
      
      case 'pending':
        console.log('⏳ Payment pending');
        // await processPendingPayment(req.body);
        break;
      
      case 'deny':
      case 'expire':
      case 'cancel':
        console.log('❌ Payment failed/cancelled');
        // await processFailedPayment(req.body);
        break;
      
      default:
        console.log('❓ Unknown transaction status:', transaction_status);
    }

    // Simpan notification ke database (implementasi sesuai kebutuhan)
    // await savePaymentNotification({
    //   orderId: order_id,
    //   status: transaction_status,
    //   amount: gross_amount,
    //   paymentType: payment_type,
    //   transactionId: transaction_id,
    //   fraudStatus: fraud_status,
    //   transactionTime: transaction_time,
    //   timestamp: new Date()
    // });

    // Kirim response OK ke Midtrans
    res.status(200).json({
      status: 'OK',
      message: 'Notification processed successfully'
    });

  } catch (error) {
    console.error('❌ Error processing notification:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process notification',
      error: error.message
    });
  }
}; 