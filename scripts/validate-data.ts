/**
 * Validate JSON data files against v1.0 schemas using Ajv.
 * Usage: npx tsx scripts/validate-data.ts <entity> <dataFile>
 * Example: npx tsx scripts/validate-data.ts talk data/talks.json
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SCHEMAS: Record<string, string> = {
  talk: '../src/contracts/talk.v1.json',
  speaker: '../src/contracts/speaker.v1.json',
  ticket: '../src/contracts/ticket.v1.json',
  sponsor: '../src/contracts/sponsor.v1.json',
};

function main() {
  const [entity, dataFile] = process.argv.slice(2);

  if (!entity || !dataFile) {
    console.log('Usage: npx tsx scripts/validate-data.ts <entity> <dataFile>');
    console.log('Entities:', Object.keys(SCHEMAS).join(', '));
    process.exit(1);
  }

  const schemaPath = SCHEMAS[entity];
  if (!schemaPath) {
    console.error(`Unknown entity "${entity}". Valid: ${Object.keys(SCHEMAS).join(', ')}`);
    process.exit(1);
  }

  const schema = JSON.parse(readFileSync(resolve(__dirname, schemaPath), 'utf-8'));
  const data = JSON.parse(readFileSync(resolve(process.cwd(), dataFile), 'utf-8'));

  const ajv = new Ajv({ allErrors: true });
  // ajv-formats adds "uri", "date", etc.
  try { addFormats(ajv); } catch { /* ajv-formats optional */ }

  const validate = ajv.compile(schema);
  const items = Array.isArray(data) ? data : [data];
  let errors = 0;

  items.forEach((item, i) => {
    const valid = validate(item);
    if (!valid) {
      errors++;
      console.error(`❌ Item ${i} (id=${item.id ?? '?'}):`);
      validate.errors?.forEach((e) => {
        console.error(`   ${e.instancePath || '/'} ${e.message}`);
      });
    }
  });

  if (errors === 0) {
    console.log(`✅ All ${items.length} ${entity}(s) valid.`);
  } else {
    console.error(`\n${errors}/${items.length} invalid.`);
    process.exit(1);
  }
}

main();
