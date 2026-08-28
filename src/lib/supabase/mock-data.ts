import { Product, Category, Collection, Enquiry } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Home & Décor', slug: 'home-decor', description: 'Handcrafted living accents, preserved moss art & statement tabletop pieces', icon: 'Sparkles' },
  { id: 'cat-2', name: 'Tableware & Dining', slug: 'tableware', description: 'Artisanal wooden serving boards, brass inlays & handcrafted coasters', icon: 'Utensils' },
  { id: 'cat-3', name: 'Executive Stationery', slug: 'stationery', description: 'Sustainable bamboo journals, handcrafted wooden desk organizers & pens', icon: 'BookOpen' },
  { id: 'cat-4', name: 'Corporate Gifting Hampers', slug: 'corporate-gifting', description: 'Curated welcome kits, festive bespoke hampers & conference memorabilia', icon: 'Gift' },
  { id: 'cat-5', name: 'Tech & Lifestyle', slug: 'tech-lifestyle', description: 'Natural cork tech organizers, wooden docking stations & eco-accessories', icon: 'Laptop' },
];

export const INITIAL_COLLECTIONS: Collection[] = [
  { id: 'col-1', name: 'Vana (Forest Green & Preserved Moss)', slug: 'vana-collection', description: 'Zero-maintenance botanical art crafted with real Icelandic moss and reclaimed teak.' },
  { id: 'col-2', name: 'Kaastha (Reclaimed Wood & Brass)', slug: 'kaastha-collection', description: 'Indian artisan woodcraft celebrating sheesham, acacia and hand-beaten brass.' },
  { id: 'col-3', name: 'Venu (Fine Bamboo Essentials)', slug: 'venu-collection', description: 'Ultra-light, durable and organic bamboo gifts for the forward-thinking corporate.' },
  { id: 'col-4', name: 'Dharani (Organic Cork Lifestyle)', slug: 'dharani-collection', description: 'Cruelty-free, waterproof tree-bark cork accessories with sleek modern contours.' },
  { id: 'col-5', name: 'Heritage Artisanal Hampers', slug: 'heritage-hampers', description: 'Festive and milestone gift boxes hand-assembled by rural master craftspeople.' },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    sku: 'VG-MOSS-01',
    name: 'Vana Preserved Moss & Teak Hexagon Desk Organizer',
    category_id: 'cat-1',
    category_name: 'Home & Décor',
    subcategory: 'Desk Décor & Planters',
    price: 1850,
    gst_percent: 18,
    description: 'A breathtaking synergy of zero-maintenance real preserved moss and solid reclaimed Indian teak wood. Designed for modern executive desks, this piece improves workspace well-being while carrying your brand engraving on hand-finished brass plates.',
    specification: {
      dimensions: '22cm x 18cm x 7cm',
      weight: '480g',
      finish: 'Natural Beeswax & Organic Matte Oil',
      packaging: 'Handmade Recycled Kraft Gift Box with Jute Tie',
      customization_options: ['Laser Logo Engraving', 'Custom Brass Plaque', 'Personalized Recipient Name', 'Custom Moss Hue'],
      origin: 'Saharanpur & Nilgiris Artisan Clusters, India',
      eco_impact: 'Saves approx. 1.8kg CO2e; zero water required for moss life.'
    },
    primary_use_case: 'Executive Desk Decor & Client Appreciation',
    secondary_use_cases: ['New Hire Welcome Kits', 'VIP Speaker Mementos', 'Earth Day Gifting'],
    material_tags: ['Wood', 'Moss', 'Brass'],
    tier: 'Artisan Luxe',
    speed: '3-5 Days',
    featured: true,
    min_order_qty: 10,
    collections: ['Vana (Forest Green & Preserved Moss)', 'Kaastha (Reclaimed Wood & Brass)'],
    images: [
      {
        id: 'img-1-1',
        product_id: 'prod-1',
        storage_path: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
        image_type: 'primary',
        sort_order: 1
      },
      {
        id: 'img-1-2',
        product_id: 'prod-1',
        storage_path: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
        image_type: 'gallery',
        sort_order: 2
      },
      {
        id: 'img-1-3',
        product_id: 'prod-1',
        storage_path: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1000&q=80',
        image_type: 'packaging',
        sort_order: 3
      }
    ],
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 'prod-2',
    sku: 'VG-WOOD-02',
    name: 'Royal Sheesham & Hand-Etched Brass Coaster Set of 6',
    category_id: 'cat-2',
    category_name: 'Tableware & Dining',
    subcategory: 'Drinkware & Coasters',
    price: 1250,
    gst_percent: 12,
    description: 'Handcrafted from seasoned North Indian Sheesham wood with delicate handcrafted brass geometry inlays. Comes in a matching solid wood holder. Each coaster is finished with water-resistant organic lacquer.',
    specification: {
      dimensions: 'Coasters: 10cm x 10cm x 1cm; Holder: 12cm x 12cm x 6cm',
      weight: '620g',
      finish: 'Food-grade Linseed Oil & Polished Brass',
      packaging: 'Handmade Mulberry Paper Wrap inside Embossed Hard Box',
      customization_options: ['Deep Metal Etching', 'Wood Laser Branding', 'Custom Silhouette Shape'],
      origin: 'Moradabad & Saharanpur, Uttar Pradesh',
      eco_impact: '100% Biodegradable hardwood from sustainable government-allotted timber.'
    },
    primary_use_case: 'Corporate Festive Gifting & Diwali Keepsakes',
    secondary_use_cases: ['Boardroom Amenities', 'Annual Gala Giveaways'],
    material_tags: ['Wood', 'Brass'],
    tier: 'Executive',
    speed: 'Ready to Ship',
    featured: true,
    min_order_qty: 25,
    collections: ['Kaastha (Reclaimed Wood & Brass)', 'Heritage Artisanal Hampers'],
    images: [
      {
        id: 'img-2-1',
        product_id: 'prod-2',
        storage_path: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1000&q=80',
        image_type: 'primary',
        sort_order: 1
      },
      {
        id: 'img-2-2',
        product_id: 'prod-2',
        storage_path: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1000&q=80',
        image_type: 'gallery',
        sort_order: 2
      }
    ],
    created_at: '2026-01-12T11:30:00Z'
  },
  {
    id: 'prod-3',
    sku: 'VG-CORK-03',
    name: 'Dharani Cork & Organic Cotton Executive Folio Set',
    category_id: 'cat-3',
    category_name: 'Executive Stationery',
    subcategory: 'Journals & Tech Sleeves',
    price: 1650,
    gst_percent: 18,
    description: 'Harvested without harming a single oak tree, this silky cork leather document folio holds a 14-inch laptop or tablet, business cards, pen dock, and a refillable stone paper notebook.',
    specification: {
      dimensions: '35cm x 26cm x 2.5cm',
      weight: '340g',
      finish: 'Natural Cork Grain with Water-Repellent Nano Coating',
      packaging: 'Organic Muslin Cotton Drawstring Pouch',
      customization_options: ['Blind Debossing', 'Gold Foil Stamping', 'Custom Printed Cotton Lining', 'Individual Monogramming'],
      origin: 'Coimbatore & Pune Eco-Textile Studios',
      eco_impact: 'Vegan, renewable tree-bark harvesting allows the cork tree to absorb 3-5x more CO2.'
    },
    primary_use_case: 'Onboarding Kits & Leadership Conferences',
    secondary_use_cases: ['Sales Kickoff Merchandise', 'Green Company Milestone'],
    material_tags: ['Cork', 'Organic Cotton'],
    tier: 'Signature',
    speed: '3-5 Days',
    featured: true,
    min_order_qty: 15,
    collections: ['Dharani (Organic Cork Lifestyle)'],
    images: [
      {
        id: 'img-3-1',
        product_id: 'prod-3',
        storage_path: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
        image_type: 'primary',
        sort_order: 1
      },
      {
        id: 'img-3-2',
        product_id: 'prod-3',
        storage_path: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=80',
        image_type: 'gallery',
        sort_order: 2
      }
    ],
    created_at: '2026-01-15T09:00:00Z'
  },
  {
    id: 'prod-4',
    sku: 'VG-BAMB-04',
    name: 'Venu Hand-Turned Bamboo Wireless Charging Station',
    category_id: 'cat-5',
    category_name: 'Tech & Lifestyle',
    subcategory: 'Wireless Chargers & Docks',
    price: 2150,
    gst_percent: 18,
    description: 'Combining fast 15W Qi-certified wireless charging with a natural solid bamboo tray for daily essentials. Features dual coils for horizontal and vertical smartphone positioning.',
    specification: {
      dimensions: '20cm x 15cm x 1.8cm',
      weight: '290g',
      finish: 'Smooth Hand-Sanded Bamboo with Natural Plant Oil',
      packaging: 'FSC-Certified Kraft Box with Plantable Seed Paper Sleeve',
      customization_options: ['Laser Branding', 'Colored Resin Accent', 'Custom Cable Color'],
      origin: 'Assam Bamboo Artisans & Bengaluru Tech Lab',
      eco_impact: 'Replaces virgin petroleum plastic housing with fast-growing renewable bamboo.'
    },
    primary_use_case: 'Tech Executive Gifts & Client Onboarding',
    secondary_use_cases: ['Hackathon Grand Prizes', 'Partner Summit Keepsakes'],
    material_tags: ['Bamboo'],
    tier: 'Executive',
    speed: 'Ready to Ship',
    featured: true,
    min_order_qty: 20,
    collections: ['Venu (Fine Bamboo Essentials)'],
    images: [
      {
        id: 'img-4-1',
        product_id: 'prod-4',
        storage_path: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80',
        image_type: 'primary',
        sort_order: 1
      }
    ],
    created_at: '2026-01-18T14:15:00Z'
  },
  {
    id: 'prod-5',
    sku: 'VG-MDF-05',
    name: 'Jali Architectural MDF & Warm Amber Ambient Lamp',
    category_id: 'cat-1',
    category_name: 'Home & Décor',
    subcategory: 'Ambient Lighting',
    price: 1450,
    gst_percent: 18,
    description: 'Engineered from zero-emission low-formaldehyde eco-MDF, featuring laser-cut traditional Indian jali latticework that casts hypnotic ambient warm shadows across walls.',
    specification: {
      dimensions: '14cm x 14cm x 26cm',
      weight: '550g',
      finish: 'Matte Earth Pigment Coating & Warm 2700K LED',
      packaging: 'Flat-pack gift envelope or assembled rigid wooden casket',
      customization_options: ['Custom Jali Pattern with Brand Monogram', 'Custom Size', 'Dimmable Switch'],
      origin: 'Jaipur Precision Craft Studio',
      eco_impact: 'Utilizes upcycled wood fibers, reducing timber waste by 40%.'
    },
    primary_use_case: 'Festive Lighting & Cultural Corporate Hampers',
    secondary_use_cases: ['Hospitality Suite Accents', 'Long Service Awards'],
    material_tags: ['MDF', 'Wood'],
    tier: 'Eco Essentials',
    speed: '7-10 Days',
    featured: false,
    min_order_qty: 50,
    collections: ['Heritage Artisanal Hampers'],
    images: [
      {
        id: 'img-5-1',
        product_id: 'prod-5',
        storage_path: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80',
        image_type: 'primary',
        sort_order: 1
      }
    ],
    created_at: '2026-01-20T16:00:00Z'
  },
  {
    id: 'prod-6',
    sku: 'VG-HAMP-06',
    name: 'The Sovereign Artisanal Heritage Hamper Box',
    category_id: 'cat-4',
    category_name: 'Corporate Gifting Hampers',
    subcategory: 'Luxury Multi-Item Boxes',
    price: 4950,
    gst_percent: 18,
    description: 'The pinnacle of bespoke corporate gifting. Includes an Acacia wood serving platter, hand-poured soy candle in carved teak bowl, artisanal cork diary, pure brass bookmark, and single-origin shade-grown organic coffee.',
    specification: {
      dimensions: '38cm x 28cm x 14cm',
      weight: '2.4kg',
      finish: 'Hand-rubbed Walnut Stain Box with Brass Latch',
      packaging: 'Solid Pine/Sheesham Trunk with Satin Ribbon and Wax Seal',
      customization_options: ['Custom Trunk Plaque', 'Individual Gift Cards with Handwritten Font', 'Curated Product Swaps', 'Custom Branded Ribbons'],
      origin: 'Multiple Master Artisan Guilds across India',
      eco_impact: '100% Plastic-free packaging, carbon-neutral fulfillment.'
    },
    primary_use_case: 'C-Suite Executive Gifting & High-Value Clients',
    secondary_use_cases: ['Annual Shareholder Gifts', 'Merger & Acquisition Keepsakes'],
    material_tags: ['Wood', 'Brass', 'Cork', 'Moss'],
    tier: 'Signature',
    speed: '7-10 Days',
    featured: true,
    min_order_qty: 5,
    collections: ['Heritage Artisanal Hampers', 'Kaastha (Reclaimed Wood & Brass)'],
    images: [
      {
        id: 'img-6-1',
        product_id: 'prod-6',
        storage_path: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
        image_type: 'primary',
        sort_order: 1
      },
      {
        id: 'img-6-2',
        product_id: 'prod-6',
        storage_path: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
        image_type: 'gallery',
        sort_order: 2
      }
    ],
    created_at: '2026-01-25T12:00:00Z'
  },
  {
    id: 'prod-7',
    sku: 'VG-MOSS-07',
    name: 'Preserved Botanical Moss Living Wall Accent (30x30cm)',
    category_id: 'cat-1',
    category_name: 'Home & Décor',
    subcategory: 'Wall Decor',
    price: 3200,
    gst_percent: 18,
    description: 'Evergreen preserved sheet moss, reindeer moss, and mood moss arranged in a sleek reclaimed teak wood shadowbox frame. Requires zero watering, sunlight, or pruning for 7+ years.',
    specification: {
      dimensions: '30cm x 30cm x 5cm',
      weight: '1.2kg',
      finish: 'Matte Teak Shadowbox with Wall Mount Hardware',
      packaging: 'Cushioned Eco-Honeycomb Board Crate',
      customization_options: ['Custom Corporate Logo in Moss/Wood', 'Multi-panel Wall Panorama', 'Custom Frame Wood'],
      origin: 'Nilgiris & Himachal Sustainable Foraging Partnerships',
      eco_impact: 'Natural acoustic dampener (NRC 0.65), completely non-toxic dyes.'
    },
    primary_use_case: 'Office Boardrooms & Executive Home Offices',
    secondary_use_cases: ['Architect & Designer Partner Gifting', 'Work Anniversary Milestones'],
    material_tags: ['Moss', 'Wood'],
    tier: 'Artisan Luxe',
    speed: '3-5 Days',
    featured: true,
    min_order_qty: 5,
    collections: ['Vana (Forest Green & Preserved Moss)'],
    images: [
      {
        id: 'img-7-1',
        product_id: 'prod-7',
        storage_path: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=1000&q=80',
        image_type: 'primary',
        sort_order: 1
      }
    ],
    created_at: '2026-02-01T10:00:00Z'
  },
  {
    id: 'prod-8',
    sku: 'VG-CORK-08',
    name: 'Dharani Cork Desk Mat & Magnetic Cable Organizer',
    category_id: 'cat-5',
    category_name: 'Tech & Lifestyle',
    subcategory: 'Desk Accessories',
    price: 1100,
    gst_percent: 18,
    description: 'Dual-sided waterproof desk mat made from natural Portuguese cork top and organic felt backing. Features an integrated magnetic docking strip to keep charging cords neat.',
    specification: {
      dimensions: '80cm x 40cm x 0.3cm',
      weight: '410g',
      finish: 'Smooth Warm Natural Cork with Anti-Fray Stitching',
      packaging: 'Cylindrical Kraft Storage Tube with Metal Lid',
      customization_options: ['Corner Debossed Company Logo', 'Custom Felt Color', 'Monogram Tag'],
      origin: 'Bengaluru Sustainable Lifestyle Unit',
      eco_impact: 'Hypoallergenic, antibacterial, naturally water resistant.'
    },
    primary_use_case: 'Remote Worker Welcome Packages & Tech Swag Upgrades',
    secondary_use_cases: ['Company Rebranding Gifts', 'Internship Graduation Packs'],
    material_tags: ['Cork'],
    tier: 'Eco Essentials',
    speed: 'Ready to Ship',
    featured: false,
    min_order_qty: 30,
    collections: ['Dharani (Organic Cork Lifestyle)'],
    images: [
      {
        id: 'img-8-1',
        product_id: 'prod-8',
        storage_path: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1000&q=80',
        image_type: 'primary',
        sort_order: 1
      }
    ],
    created_at: '2026-02-05T09:30:00Z'
  }
];

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-101',
    user_id: 'usr-1',
    product_id: 'prod-1',
    product_sku: 'VG-MOSS-01',
    product_name: 'Vana Preserved Moss & Teak Hexagon Desk Organizer',
    product_image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@novatech.io',
    phone: '+91 98765 43210',
    company_name: 'NovaTech Solutions',
    quantity: 120,
    customization_requirements: 'Laser engraved company logo on the brass plaque with individualized recipient names for our Q3 leadership conclave.',
    message: 'We are planning our annual leadership conclave in Goa next month. We need 120 premium sustainable units delivered by 15th of next month. Could you provide a formal commercial quotation with GST and shipping breakdown?',
    status: 'Replied',
    admin_notes: 'High priority corporate lead. Offered 12% bulk concession on 100+ units. Awaiting approval on digital render proof.',
    created_at: '2026-08-20T14:30:00Z',
    updated_at: '2026-08-21T10:15:00Z',
    messages: [
      {
        id: 'msg-1',
        enquiry_id: 'enq-101',
        sender_id: 'usr-1',
        sender_name: 'Aarav Sharma',
        sender_type: 'customer',
        message: 'Hi VirSaa team, we are ordering 120 units of the Vana Preserved Moss Desk Organizer for our leadership summit in Goa. Can we get individual laser names on each unit?',
        created_at: '2026-08-20T14:30:00Z'
      },
      {
        id: 'msg-2',
        enquiry_id: 'enq-101',
        sender_id: 'admin-1',
        sender_name: 'VirSaa Design Concierge',
        sender_type: 'admin',
        message: 'Hello Aarav! Thank you for choosing VirSaa Gifts. Yes, individual recipient name engraving on our brushed brass plaque is completely doable and handled in-house with zero delay. We have prepared a 3D digital mockup and commercial proposal with Tier-1 bulk pricing. Let us know if you would like a physical sample sent to your Bengaluru headquarters!',
        created_at: '2026-08-21T10:15:00Z'
      }
    ]
  },
  {
    id: 'enq-102',
    user_id: 'usr-2',
    product_id: 'prod-6',
    product_sku: 'VG-HAMP-06',
    product_name: 'The Sovereign Artisanal Heritage Hamper Box',
    product_image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    name: 'Pooja Iyer',
    email: 'pooja.iyer@zenithcapital.com',
    phone: '+91 98234 56789',
    company_name: 'Zenith Capital Advisors',
    quantity: 45,
    customization_requirements: 'Custom brass latch tag with Zenith logo + bespoke congratulatory wax-sealed card inside each hamper.',
    message: 'Looking for 45 ultra-premium hampers for our top venture partners and C-suite founders. Please confirm delivery timeline for Mumbai.',
    status: 'In Review',
    admin_notes: 'Checking inventory for sheesham timber boxes and artisan soy candle batches.',
    created_at: '2026-08-27T11:00:00Z',
    updated_at: '2026-08-27T11:00:00Z',
    messages: [
      {
        id: 'msg-3',
        enquiry_id: 'enq-102',
        sender_id: 'usr-2',
        sender_name: 'Pooja Iyer',
        sender_type: 'customer',
        message: 'Hello, looking for 45 units of the Sovereign Heritage Hamper for our Mumbai partner summit. Need confirmation on delivery date.',
        created_at: '2026-08-27T11:00:00Z'
      }
    ]
  },
  {
    id: 'enq-103',
    user_id: null,
    product_id: 'prod-3',
    product_sku: 'VG-CORK-03',
    product_name: 'Dharani Cork & Organic Cotton Executive Folio Set',
    product_image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
    name: 'Vikram Malhotra',
    email: 'v.malhotra@greengrid.in',
    phone: '+91 99112 33445',
    company_name: 'GreenGrid Renewables',
    quantity: 300,
    customization_requirements: 'Embossed GreenGrid logo on cork cover and customized plantable seed paper bookmark.',
    message: 'We are hosting a global clean energy summit in Delhi with 300 delegates. We need sustainable stationery folders that highlight zero-plastic commitments.',
    status: 'New',
    admin_notes: '',
    created_at: '2026-08-28T09:45:00Z',
    updated_at: '2026-08-28T09:45:00Z',
    messages: [
      {
        id: 'msg-4',
        enquiry_id: 'enq-103',
        sender_id: 'guest',
        sender_name: 'Vikram Malhotra',
        sender_type: 'customer',
        message: 'Hi, we require 300 units for our upcoming ESG summit in Delhi. Need debossed logo on cork folio.',
        created_at: '2026-08-28T09:45:00Z'
      }
    ]
  }
];
