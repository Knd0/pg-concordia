import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopSettings } from './entities/shop-settings.entity';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Preference, OAuth } from 'mercadopago';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(ShopSettings)
    private settingsRepository: Repository<ShopSettings>,
    private configService: ConfigService,
  ) {}

  private async getClient() {
    const envAccessToken = this.configService.get('MERCADO_PAGO_ACCESS_TOKEN');
    if (envAccessToken) {
        return new MercadoPagoConfig({ accessToken: envAccessToken });
    }

    const settings = await this.settingsRepository.findOne({ where: { id: 1 } });
    if (!settings || !settings.mercadoPagoAccessToken) {
      throw new BadRequestException('Mercado Pago not linked');
    }
    return new MercadoPagoConfig({ accessToken: settings.mercadoPagoAccessToken });
  }

  async getAuthUrl() {
    const clientId = this.configService.get('MERCADO_PAGO_CLIENT_ID');
    const redirectUri = this.configService.get('MERCADO_PAGO_REDIRECT_URI');
    const state = 'random_state_string'; // Should be random and verified

    return `https://auth.mercadopago.com.ar/authorization?client_id=${clientId}&response_type=code&platform_id=mp&state=${state}&redirect_uri=${redirectUri}`;
  }

  async handleCallback(code: string) {
    const clientId = this.configService.get('MERCADO_PAGO_CLIENT_ID');
    const clientSecret = this.configService.get('MERCADO_PAGO_CLIENT_SECRET');
    const redirectUri = this.configService.get('MERCADO_PAGO_REDIRECT_URI');

    const client = new MercadoPagoConfig({ accessToken: clientSecret }); // Use client secret as access token for OAuth? No, use basic auth or client credentials.
    // Actually, the SDK has an OAuth class.
    
    const oauth = new OAuth(client);

    try {
        const response = await oauth.create({
            body: {
                client_secret: clientSecret,
                client_id: clientId,
                code: code,
                redirect_uri: redirectUri,
            }
        });

        let settings = await this.settingsRepository.findOne({ where: { id: 1 } });
        if (!settings) {
            settings = new ShopSettings();
            settings.id = 1;
        }

        settings.mercadoPagoAccessToken = response.access_token || '';
        settings.mercadoPagoRefreshToken = response.refresh_token || '';
        settings.mercadoPagoPublicKey = response.public_key || '';
        settings.mercadoPagoUserId = response.user_id?.toString() || '';
        settings.mercadoPagoExpiresIn = response.expires_in || 0;
        settings.updatedAt = new Date();

        await this.settingsRepository.save(settings);

        return { success: true };
    } catch (error) {
        console.error('OAuth Error:', error);
        throw new BadRequestException('Failed to authorize with Mercado Pago');
    }
  }

  async createPreference(items: any[], shippingCost: number) {
    const client = await this.getClient();
    const preference = new Preference(client);

    const mpItems = items.map(item => ({
      id: item.id?.toString() || 'unknown',
      title: item.title,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      currency_id: 'ARS',
    }));

    if (shippingCost > 0) {
        mpItems.push({
            id: 'shipping',
            title: 'Envío',
            quantity: 1,
            unit_price: Number(shippingCost),
            currency_id: 'ARS'
        });
    }

    const result = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: `${this.configService.get('FRONTEND_URL') || 'http://localhost:4200'}/checkout/success`,
          failure: `${this.configService.get('FRONTEND_URL') || 'http://localhost:4200'}/checkout/failure`,
          pending: `${this.configService.get('FRONTEND_URL') || 'http://localhost:4200'}/checkout/pending`,
        },
        auto_return: 'approved',
      }
    });

    return { init_point: result.init_point, sandbox_init_point: result.sandbox_init_point };
  }
  
  async getSettings() {
      return this.settingsRepository.findOne({ where: { id: 1 } });
  }
}
