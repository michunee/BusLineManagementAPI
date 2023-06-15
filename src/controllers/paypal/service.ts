import { Injectable } from '@nestjs/common';
import { ORDER_BY_DESC } from 'src/base/constants';
import { Person } from 'src/entities/person';
import { Ticket } from 'src/entities/ticket';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', //sandbox or live
  client_id:
    'AZVBTtsVtmd4IW_BppWM7O8hcC_19xODbxAkjEJY6w5yLd-Im3a5FMicVrbAG9mXZoi0nIJs3A9Rl3jy',
  client_secret:
    'EG5XY4VqAgJS3YB2BfAQa1PaWosFl5xmFIcAKM6UeeIuF8asxxLqqscqluPgk3AdIYPLLzg5vNbSFbur',
});

let globalPrice = 0;
let PersonID = 0;

@Injectable()
export class PaypalService {
  getPaypalPayment(req: any, res: any, currentPerson: Person) {
    PersonID = currentPerson.ID;
    const totalPrice = req.query.totalPrice;
    globalPrice = totalPrice;
    const item = [
      {
        name: 'item',
        sku: 'item',
        price: globalPrice,
        currency: 'USD',
        quantity: 1,
      },
    ];
    const create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${process.env.API_DOMAIN}/api/paypal/success`,
        cancel_url: `${process.env.API_DOMAIN}/api/paypal/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: item,
          },
          amount: {
            currency: 'USD',
            total: globalPrice,
          },
          description: 'This is the payment description.',
        },
      ],
    };

    paypal.payment.create(
      create_payment_json,
      function (error: any, payment: any) {
        if (error) {
          res.status(400).json({
            message: 'Payment failed!',
          });
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === 'approval_url') {
              res.status(200).json({
                redirectUrl: payment.links[i].href,
              });
            }
          }
        }
      },
    );
  }

  getPaypalPaymentSuccess(req: any, res: any) {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: 'USD',
            total: globalPrice,
          },
        },
      ],
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error: any) => {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        res.redirect(`${process.env.WEB_DOMAIN}/success`);
      }
    });
  }

  async getPaypalPaymentCancel(req: any, res: any) {
    const lastTicket = await Ticket.createQueryBuilder()
      .where('Ticket.PersonID = :PersonID', {
        PersonID,
      })
      .orderBy('Ticket.ID', ORDER_BY_DESC)
      .take(1)
      .getOne();

    await Ticket.remove(lastTicket);
    res.redirect(`${process.env.WEB_DOMAIN}/user`);
  }
}
