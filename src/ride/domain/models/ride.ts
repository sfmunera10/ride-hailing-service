import { RidePayment } from '../../../payment/domain/models/ride.payment';
import { User } from '../../../user/domain/models/user';

export enum RideStatus {
  IN_PROGRESS = 'IN PROGRESS',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED',
}

export interface RideProps {
  id: string;
  rider?: User;
  driver?: User;
  numberOfPassengers: number;
  status: RideStatus;
  kmTraveled: number;
  minutesPassed: number;
  initialLatitude: number;
  initialLongitude: number;
  finalLatitude?: number;
  finalLongitude?: number;
  ridePayment?: RidePayment;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Ride {
  private props: RideProps;

  private constructor(props: RideProps) {
    this.props = props;
  }

  public static create(props: RideProps): Ride {
    props.createdAt = new Date();
    props.updatedAt = props.createdAt;

    return new Ride(props);
  }

  public getProperty(key: string) {
    return this.props[key as keyof typeof this.props];
  }

  public getId() {
    return this.props.id;
  }

  public getRider() {
    return this.props.rider;
  }

  public addRider(user: User) {
    this.props.rider = user;
  }

  public addDriver(user: User) {
    this.props.driver = user;
  }

  public finishRide(finalLatitude: number, finalLongitude: number) {
    this.props.finalLatitude = finalLatitude;
    this.props.finalLongitude = finalLongitude;
    this.props.status = RideStatus.FINISHED;
  }
}
