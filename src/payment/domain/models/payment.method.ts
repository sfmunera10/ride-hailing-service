import { User } from '../../../user/domain/models/user';

export enum PaymentMethodName {
  CARD = 'CARD',
  NEQUI = 'NEQUI',
}

interface PaymentMethodProps {
  id?: string;
  methodName: PaymentMethodName;
  riders?: User[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class PaymentMethod {
  private props: PaymentMethodProps;

  private constructor(props: PaymentMethodProps) {
    this.props = props;
  }

  public static create(props: PaymentMethodProps): PaymentMethod {
    props.createdAt = new Date();
    props.updatedAt = props.createdAt;

    return new PaymentMethod(props);
  }

  public getProperty(key: string) {
    return this.props[key as keyof typeof this.props];
  }

  public getPaymentMethodName() {
    return this.props.methodName;
  }

  public getRiders() {
    return this.props.riders;
  }

  public addRider(user: User) {
    if (!this.props.riders) this.props.riders = [];
    this.props.riders.push(user);
  }
}
