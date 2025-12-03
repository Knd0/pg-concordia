import { Module } from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { AndreaniService } from './providers/andreani.service';
import { OcaService } from './providers/oca.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ShippingController],
  providers: [ShippingService, AndreaniService, OcaService],
  exports: [ShippingService],
})
export class ShippingModule {}
