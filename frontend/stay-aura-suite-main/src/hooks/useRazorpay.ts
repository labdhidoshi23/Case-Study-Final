import { paymentApi } from '../api/services';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentOptions {
  reservationId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: any) => void;
}

export const useRazorpay = () => {
  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (options: PaymentOptions) => {
    const loaded = await loadScript();
    if (!loaded) {
      options.onFailure('Razorpay SDK failed to load');
      return;
    }

    try {
      const { data } = await paymentApi.createOrder({
        reservationId: options.reservationId,
        amount: options.amount,
      });

      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: options.amount * 100,
        currency: 'INR',
        order_id: data.razorpayOrderId,
        name: 'Hotel Whitmore Stays',
        description: `Reservation #${options.reservationId}`,
        prefill: {
          name: options.customerName,
          email: options.customerEmail,
        },
        handler: async (response: any) => {
          try {
            await paymentApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              customerEmail: options.customerEmail,
            });
            options.onSuccess(response.razorpay_payment_id);
          } catch (err) {
            options.onFailure(err);
          }
        },
        modal: {
          ondismiss: () => options.onFailure('Payment cancelled'),
        },
      });

      rzp.open();
    } catch (err) {
      options.onFailure(err);
    }
  };

  return { initiatePayment };
};
