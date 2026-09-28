export type ContactMessageStatus = 'NEW' | 'READ' | 'ARCHIVED';

/** Mirrors spec §28/§35 `contact_messages` table. */
export class ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: Date;
}
