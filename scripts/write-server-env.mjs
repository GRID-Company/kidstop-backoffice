import { writeFileSync } from 'node:fs';

const RUNTIME_VARS = [
  'GOOGLE_CLOUD_PROJECT_ID',
  'GOOGLE_CLOUD_CLIENT_EMAIL',
  'GOOGLE_CLOUD_PRIVATE_KEY',
];

const lines = RUNTIME_VARS.filter((key) => process.env[key]).map(
  (key) => `${key}=${JSON.stringify(process.env[key])}`
);

if (lines.length === 0) {
  console.log(
    '[write-server-env] No server runtime vars in build env, skipping .env.production'
  );
  process.exit(0);
}

writeFileSync('.env.production', `${lines.join('\n')}\n`);
console.log(`[write-server-env] Wrote ${lines.length} vars to .env.production`);
