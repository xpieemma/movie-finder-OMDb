interface EnvConfig {
  apiUrl: string;
  appName: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isVercel: boolean;
  vercelUrl?: string;
  betterstackToken?: string;
}

export const env: EnvConfig = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  appName: import.meta.env.VITE_APP_NAME || 'MovieFinder',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  isVercel: !!import.meta.env.VERCEL,
  vercelUrl: import.meta.env.VERCEL_URL,
  betterstackToken: import.meta.env.VITE_BETTERSTACK_TOKEN,
};

if (env.isDevelopment) {
  console.log('Ìºç Environment:', {
    ...env,
    betterstackToken: env.betterstackToken ? '***' : undefined,
  });
}
