/**
 * TriskelGate API client
 * Wraps all calls to the TriskelGate ticketing platform with circuit breaker protection.
 */

import { CircuitBreaker } from './circuitBreaker';
import type {
  TGEvent,
  TGTicketType,
  TGValidatePayload,
  TGValidateResponse,
  TGCheckoutPayload,
  TGCheckoutResponse,
  TGCheckoutSessionStatus,
  TGApiResponse,
  TGOrder,
} from './types';

export interface TriskelGateClientOptions {
  baseUrl?: string;
  apiKey?: string;
  timeoutMs?: number;
}

const DEFAULT_BASE_URL = 'https://tickets.xopsconference.com';
const DEFAULT_TIMEOUT_MS = 10_000;

export class TriskelGateClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeoutMs: number;
  private readonly breaker: CircuitBreaker;

  constructor(options: TriskelGateClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.apiKey = options.apiKey;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.breaker = new CircuitBreaker({ failureThreshold: 5, resetTimeoutMs: 30_000 });
  }

  /** GET /api/events – list all events */
  async listEvents(): Promise<TGEvent[]> {
    return this.breaker.execute(async () => {
      const raw = await this.request<TGApiResponse<TGEvent[]>>('GET', '/api/events');
      return raw.data ?? (raw as unknown as TGEvent[]);
    });
  }

  /** GET /api/events/:id/ticket-types – list ticket types for an event */
  async listTicketTypes(eventId: number | string): Promise<TGTicketType[]> {
    return this.breaker.execute(async () => {
      const raw = await this.request<TGApiResponse<TGTicketType[]>>(
        'GET',
        `/api/events/${encodeURIComponent(String(eventId))}/ticket-types`,
      );
      return raw.data ?? (raw as unknown as TGTicketType[]);
    });
  }

  /** POST /api/validate – validate a ticket (QR scan) */
  async validateTicket(payload: TGValidatePayload): Promise<TGValidateResponse> {
    return this.breaker.execute(() =>
      this.request<TGValidateResponse>('POST', '/api/validate', payload),
    );
  }

  /** POST /api/payment/create-session – create a Stripe checkout session */
  async createCheckout(payload: TGCheckoutPayload): Promise<TGCheckoutResponse> {
    return this.breaker.execute(() =>
      this.request<TGCheckoutResponse>('POST', '/api/payment/create-session', payload),
    );
  }

  /** GET /api/checkout/sessions/:id/status – check payment status */
  async getCheckoutSessionStatus(sessionId: string): Promise<TGCheckoutSessionStatus> {
    return this.breaker.execute(() =>
      this.request<TGCheckoutSessionStatus>(
        'GET',
        `/api/checkout/sessions/${encodeURIComponent(sessionId)}/status`,
      ),
    );
  }

  /** GET /api/orders/:id – get order status */
  async getOrder(orderId: string): Promise<TGOrder> {
    return this.breaker.execute(() =>
      this.request<TGOrder>('GET', `/api/orders/${encodeURIComponent(orderId)}`),
    );
  }

  /** Expose circuit breaker state for monitoring */
  get circuitState(): string {
    return this.breaker.currentState;
  }

  // ── internal ─────────────────────────────────────────────

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new TriskelGateApiError(res.status, text || res.statusText, url);
      }

      return (await res.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }
}

export class TriskelGateApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: string,
    public readonly url: string,
  ) {
    super(`TriskelGate ${status}: ${body} (${url})`);
    this.name = 'TriskelGateApiError';
  }
}

/** Singleton-ish factory – reads env vars if available (Node / SSR) */
let _defaultClient: TriskelGateClient | null = null;

export function getDefaultClient(): TriskelGateClient {
  if (!_defaultClient) {
    _defaultClient = new TriskelGateClient({
      baseUrl: typeof process !== 'undefined'
        ? process.env.TRISKELGATE_BASE_URL ?? DEFAULT_BASE_URL
        : DEFAULT_BASE_URL,
      apiKey: typeof process !== 'undefined'
        ? process.env.TRISKELGATE_API_KEY
        : undefined,
    });
  }
  return _defaultClient;
}

/** Browser-side singleton – reads Vite env vars */
export const triskelGateClient = new TriskelGateClient({
  baseUrl: (
    (typeof import.meta !== 'undefined' && (import.meta as Record<string, any>).env?.VITE_TRISKELGATE_URL) ||
    (typeof import.meta !== 'undefined' && (import.meta as Record<string, any>).env?.VITE_TRISKELL_API_BASE_URL) ||
    'http://localhost:3001'
  ),
});
