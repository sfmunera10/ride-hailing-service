import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/infrastructure/user.module';
import { RideModule } from './ride/ride.module';
import { PaymentModule } from './payment/payment.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { setEnvironment } from './common/environments';
import { HealthController } from './common/http/terminus/index';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    UserModule,
    RideModule,
    PaymentModule,
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
    }),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 3,
    }),
    TerminusModule,
    TypeOrmModule.forRoot(),
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
