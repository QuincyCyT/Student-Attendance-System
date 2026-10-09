import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const DEFAULT_SUPABASE_URL = 'https://cjghzrwmyasithmlekoc.supabase.co';
export const DEFAULT_SUPABASE_KEY = 'sb_publishable_rioDf3rHe6X2dyYw5cmoNQ_033ViyO5';

function isValidHttpUrl(stringCandidate?: string | null): boolean {
  if (!stringCandidate || typeof stringCandidate !== 'string') return false;
  const trimmed = stringCandidate.trim();
  if (
    trimmed === '' ||
    trimmed === 'undefined' ||
    trimmed === 'null' ||
    trimmed.startsWith('MY_') ||
    trimmed.startsWith('<')
  ) {
    return false;
  }
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function resolveSupabaseConfig(): { url: string; key: string } {
  let envUrl: string | undefined;
  let envKey: string | undefined;

  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      envUrl = (import.meta as any).env.VITE_SUPABASE_URL;
      envKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
    }
  } catch {
    // Ignore environment access errors
  }

  const url = isValidHttpUrl(envUrl) ? envUrl!.trim() : DEFAULT_SUPABASE_URL;
  const key =
    envKey &&
    envKey.trim() !== '' &&
    envKey !== 'undefined' &&
    envKey !== 'null' &&
    !envKey.startsWith('MY_')
      ? envKey.trim()
      : DEFAULT_SUPABASE_KEY;

  return { url, key };
}

const config = resolveSupabaseConfig();

export const SUPABASE_URL = config.url;
export const SUPABASE_ANON_KEY = config.key;

function initClient(): SupabaseClient {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client with config:', SUPABASE_URL, err);
    return createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_KEY);
  }
}

export const supabase: SupabaseClient = initClient();
