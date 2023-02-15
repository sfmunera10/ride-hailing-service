import { Ride } from '../../../ride/domain/models/ride';

interface RidePaymentProps {
  id?: string;
  baseFee: number;
  kmFee: number;
  minuteFee: number;
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
  ride: Ride;
}

export class RidePayment {
  private props: RidePaymentProps;

  private constructor(props: RidePaymentProps) {
    this.props = props;
  }

  public static create(props: RidePaymentProps): RidePayment {
    props.createdAt = new Date();
    props.updatedAt = props.createdAt;

    return new RidePayment(props);
  }

  public getProperty(key: string) {
    return this.props[key as keyof typeof this.props];
  }
}
