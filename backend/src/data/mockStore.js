// In-memory demo data store for zero-database deployment resilience
const mockUsers = [
  {
    _id: '662b001a1111111111111111',
    name: 'Ayush Birthire',
    email: 'ayush@agrismart.org',
    password: 'ayushpassword123',
    role: 'farmer',
    phone: '+91 99887 76655',
    location: { village: 'Nimar Valley', district: 'Indore', state: 'Madhya Pradesh' },
    preferredLanguage: 'hi',
  },
  {
    _id: '662b001b2222222222222222',
    name: 'Ramesh Patel',
    email: 'farmer@agrismart.org',
    password: 'farmerpassword123',
    role: 'farmer',
    phone: '+91 91234 56789',
    location: { village: 'Khargone Rural', district: 'Khargone', state: 'Madhya Pradesh' },
    preferredLanguage: 'en',
  },
  {
    _id: '662b001c3333333333333333',
    name: 'System Administrator',
    email: 'admin@agrismart.org',
    password: 'adminpassword123',
    role: 'admin',
    phone: '+91 98765 43210',
    location: { village: 'Central KVK', district: 'Bhopal', state: 'Madhya Pradesh' },
    preferredLanguage: 'en',
  },
];

const mockFarms = [
  {
    _id: '662b002a1111111111111111',
    farmer: { _id: '662b001a1111111111111111', name: 'Ayush Birthire' },
    name: 'Kisan Samriddhi Agri Farm',
    location: { address: 'Survey No. 88', village: 'Sanwer', district: 'Indore', state: 'Madhya Pradesh', pincode: '453551' },
    totalArea: { value: 8, unit: 'Acres' },
    soilType: 'Loamy',
    irrigationType: 'Sprinkler',
    cropsGrown: ['Wheat', 'Chickpeas / Gram'],
    notes: 'Organic farming pilot with crop rotation and rainwater harvesting pond.',
  },
  {
    _id: '662b002b2222222222222222',
    farmer: { _id: '662b001b2222222222222222', name: 'Ramesh Patel' },
    name: 'Green Horizon Organic Estate',
    location: { address: 'Plot 42, Riverbank Canal Road', village: 'Khargone Rural', district: 'Khargone', state: 'Madhya Pradesh', pincode: '451001' },
    totalArea: { value: 12.5, unit: 'Acres' },
    soilType: 'Black',
    irrigationType: 'Drip',
    cropsGrown: ['Soybean', 'Cotton', 'Wheat'],
    notes: 'Well-drained fertile black cotton soil with solar drip pumps installed in 2024.',
  },
];

const mockCrops = [
  {
    _id: '662b003a1111111111111111',
    farm: { _id: '662b002a1111111111111111', name: 'Kisan Samriddhi Agri Farm' },
    farmer: '662b001a1111111111111111',
    cropName: 'Desi Kabuli Chickpea (Chana)',
    variety: 'JG-11 High Yield',
    season: 'Rabi (Winter)',
    areaPlanted: { value: 7, unit: 'Acres' },
    plantingDate: new Date('2026-10-25'),
    expectedHarvestDate: new Date('2026-02-28'),
    currentStage: 'Vegetative Growth',
    healthStatus: 'Healthy',
    activityLogs: [
      { activityType: 'Soil Test', description: 'Pre-sowing soil profile testing completed', cost: 500, date: new Date('2026-10-18') },
    ],
  },
  {
    _id: '662b003b2222222222222222',
    farm: { _id: '662b002b2222222222222222', name: 'Green Horizon Organic Estate' },
    farmer: '662b001b2222222222222222',
    cropName: 'Golden Sharbati Wheat',
    variety: 'C-306 Sharbati',
    season: 'Rabi (Winter)',
    areaPlanted: { value: 6, unit: 'Acres' },
    plantingDate: new Date('2026-11-10'),
    expectedHarvestDate: new Date('2026-03-25'),
    currentStage: 'Flowering / Fruiting',
    healthStatus: 'Healthy',
    activityLogs: [
      { activityType: 'Sowing / Seedling', description: 'Certified seeds treated with Trichoderma viride', cost: 4200, date: new Date('2026-11-10') },
      { activityType: 'Irrigation', description: 'First drip irrigation flush applied', cost: 650, date: new Date('2026-11-25') },
    ],
  },
];

const mockSoilReports = [
  {
    _id: '662b004a1111111111111111',
    farm: { _id: '662b002a1111111111111111', name: 'Kisan Samriddhi Agri Farm' },
    farmer: '662b001a1111111111111111',
    sampleDate: new Date('2026-10-22'),
    phLevel: 6.8,
    nitrogen: 320,
    phosphorus: 24,
    potassium: 210,
    organicCarbon: 0.85,
    moisture: 28,
    overallScore: 88,
    status: 'Optimal',
    recommendations: [
      { category: 'General', tip: 'Soil fertility is healthy and balanced. Continue micro-irrigation schedule.', priority: 'Low' },
      { category: 'Organic Matter', tip: 'Maintain organic carbon by applying mulching residues post-harvest.', priority: 'Medium' }
    ],
  },
];

