import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/infrastructure/user.module';
import { RideModule } from './ride/ride.module';
import { PaymentModule } from './payment/payment.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [UserModule, RideModule, PaymentModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
