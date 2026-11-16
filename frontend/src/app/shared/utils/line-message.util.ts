import { Lang } from '../../core/i18n/language.service';

/**
 * Text of the LINE messages guests send to the garden. Staff read Thai, so Thai visitors'
 * messages are in Thai and everyone else's in English (German visitors included).
 */
const LABELS = {
  en: {
    preOrder: 'Pre-order for my visit',
    booking: 'Visit booking request',
    event: 'Private event inquiry',
    contact: 'Message from the website',
    name: 'Name',
    visitDate: 'Visit date',
    time: 'Time',
    guests: 'Guests',
    phone: 'Phone',
    email: 'Email',
    experience: 'Experience',
    organization: 'Organisation',
    eventType: 'Event type',
    flexible: 'flexible',
    subject: 'Subject',
    note: 'Note',
    items: 'Items',
    total: 'Total',
    priceOnLine: 'price to confirm',
    plusOnLine: '+ items with price to confirm',
  },
  th: {
    preOrder: 'สั่งจองล่วงหน้าสำหรับวันที่มาสวน',
    booking: 'ขอจองเข้าชมสวน',
    event: 'สอบถามจัดงานส่วนตัว',
    contact: 'ข้อความจากเว็บไซต์',
    name: 'ชื่อ',
    visitDate: 'วันที่มา',
    time: 'เวลา',
    guests: 'จำนวนคน',
    phone: 'โทร',
    email: 'อีเมล',
    experience: 'รูปแบบการเข้าชม',
    organization: 'องค์กร',
    eventType: 'ประเภทงาน',
    flexible: 'ยืดหยุ่นได้',
    subject: 'เรื่อง',
    note: 'หมายเหตุ',
    items: 'รายการ',
    total: 'รวม',
    priceOnLine: 'รอยืนยันราคา',
    plusOnLine: '+ รายการที่รอยืนยันราคา',
  },
};

export type LineLabels = (typeof LABELS)['en'];

export function lineLabels(lang: Lang): LineLabels {
  return lang === 'th' ? LABELS.th : LABELS.en;
}

/** "20 Dec 2026" / "20 ธ.ค. 2569" from an input's YYYY-MM-DD value (no time-zone shift). */
export function formatVisitDate(isoDate: string, lang: Lang): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  return new Date(year, month - 1, day).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatBaht(amount: number): string {
  return `฿${amount.toLocaleString('en-US')}`;
}

/**
 * 🌿 Erotic Garden — <title>
 * Label: value          (empty values are left out)
 * …
 * <extra lines>
 */
export function composeLineMessage(title: string, fields: [string, string | number | null | undefined][], extra: string[] = []): string {
  const lines = [`🌿 Erotic Garden — ${title}`];
  for (const [label, value] of fields) {
    const text = String(value ?? '').trim();
    if (text) lines.push(`${label}: ${text}`);
  }
  return [...lines, ...extra.filter((line) => line !== '')].join('\n');
}