const mockResources = [
  {
    _id: '662b005a1111111111111111',
    name: 'Certified Hybrid Wheat Seed (HD-2967)',
    category: 'Seeds',
    brand: 'National Seeds Corp',
    price: 950,
    unit: 'bag (50kg)',
    stockQuantity: 150,
    description: 'Disease-resistant, high-tillering variety ideal for central and north agricultural plains. High protein grain quality.',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    isApproved: true,
  },
  {
    _id: '662b005b2222222222222222',
    name: 'Neem-Coated Urea (Slow Release)',
    category: 'Fertilizers',
    brand: 'IFFCO Agro',
    price: 266,
    unit: 'bag (50kg)',
    stockQuantity: 400,
    description: 'Government-subsidized neem-coated urea for sustained nitrogen availability and minimized volatilization.',
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=60',
    rating: 4.8,
    isApproved: true,
  },
  {
    _id: '662b005c3333333333333333',
    name: 'Cold-Pressed Pure Neem Oil (10,000 PPM)',
    category: 'Bio-Pesticides',
    brand: 'EcoProtect Organic',
    price: 580,
    unit: 'liter',
    stockQuantity: 120,
    description: '100% natural organic broad-spectrum repellent effective against whitefly, aphids, thrips, and leaf miners.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=60',
    rating: 4.9,
    isApproved: true,
  },
  {
    _id: '662b005d4444444444444444',
    name: 'Solar Powered Drip Irrigation Starter Kit (1 Acre)',
    category: 'Irrigation Kits',
    brand: 'Jain Precision Irrigation',
    price: 14500,
    unit: 'set',
    stockQuantity: 25,
    description: 'Complete water-saving kit with inline emitters, UV mainline pipes, screen filter, and pressure regulator.',
    imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=60',
    rating: 5.0,
    isApproved: true,
  },
];

const mockOrders = [
  {
    _id: '662b006a1111111111111111',
    orderNumber: 'ORD-AGRI-892314',
    farmer: { _id: '662b001a1111111111111111', name: 'Ayush Birthire' },
    items: [
      { name: 'Certified Hybrid Wheat Seed (HD-2967)', quantity: 2, price: 950, unit: 'bag (50kg)' },
      { name: 'Cold-Pressed Pure Neem Oil (10,000 PPM)', quantity: 1, price: 580, unit: 'liter' },
    ],
    totalAmount: 2480,
    shippingAddress: {
      fullName: 'Ayush Birthire',
      phone: '+91 99887 76655',
      address: 'Farm Plot #88, Sanwer',
      district: 'Indore',
      state: 'Madhya Pradesh',
      pincode: '453551',
    },
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    orderStatus: 'Dispatched',
    orderDate: new Date(),
  },
];

const mockPestAlerts = [
  {
    _id: '662b007a1111111111111111',
    pestName: 'Fall Armyworm (Spodoptera frugiperda)',
    scientificName: 'Spodoptera frugiperda',
    affectedCrops: ['Maize', 'Sorghum', 'Sweet Corn'],
    severity: 'High',
    symptoms: ['Large ragged whorl feeding holes', 'Sawdust-like frass on inner leaves'],
    preventionAdvice: ['Install pheromone traps (5 traps/acre)', 'Conserve beneficial predators'],
    organicTreatment: 'Spray Bacillus thuringiensis (Bt) kurstaki formulation at 2g/liter',
    chemicalTreatment: 'Chlorantraniliprole 18.5% SC @ 0.4 ml/liter in central leaf whorls',
    affectedRegions: ['Madhya Pradesh', 'Maharashtra'],
    active: true,
  },
  {
    _id: '662b007b2222222222222222',
    pestName: 'Cotton Whitefly (Bemisia tabaci)',
    scientificName: 'Bemisia tabaci',
    affectedCrops: ['Cotton', 'Tomato', 'Chilli'],
    severity: 'Moderate',
    symptoms: ['Yellowing and curling of upper leaves', 'Honeydew secretion leading to black sooty mold'],
    preventionAdvice: ['Erect yellow sticky cards (15-20/acre)'],
    organicTreatment: 'Spray 5 ml/liter pure Cold-Pressed Neem Oil (10,000 PPM)',
    chemicalTreatment: 'Diafenthiuron 50% WP @ 1g/liter',
    affectedRegions: ['Khargone', 'Indore', 'Dhar'],
    active: true,
  },
];

const mockForumPosts = [
  {
    _id: '662b008a1111111111111111',
    title: 'How can I treat leaf curling in my winter tomato nursery without harsh chemicals?',
    content: 'I noticed whiteflies clustering under the young leaves in my nursery beds. What is the safest organic remedy to prevent stunt virus?',
    authorName: 'Ramesh Patel',
    category: 'Pest Management',
    isExpertConsultation: true,
    status: 'Answered by Expert',
    tags: ['Tomato', 'Organic', 'Whitefly'],
    upvotes: 12,
    replies: [
      {
        authorName: 'Dr. V. K. Sharma (Senior Agronomist, KVK)',
        content: 'Spray 5 ml/liter cold-pressed neem oil (10,000 ppm) with 1 ml liquid soap in late afternoon. Hang 12 yellow sticky sheets above the canopy.',
        isExpertReply: true,
        createdAt: new Date(),
      },
    ],
    createdAt: new Date(),
  },
];

module.exports = {
  mockUsers,
  mockFarms,
  mockCrops,
  mockSoilReports,
  mockResources,
  mockOrders,
  mockPestAlerts,
  mockForumPosts,
};
