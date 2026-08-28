import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { readFileSync } from 'fs';

// Load .env.local for credentials (never commit secrets directly)
function loadEnv() {
  const envPath = new URL('../.env.local', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');
  if (fs.existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) process.env[m[1].trim()] = m[2].trim();
    }
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uoefljjbzjysuxarkxvj.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const BUCKET_NAME = 'product-images';

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY not set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const data = JSON.parse(fs.readFileSync('ecogift_products.json', 'utf8'));
const imgBase = path.join(process.cwd(), 'EcoGift_Full_Images');

const categoryMap = new Map();
const collectionMap = new Map();

const catMeta = {
  'Tableware': { icon: 'Utensils', desc: 'Sustainable cork, bamboo and wooden coasters, trays, and dining accents.' },
  'Writing Instruments': { icon: 'PenTool', desc: 'Handcrafted wooden pens, seed pens, bamboo styluses and premium desk pens.' },
  'Small Gifts': { icon: 'Gift', desc: 'Plantable bookmarks, badges, keychains, tags and memorable mini-keepsakes.' },
  'Planters & Grow Kits': { icon: 'Sprout', desc: 'Zero-waste coir grow pots, seed bombs, microgreen kits and desktop planters.' },
  'Notebooks': { icon: 'BookOpen', desc: 'Seed paper journals, cork notebooks, recycled kraft planners and diaries.' },
  'Calendars': { icon: 'Calendar', desc: 'Plantable seed calendars, perpetual wooden desktop calendars and eco planners.' },
  'Deskspace': { icon: 'LayoutGrid', desc: 'Artisanal organizers, phone stands, card holders and stationery caddies.' },
  'Spiritual & Wellness': { icon: 'Sparkles', desc: 'Sacred symbols, aromatherapy accessories, incense holders and mindful gifts.' },
  'Packaging': { icon: 'Package', desc: 'Biodegradable kraft boxes, jute pouches, seed paper sleeves and bespoke gift wraps.' },
  'Home & Décor': { icon: 'Home', desc: 'Preserved botanicals, handcrafted wall art, table decor and sustainable living accents.' },
};

function sortImages(files) {
  return files.sort((a, b) => {
    const score = (name) => {
      if (name.includes('hero')) return 1;
      if (name.startsWith('image')) return 2;
      if (name.startsWith('branded')) return 3;
      if (name.startsWith('infographic')) return 4;
      return 5;
    };
    const sA = score(a);
    const sB = score(b);
    if (sA !== sB) return sA - sB;
    return a.localeCompare(b);
  });
}

data.products.forEach(p => {
  const cat = p.category || 'Home & Décor';
  const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  if (!categoryMap.has(cat)) {
    const meta = catMeta[cat] || { icon: 'Sparkles', desc: 'Handcrafted sustainable creations' };
    categoryMap.set(cat, {
      id: 'cat-' + slug,
      name: cat,
      slug: slug,
      description: meta.desc,
      icon: meta.icon
    });
  }

  if (p.collections && Array.isArray(p.collections)) {
    p.collections.forEach(c => {
      const col = c.trim();
      if (col && !collectionMap.has(col)) {
        const cslug = col.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        collectionMap.set(col, {
          id: 'col-' + cslug,
          name: col,
          slug: cslug,
          description: 'Curated corporate gifting collection celebrating ' + col + '.'
        });
      }
    });
  }
});

const categories = Array.from(categoryMap.values());
const collections = Array.from(collectionMap.values());
const products = [];
const allProductImages = [];

data.products.forEach((p, index) => {
  const sku = p.sku_id || ('SKU-' + (index + 1));
  const folder = (p.image_folder || sku).toLowerCase();
  const prodId = 'prod-' + (index + 1);

  let localFiles = [];
  const folderPath = path.join(imgBase, folder);
  if (fs.existsSync(folderPath)) {
    localFiles = fs.readdirSync(folderPath).filter(f => f.match(/\.(webp|jpg|jpeg|png|svg)$/i));
  }

  const productImages = [];
  if (localFiles.length > 0) {
    const sorted = sortImages(localFiles);
    sorted.forEach((file, idx) => {
      let imageType = 'gallery';
      if (file.includes('hero') || idx === 0) imageType = 'primary';
      else if (file.includes('branded')) imageType = 'craft';
      else if (file.includes('infographic') || file.includes('packaging')) imageType = 'packaging';

      const imgRecord = {
        id: `${sku}-img-${idx + 1}`,
        product_id: prodId,
        storage_path: `${folder}/${file}`,
        image_type: imageType,
        sort_order: idx + 1
      };
      productImages.push(imgRecord);
      allProductImages.push(imgRecord);
    });
  } else if (p.hero_url) {
    const imgRecord = {
      id: `${sku}-img-1`,
      product_id: prodId,
      storage_path: p.hero_url,
      image_type: 'primary',
      sort_order: 1
    };
    productImages.push(imgRecord);
    allProductImages.push(imgRecord);
  } else {
    const imgRecord = {
      id: `${sku}-img-1`,
      product_id: prodId,
      storage_path: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      image_type: 'primary',
      sort_order: 1
    };
    productImages.push(imgRecord);
    allProductImages.push(imgRecord);
  }

  const cat = p.category || 'Home & Décor';
  const catObj = categoryMap.get(cat);

  const materialList = p.material_tags
    ? p.material_tags.split(';').map(s => s.trim()).filter(Boolean)
    : ['Sustainable Materials'];

  const secondaryUseCases = p.secondary_use_cases
    ? p.secondary_use_cases.split(';').map(s => s.trim()).filter(Boolean)
    : ['Corporate Gifting', 'Welcome Kits'];

  let speed = '3-5 Days';
  if (p.speed_bucket === 'Fast') speed = 'Ready to Ship';
  else if (p.speed_bucket === 'Slow') speed = '7-10 Days';

  const rate = Number(p.rate) || 150;
  const minOrder = rate > 1000 ? 5 : rate > 300 ? 25 : rate > 100 ? 50 : 100;

  products.push({
    id: prodId,
    sku: sku,
    name: p.product_name || ('Eco Gift Item ' + sku),
    category_id: catObj ? catObj.id : 'cat-home-decor',
    category_name: cat,
    subcategory: p.subcategory || 'Artisanal Gifts',
    price: rate,
    gst_percent: Number(p.gst_percent) || 5,
    description: p.short_description || ('Handcrafted ' + p.product_name + ' designed with sustainable eco-conscious materials for memorable gifting.'),
    specification: {
      dimensions: p.specification || 'Standard artisanal dimensions',
      weight: 'Artisanal spec',
      finish: 'Natural Eco Finish',
      packaging: p.specification && p.specification.toLowerCase().includes('sleeve') ? 'Kraft Paper Eco Sleeve' : p.specification && p.specification.toLowerCase().includes('box') ? 'Recycled Kraft Box' : 'Eco-friendly Recyclable Box',
      customization_options: ['Laser Logo Engraving', 'Custom Screen Print', 'Personalized Sleeve', 'Bespoke Branding Plaque'],
      origin: 'Artisan Clusters, India',
      eco_impact: 'Zero single-use plastic, ethically sourced biodegradable components'
    },
    primary_use_case: p.primary_use_case || 'Corporate & Tabletop Gifting',
    secondary_use_cases: secondaryUseCases,
    material_tags: materialList,
    tier: (['Essential', 'Premium', 'Signature', 'Luxury'].includes(p.tier) ? p.tier : 'Essential'),
    speed: speed,
    featured: p.catalog === 'YES' || p.tier === 'Signature' || p.tier === 'Luxury' || index < 12,
    min_order_qty: minOrder,
    collections: p.collections || ['Eco Stationery'],
    images: productImages,
    created_at: p.created_at || '2026-04-23T21:25:32+00:00',
    updated_at: p.last_updated_at || '2026-08-28T13:42:03.832Z'
  });
});

async function syncToDatabase() {
  console.log(`\n========================================`);
  console.log(`Syncing Data to Supabase Database...`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Collections: ${collections.length}`);
  console.log(`Products: ${products.length}`);
  console.log(`Product Images: ${allProductImages.length}`);
  console.log(`========================================\n`);

  // Try writing to categories
  const { error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'id' });
  if (catErr) {
    console.log('Note on categories upsert:', catErr.message);
  } else {
    console.log('✓ Categories upserted successfully.');
  }

  // Try writing to collections
  const { error: colErr } = await supabase.from('collections').upsert(collections, { onConflict: 'id' });
  if (colErr) {
    console.log('Note on collections upsert:', colErr.message);
  } else {
    console.log('✓ Collections upserted successfully.');
  }

  // Try writing to products (in chunks of 50)
  let prodSuccess = 0;
  for (let i = 0; i < products.length; i += 50) {
    const chunk = products.slice(i, i + 50).map(({ images, category_name, ...p }) => p);
    const { error: pErr } = await supabase.from('products').upsert(chunk, { onConflict: 'id' });
    if (pErr) {
      console.log(`Note on products chunk [${i}-${i + 50}]:`, pErr.message);
    } else {
      prodSuccess += chunk.length;
    }
  }
  console.log(`✓ Products synced: ${prodSuccess}/${products.length}`);

  // Try writing to product_images (in chunks of 100)
  let imgSuccess = 0;
  for (let i = 0; i < allProductImages.length; i += 100) {
    const chunk = allProductImages.slice(i, i + 100);
    const { error: imgErr } = await supabase.from('product_images').upsert(chunk, { onConflict: 'id' });
    if (imgErr) {
      console.log(`Note on images chunk [${i}-${i + 100}]:`, imgErr.message);
    } else {
      imgSuccess += chunk.length;
    }
  }
  console.log(`✓ Product Images synced: ${imgSuccess}/${allProductImages.length}`);

  // Also write mock-data.ts with clean Supabase Storage paths as the ultra-fast typed backup
  const fileContent = 'import { Product, Category, Collection, Enquiry } from \'./types\';\n\n' +
    'export const INITIAL_CATEGORIES: Category[] = ' + JSON.stringify(categories, null, 2) + ';\n\n' +
    'export const INITIAL_COLLECTIONS: Collection[] = ' + JSON.stringify(collections, null, 2) + ';\n\n' +
    'export const INITIAL_PRODUCTS: Product[] = ' + JSON.stringify(products, null, 2) + ';\n\n' +
    'export const INITIAL_ENQUIRIES: Enquiry[] = [];\n';

  fs.writeFileSync(path.join(process.cwd(), 'src', 'lib', 'supabase', 'mock-data.ts'), fileContent, 'utf8');
  console.log('✓ Updated mock-data.ts with Supabase Storage paths.');
}

syncToDatabase().catch(console.error);
