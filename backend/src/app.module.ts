import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ArtworksModule } from './artworks/artworks.module';
import { GalleryModule } from './gallery/gallery.module';
import { ExperiencesModule } from './experiences/experiences.module';
import { TeaHouseModule } from './tea-house/tea-house.module';
import { ReviewsModule } from './reviews/reviews.module';
import { EventsModule } from './events/events.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { BookingsModule } from './bookings/bookings.module';
import { ContactModule } from './contact/contact.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MediaModule } from './media/media.module';
import { EventInquiriesModule } from './event-inquiries/event-inquiries.module';
import { StorageModule } from './storage/storage.module';
import { CoffeeGuideModule } from './coffee-guide/coffee-guide.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    DatabaseModule,
    AuthModule,
    NotificationsModule,
    StorageModule,
    ArtworksModule,
    GalleryModule,
    ExperiencesModule,
    TeaHouseModule,
    ReviewsModule,
    EventsModule,
    SiteSettingsModule,
    BookingsModule,
    ContactModule,
    ProductsModule,
    OrdersModule,
    MediaModule,
    EventInquiriesModule,
    CoffeeGuideModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
