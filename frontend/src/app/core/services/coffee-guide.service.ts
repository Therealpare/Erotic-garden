import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { API_BASE_URL, isApiConfigured } from '../config/api.config';
import { CoffeeGuide, CoffeeGuideEntry } from '../models/coffee-guide.model';
import { resolveImageUrl } from '../../shared/utils/image-url.util';

type GuideText = Pick<CoffeeGuideEntry, 'key' | 'name' | 'summary' | 'flavor' | 'brewing'>;

/**
 * Same text as the database seed (migration CoffeeGuideAndBeanProfiles), shown when this
 * build has no API. Once the API is live, admins edit it in /admin/coffee-guide.
 */
const FALLBACK_ROASTS: GuideText[] = [
  {
    key: 'light',
    name: { en: 'Light Roast', th: 'คั่วอ่อน', de: 'Helle Röstung' },
    summary: {
      en: 'Light brown beans with a dry surface and no oily sheen.',
      th: 'เมล็ดสีน้ำตาลอ่อน ผิวแห้ง ไม่มีน้ำมันเคลือบ',
      de: 'Hellbraune Bohnen mit trockener Oberfläche, ganz ohne Ölglanz.',
    },
    flavor: {
      en: 'Bright, lively acidity with fruity or floral notes, a light body and little bitterness.',
      th: 'เปรี้ยวสดใส โทนผลไม้หรือดอกไม้ Body เบา ขมน้อย',
      de: 'Frische, lebendige Säure mit fruchtigen oder blumigen Noten, leichter Körper und kaum Bitterkeit.',
    },
    brewing: {
      en: 'Drip, pour-over, cold brew and slow bar.',
      th: 'Drip, Pour-over, Cold Brew และ Slow Bar',
      de: 'Filterkaffee, Pour-over, Cold Brew und Slow Bar.',
    },
  },
  {
    key: 'medium',
    name: { en: 'Medium Roast', th: 'คั่วกลาง', de: 'Mittlere Röstung' },
    summary: {
      en: 'Deeper brown beans with a dry surface or just a little oil.',
      th: 'เมล็ดสีน้ำตาลเข้มขึ้น ผิวแห้งหรือมีน้ำมันเล็กน้อย',
      de: 'Dunklere braune Bohnen, trocken oder mit nur wenig Öl auf der Oberfläche.',
    },
    flavor: {
      en: 'A balance of acidity and bitterness, with nutty, caramel or chocolate notes.',
      th: 'สมดุลระหว่างความเปรี้ยวและความขม โทนถั่ว คาราเมล หรือช็อกโกแลต',
      de: 'Ausgewogen zwischen Säure und Bitterkeit, mit Noten von Nüssen, Karamell oder Schokolade.',
    },
    brewing: {
      en: 'Americano, cappuccino, latte, and coffee served hot or iced.',
      th: 'Americano, Cappuccino, Latte และกาแฟร้อนหรือเย็น',
      de: 'Americano, Cappuccino, Latte sowie Kaffee heiß oder auf Eis.',
    },
  },
  {
    key: 'dark',
    name: { en: 'Dark Roast', th: 'คั่วเข้ม', de: 'Dunkle Röstung' },
    summary: {
      en: 'Dark brown to almost black beans, often with oil on the surface.',
      th: 'เมล็ดสีน้ำตาลเข้มถึงเกือบดำ อาจมีน้ำมันบนผิว',
      de: 'Dunkelbraune bis fast schwarze Bohnen, oft mit Öl auf der Oberfläche.',
    },
    flavor: {
      en: 'Bold and intense, with a heavy body, pronounced bitterness and sometimes roasty or smoky notes.',
      th: 'เข้มข้น Body หนัก ความขมเด่น และอาจมีกลิ่นคั่วหรือ Smoky',
      de: 'Kräftig und intensiv, mit vollem Körper, ausgeprägter Bitterkeit und mitunter röstigen oder rauchigen Noten.',
    },
    brewing: {
      en: 'Espresso, mocha, and iced coffee with milk or other mixers.',
      th: 'Espresso, Mocha และกาแฟเย็นที่ผสมนมหรือส่วนผสมอื่น',
      de: 'Espresso, Mokka und Eiskaffee mit Milch oder anderen Zutaten.',
    },
  },
];

