const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const InventoryMovement = require('../models/InventoryMovement');
const Cart = require('../models/Cart');

const categoriesData = [
  {
    name: 'Soft Toys',
    slug: 'soft-toys',
    description: 'Cuddly teddy bears, plush animals, and ultra-soft huggable friends.',
    image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    iconName: 'Heart',
    color: '#FF786E'
  },
  {
    name: 'Educational Toys',
    slug: 'educational-toys',
    description: 'STEM kits, logic puzzles, coding toys, and brain-boosting fun.',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
    iconName: 'GraduationCap',
    color: '#7657E8'
  },
  {
    name: 'Remote Control Toys',
    slug: 'remote-control-toys',
    description: 'High-speed RC cars, stunt buggies, drones, and rechargeable monster trucks.',
    image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80',
    iconName: 'Radio',
    color: '#62C8F5'
  },
  {
    name: 'Building Blocks',
    slug: 'building-blocks',
    description: 'Magnetic tiles, creative brick sets, towers, and architecture kits.',
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    iconName: 'Blocks',
    color: '#FFD85E'
  },
  {
    name: 'Dolls and Dollhouses',
    slug: 'dolls-and-dollhouses',
    description: 'Fashion dolls, magical miniature dollhouses, accessories, and play sets.',
    image: 'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=600&q=80',
    iconName: 'Sparkles',
    color: '#FF786E'
  },
  {
    name: 'Board Games',
    slug: 'board-games',
    description: 'Classic family board games, strategy games, fast-paced card adventures.',
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80',
    iconName: 'Dices',
    color: '#8EE5BE'
  },
  {
    name: 'Outdoor Toys',
    slug: 'outdoor-toys',
    description: 'Sports sets, water blasters, backyard playsets, and active scooters.',
    image: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=600&q=80',
    iconName: 'Sun',
    color: '#62C8F5'
  },
  {
    name: 'Baby Toys',
    slug: 'baby-toys',
    description: 'BPA-free teething toys, sensory rattles, musical mobiles, and activity gyms.',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    iconName: 'Smile',
    color: '#FFD85E'
  }
];

