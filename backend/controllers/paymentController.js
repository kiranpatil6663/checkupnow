import Razorpay from 'razorpay';
import crypto from 'crypto';
import appointmentModel from '../models/appointmentModel.js';

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// API to create a Razorpay order for an appointment
const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }
    if (appointment.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorized action' });
    }
    if (appointment.cancelled) {
      return res.json({ success: false, message: 'Appointment is cancelled' });
    }
    if (appointment.payment) {
      return res.json({ success: false, message: 'Appointment already paid' });
    }

    const options = {
      amount: appointment.amount * 100, // Razorpay uses paise, smallest currency unit
      currency: 'INR',
      receipt: appointment._id.toString(),
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify Razorpay payment signature and mark appointment as paid
const verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;
    const { appointmentId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: 'Appointment not found' });
    }
    if (appointment.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorized action' });
    }

    // Recreate the expected signature using our secret key
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.json({ success: false, message: 'Payment verification failed' });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      payment: true,
      paymentId: razorpay_payment_id,
    });

    res.json({ success: true, message: 'Payment verified' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { createOrder, verifyPayment };