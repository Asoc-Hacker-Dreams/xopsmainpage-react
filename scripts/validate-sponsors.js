#!/usr/bin/env node

/**
 * Script to validate sponsors.json against sponsor.schema.json
 * Uses AJV JSON Schema validator
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup AJV with strict mode and formats
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
  strict: true,
  strictSchema: true,
});

// Add format validators (uri, date-time, etc.)
addFormats(ajv);

// Load schemas
const sponsorSchemaPath = join(__dirname, '../schemas/sponsor.schema.json');
const sponsorsDataPath = join(__dirname, '../src/data/sponsors.json');

let sponsorSchema;
let sponsorsData;

try {
  const sponsorSchemaContent = readFileSync(sponsorSchemaPath, 'utf8');
  sponsorSchema = JSON.parse(sponsorSchemaContent);
  console.log('✅ Loaded sponsor schema');
} catch (error) {
  console.error('❌ Error loading sponsor schema:', error.message);
  process.exit(1);
}

try {
  const sponsorsDataContent = readFileSync(sponsorsDataPath, 'utf8');
  sponsorsData = JSON.parse(sponsorsDataContent);
  console.log('✅ Loaded sponsors data');
} catch (error) {
  console.error('❌ Error loading sponsors data:', error.message);
  process.exit(1);
}

// Compile schema
let validate;
try {
  validate = ajv.compile(sponsorSchema);
  console.log('✅ Compiled sponsor schema');
} catch (error) {
  console.error('❌ Error compiling schema:', error.message);
  process.exit(1);
}

// Validate data
console.log('\n📋 Validating sponsors data...\n');

// Ensure data is an array
if (!Array.isArray(sponsorsData)) {
  console.error('❌ Error: sponsors.json must be an array');
  process.exit(1);
}

let hasErrors = false;
let validCount = 0;

sponsorsData.forEach((sponsor, index) => {
  const valid = validate(sponsor);
  
  if (valid) {
    validCount++;
    console.log(`✅ Sponsor ${index + 1} (${sponsor.name || 'unnamed'}) - VALID`);
  } else {
    hasErrors = true;
    console.error(`\n❌ Sponsor ${index + 1} (${sponsor.name || 'unnamed'}) - INVALID\n`);
    
    // Display detailed errors
    validate.errors.forEach((error) => {
      const field = error.instancePath || '(root)';
      const message = error.message;
      
      // Provide clear error messages
      if (error.keyword === 'required') {
        console.error(`  → Campo obligatorio faltante: ${error.params.missingProperty}`);
      } else if (error.keyword === 'enum') {
        console.error(`  → Campo "${field}": debe ser uno de [${error.params.allowedValues.join(', ')}]`);
      } else if (error.keyword === 'format') {
        console.error(`  → Campo "${field}": formato inválido (debe ser ${error.params.format})`);
      } else if (error.keyword === 'pattern') {
        console.error(`  → Campo "${field}": no cumple con el patrón requerido`);
      } else if (error.keyword === 'minLength') {
        console.error(`  → Campo "${field}": debe tener al menos ${error.params.limit} caracteres`);
      } else if (error.keyword === 'type') {
        console.error(`  → Campo "${field}": debe ser de tipo ${error.params.type}`);
      } else {
        console.error(`  → Campo "${field}": ${message}`);
      }
      
      // Show additional details in verbose mode
      if (process.argv.includes('--verbose') || process.argv.includes('-v')) {
        console.error(`     Detalles: ${JSON.stringify(error, null, 2)}`);
      }
    });
    
    console.error('');
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Resumen de validación:');
console.log('='.repeat(60));
console.log(`Total de sponsors: ${sponsorsData.length}`);
console.log(`✅ Válidos: ${validCount}`);
console.log(`❌ Inválidos: ${sponsorsData.length - validCount}`);
console.log('='.repeat(60) + '\n');

if (hasErrors) {
  console.error('❌ Validación FALLIDA: La validación encontró errores.\n');
  console.error('Sugerencia: Revisa los campos obligatorios y formatos en schemas/sponsor.schema.json');
  console.error('Usa --verbose o -v para ver detalles completos de los errores.\n');
  process.exit(1);
} else {
  console.log('✅ Validación EXITOSA: Todos los sponsors cumplen con el schema v1.0\n');
  process.exit(0);
}
