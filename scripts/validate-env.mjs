// scripts/validate-env.mjs
// Build-time and CI validation to ensure all required Firebase Web environment variables exist.

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const optionalEnvVars = [
  'VITE_FIREBASE_MEASUREMENT_ID',
];

let missing = [];

for (const envVar of requiredEnvVars) {
  const val = process.env[envVar];
  if (!val || val.trim() === '') {
    missing.push(envVar);
  }
}

if (missing.length > 0) {
  console.error('❌ Environment validation failed!');
  console.error('The following required Firebase build variables are missing or empty:');
  for (const v of missing) {
    console.error(` - Missing required Firebase build variable: ${v}`);
  }
  console.error('\nPlease ensure these environment variables / GitHub Secrets are configured before building.');
  process.exit(1);
}

console.log('✅ All required Firebase build variables are present.');
for (const envVar of requiredEnvVars) {
  console.log(` - ${envVar}: Present`);
}
for (const envVar of optionalEnvVars) {
  const isPresent = Boolean(process.env[envVar] && process.env[envVar].trim() !== '');
  console.log(` - ${envVar}: ${isPresent ? 'Present (optional)' : 'Not set (optional)'}`);
}

process.exit(0);
