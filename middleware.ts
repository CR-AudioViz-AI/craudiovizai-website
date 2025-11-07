// =====================================================
// CR AUDIOVIZ AI - UNIVERSAL SECURITY MIDDLEWARE
// Fortune 50 Protection Layer
// Deploy this to EVERY app in the ecosystem
// Built: 2025-11-04
// =====================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getErrorMessage, logError, formatApiError } from '@/lib/utils/error-utils';

// Configuration
const CONFIG = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'unknown-app',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  RATE_LIMIT_WINDOW_MS: 60000,
  RATE_LIMIT_MAX_REQUESTS: 100,
  HONEYPOT_ENABLED: true,
  HONEYPOT_ROUTES: ['/admin', '/api/admin', '/.env', '/wp-admin'],
  WHITELISTED_IPS: [] as string[],
};

// Attack patterns
const ATTACK_PATTERNS = {
  sqlInjection: [/union.*select/i, /insert.*into/i, /drop.*table/i, /exec\s*\(/i],
  xss: [/<script[\s\S]*?>/i, /javascript:/i, /onerror\s*=/i],
  pathTraversal: [/\.\.\/\.\.\//,  /\.\.\\\.\.\\/, /%2e%2e%2f/i],
};

const BLOCKED_USER_AGENTS = ['sqlmap', 'nikto', 'nmap', 'metasploit'];

// Cache
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();
const blockedIPsCache = new Set<string>();
let lastBlockedIPRefresh = 0;

async function refreshBlockedIPs(): Promise<void> {
  const now = Date.now();
  if (now - lastBlockedIPRefresh < 300000) return;
  
  try {
    const response = await fetch(
      `${CONFIG.SUPABASE_URL}/rest/v1/blocked_ips?select=ip_address`,
      {
        headers: {
          'apikey': CONFIG.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    
    if (response.ok) {
      const blockedIPs = await response.json();
      blockedIPsCache.clear();
      blockedIPs.forEach((entry: any) => blockedIPsCache.add(entry.ip_address));
      lastBlockedIPRefresh = now;
    }
  } catch (error: unknown) {
    logError(\'[Security] Failed to refresh blocked IPs:\', error);
  }
}

function getClientIP(request: NextRequest): string {
  return request.ip || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitCache.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitCache.set(identifier, { count: 1, resetTime: now + CONFIG.RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (entry.count >= CONFIG.RATE_LIMIT_MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

function detectAttackPattern(url: string): { detected: boolean; type: string | null } {
  const fullUrl = decodeURIComponent(url);
  
  for (const pattern of ATTACK_PATTERNS.sqlInjection) {
    if (pattern.test(fullUrl)) return { detected: true, type: 'sql_injection' };
  }
  for (const pattern of ATTACK_PATTERNS.xss) {
    if (pattern.test(fullUrl)) return { detected: true, type: 'xss' };
  }
  for (const pattern of ATTACK_PATTERNS.pathTraversal) {
    if (pattern.test(fullUrl)) return { detected: true, type: 'path_traversal' };
  }
  
  return { detected: false, type: null };
}

async function logThreat(data: any): Promise<void> {
  try {
    await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/security_threats`, {
      method: 'POST',
      headers: {
        'apikey': CONFIG.SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${CONFIG.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ ...data, app_name: CONFIG.APP_NAME }),
    });
  } catch (error: unknown) {
    logError(\'[Security] Failed to log threat:\', error);
  }
}

export async function middleware(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const url = request.nextUrl;
  const fullPath = url.pathname + url.search;
  
  await refreshBlockedIPs();
  
  if (blockedIPsCache.has(ip)) {
    await logThreat({ ip, user_agent: userAgent, url_path: fullPath, threat_type: 'blocked_ip_attempt', severity: 'high', action_taken: 'blocked' });
    return new NextResponse('Access Denied', { status: 403 });
  }
  
  const isBlockedAgent = BLOCKED_USER_AGENTS.some(agent => userAgent.includes(agent));
  if (isBlockedAgent) {
    await logThreat({ ip, user_agent: userAgent, url_path: fullPath, threat_type: 'blocked_user_agent', severity: 'high', action_taken: 'blocked' });
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  const attackDetection = detectAttackPattern(fullPath);
  if (attackDetection.detected) {
    await logThreat({ ip, user_agent: userAgent, url_path: fullPath, threat_type: attackDetection.type, severity: 'critical', action_taken: 'honeypot' });
    return NextResponse.redirect(new URL('/api/security/honeypot', request.url));
  }
  
  const isHoneypotRoute = CONFIG.HONEYPOT_ROUTES.some(route => url.pathname.startsWith(route));
  if (isHoneypotRoute && CONFIG.HONEYPOT_ENABLED) {
    return NextResponse.redirect(new URL('/api/security/honeypot', request.url));
  }
  
  const rateLimitKey = `${ip}:${url.pathname}`;
  if (!checkRateLimit(rateLimitKey)) {
    await logThreat({ ip, user_agent: userAgent, url_path: fullPath, threat_type: 'rate_limit_exceeded', severity: 'medium', action_taken: 'rate_limited' });
    return new NextResponse('Too Many Requests', { status: 429 });
  }
  
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Protected-By', 'CR-Security-System');
  
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
