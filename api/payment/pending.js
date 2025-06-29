module.exports = async (req, res) => {
  try {
    // Log callback data dari Midtrans
    console.log('⏳ Payment Pending Callback Received');
    console.log('Query params:', req.query);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);

    // Ambil data dari query parameters
    const {
      order_id,
      transaction_status,
      status_code,
      gross_amount,
      payment_type,
      signature_key,
      transaction_id,
      fraud_status
    } = req.query;

    // Log detail transaksi pending
    console.log('📊 Pending Transaction Details:');
    console.log('  Order ID:', order_id);
    console.log('  Status:', transaction_status);
    console.log('  Status Code:', status_code);
    console.log('  Amount:', gross_amount);
    console.log('  Payment Type:', payment_type);
    console.log('  Transaction ID:', transaction_id);
    console.log('  Fraud Status:', fraud_status);

    // Simpan data pending ke database (implementasi sesuai kebutuhan)
    // await savePaymentPending({
    //   orderId: order_id,
    //   status: transaction_status,
    //   amount: gross_amount,
    //   paymentType: payment_type,
    //   transactionId: transaction_id,
    //   timestamp: new Date()
    // });

    // Kirim response sukses ke Midtrans
    res.status(200).json({
      status: 'success',
      message: 'Payment pending callback processed successfully',
      order_id: order_id,
      transaction_status: transaction_status
    });

  } catch (error) {
    console.error('❌ Error processing pending callback:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process pending callback',
      error: error.message
    });
  }
}; 