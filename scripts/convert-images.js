#!/usr/bin/env node

/**
 * Image Conversion Script
 * 
 * Converts images to AVIF and WebP formats for better Core Web Vitals performance.
 * This script uses sharp for image processing.
 * 
 * Usage: node scripts/convert-images.js [options]
 * 
 * Options:
 *   --source <path>  Source directory (default: src/assets)
 *   --quality <num>  Quality for conversion (default: 80)
 *   --force          Force reconversion of existing files
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
const getArg = (flag, defaultValue) => {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : defaultValue;
};

const SOURCE_DIR = getArg('--source', path.join(__dirname, '../src/assets'));
const QUALITY = parseInt(getArg('--quality', '80'), 10);
const FORCE = args.includes('--force');

// Supported input formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif'];

// Image conversion configuration
const CONVERSION_CONFIG = {
  avif: {
    quality: QUALITY,
    effort: 4, // 0-9, higher = better compression but slower
  },
  webp: {
    quality: QUALITY,
    effort: 4,
  },
};

/**
 * Get all image files recursively
 */
async function getImageFiles(dir, fileList = []) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      await getImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file.name).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
}

/**
 * Convert image to specified format
 */
async function convertImage(inputPath, format) {
  const outputPath = inputPath.replace(/\.(jpg|jpeg|png|gif)$/i, `.${format}`);
  
  // Skip if output exists and not forcing
  if (!FORCE) {
    try {
      await fs.access(outputPath);
      // eslint-disable-next-line no-console
      console.log(`⏭️  Skipping ${path.basename(outputPath)} (already exists)`);
      return { success: true, skipped: true };
    } catch {
      // File doesn't exist, proceed with conversion
    }
  }

  try {
    const image = sharp(inputPath);
    
    // Configure conversion based on format
    let converter;
    if (format === 'avif') {
      converter = image.avif(CONVERSION_CONFIG.avif);
    } else if (format === 'webp') {
      converter = image.webp(CONVERSION_CONFIG.webp);
    }

    await converter.toFile(outputPath);
    
    // Get file sizes for comparison
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const originalSize = (await fs.stat(inputPath)).size;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const convertedSize = (await fs.stat(outputPath)).size;
    const savingsPercent = ((1 - convertedSize / originalSize) * 100).toFixed(1);
    
    // eslint-disable-next-line no-console
    console.log(
      `✅ ${path.basename(inputPath)} → ${format.toUpperCase()} ` +
      `(${(originalSize / 1024).toFixed(0)}KB → ${(convertedSize / 1024).toFixed(0)}KB, ` +
      `${savingsPercent}% smaller)`
    );
    
    return { 
      success: true, 
      skipped: false,
      originalSize,
      convertedSize,
      savings: savingsPercent
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`❌ Failed to convert ${path.basename(inputPath)} to ${format}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Main conversion process
 */
async function main() {
  // eslint-disable-next-line no-console
  console.log('🖼️  Image Conversion Tool for Core Web Vitals Optimization\n');
  // eslint-disable-next-line no-console
  console.log(`📁 Source: ${SOURCE_DIR}`);
  // eslint-disable-next-line no-console
  console.log(`⚙️  Quality: ${QUALITY}`);
  // eslint-disable-next-line no-console
  console.log(`🔄 Force: ${FORCE ? 'Yes' : 'No'}\n`);

  try {
    // Check if source directory exists
    await fs.access(SOURCE_DIR);
  } catch {
    // eslint-disable-next-line no-console
    console.error(`❌ Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  // Get all image files
  // eslint-disable-next-line no-console
  console.log('📊 Scanning for images...');
  const imageFiles = await getImageFiles(SOURCE_DIR);
  // eslint-disable-next-line no-console
  console.log(`Found ${imageFiles.length} images\n`);

  if (imageFiles.length === 0) {
    // eslint-disable-next-line no-console
    console.log('No images to convert.');
    return;
  }

  // Statistics
  const stats = {
    total: imageFiles.length,
    converted: 0,
    skipped: 0,
    failed: 0,
    totalOriginalSize: 0,
    totalConvertedSize: 0,
  };

  // Convert each image to AVIF and WebP
  for (const imagePath of imageFiles) {
    // eslint-disable-next-line no-console
    console.log(`\n📸 Processing: ${path.relative(SOURCE_DIR, imagePath)}`);
    
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const originalSize = (await fs.stat(imagePath)).size;
    stats.totalOriginalSize += originalSize;
    
    // Convert to AVIF
    const avifResult = await convertImage(imagePath, 'avif');
    if (avifResult.success) {
      if (avifResult.skipped) {
        stats.skipped++;
      } else {
        stats.converted++;
        stats.totalConvertedSize += avifResult.convertedSize;
      }
    } else {
      stats.failed++;
    }
    
    // Convert to WebP
    const webpResult = await convertImage(imagePath, 'webp');
    if (webpResult.success) {
      if (webpResult.skipped) {
        stats.skipped++;
      } else {
        stats.converted++;
        stats.totalConvertedSize += webpResult.convertedSize;
      }
    } else {
      stats.failed++;
    }
  }

  // Print summary
  // eslint-disable-next-line no-console
  console.log('\n' + '='.repeat(50));
  // eslint-disable-next-line no-console
  console.log('📊 Conversion Summary');
  // eslint-disable-next-line no-console
  console.log('='.repeat(50));
  // eslint-disable-next-line no-console
  console.log(`Total images processed: ${stats.total}`);
  // eslint-disable-next-line no-console
  console.log(`Successfully converted: ${stats.converted}`);
  // eslint-disable-next-line no-console
  console.log(`Skipped (already exist): ${stats.skipped}`);
  // eslint-disable-next-line no-console
  console.log(`Failed: ${stats.failed}`);
  
  if (stats.converted > 0) {
    const totalSavings = ((1 - stats.totalConvertedSize / stats.totalOriginalSize) * 100).toFixed(1);
    // eslint-disable-next-line no-console
    console.log(`\n💾 Total space savings: ${totalSavings}%`);
    // eslint-disable-next-line no-console
    console.log(`   Original size: ${(stats.totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    // eslint-disable-next-line no-console
    console.log(`   Converted size: ${(stats.totalConvertedSize / 1024 / 1024).toFixed(2)} MB`);
  }
  
  // eslint-disable-next-line no-console
  console.log('\n✨ Done!\n');
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
