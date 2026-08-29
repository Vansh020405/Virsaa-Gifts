const B32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function base32Decode(input: string): Uint8Array {
  const cleaned = input
    .toUpperCase()
    .replace(/=+$/g, '')
    .replace(/[\s-]/g, '');
  let bits = 0;
  let value = 0;
  const out = new Uint8Array(Math.floor((cleaned.length * 5) / 8));
  let index = 0;
  for (const ch of cleaned) {
    const v = B32_ALPHABET.indexOf(ch);
    if (v === -1) continue;
    value = (value << 5) | v;
    bits += 5;
    if (bits >= 8) {
      out[index++] = (value >>> (bits - 8)) & 0xff;
      bits -= 8;
    }
  }
  return out.slice(0, index);
}

function toArrayBufferBacked(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy;
}

async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    toArrayBufferBacked(key),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, toArrayBufferBacked(message));
}

async function hotp(secretBytes: Uint8Array, counter: number, digits: number): Promise<string> {
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(4, counter >>> 0);
  const hmac = new Uint8Array(await hmacSha1(secretBytes, new Uint8Array(buf)));
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binCode =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  const codeInt = binCode % Math.pow(10, digits);
  return codeInt.toString().padStart(digits, '0');
}

export function totpCounter(nowMs: number, timeStepSeconds = 30): number {
  return Math.floor(nowMs / 1000 / timeStepSeconds);
}

export async function generateTOTP(secret: string, timeStepSeconds = 30, digits = 6): Promise<string> {
  return hotp(base32Decode(secret), totpCounter(Date.now(), timeStepSeconds), digits);
}

export async function verifyTOTP(secret: string, code: string, timeStepSeconds = 30, digits = 6, windowSteps = 1): Promise<boolean> {
  const counter = totpCounter(Date.now(), timeStepSeconds);
  const normalized = code.replace(/\s+/g, '');
  for (let i = -windowSteps; i <= windowSteps; i++) {
    const candidate = await hotp(base32Decode(secret), counter + i, digits);
    if (candidate === normalized) return true;
  }
  return false;
}