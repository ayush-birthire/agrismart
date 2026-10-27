const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Farm = require('../models/Farm');
const Crop = require('../models/Crop');
const SoilReport = require('../models/SoilReport');
const WeatherData = require('../models/WeatherData');
const Resource = require('../models/Resource');
const Order = require('../models/Order');
const PestAlert = require('../models/PestAlert');
const ForumPost = require('../models/ForumPost');

const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agrismart';
  try {
    await mongoose.connect(mongoURI);
    console.log('[Seed]: Connected to MongoDB at', mongoURI);

    // Clear existing data
    await User.deleteMany();
    await Farm.deleteMany();
    await Crop.deleteMany();
    await SoilReport.deleteMany();
    await WeatherData.deleteMany();
    await Resource.deleteMany();
    await Order.deleteMany();
    await PestAlert.deleteMany();
    await ForumPost.deleteMany();

    console.log('[Seed]: Cleared existing collections.');

    // 1. Create Users (Farmer & Admin)
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@agrismart.org',
      password: 'adminpassword123',
      role: 'admin',
      phone: '+91 98765 43210',
      location: { village: 'Central KVK', district: 'Bhopal', state: 'Madhya Pradesh' },
      preferredLanguage: 'en',
    });

    const farmerUser = await User.create({
      name: 'Ramesh Patel',
      email: 'farmer@agrismart.org',
      password: 'farmerpassword123',
      role: 'farmer',
      phone: '+91 91234 56789',
      location: { village: 'Khargone Rural', district: 'Khargone', state: 'Madhya Pradesh' },
      preferredLanguage: 'en',
    });

    const ayushUser = await User.create({
      name: 'Ayush Birthire',
      email: 'ayush@agrismart.org',
      password: 'ayushpassword123',
      role: 'farmer',
      phone: '+91 99887 76655',
      location: { village: 'Nimar Valley', district: 'Indore', state: 'Madhya Pradesh' },
      preferredLanguage: 'hi',
    });

    console.log('[Seed]: Created demo Users (admin, farmer, ayush).');

    // 2. Create Farms for Farmers
    const farm1 = await Farm.create({
      farmer: farmerUser._id,
      name: 'Green Horizon Organic Estate',
      location: {
        address: 'Plot 42, Riverbank Canal Road',
        village: 'Khargone Rural',
        district: 'Khargone',
        state: 'Madhya Pradesh',
        pincode: '451001',
      },
      totalArea: { value: 12.5, unit: 'Acres' },
      soilType: 'Black',
      irrigationType: 'Drip',
      cropsGrown: ['Soybean', 'Cotton', 'Wheat'],
      notes: 'Well-drained fertile black cotton soil with solar drip pumps installed in 2024.',
    });

    const farm2 = await Farm.create({
      farmer: ayushUser._id,
      name: 'Kisan Samriddhi Agri Farm',
      location: {
        address: 'Survey No. 88, Highway Bypass',
        village: 'Sanwer',
        district: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '453551',
      },
      totalArea: { value: 8, unit: 'Acres' },
      soilType: 'Loamy',
      irrigationType: 'Sprinkler',
      cropsGrown: ['Wheat', 'Chickpeas / Gram'],
      notes: 'Organic farming pilot with crop rotation and rainwater harvesting pond.',
    });

    console.log('[Seed]: Created demo Farms.');

    // 3. Create Crops
    const crop1 = await Crop.create({
      farm: farm1._id,
      farmer: farmerUser._id,
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
        { activityType: 'Fertilizer Application', description: 'Applied split dose of vermicompost & organic booster', cost: 3800, date: new Date('2026-12-15') }
      ],
      notes: 'Excellent canopy coverage, zero aphid infestation observed.',
    });

    const crop2 = await Crop.create({
      farm: farm1._id,
      farmer: farmerUser._id,
      cropName: 'Hybrid Cotton (BT-II)',
      variety: 'RCH-659',
      season: 'Kharif (Monsoon)',
      areaPlanted: { value: 5, unit: 'Acres' },
      plantingDate: new Date('2026-06-20'),
      expectedHarvestDate: new Date('2026-12-15'),
      currentStage: 'Maturity / Ripening',
      healthStatus: 'Good',
      activityLogs: [
        { activityType: 'Weeding', description: 'Intercultural hand-weeding completed across row spacing', cost: 3500, date: new Date('2026-07-30') },
        { activityType: 'Pesticide Spray', description: 'Preventive neem oil spray (10,000 ppm) applied for whitefly control', cost: 1800, date: new Date('2026-09-12') }
      ],
    });

    const crop3 = await Crop.create({
      farm: farm2._id,
      farmer: ayushUser._id,
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
    });

    console.log('[Seed]: Created demo Crops with activity logs.');

    // 4. Create Soil Health Reports
    await SoilReport.create({
      farm: farm1._id,
      farmer: farmerUser._id,
      sampleDate: new Date('2026-10-15'),
      phLevel: 7.2,
      nitrogen: 340,
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
    });

    await SoilReport.create({
      farm: farm2._id,
      farmer: ayushUser._id,
      sampleDate: new Date('2026-10-22'),
      phLevel: 5.8,
      nitrogen: 210,
      phosphorus: 12,
      potassium: 160,
      organicCarbon: 0.42,
      moisture: 18,
      overallScore: 62,
      status: 'Acidic',
      recommendations: [
        { category: 'pH Balance', tip: 'Soil pH is mildly acidic (5.8). Apply 1.2 tons/ha agricultural lime before next season.', priority: 'High' },
        { category: 'Nitrogen (N) Deficiency', tip: 'Nitrogen level is low (210 kg/ha). Apply split application of urea or green manure.', priority: 'High' },
        { category: 'Phosphorus (P) Deficiency', tip: 'Low phosphorus (12 kg/ha). Apply Single Super Phosphate (SSP) at root zone.', priority: 'Medium' }
      ],
    });

    console.log('[Seed]: Created demo Soil Health Reports.');

    // 5. Create Marketplace Resources
    const resources = await Resource.create([
      {
        name: 'Certified Hybrid Wheat Seed (HD-2967)',
        category: 'Seeds',
        brand: 'National Seeds Corp',
        price: 950,
        unit: 'bag (50kg)',
        stockQuantity: 150,
        description: 'Disease-resistant, high-tillering variety ideal for central and north agricultural plains. High protein grain quality.',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=60',
        rating: 4.9,
      },
      {
        name: 'Neem-Coated Urea (Slow Release)',
        category: 'Fertilizers',
        brand: 'IFFCO Agro',
        price: 266,
        unit: 'bag (50kg)',
        stockQuantity: 400,
        description: 'Government-subsidized neem-coated urea for sustained nitrogen availability and minimized nitrogen volatilization losses.',
        imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=600&auto=format&fit=crop&q=60',
        rating: 4.8,
      },
      {
        name: 'Bio-NPK Liquid Consortium (1 Liter)',
        category: 'Fertilizers',
        brand: 'Kisan BioTech',
        price: 450,
        unit: 'liter',
        stockQuantity: 85,
        description: 'Synergistic combination of Nitrogen fixing, Phosphorus solubilizing, and Potassium mobilizing friendly microorganisms.',
        imageUrl: 'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=600&auto=format&fit=crop&q=60',
        rating: 4.7,
      },
      {
        name: 'Cold-Pressed Pure Neem Oil (10,000 PPM)',
        category: 'Bio-Pesticides',
        brand: 'EcoProtect Organic',
        price: 580,
        unit: 'liter',
        stockQuantity: 120,
        description: '100% natural organic broad-spectrum repellent effective against whitefly, aphids, thrips, and leaf miners.',
        imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=60',
        rating: 4.9,
      },
      {
        name: 'Solar Powered Drip Irrigation Starter Kit (1 Acre)',
        category: 'Irrigation Kits',
        brand: 'Jain Precision Irrigation',
        price: 14500,
        unit: 'set',
        stockQuantity: 25,
        description: 'Complete water-saving kit with inline emitters, UV-stabilized mainline pipes, screen filter, and pressure regulator valves.',
        imageUrl: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=60',
        rating: 5.0,
      },
      {
        name: 'Digital Soil NPK & pH Portable Testing Pen',
        category: 'Equipment & Tools',
        brand: 'AgriSensors India',
        price: 1850,
        unit: 'piece',
        stockQuantity: 40,
        description: 'High-accuracy handheld multi-parameter probe for instantaneous on-field measurement of soil pH, EC, and moisture percentage.',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60',
        rating: 4.6,
      },
    ]);

    console.log('[Seed]: Created demo Marketplace Resources.');

    // 6. Create Demo Orders
    await Order.create({
      farmer: farmerUser._id,
      items: [
        {
          resource: resources[0]._id,
          name: resources[0].name,
          quantity: 2,
          price: resources[0].price,
          unit: resources[0].unit,
        },
        {
          resource: resources[3]._id,
          name: resources[3].name,
          quantity: 1,
          price: resources[3].price,
          unit: resources[3].unit,
        },
      ],
      totalAmount: 950 * 2 + 580,
      shippingAddress: {
        fullName: 'Ramesh Patel',
        phone: '+91 91234 56789',
        address: 'Farm House #4, River Road',
        village: 'Khargone Rural',
        district: 'Khargone',
        state: 'Madhya Pradesh',
        pincode: '451001',
      },
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Dispatched',
      statusTimeline: [
        { status: 'Placed', timestamp: new Date(Date.now() - 48 * 3600000), notes: 'Order placed by farmer' },
        { status: 'Processing', timestamp: new Date(Date.now() - 36 * 3600000), notes: 'Packaging confirmed at central warehouse' },
        { status: 'Dispatched', timestamp: new Date(Date.now() - 12 * 3600000), notes: 'In transit via AgriLogistics Express' },
      ],
    });

    console.log('[Seed]: Created demo Orders.');

    // 7. Create Pest Alerts
    await PestAlert.create([
      {
        pestName: 'Fall Armyworm (Spodoptera frugiperda)',
        scientificName: 'Spodoptera frugiperda',
        affectedCrops: ['Maize', 'Sorghum', 'Sweet Corn'],
        severity: 'High',
        symptoms: ['Large ragged whorl feeding holes', 'Sawdust-like frass on inner leaves', 'Boring into young cobs'],
        preventionAdvice: ['Install pheromone traps (5 traps/acre)', 'Intercrop with cowpea or desmodium', 'Conserve beneficial predators like Trichogramma'],
        organicTreatment: 'Spray Bacillus thuringiensis (Bt) kurstaki formulation at 2g/liter or neem kernel extract (5%)',
        chemicalTreatment: 'Chlorantraniliprole 18.5% SC @ 0.4 ml/liter in central leaf whorls',
        affectedRegions: ['Madhya Pradesh', 'Maharashtra', 'Karnataka'],
        active: true,
      },
      {
        pestName: 'Cotton Whitefly (Bemisia tabaci)',
        scientificName: 'Bemisia tabaci',
        affectedCrops: ['Cotton', 'Tomato', 'Chilli', 'Okra'],
        severity: 'Moderate',
        symptoms: ['Yellowing and curling of upper leaves', 'Honeydew secretion leading to black sooty mold', 'Vector for Cotton Leaf Curl Virus (CLCuV)'],
        preventionAdvice: ['Erect yellow sticky cards (15-20/acre) above crop canopy', 'Avoid excessive synthetic nitrogen application'],
        organicTreatment: 'Spray 5 ml/liter pure Cold-Pressed Neem Oil (10,000 PPM) mixed with mild soap emulsifier',
        chemicalTreatment: 'Diafenthiuron 50% WP @ 1g/liter or Spiromesifen 22.9% SC @ 1 ml/liter',
        affectedRegions: ['Khargone', 'Khandwa', 'Barwani', 'Dhar'],
        active: true,
      },
      {
        pestName: 'Yellow Rust / Stripe Rust of Wheat',
        scientificName: 'Puccinia striiformis',
        affectedCrops: ['Wheat', 'Barley'],
        severity: 'High',
        symptoms: ['Linear yellow-orange stripes of powdery spores on leaf blades', 'Stunted plant growth and shrivelled grain formation'],
        preventionAdvice: ['Sow certified rust-resistant seed varieties (HD-2967, PBW-550)', 'Avoid late sowing beyond mid-November'],
        organicTreatment: 'Foliar spray of Panchagavya (3%) or fermented butter-milk (chaas) solution',
        chemicalTreatment: 'Propiconazole 25% EC @ 1 ml/liter at first signs of yellow pustules',
        affectedRegions: ['Indore', 'Ujjain', 'Dewas', 'Sehore'],
        active: true,
      },
    ]);

    console.log('[Seed]: Created demo Pest Alerts.');

    // 8. Create Community Discussions & Expert Consultations
    await ForumPost.create([
      {
        title: 'How can I treat leaf curling in my winter tomato nursery without harsh chemicals?',
        content: 'I noticed whiteflies clustering under the young leaves in my nursery beds. The top leaflets are beginning to cup upwards. What is the safest organic remedy to prevent stunt virus?',
        author: farmerUser._id,
        authorName: 'Ramesh Patel',
        authorRole: 'farmer',
        category: 'Pest Management',
        isExpertConsultation: true,
        status: 'Answered by Expert',
        tags: ['Tomato', 'Organic', 'Whitefly', 'LeafCurl'],
        replies: [
          {
            author: adminUser._id,
            authorName: 'Dr. V. K. Sharma (Senior Agronomist, KVK)',
            authorRole: 'admin',
            content: 'Hello Ramesh. Upward cupping is typically caused by whitefly feeding stress. Immediately hang 12 yellow sticky sheets above the nursery canopy. Spray 5 ml/liter cold-pressed neem oil (10,000 ppm) with 1 ml liquid dish soap in late afternoon. Ensure thorough under-leaf coverage.',
            isExpertReply: true,
            createdAt: new Date(Date.now() - 18 * 3600000),
          },
        ],
        upvotes: 8,
      },
      {
        title: 'Micro-irrigation subsidy under Pradhan Mantri Krishi Sinchayee Yojana (PMKSY) in MP',
        content: 'Can someone share the current portal link and document checklist required to avail the 55% subsidy on drip system installations in Madhya Pradesh?',
        author: ayushUser._id,
        authorName: 'Ayush Birthire',
        authorRole: 'farmer',
        category: 'Government Schemes & Subsidies',
        isExpertConsultation: false,
        status: 'Open',
        tags: ['Subsidy', 'DripIrrigation', 'PMKSY', 'GovernmentScheme'],
        replies: [
          {
            author: farmerUser._id,
            authorName: 'Ramesh Patel',
            authorRole: 'farmer',
            content: 'Ayush, you can apply directly on the MP e-Krishi Anudan portal (dbt.mpdage.org). You will need your Khasra/Khatauni land record, Aadhaar card, electricity connection bill, and bank passbook photocopy.',
            isExpertReply: false,
            createdAt: new Date(Date.now() - 6 * 3600000),
          },
        ],
        upvotes: 14,
      },
    ]);

    console.log('[Seed]: Created demo Community Discussions & Expert Consultations.');

    console.log('\n======================================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!             ');
    console.log('======================================================');
    console.log('Demo Login Credentials:');
    console.log('1. Farmer:  email: farmer@agrismart.org  | pass: farmerpassword123');
    console.log('2. Admin:   email: admin@agrismart.org   | pass: adminpassword123');
    console.log('3. Ayush:   email: ayush@agrismart.org   | pass: ayushpassword123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedDatabase();