const FALLBACK_PROCESSES: GuideText[] = [
  {
    key: 'washed',
    name: { en: 'Washed Process', th: 'กระบวนการเปียก', de: 'Gewaschene Aufbereitung' },
    summary: {
      en: 'The skin and fruit are taken off the coffee cherry, the sticky layer is washed away, and the beans are dried.',
      th: 'ลอกเปลือกและเนื้อผลกาแฟออก แล้วกำจัดเมือกและตากเมล็ดให้แห้ง',
      de: 'Haut und Fruchtfleisch der Kaffeekirsche werden entfernt, die klebrige Schicht wird abgewaschen und die Bohnen werden getrocknet.',
    },
    flavor: {
      en: 'Usually a clean cup with clear acidity, sometimes with floral or fruity notes.',
      th: 'โดยทั่วไปให้รสชาติสะอาด Acidity ชัดเจน และอาจมีโทนดอกไม้หรือผลไม้',
      de: 'Meist eine klare, saubere Tasse mit deutlicher Säure, mitunter mit blumigen oder fruchtigen Noten.',
    },
    brewing: {},
  },
  {
    key: 'natural',
    name: { en: 'Natural / Dry Process', th: 'กระบวนการแห้ง', de: 'Natürliche / trockene Aufbereitung' },
    summary: {
      en: 'The whole coffee cherry is dried first; the dried skin and fruit are removed afterwards.',
      th: 'ตากผลกาแฟทั้งลูกก่อนนำไปสีเอาเปลือกและเนื้อแห้งออก',
      de: 'Die ganze Kaffeekirsche wird zuerst getrocknet; erst danach werden die getrocknete Haut und das Fruchtfleisch entfernt.',
    },
    flavor: {
      en: 'Often sweeter, with more body and notes of ripe fruit or berries.',
      th: 'โดยทั่วไปอาจให้ความหวานและ Body มากขึ้น พร้อมโทนผลไม้สุกหรือเบอร์รี่',
      de: 'Oft süßer, mit mehr Körper und Noten von reifen Früchten oder Beeren.',
    },
    brewing: {},
  },
  {
    key: 'honey',
    name: { en: 'Honey Process', th: 'กระบวนการฮันนี่', de: 'Honey-Aufbereitung' },
    summary: {
      en: 'The skin is taken off, but part of the sticky fruit layer stays on the beans while they dry.',
      th: 'ลอกเปลือกผลกาแฟออก แต่คงเมือกบางส่วนไว้ขณะตากแห้ง',
      de: 'Die Haut wird entfernt, ein Teil der klebrigen Fruchtschicht bleibt beim Trocknen jedoch an den Bohnen.',
    },
    flavor: {
      en: 'Usually a balance of sweetness and acidity, with a medium to full body.',
      th: 'โดยทั่วไปให้ความสมดุลระหว่างความหวานและความเปรี้ยว พร้อม Body ระดับกลางถึงสูง',
      de: 'Meist ausgewogen zwischen Süße und Säure, mit mittlerem bis vollem Körper.',
    },
    brewing: {},
  },
];

function toEntries(kind: CoffeeGuideEntry['kind'], texts: GuideText[], firstId: number): CoffeeGuideEntry[] {
  return texts.map((text, index) => ({ ...text, id: firstId + index, kind, imageUrl: null, imageAlt: null, sortOrder: index }));
}

const FALLBACK_GUIDE: CoffeeGuide = {
  roastLevels: toEntries('ROAST', FALLBACK_ROASTS, 1),
  processes: toEntries('PROCESS', FALLBACK_PROCESSES, 4),
};

/** Roast-level and processing-method explainers for /coffee (managed in /admin/coffee-guide). */
@Injectable({ providedIn: 'root' })
export class CoffeeGuideService {
  private readonly http = inject(HttpClient);

  get(): Observable<CoffeeGuide> {
    if (!isApiConfigured()) return of(FALLBACK_GUIDE);
    const withImages = (entries: CoffeeGuideEntry[]) =>
      entries.map((entry) => ({ ...entry, imageUrl: entry.imageUrl ? resolveImageUrl(entry.imageUrl) : null }));
    return this.http.get<CoffeeGuide>(`${API_BASE_URL}/coffee-guide`).pipe(
      map((guide) => ({ roastLevels: withImages(guide.roastLevels), processes: withImages(guide.processes) })),
    );
  }
}