const sampleProducts = [
  // Soft Toys
  {
    name: 'Barnaby Honey Bear Super Soft Plush',
    categorySlug: 'soft-toys',
    price: 899,
    discountPrice: 699,
    stock: 25,
    ageGroup: '0-2 Years',
    brand: 'CuddleKingdom',
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 38,
    safetyInfo: 'Hypoallergenic plush, securely stitched glass eyes, washable at 30°C.',
    shortDescription: 'Ultra-cuddly 40cm honey bear made with velvety soft fur.',
    description: 'Barnaby is every toddler’s best friend. Crafted from hypoallergenic ultra-fine polyester fibres with reinforced safety stitching. Free from hazardous small parts.',
    images: [
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1556012018-50c5c0da73bf?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Lulu Rainbow Unicorn Giant Pillow Plush',
    categorySlug: 'soft-toys',
    price: 1299,
    discountPrice: 999,
    stock: 14,
    ageGroup: '3-5 Years',
    brand: 'DreamWorks Plush',
    featured: true,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 22,
    safetyInfo: 'Non-shedding pastel velvet, flame retardant filling, baby-safe embroidery.',
    shortDescription: 'Magical 50cm rainbow unicorn with shimmering gold horn.',
    description: 'Delight any child with Lulu the Rainbow Unicorn. Features silky pastel mane, embroidered starry eyes, and plush memory-foam fill.',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Pip the Velvet Elephant with Floppy Ears',
    categorySlug: 'soft-toys',
    price: 749,
    discountPrice: null,
    stock: 19,
    ageGroup: '0-2 Years',
    brand: 'CuddleKingdom',
    featured: false,
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.7,
    reviewCount: 15,
    safetyInfo: 'Organic bamboo-cotton blend exterior, natural non-toxic dyes.',
    shortDescription: 'Charming elephant plush toy with soothing textured ears.',
    description: 'Pip is designed specifically for infant sensory development. The textured floppy ears encourage tactile exploration while soft crinkle sounds engage young ears.',
    images: [
      'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=600&q=80'
    ]
  },

  // Educational Toys
  {
    name: 'WonderSolar 12-in-1 Robot STEM Building Kit',
    categorySlug: 'educational-toys',
    price: 1799,
    discountPrice: 1449,
    stock: 18,
    ageGroup: '6-8 Years',
    brand: 'STEMGenius',
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 47,
    safetyInfo: 'Solar-powered with no toxic batteries. Certified BPA-free ABS plastic parts.',
    shortDescription: 'Build 12 unique moving robots powered directly by clean solar energy.',
    description: 'Ignite future engineers! This complete kit includes gears, solar panel module, and 190 durable building pieces. Children can build swimming turtles, crawling beetles, rovers, and walking robots.',
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Interactive Talking World Map & Audio Globe',
    categorySlug: 'educational-toys',
    price: 2499,
    discountPrice: 1999,
    stock: 12,
    ageGroup: '6-8 Years',
    brand: 'STEMGenius',
    featured: true,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 31,
    safetyInfo: 'Low-volume smart speaker limiter to protect children hearing.',
    shortDescription: 'Explore 195 countries, capitals, landmarks, and animals with a touch.',
    description: 'Tap any continent or country to hear fascinating national anthems, geographical trivia, wildlife facts, and bilingual greetings.',
    images: [
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Magnetic Wooden Alphabet & Math Balance Maze',
    categorySlug: 'educational-toys',
    price: 999,
    discountPrice: 799,
    stock: 30,
    ageGroup: '3-5 Years',
    brand: 'EcoPlay Studio',
    featured: false,
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.6,
    reviewCount: 19,
    safetyInfo: 'Certified FSC sustainable birch wood, organic water-based paint.',
    shortDescription: 'Montessori-inspired wooden counting and letter recognition board.',
    description: 'Develop hand-eye coordination, color matching, and early number fluency. Includes magnetic stylus wand and enclosed transparent shatterproof shield.',
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80'
    ]
  },

  // Remote Control Toys
  {
    name: 'NitroX 4WD All-Terrain Rock Crawler RC Truck',
    categorySlug: 'remote-control-toys',
    price: 2299,
    discountPrice: 1899,
    stock: 22,
    ageGroup: '6-8 Years',
    brand: 'SpeedViper',
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 54,
    safetyInfo: 'Shock-proof crash bumpers and USB rechargeable battery with overheat shutoff.',
    shortDescription: 'High-torque dual motors with 2.4GHz interference-free long range control.',
    description: 'Conquer grass, gravel, mud, and rocky slopes! With independent suspension shocks, high-traction rubber treads, and responsive pistol-grip transmitter.',
    images: [
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'AeroSky Gesture-Controlled Mini Hover Drone',
    categorySlug: 'remote-control-toys',
    price: 1599,
    discountPrice: 1299,
    stock: 15,
    ageGroup: '9-12 Years',
    brand: 'SpeedViper',
    featured: false,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 28,
    safetyInfo: 'Full 360-degree enclosed cage protects little fingers from spinning propellers.',
    shortDescription: 'Fly with intuitive hand motions using smart infrared sensor watch.',
    description: 'Do flips and tricks in mid-air! Features altitude hold, emergency stop, and dazzling multi-color LED night lights for bedroom flight adventures.',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Cyclone Stunt Car 360 Rotating Racer',
    categorySlug: 'remote-control-toys',
    price: 1199,
    discountPrice: 899,
    stock: 35,
    ageGroup: '3-5 Years',
    brand: 'SpeedViper',
    featured: false,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 41,
    safetyInfo: 'Shatter-resistant body and rounded edges tested for toddler safety.',
    shortDescription: 'Performs crazy spins, flips over walls, and continues driving inverted!',
    description: 'Double-sided driving mechanism means it never gets stuck! Features light-up transparent wheels and pumping techno music toggles.',
    images: [
      'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80'
    ]
  },

  // Building Blocks
  {
    name: 'MagnaTiles 100-Piece 3D Deluxe Magnetic Castles',
    categorySlug: 'building-blocks',
    price: 2199,
    discountPrice: 1799,
    stock: 16,
    ageGroup: '3-5 Years',
    brand: 'BlockCraft',
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 5.0,
    reviewCount: 65,
    safetyInfo: 'Sonic-welded rivets prevent loose magnets. Non-toxic, lead-free food-grade ABS.',
    shortDescription: 'Vibrant translucent magnetic geometric shapes for limitless towers.',
    description: 'The premier open-ended toy loved by parents and preschool teachers! Kids naturally learn geometric symmetry, architectural stability, and color mixing in sunlight.',
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Galactic Spaceship & Space Station 850pc Block Set',
    categorySlug: 'building-blocks',
    price: 2799,
    discountPrice: 2299,
    stock: 8,
    ageGroup: '9-12 Years',
    brand: 'BlockCraft',
    featured: true,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 33,
    safetyInfo: 'Compatible with standard major brick brands. Strict ASTM quality certified.',
    shortDescription: 'Detailed deep-space explorer ship with launch pad and 4 astronaut figures.',
    description: 'Features opening cockpit, cargo bay with rover deployer, solar panel array, and illuminated engine thruster blocks.',
    images: [
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Junior Builders Chunky Wooden Town & Train Track',
    categorySlug: 'building-blocks',
    price: 1699,
    discountPrice: 1399,
    stock: 20,
    ageGroup: '3-5 Years',
    brand: 'EcoPlay Studio',
    featured: false,
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.7,
    reviewCount: 24,
    safetyInfo: 'Smooth-sanded solid beech wood, no splinters, organic beeswax polish.',
    shortDescription: '50-piece railway loop with wooden locomotive, houses, trees, and bridges.',
    description: 'Classic heirloom-quality train set that connects easily with magnetic couplers. Provides hours of imaginative town-building play.',
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80'
    ]
  },

  // Dolls and Dollhouses
  {
    name: 'Victorian 3-Story Wooden Dream Dollhouse with Furniture',
    categorySlug: 'dolls-and-dollhouses',
    price: 3499,
    discountPrice: 2999,
    stock: 6,
    ageGroup: '3-5 Years',
    brand: 'WonderHaven',
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 42,
    safetyInfo: 'Sturdy engineered wood construction, non-toxic water-based paints.',
    shortDescription: 'Handcrafted 70cm tall doll mansion with 18 mini wooden furniture pieces.',
    description: 'Includes working elevator, opening balcony doors, LED ceiling chandeliers, and cozy living room, kitchen, bedroom, and bathroom suite.',
    images: [
      'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Aria the Ballerina Poseable Art Doll with Wardrobe',
    categorySlug: 'dolls-and-dollhouses',
    price: 1199,
    discountPrice: 949,
    stock: 24,
    ageGroup: '6-8 Years',
    brand: 'WonderHaven',
    featured: false,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 19,
    safetyInfo: 'Soft vinyl skin, rooted brushable hair, tested free of phthalates.',
    shortDescription: 'Articulated joints allow real ballet poses! Includes 3 satin costumes.',
    description: 'Aria has 14 points of articulation for graceful arabesques and pirouettes. Comes with pink tulle tutu, practice leotard, satin slippers, and vanity mirror.',
    images: [
      'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'My Cozy Cottage Portable Wooden Doll Villa',
    categorySlug: 'dolls-and-dollhouses',
    price: 1499,
    discountPrice: null,
    stock: 15,
    ageGroup: '3-5 Years',
    brand: 'WonderHaven',
    featured: false,
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.7,
    reviewCount: 14,
    safetyInfo: 'Integrated brass carry handle with safety latch, smoothed rounded corners.',
    shortDescription: 'Fold-and-go doll cottage with 2 wooden family figures and playful pet.',
    description: 'Folds shut neatly to store all furnishings inside. Perfect for holidays, playdates, and visits to grandparents.',
    images: [
      'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?auto=format&fit=crop&w=600&q=80'
    ]
  },

  // Board Games
  {
    name: 'Dragon Quest: The Magical Kingdom Family Board Game',
    categorySlug: 'board-games',
    price: 1299,
    discountPrice: 999,
    stock: 28,
    ageGroup: '6-8 Years',
    brand: 'PlayMinds',
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 52,
    safetyInfo: 'Recycled cardboard tiles, large wooden player tokens, non-toxic inks.',
    shortDescription: 'Cooperative strategy game where players team up to rescue the crystal egg!',
    description: 'Easy to learn for young kids yet deeply engaging for adults. Encourages collaboration, communication, and decision-making instead of conflict.',
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Speedy Safari Fast Action Animal Card Game',
    categorySlug: 'board-games',
    price: 499,
    discountPrice: 399,
    stock: 45,
    ageGroup: '3-5 Years',
    brand: 'PlayMinds',
    featured: false,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.6,
    reviewCount: 18,
    safetyInfo: 'Laminated spill-resistant cards with smooth rounded corners.',
    shortDescription: 'Fast-paced matching and reflex game for 2 to 6 players.',
    description: 'Spot matching jungle animals before anyone else! Fantastic for quick reflexes, focus, pattern recognition, and loads of giggles.',
    images: [
      'https://images.unsplash.com/photo-1606167668584-78701c57f13d?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Smart Chess & Checkers Deluxe Wooden 2-in-1 Board',
    categorySlug: 'board-games',
    price: 1399,
    discountPrice: 1099,
    stock: 17,
    ageGroup: '9-12 Years',
    brand: 'PlayMinds',
    featured: false,
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 30,
    safetyInfo: 'Carved solid rosewood pieces with felted bottoms to prevent scratching.',
    shortDescription: 'Folding magnetic travel chess set with handcrafted wooden pieces.',
    description: 'Learn strategic foresight and patience. Storage compartments inside fold-out board keep every piece organized and secure.',
    images: [
      'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=600&q=80'
    ]
  },

  // Outdoor Toys
  {
    name: 'GlideSpeed 3-Wheel LED Light-Up Kick Scooter',
    categorySlug: 'outdoor-toys',
    price: 2199,
    discountPrice: 1799,
    stock: 14,
    ageGroup: '3-5 Years',
    brand: 'TurboGlide',
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 48,
    safetyInfo: 'Lean-to-steer technology, anti-slip wide deck, and instant rear fender brake.',
    shortDescription: 'Smooth PU wheels light up brightly as they roll—no batteries needed!',
    description: 'Adjustable handlebar height grows with your child (ages 3 to 10). Lean-to-steer mechanism promotes natural balance, motor skills, and confidence.',
    images: [
      'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'HydroBlaster Mega Super Soaker Water Gun with Dual Nozzles',
    categorySlug: 'outdoor-toys',
    price: 799,
    discountPrice: 599,
    stock: 32,
    ageGroup: '6-8 Years',
    brand: 'TurboGlide',
    featured: false,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.7,
    reviewCount: 26,
    safetyInfo: 'Child-safe water pressure output, leak-proof screw cap design.',
    shortDescription: 'Pump-action blaster shoots twin streams of water up to 10 meters away.',
    description: 'Beat summer heat with backyard water battles! 1200ml high-capacity reservoir means less refilling and nonstop splash fun.',
    images: [
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Junior Pop-Up Badminton & Tennis Set with Soft Balls',
    categorySlug: 'outdoor-toys',
    price: 1099,
    discountPrice: null,
    stock: 21,
    ageGroup: '6-8 Years',
    brand: 'TurboGlide',
    featured: false,
    isBestSeller: false,
    isNewArrival: false,
    rating: 4.6,
    reviewCount: 16,
    safetyInfo: 'Ultra-lightweight foam wrapped frames and soft low-impact foam balls.',
    shortDescription: 'Portable instant lawn and beach racket sports kit with sturdy net.',
    description: 'Sets up in less than 2 minutes on grass, sand, or patio. Includes 2 oversized rackets, 2 shuttlecocks, 2 soft tennis balls, and carry duffel bag.',
    images: [
      'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=600&q=80'
    ]
  },

  // Baby Toys
  {
    name: 'Sensory Symphony Musical Soft Activity Cube',
    categorySlug: 'baby-toys',
    price: 899,
    discountPrice: 699,
    stock: 26,
    ageGroup: '0-2 Years',
    brand: 'BabySprout',
    featured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 39,
    safetyInfo: 'Certified 100% BPA, PVC, Phthalate-Free silicone teethers and plush cotton.',
    shortDescription: '6 sides of discovery with baby-safe mirror, rattle, bell, and textures.',
    description: 'Designed to soothe sore gums and stimulate sensory development. Includes crinkle leaves, squeaker button, silicone teething ring, and high-contrast ribbons.',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Rainbow Nesting Stacking Rings & Musical Stacker',
    categorySlug: 'baby-toys',
    price: 649,
    discountPrice: 499,
    stock: 33,
    ageGroup: '0-2 Years',
    brand: 'BabySprout',
    featured: false,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.8,
    reviewCount: 44,
    safetyInfo: 'Food-grade silicone rings, dishwasher safe, no small removable parts.',
    shortDescription: 'Soft tactile rings of varying sizes that play pleasant chime when stacked.',
    description: 'Helps babies grasp concepts of relative size, stacking balance, color identification, and fine motor grip strength.',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    name: 'Dreamy Stars Crib Projector & White Noise Lullaby Machine',
    categorySlug: 'baby-toys',
    price: 1599,
    discountPrice: 1249,
    stock: 12,
    ageGroup: '0-2 Years',
    brand: 'BabySprout',
    featured: false,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 27,
    safetyInfo: 'Auto-timer shutoff (15/30/60 min) and soft glow eye-safe LED projection.',
    shortDescription: 'Projects rotating starlight constellations while playing gentle womb sounds.',
    description: 'Helps infants drift peacefully into deep sleep. Includes 10 soothing melodies, heartbeat sounds, rainfall white noise, and cry-activated sensor.',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80'
    ]
  }
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/toywonder';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    await Coupon.deleteMany();
    await InventoryMovement.deleteMany();
    await Cart.deleteMany();

    console.log('Creating Admin & Customer users...');
    const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
    const customerPasswordHash = await bcrypt.hash('Customer@123', 10);

    const adminUser = await User.create({
      name: 'ToyWonder Admin',
      email: 'admin@toywonder.com',
      passwordHash: adminPasswordHash,
      phone: '+91 98765 43210',
      role: 'admin',
      accountStatus: 'active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    });

    const customer1 = await User.create({
      name: 'Alice Sharma',
      email: 'alice@example.com',
      passwordHash: customerPasswordHash,
      phone: '+91 91234 56789',
      role: 'customer',
      accountStatus: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      addresses: [
        {
          fullName: 'Alice Sharma',
          phone: '+91 91234 56789',
          street: 'Flat 402, Lotus Blossom Residency, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: true
        }
      ]
    });

    const customer2 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      passwordHash: customerPasswordHash,
      phone: '+91 98989 12345',
      role: 'customer',
      accountStatus: 'active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      addresses: [
        {
          fullName: 'Rahul Verma',
          phone: '+91 98989 12345',
          street: '15, Gulmohar Enclave, Malviya Nagar',
          city: 'New Delhi',
          state: 'Delhi',
          postalCode: '110017',
          country: 'India',
          isDefault: true
        }
      ]
    });

    console.log('Seeding 8 Categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log(`Seeding ${sampleProducts.length} Products...`);
    const createdProducts = [];
    let skuCounter = 101;

    for (const item of sampleProducts) {
      const categoryId = categoryMap[item.categorySlug];
      const sku = `TW-${skuCounter++}`;
      const slug = `${slugify(item.name, { lower: true, strict: true })}-${sku.toLowerCase()}`;

      const prod = await Product.create({
        name: item.name,
        slug,
        description: item.description,
        shortDescription: item.shortDescription,
        images: item.images,
        category: categoryId,
        brand: item.brand,
        SKU: sku,
        price: item.price,
        discountPrice: item.discountPrice,
        stock: item.stock,
        ageGroup: item.ageGroup,
        rating: item.rating,
        reviewCount: item.reviewCount,
        featured: item.featured,
        isBestSeller: item.isBestSeller,
        isNewArrival: item.isNewArrival,
        safetyInfo: item.safetyInfo,
        specifications: {
          material: item.categorySlug === 'soft-toys' ? 'Plush Polyester / Hypoallergenic' : 'Eco-Friendly ABS / Wooden',
          dimensions: 'Standard toy dimensions',
          weight: '450g',
          batteryRequired: item.categorySlug === 'remote-control-toys' ? 'Rechargeable (Included)' : 'No',
          origin: 'India'
        },
        active: true
      });

      createdProducts.push(prod);

      // Record seed inventory movement
      await InventoryMovement.create({
        product: prod._id,
        movementType: 'initial_seed',
        quantity: prod.stock,
        previousStock: 0,
        newStock: prod.stock,
        reference: 'Initial catalog seed',
        performedBy: adminUser._id
      });
    }

    console.log('Seeding Promotional Coupons...');
    await Coupon.insertMany([
      {
        code: 'WONDER20',
        description: '20% off on all toy orders over ₹500',
        discountType: 'percentage',
        discountValue: 20,
        minimumOrderValue: 500,
        maxDiscountAmount: 400,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 1000,
        usageCount: 14,
        active: true
      },
      {
        code: 'TOYFEST100',
        description: 'Flat ₹100 instant cash discount on orders above ₹799',
        discountType: 'fixed',
        discountValue: 100,
        minimumOrderValue: 799,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 500,
        usageCount: 22,
        active: true
      },
      {
        code: 'SUPERKID',
        description: '15% off for young champions, min order ₹300',
        discountType: 'percentage',
        discountValue: 15,
        minimumOrderValue: 300,
        maxDiscountAmount: 300,
        expiryDate: new Date('2028-12-31'),
        usageLimit: 1000,
        usageCount: 8,
        active: true
      }
    ]);

    console.log('Seeding Sample Customer Reviews...');
    await Review.insertMany([
      {
        user: customer1._id,
        product: createdProducts[0]._id, // Barnaby Honey Bear
        rating: 5,
        comment: 'My 2-year-old daughter cannot sleep without Barnaby! The plush fur is unbelievably soft and high quality.',
        verifiedPurchase: true
      },
      {
        user: customer2._id,
        product: createdProducts[3]._id, // WonderSolar 12-in-1 Robot
        rating: 5,
        comment: 'Fantastic STEM kit! We assembled the turtle and rover together over the weekend. Highly educational!',
        verifiedPurchase: true
      },
      {
        user: customer1._id,
        product: createdProducts[9]._id, // MagnaTiles
        rating: 5,
        comment: 'The best magnetic tiles on the market. Super sturdy magnets and gorgeous bright colors when sunlight hits them.',
        verifiedPurchase: true
      }
    ]);

    console.log('Seeding Demo Orders for Admin Dashboard charts...');
    const demoOrders = [
      {
        orderNumber: 'TW-DEMO-1001',
        user: customer1._id,
        items: [
          {
            product: createdProducts[0]._id,
            name: createdProducts[0].name,
            image: createdProducts[0].images[0],
            price: createdProducts[0].discountPrice || createdProducts[0].price,
            quantity: 1,
            subtotal: createdProducts[0].discountPrice || createdProducts[0].price
          },
          {
            product: createdProducts[9]._id,
            name: createdProducts[9].name,
            image: createdProducts[9].images[0],
            price: createdProducts[9].discountPrice || createdProducts[9].price,
            quantity: 1,
            subtotal: createdProducts[9].discountPrice || createdProducts[9].price
          }
        ],
        shippingAddress: customer1.addresses[0],
        subtotal: 2498,
        discount: 200,
        shippingFee: 0,
        total: 2298,
        paymentMethod: 'Razorpay',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'Pending', note: 'Order placed', changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { status: 'Confirmed', note: 'Payment received', changedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { status: 'Shipped', note: 'Dispatched via Express Courier', changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { status: 'Delivered', note: 'Delivered to customer', changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        orderNumber: 'TW-DEMO-1002',
        user: customer2._id,
        items: [
          {
            product: createdProducts[3]._id,
            name: createdProducts[3].name,
            image: createdProducts[3].images[0],
            price: createdProducts[3].discountPrice || createdProducts[3].price,
            quantity: 1,
            subtotal: createdProducts[3].discountPrice || createdProducts[3].price
          }
        ],
        shippingAddress: customer2.addresses[0],
        subtotal: 1449,
        discount: 100,
        shippingFee: 0,
        total: 1349,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Shipped',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        statusHistory: [
          { status: 'Confirmed', note: 'Cash on delivery order confirmed', changedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { status: 'Shipped', note: 'In transit to New Delhi hub', changedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) }
        ]
      },
      {
        orderNumber: 'TW-DEMO-1003',
        user: customer1._id,
        items: [
          {
            product: createdProducts[6]._id, // NitroX RC
            name: createdProducts[6].name,
            image: createdProducts[6].images[0],
            price: createdProducts[6].discountPrice || createdProducts[6].price,
            quantity: 1,
            subtotal: createdProducts[6].discountPrice || createdProducts[6].price
          }
        ],
        shippingAddress: customer1.addresses[0],
        subtotal: 1899,
        discount: 0,
        shippingFee: 0,
        total: 1899,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Confirmed',
        createdAt: new Date(),
        statusHistory: [
          { status: 'Confirmed', note: 'Order confirmed and packed', changedAt: new Date() }
        ]
      }
    ];

    await Order.insertMany(demoOrders);

    console.log('✅ SEEDING COMPLETE!');
    console.log('=============================================');
    console.log('Admin Account:    admin@toywonder.com  / Admin@123');
    console.log('Customer Account: alice@example.com    / Customer@123');
    console.log('Customer Account: rahul@example.com    / Customer@123');
    console.log(`Products Seeded:  ${createdProducts.length}`);
    console.log(`Categories:       ${createdCategories.length}`);
    console.log('Coupons:          WONDER20, TOYFEST100, SUPERKID');
    console.log('=============================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seeding Error:', err);
    process.exit(1);
  }
};

seedData();
