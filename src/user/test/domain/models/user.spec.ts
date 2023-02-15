import { User, UserGroup } from '../../../domain/models/user';
import {
  randFirstName,
  randLastName,
  randPastDate,
  randPhoneNumber,
  randGender,
  randEmail,
  randNumber,
  randUuid,
} from '@ngneat/falso';
import {
  PaymentMethod,
  PaymentMethodName,
} from '../../../../payment/domain/models/payment.method';
import {
  Ride,
  RideProps,
  RideStatus,
} from '../../../../ride/domain/models/ride';
import { DomainException } from '../../../../common/domain/exceptions/domain.exception';

describe('User domain model tests', () => {
  let riderMock: User;
  const riderObj = {
    givenName: randFirstName(),
    familyName: randLastName(),
    dateOfBirth: randPastDate({ years: 21 }),
    mobilePhoneNumber: randPhoneNumber({ countryCode: 'CO' }),
    gender: randGender(),
    email: randEmail(),
    userGroup: UserGroup.RIDER,
    isAvailable: true,
  };

  let driverMock: User;
  const driverObj = {
    givenName: randFirstName(),
    familyName: randLastName(),
    dateOfBirth: randPastDate({ years: 21 }),
    mobilePhoneNumber: randPhoneNumber({ countryCode: 'CO' }),
    gender: randGender(),
    email: randEmail(),
    userGroup: UserGroup.DRIVER,
    isAvailable: true,
  };

  let paymentMethodMock: PaymentMethod;
  const paymentMethodObj = {
    methodName: PaymentMethodName.CARD,
  };

  let rideMock: Ride;
  let rideObj: RideProps;

  beforeEach(() => {
    riderMock = User.create({ ...riderObj });
    driverMock = User.create({ ...driverObj });
    paymentMethodMock = PaymentMethod.create({ ...paymentMethodObj });
    rideObj = {
      id: randUuid(),
      numberOfPassengers: randNumber({ min: 1, max: 4 }),
      status: RideStatus.IN_PROGRESS,
      kmTraveled: randNumber({ min: 0.1, max: 500, fraction: 1 }),
      minutesPassed: randNumber({ min: 0.1, max: 720, fraction: 1 }),
      initialLatitude: 4.624335,
      initialLongitude: -74.063644,
    };
    rideMock = Ride.create({ ...rideObj });
    driverMock.assignDriverToRide(rideMock);
  });

  test('Should create new users with no relationships - Success', () => {
    const riderObj2 = {
      givenName: randFirstName(),
      familyName: randLastName(),
      dateOfBirth: randPastDate({ years: 21 }),
      mobilePhoneNumber: randPhoneNumber({ countryCode: 'CO' }),
      gender: randGender(),
      email: randEmail(),
      userGroup: UserGroup.RIDER,
      isAvailable: true,
    };

    const driverObj2 = {
      givenName: randFirstName(),
      familyName: randLastName(),
      dateOfBirth: randPastDate({ years: 21 }),
      mobilePhoneNumber: randPhoneNumber({ countryCode: 'CO' }),
      gender: randGender(),
      email: randEmail(),
      userGroup: UserGroup.DRIVER,
      isAvailable: true,
    };

    const newRider = User.create({ ...riderObj2 });
    const newDriver = User.create({ ...driverObj2 });

    expect(newRider instanceof User).toBeTruthy();
    expect(newDriver instanceof User).toBeTruthy();

    Object.keys(riderObj2).forEach((key) => {
      expect(newRider.getProperty(key)).toBe(
        riderObj2[key as keyof typeof riderObj2],
      );
    });

    Object.keys(driverObj2).forEach((key) => {
      expect(newDriver.getProperty(key)).toBe(
        driverObj2[key as keyof typeof driverObj2],
      );
    });

    expect(newDriver.getProperty('createdAt')).toBeDefined();
    expect(newDriver.getProperty('updatedAt')).toBeDefined();
  });

  test('Should throw exception if one or more user properties are not valid - Error', () => {
    expect(() => {
      User.create({ ...riderObj, givenName: '' });
    }).toThrow(DomainException);
  });

  test('Should create a payment method for a rider user - Success', () => {
    riderMock.createPaymentMethod(paymentMethodMock);

    const paymentMethod = riderMock.findPaymentMethod(paymentMethodMock);

    expect(paymentMethod instanceof PaymentMethod).toBeTruthy();
    expect(paymentMethod).toBeDefined();
    expect(paymentMethod?.getPaymentMethodName()).toBe(
      paymentMethodObj.methodName,
    );
    expect(paymentMethod?.getRiders()).toBeDefined();
    paymentMethod?.getRiders()?.forEach((user) => {
      Object.keys(riderObj).forEach((key) => {
        expect(user.getProperty(key)).toBe(
          riderObj[key as keyof typeof riderObj],
        );
      });
    });
  });

  test('Should not allow a rider to create a previously created payment method of the same type - Error', () => {
    expect(() => {
      riderMock.createPaymentMethod(paymentMethodMock);
      riderMock.createPaymentMethod(paymentMethodMock);
    }).toThrow(DomainException);
  });

  test('Should not allow a driver to create a payment method - Error', () => {
    expect(() => {
      driverMock.createPaymentMethod(paymentMethodMock);
    }).toThrow(DomainException);
    expect(paymentMethodMock.getRiders()).toBeUndefined();
  });

  test('Should not find a payment method from the rider user - Error ', () => {
    const paymentMethod = riderMock.findPaymentMethod(paymentMethodMock);

    expect(paymentMethod).toBeUndefined();
  });

  test('Should request (create) a ride for a rider user - Success', () => {
    riderMock.requestNewRideAsARider(rideMock);

    const ride = riderMock.findRiderRide(rideMock);

    expect(ride instanceof Ride).toBeTruthy();
    expect(ride).toBeDefined();

    expect(ride?.getId()).toBeDefined();

    Object.keys(rideObj).forEach((key) => {
      expect(ride?.getProperty(key)).toBe(rideObj[key as keyof typeof rideObj]);
    });

    expect(ride?.getRider()).toBeDefined();
    Object.keys(riderObj).forEach((key) => {
      expect(ride?.getRider()?.getProperty(key)).toBe(
        riderObj[key as keyof typeof riderObj],
      );
    });
  });

  test('Should not allow a driver to request a ride - Error', () => {
    expect(() => {
      driverMock.requestNewRideAsARider(rideMock);
    }).toThrow(DomainException);
    expect(rideMock.getRider()).toBeUndefined();
  });

  test('Should not find a ride from the rider user - Error ', () => {
    const ride = riderMock.findRiderRide(rideMock);

    expect(ride).toBeUndefined();
  });

  test('Should finish an existing ride (driver request) - Success ', () => {
    const finalLatitude = 6.230833;
    const finalLongitude = -75.590553;

    riderMock.requestNewRideAsARider(rideMock);
    driverMock.finishRideAsADriver(
      finalLatitude,
      finalLongitude,
      rideMock.getId(),
    );

    const ride = riderMock.findRiderRide(rideMock);

    expect(ride?.getProperty('finalLatitude')).toBeDefined();
    expect(ride?.getProperty('finalLongitude')).toBeDefined();

    expect(ride instanceof Ride).toBeTruthy();
    expect(ride).toBeDefined();

    rideObj.status = RideStatus.FINISHED;

    Object.keys(rideObj).forEach((key) => {
      expect(ride?.getProperty(key)).toBe(rideObj[key as keyof typeof rideObj]);
    });

    expect(ride?.getRider()).toBeDefined();
    Object.keys(riderObj).forEach((key) => {
      expect(ride?.getRider()?.getProperty(key)).toBe(
        riderObj[key as keyof typeof riderObj],
      );
    });
  });

  test('Should not allow a rider to finish an existing ride - Error', () => {
    expect(() => {
      const finalLatitude = 6.230833;
      const finalLongitude = -75.590553;
      riderMock.requestNewRideAsARider(rideMock);
      riderMock.finishRideAsADriver(
        finalLatitude,
        finalLongitude,
        rideMock.getId(),
      );
    }).toThrow(DomainException);

    expect(rideMock.getProperty('finalLatitude')).toBeUndefined();
    expect(rideMock.getProperty('finalLongitude')).toBeUndefined();

    expect(rideMock.getProperty('status')).toBe(RideStatus.IN_PROGRESS);
  });
});
