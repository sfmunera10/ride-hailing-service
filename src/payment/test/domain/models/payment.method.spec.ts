import {
  PaymentMethod,
  PaymentMethodName,
} from '../../../domain/models/payment.method';

describe('PaymentMethod domain model tests', () => {
  test('Should create new payment methods with no relationships - Success', () => {
    const paymentMethodObj = {
      methodName: PaymentMethodName.NEQUI,
    };

    const newPaymentMethod = PaymentMethod.create({ ...paymentMethodObj });

    expect(newPaymentMethod instanceof PaymentMethod).toBeTruthy();

    expect(newPaymentMethod.getPaymentMethodName()).toBe(
      paymentMethodObj.methodName,
    );

    expect(newPaymentMethod.getProperty('createdAt')).toBeDefined();
    expect(newPaymentMethod.getProperty('updatedAt')).toBeDefined();
  });
});
