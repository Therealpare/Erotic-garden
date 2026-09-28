import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactMessage } from './entities/contact-message.entity';

/** In-memory store — replace with a real repository in Phase 5. */
const MESSAGES: ContactMessage[] = [];
let nextId = 1;

@Injectable()
export class ContactService {
  create(dto: CreateContactDto): ContactMessage {
    const message: ContactMessage = {
      id: nextId++,
      name: dto.name,
      email: dto.email,
      subject: dto.subject,
      message: dto.message,
      status: 'NEW',
      createdAt: new Date(),
    };

    MESSAGES.push(message);
    return message;
  }

  findAll(): ContactMessage[] {
    return MESSAGES;
  }
}
