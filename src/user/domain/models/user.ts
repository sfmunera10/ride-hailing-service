import { Ride } from '../../../ride/domain/models/ride';
import { DomainException } from '../../../common/domain/exceptions/domain.exception';
import { isAppropiateStringLength } from '../../../common/shared/utils';
import { PaymentMethod } from '../../../payment/domain/models/payment.method';

export enum UserGroup {
  RIDER = 'Rider',
  DRIVER = 'Driver',
}

interface UserProps {
  id?: string;
  isAvailable: boolean;
  givenName: string;
  familyName: string;
  dateOfBirth: Date;
  mobilePhoneNumber: string;
  gender: string;
  email: string;
  userGroup: UserGroup;
  paymentMethods?: PaymentMethod[];
  ridesAsARider?: Ride[];
  ridesAsADriver?: Ride[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  public static create(props: UserProps): User {
    const errors = [];

    if (!isAppropiateStringLength(2, 64, props.givenName))
      errors.push('givenName must be between 2 and 64 characters long');
    if (!isAppropiateStringLength(2, 64, props.familyName))
      errors.push('givenName must be between 2 and 64 characters long');

    if (errors.length) throw new DomainException(JSON.stringify(errors));

    props.createdAt = new Date();
    props.updatedAt = props.createdAt;

    return new User(props);
  }

  public getProperty(key: string) {
    return this.props[key as keyof typeof this.props];
  }

  public createPaymentMethod(paymentMethod: PaymentMethod) {
    if (this.props.userGroup === UserGroup.DRIVER)
      throw new DomainException(
        JSON.stringify('A driver cannot create payment methods'),
      );
    if (this.findPaymentMethod(paymentMethod))
      throw new DomainException(
        JSON.stringify(
          'Cannot create a previously existing payment method of the same type',
        ),
      );
    if (!this.props.paymentMethods) this.props.paymentMethods = [];

    this.props.paymentMethods.push(paymentMethod);
    paymentMethod.addRider(this);
  }

  public findPaymentMethod(paymentMethod: PaymentMethod) {
    return this.props.paymentMethods?.find(
      (method) =>
        method.getPaymentMethodName() === paymentMethod.getPaymentMethodName(),
    );
  }

  public requestNewRideAsARider(ride: Ride) {
    if (this.props.userGroup === UserGroup.DRIVER)
      throw new DomainException(
        JSON.stringify('A driver cannot request a ride'),
      );
    if (!this.props.ridesAsARider) this.props.ridesAsARider = [];
    this.props.ridesAsARider.push(ride);
    ride.addRider(this);
  }

  public assignDriverToRide(ride: Ride) {
    if (this.props.userGroup === UserGroup.RIDER)
      throw new DomainException(
        JSON.stringify('A rider cannot be assigned to be the driver of a ride'),
      );
    if (!this.props.ridesAsADriver) this.props.ridesAsADriver = [];
    this.props.ridesAsADriver.push(ride);
    ride.addDriver(this);
  }

  public findRiderRide(ride: Ride) {
    return this.props.ridesAsARider?.find(
      (riderRide) => riderRide.getId() === ride.getId(),
    );
  }

  public findDriverRide(rideId: string) {
    return this.props.ridesAsADriver?.find(
      (driverRide) => driverRide.getId() === rideId,
    );
  }

  public finishRideAsADriver(
    finalLatitude: number,
    finalLongitude: number,
    rideId: string,
  ) {
    if (this.props.userGroup === UserGroup.RIDER)
      throw new DomainException(JSON.stringify('A rider cannot finish a ride'));
    const ride = this.findDriverRide(rideId);
    ride?.finishRide(finalLatitude, finalLongitude);
  }
}
