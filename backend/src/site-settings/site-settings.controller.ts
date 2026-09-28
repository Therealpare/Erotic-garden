import { Controller, Get } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { SiteSettings } from './entities/site-settings.entity';

@Controller('site-settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get()
  get(): SiteSettings {
    return this.siteSettingsService.get();
  }
}
