import Iyzipay from "iyzipay";

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY!,
  secretKey: process.env.IYZICO_SECRET_KEY!,
  uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
});

export interface CreatePaymentParams {
  price: string;
  paidPrice: string;
  basketId: string;
  callbackUrl: string;
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    ip: string;
    city: string;
    country: string;
    address: string;
  };
  packageTitle: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCheckoutForm(params: CreatePaymentParams): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = {
      locale: Iyzipay.LOCALE.TR,
      conversationId: params.basketId,
      price: params.price,
      paidPrice: params.paidPrice,
      currency: Iyzipay.CURRENCY.TRY,
      basketId: params.basketId,
      paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
      callbackUrl: params.callbackUrl,
      buyer: {
        id: params.buyer.id,
        name: params.buyer.name,
        surname: params.buyer.surname,
        gsmNumber: "+905000000000",
        email: params.buyer.email,
        identityNumber: "11111111111",
        registrationAddress: params.buyer.address || "Istanbul",
        ip: params.buyer.ip,
        city: params.buyer.city || "Istanbul",
        country: params.buyer.country || "Turkey",
      },
      shippingAddress: {
        contactName: `${params.buyer.name} ${params.buyer.surname}`,
        city: params.buyer.city || "Istanbul",
        country: params.buyer.country || "Turkey",
        address: params.buyer.address || "Istanbul",
      },
      billingAddress: {
        contactName: `${params.buyer.name} ${params.buyer.surname}`,
        city: params.buyer.city || "Istanbul",
        country: params.buyer.country || "Turkey",
        address: params.buyer.address || "Istanbul",
      },
      basketItems: [
        {
          id: params.basketId,
          name: params.packageTitle,
          category1: "Video Paket",
          itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
          price: params.paidPrice,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    iyzipay.checkoutFormInitialize.create(request as any, (err: Error, result: any) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function retrieveCheckoutForm(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve(
      { locale: Iyzipay.LOCALE.TR, token },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err: Error, result: any) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}
