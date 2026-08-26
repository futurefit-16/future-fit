// Environment variable validation

interface EnvVar {
  name: string;
  required: boolean;
  pattern?: RegExp;
}

const requiredEnvVars: EnvVar[] = [
  { name: 'NEXT_PUBLIC_SUPABASE_URL', required: true },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true },
  { name: 'RAZORPAY_KEY_ID', required: true, pattern: /^rzp_(live|test)_[A-Za-z0-9]+$/ },
  { name: 'RAZORPAY_KEY_SECRET', required: true },
  { name: 'NEXT_PUBLIC_SITE_URL', required: true },
];

export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar.name];
    
    if (envVar.required && !value) {
      errors.push(`Missing required environment variable: ${envVar.name}`);
      continue;
    }

    if (value && envVar.pattern && !envVar.pattern.test(value)) {
      errors.push(`Invalid format for ${envVar.name}`);
    }
  }

  // Validate production-specific requirements
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.NEXT_PUBLIC_SITE_URL?.startsWith('https://')) {
      errors.push('NEXT_PUBLIC_SITE_URL must use HTTPS in production');
    }

    if (process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_')) {
      errors.push('Cannot use test Razorpay keys in production');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Validate environment on startup
const envValidation = validateEnvironment();
if (!envValidation.valid && process.env.NODE_ENV === 'production') {
  console.error('Environment validation failed:', envValidation.errors);
  throw new Error('Invalid environment configuration');
} else if (!envValidation.valid) {
  console.warn('Environment validation warnings:', envValidation.errors);
}
