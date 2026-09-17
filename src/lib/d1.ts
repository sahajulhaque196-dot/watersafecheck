// src/lib/d1.ts
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '2315d8150d6cf9140fb99f826d85eb21'
const CLOUDFLARE_DATABASE_ID = process.env.CLOUDFLARE_DATABASE_ID || '2e8eed70-7477-4da0-a2bf-63e927bd5873'
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || ''

const D1_ENDPOINT = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database/${CLOUDFLARE_DATABASE_ID}/query`;

export async function d1Query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const res = await fetch(D1_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
      next: { revalidate: 86400 }, // Cache on Next.js fetch cache for 24h
    });

    if (!res.ok) {
      return [];
    }

    const json = await res.json();
    if (!json.success || !json.result || !json.result[0]) {
      return [];
    }

    return (json.result[0].results || []) as T[];
  } catch (e) {
    console.error('D1 Query Exception:', e);
    return [];
  }
}
