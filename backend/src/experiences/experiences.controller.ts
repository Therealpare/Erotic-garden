import { Controller, Get, Param } from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { Experience } from './entities/experience.entity';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  findAll(): Experience[] {
    return this.experiencesService.findAll();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string): Experience {
    return this.experiencesService.findBySlug(slug);
  }
}
