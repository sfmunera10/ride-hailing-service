import { RidePayment } from '../../../domain/models/ride.payment';
import { randNumber, randUuid } from '@ngneat/falso';
import { Ride, RideStatus } from '../../../../ride/domain/models/ride';

describe('RidePayment domain model tests', () => {
  test('Should create new ride payments - Success', () => {
    const rideObj = {
      id: randUuid(),
      numberOfPassengers: randNumber({ min: 1, max: 4 }),
      status: RideStatus.IN_PROGRESS,
      kmTraveled: randNumber({ min: 0.1, max: 500, fraction: 1 }),
      minutesPassed: randNumber({ min: 0.1, max: 720, fraction: 1 }),
      initialLatitude: 4.624335,
      initialLongitude: -74.063644,
    };
    const rideMock = Ride.create({ ...rideObj });

    const ridePaymentObj = {
      baseFee: 3500,
      kmFee: 1000,
      minuteFee: 200,
      totalAmount: 15500,
      ride: rideMock,
    };

    const newRidePayment = RidePayment.create({ ...ridePaymentObj });

    expect(newRidePayment instanceof RidePayment).toBeTruthy();

    Object.keys(ridePaymentObj).forEach((key) => {
      expect(newRidePayment.getProperty(key)).toEqual(
        ridePaymentObj[key as keyof typeof ridePaymentObj],
      );
    });

    expect(newRidePayment.getProperty('createdAt')).toBeDefined();
    expect(newRidePayment.getProperty('updatedAt')).toBeDefined();
  });
});
