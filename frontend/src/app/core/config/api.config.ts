import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl.replace(/\/$/, '');

/** False until a backend URL is configured for this build (see environment*.ts). */
export const isApiConfigured = (): boolean => API_BASE_URL.length > 0;
