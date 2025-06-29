const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://lazisnew.firebaseio.com',
  });
}
const db = admin.firestore();

module.exports = async (req, res) => {
  try {
    // Log notification data dari Midtrans
    console.log('🔔 Payment Notification Received');
    console.log('Query params:', req.query);
    console.log('Body:', JSON.stringify(req.body));
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
      finish_redirect_url,
      custom_fields
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
    console.log('  Custom Fields:', JSON.stringify(custom_fields));

    // Verifikasi signature key (implementasi sesuai kebutuhan)
    // const isValidSignature = verifySignature(req.body, signature_key);
    // if (!isValidSignature) {
    //   console.log('❌ Invalid signature key');
    //   return res.status(400).json({ status: 'error', message: 'Invalid signature' });
    // }

    // Proses berdasarkan status transaksi
    let shouldSave = false;
    let statusToSave = transaction_status;
    switch (transaction_status) {
      case 'capture':
      case 'settlement':
        console.log('✅ Payment successful');
        shouldSave = true;
        break;
      case 'pending':
        console.log('⏳ Payment pending');
        shouldSave = true;
        break;
      case 'deny':
      case 'expire':
      case 'cancel':
        console.log('❌ Payment failed/cancelled');
        shouldSave = true;
        break;
      default:
        console.log('❓ Unknown transaction status:', transaction_status);
    }

    if (shouldSave) {
      // Ambil data custom dari order_id jika ada (misal: userId, campaignId, dsb)
      let userId = null;
      let campaignId = null;
      let campaignName = null;
      let category = null;
      let note = null;
      try {
        // Parsing order_id
        const parts = order_id ? order_id.split('-') : [];
        if (parts.length >= 4) {
          userId = parts[2];
          campaignId = parts[3];
        }
        console.log('Parsed userId:', userId, 'campaignId:', campaignId);
      } catch (e) {
        console.log('Gagal parsing order_id:', e);
      }
      // Data tambahan dari custom_fields jika dikirim dari Flutter
      if (custom_fields) {
        campaignName = custom_fields.campaign_name || custom_fields.campaignName || null;
        category = custom_fields.category || null;
        note = custom_fields.note || null;
        userId = custom_fields.user_id || userId;
        campaignId = custom_fields.campaign_id || campaignId;
        console.log('Parsed from custom_fields:', { campaignName, category, note, userId, campaignId });
      } else {
        console.log('custom_fields tidak ditemukan di body');
      }
      // Simpan ke Firestore (idempotent by order_id)
      try {
        const trxRef = db.collection('transactions').doc(order_id);
        await trxRef.set({
          order_id: order_id,
          user_id: userId,
          campaign_id: campaignId,
          campaign_name: campaignName,
          category: category,
          amount: Number(gross_amount),
          status: statusToSave,
          payment_type: payment_type,
          midtrans_transaction_id: transaction_id,
          fraud_status: fraud_status,
          transaction_time: transaction_time,
          updated_at: admin.firestore.FieldValue.serverTimestamp(),
          note: note,
        }, { merge: true });
        console.log('💾 Transaksi disimpan/diupdate di Firestore:', order_id);
      } catch (err) {
        console.error('❌ Error saat menulis ke Firestore:', err);
      }
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