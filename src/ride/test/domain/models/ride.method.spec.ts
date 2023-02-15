import { randNumber, randUuid } from '@ngneat/falso';
import { Ride, RideStatus } from '../../../domain/models/ride';

describe('PaymentMethod domain model tests', () => {
  test('Should create new rides with no relationships - Success', () => {
    const rideObj = {
      id: randUuid(),
      numberOfPassengers: randNumber({ min: 1, max: 4 }),
      status: RideStatus.IN_PROGRESS,
      kmTraveled: randNumber({ min: 0.1, max: 500, fraction: 1 }),
      minutesPassed: randNumber({ min: 0.1, max: 720, fraction: 1 }),
      initialLatitude: 4.624335,
      initialLongitude: -74.063644,
    };

    const newRide = Ride.create({ ...rideObj });

    expect(newRide instanceof Ride).toBeTruthy();

    Object.keys(rideObj).forEach((key) => {
      expect(newRide.getProperty(key)).toBe(
        rideObj[key as keyof typeof rideObj],
      );
    });

    expect(newRide.getProperty('createdAt')).toBeDefined();
    expect(newRide.getProperty('updatedAt')).toBeDefined();
  });
});
