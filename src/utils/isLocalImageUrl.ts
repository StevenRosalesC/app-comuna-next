const isIpv4 = (hostname: string) => {
  const parts = hostname.split('.');
  if (parts.length !== 4) return false;
  return parts.every((part) => {
    if (!/^\d+$/.test(part)) return false;
    const value = Number(part);
    return Number.isInteger(value) && value >= 0 && value <= 255;
  });
};

const isPrivateOrLoopbackIpv4 = (hostname: string) => {
  if (!isIpv4(hostname)) return false;
  const [a, b] = hostname.split('.').map((n) => Number(n));

  if (a === 127) return true;
  if (a === 10) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;

  return false;
};

const isPrivateOrLoopbackIpv6 = (hostname: string) => {
  const normalized = hostname.toLowerCase();
  if (!normalized.includes(':')) return false;
  if (normalized === '::1') return true;
  if (normalized.startsWith('fe80:')) return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
  return false;
};

export const isLocalImageUrl = (src?: string | null) => {
  if (!src) return false;
  const value = src.trim();
  if (!value) return false;

  if (value.startsWith('blob:') || value.startsWith('data:')) return true;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;

  const hostname = url.hostname.toLowerCase();
  if (hostname === 'localhost') return true;
  if (hostname.endsWith('.localhost')) return true;
  if (hostname.endsWith('.local')) return true;
  if (isPrivateOrLoopbackIpv4(hostname)) return true;
  if (isPrivateOrLoopbackIpv6(hostname)) return true;

  return false;
};
