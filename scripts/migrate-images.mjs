/**
 * migrate-images.mjs
 * ------------------
 * Run this ONCE after your Supabase billing cycle resets (~May 9).
 *
 * What it does:
 *   1. Lists all files in the Supabase `project-images` bucket
 *   2. Downloads each file
 *   3. Converts to WebP (with max 1920px width, ~80% quality)
 *   4. Saves to public/images/
 *   5. Prints SQL you can run in Supabase to update all image URLs in the DB
 *
 * Requirements (run once):
 *   npm install sharp node-fetch@3 @supabase/supabase-js dotenv
 *
 * Usage:
 *   node scripts/migrate-images.mjs
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env manually (dotenv ESM)
import { config } from 'dotenv';
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = 'project-images';
const OUTPUT_DIR = path.resolve(process.cwd(), 'public/images');

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listAllFiles() {
  const { data, error } = await supabase.storage.from(BUCKET).list('', {
    limit: 500,
    offset: 0,
  });
  if (error) throw new Error(`Failed to list storage files: ${error.message}`);
  return data || [];
}

async function downloadFile(fileName) {
  const { data, error } = await supabase.storage.from(BUCKET).download(fileName);
  if (error) throw new Error(`Failed to download ${fileName}: ${error.message}`);
  const buffer = Buffer.from(await data.arrayBuffer());
  return buffer;
}

async function convertToWebP(buffer, outputPath) {
  await sharp(buffer)
    .resize({ width: 1920, withoutEnlargement: true }) // max 1920px wide
    .webp({ quality: 82 })                              // ~82% quality = good balance
    .toFile(outputPath);
}

async function run() {
  console.log('🔍 Connecting to Supabase Storage...');
  await mkdir(OUTPUT_DIR, { recursive: true });

  const files = await listAllFiles();

  if (files.length === 0) {
    console.log('⚠️  No files found in the bucket. Check if Supabase is active.');
    return;
  }

  console.log(`📦 Found ${files.length} file(s) in "${BUCKET}" bucket.\n`);

  const urlMapping = []; // { oldUrl, newPath }

  for (const file of files) {
    if (!file.name || file.name.endsWith('/')) continue; // skip folders

    const oldUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${file.name}`;
    const baseName = path.basename(file.name, path.extname(file.name));
    const newFileName = `${baseName}.webp`;
    const outputPath = path.join(OUTPUT_DIR, newFileName);
    const newPublicPath = `/images/${newFileName}`;

    process.stdout.write(`  ↓ ${file.name} → ${newFileName} ... `);

    try {
      const buffer = await downloadFile(file.name);
      await convertToWebP(buffer, outputPath);
      const sizeBefore = file.metadata?.size || 0;
      const newBuffer = readFileSync(outputPath);
      const sizeAfter = newBuffer.byteLength;
      const saving = sizeBefore > 0 ? Math.round((1 - sizeAfter / sizeBefore) * 100) : '?';
      console.log(`✅ (${Math.round(sizeBefore / 1024)}KB → ${Math.round(sizeAfter / 1024)}KB, ${saving}% smaller)`);
      urlMapping.push({ oldUrl, newPath: newPublicPath });
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }
  }

  // Output SQL update statements
  console.log('\n\n📋 Run this SQL in Supabase to update all image URLs:\n');
  console.log('-- ==============================================');
  console.log('-- Paste this in: Supabase Dashboard → SQL Editor');
  console.log('-- ==============================================\n');

  for (const { oldUrl, newPath } of urlMapping) {
    console.log(`UPDATE projects SET image = '${newPath}' WHERE image = '${oldUrl}';`);
    // Also update the images array (for detail gallery images)
    console.log(`UPDATE projects SET images = array_replace(images, '${oldUrl}', '${newPath}') WHERE '${oldUrl}' = ANY(images);`);
    // Partners
    console.log(`UPDATE partners SET logo_url = '${newPath}' WHERE logo_url = '${oldUrl}';`);
    console.log('');
  }

  console.log('-- ==============================================');
  console.log('\n✅ Migration complete!');
  console.log(`📁 Images saved to: ${OUTPUT_DIR}`);
  console.log('\n📌 Next steps:');
  console.log('  1. Run the SQL above in Supabase SQL Editor');
  console.log('  2. Commit the public/images/ folder to git');
  console.log('  3. Deploy (npm run build → netlify deploy --prod --dir=dist)');
  console.log('  4. Verify the site looks correct');
}

run().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
