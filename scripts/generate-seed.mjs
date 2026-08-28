import fs from 'fs';
import path from 'path';

const data = JSON.parse(fs.readFileSync('ecogift_products.json', 'utf8'));
const imgBase = path.join(process.cwd(), 'EcoGift_Full_Images');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = `-- =========================================================================
-- VirSaa Gifts Database Seed Data
-- =========================================================================

`;

// 1. Categories
const catSet = new Map();
data.products.forEach(p => {
  const cat = p.category || 'Home & Décor';
  const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!catSet.has(slug)) {
    catSet.set(slug, { id: 'cat-' + slug, name: cat, slug: slug });
  }
});

for (const c of catSet.values()) {
  sql += `INSERT INTO public.categories (id, name, slug, description, icon) VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.slug)}, 'Artisanal Eco Creations', 'Sparkles') ON CONFLICT (id) DO NOTHING;\n`;
}

sql += '\n';

// 2. Collections
const colSet = new Map();
data.products.forEach(p => {
  if (p.collections && Array.isArray(p.collections)) {
    p.collections.forEach(c => {
      const col = c.trim();
      if (col) {
        const slug = col.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        if (!colSet.has(slug)) {
          colSet.set(slug, { id: 'col-' + slug, name: col, slug: slug });
        }
      }
    });
  }
});

for (const c of colSet.values()) {
  sql += `INSERT INTO public.collections (id, name, slug, description) VALUES (${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.slug)}, 'Curated Collection') ON CONFLICT (id) DO NOTHING;\n`;
}

sql += '\n';

// 3. Products & Images
data.products.forEach((p, idx) => {
  const sku = p.sku_id || ('SKU-' + (idx + 1));
  const folder = (p.image_folder || sku).toLowerCase();
  const id = 'prod-' + (idx + 1);
  const cat = p.category || 'Home & Décor';
  const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const catId = 'cat-' + slug;
  const price = Number(p.rate) || 150;
  const gst = Number(p.gst_percent) || 5;
  const tier = ['Essential', 'Premium', 'Signature', 'Luxury'].includes(p.tier) ? p.tier : 'Essential';
  const speed = p.speed_bucket === 'Fast' ? 'Ready to Ship' : p.speed_bucket === 'Slow' ? '7-10 Days' : '3-5 Days';
  const materials = p.material_tags ? p.material_tags.split(';').map(m => m.trim()).filter(Boolean) : ['Sustainable Materials'];
  const matArray = 'ARRAY[' + materials.map(m => escapeSql(m)).join(',') + ']::TEXT[]';
  const cols = p.collections || ['Eco Stationery'];
  const colArray = 'ARRAY[' + cols.map(c => escapeSql(c)).join(',') + ']::TEXT[]';
  const secUse = p.secondary_use_cases ? p.secondary_use_cases.split(';').map(s => s.trim()).filter(Boolean) : ['Corporate Gifting'];
  const secUseArray = 'ARRAY[' + secUse.map(s => escapeSql(s)).join(',') + ']::TEXT[]';
  const specJson = JSON.stringify({ dimensions: p.specification || 'Artisanal Dimensions', packaging: 'Eco Packaging' });

  sql += `INSERT INTO public.products (id, sku, name, category_id, subcategory, price, gst_percent, description, specification, primary_use_case, secondary_use_cases, material_tags, tier, speed, featured, min_order_qty, collections) VALUES (${escapeSql(id)}, ${escapeSql(sku)}, ${escapeSql(p.product_name || sku)}, ${escapeSql(catId)}, ${escapeSql(p.subcategory || 'Eco Gifts')}, ${price}, ${gst}, ${escapeSql(p.short_description || '')}, ${escapeSql(specJson)}::jsonb, ${escapeSql(p.primary_use_case || 'Corporate Gifting')}, ${secUseArray}, ${matArray}, ${escapeSql(tier)}::product_tier, ${escapeSql(speed)}::speed_type, ${p.catalog === 'YES' || idx < 12}, 10, ${colArray}) ON CONFLICT (id) DO NOTHING;\n`;

  // Images
  const folderPath = path.join(imgBase, folder);
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath).filter(f => f.match(/\.(webp|jpg|jpeg|png|svg)$/i));
    files.forEach((file, imgIdx) => {
      const imgId = `${sku}-img-${imgIdx + 1}`;
      const imgType = file.includes('hero') || imgIdx === 0 ? 'primary' : file.includes('branded') ? 'craft' : 'gallery';
      sql += `INSERT INTO public.product_images (id, product_id, storage_path, image_type, sort_order) VALUES (${escapeSql(imgId)}, ${escapeSql(id)}, ${escapeSql(`${folder}/${file}`)}, ${escapeSql(imgType)}, ${imgIdx + 1}) ON CONFLICT (id) DO NOTHING;\n`;
    });
  } else if (p.hero_url) {
    const imgId = `${sku}-img-1`;
    sql += `INSERT INTO public.product_images (id, product_id, storage_path, image_type, sort_order) VALUES (${escapeSql(imgId)}, ${escapeSql(id)}, ${escapeSql(p.hero_url)}, 'primary', 1) ON CONFLICT (id) DO NOTHING;\n`;
  }
});

fs.writeFileSync('supabase/seed.sql', sql, 'utf8');
console.log('Generated supabase/seed.sql successfully.');
