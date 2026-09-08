import { WorkSpot } from '../types';

export const WORK_SPOTS_DATA: WorkSpot[] = [
  // --- BALI (CANGGU, UBUD, PERERENAN) ---
  {
    id: 'bali-dojo',
    name: 'Dojo Coworking & Garden Pool',
    category: 'coworking',
    city: 'Canggu, Bali',
    country: 'Indonesia',
    lat: -8.6539,
    lng: 115.1294,
    address: 'Jl. Batu Mejan No.88, Echo Beach, Canggu, Bali',
    wifiSpeedMbps: 180,
    wifiSpeedText: '180 Mbps Dual Fiber',
    wifiReliability: 'Ultra Fast (150+ Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Plentiful (Every Seat)',
    noiseLevel: 'Call / Zoom Friendly',
    seatingErgonomics: 'Ergonomic Mesh Chairs',
    airConditioning: true,
    foodAndCoffee: 'Full organic cafe, specialty cold brews, smoothie bowls & lunch specials',
    openingHours: '24/7 Access (Members) · 8:00 AM - 10:00 PM (Day Passes)',
    rating: 4.9,
    reviewCount: 384,
    priceLevel: '$$',
    dayPassUSD: 16,
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    tags: ['Dual Fiber', 'Generator Backup', 'Poolside Desks', 'Skype Booths', 'Ergonomic'],
    reviews: [
      {
        id: 'rev-dojo-1',
        author: 'Marcus Vance',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 5,
        noiseLevel: 'Quiet Focus',
        comment: 'Unbeatable Wi-Fi reliability. Never dropped once during a 3-hour client presentation. The backup generator kicked in seamlessly during a neighborhood outage.',
        date: '3 days ago',
        verifiedNomad: true
      },
      {
        id: 'rev-dojo-2',
        author: 'Sophie Dubois',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 5,
        noiseLevel: 'Zoom Friendly',
        comment: 'The soundproof call booths are a lifesaver for remote meetings. Great community mixers on Thursdays.',
        date: '1 week ago',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'bali-batur',
    name: 'Batur Roastery & Work Loft',
    category: 'cafe',
    city: 'Canggu, Bali',
    country: 'Indonesia',
    lat: -8.6475,
    lng: 115.1382,
    address: 'Jl. Pantai Batu Bolong No.42, Canggu, Bali',
    wifiSpeedMbps: 140,
    wifiSpeedText: '140 Mbps Symmetrical',
    wifiReliability: 'Fast & Stable (80-150 Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Good (Most Tables)',
    noiseLevel: 'Moderate / Cafe Ambience',
    seatingErgonomics: 'Cushioned Cafe Seating',
    airConditioning: true,
    foodAndCoffee: 'Single-origin Kintamani pour-overs, sourdough tartines, oat matcha lattes',
    coffeePriceUSD: '$2.50 Flat White / Long Black',
    specialtyCoffee: 'Single-Origin Kintamani Arabica, V60 Chemex, Nitro Cold Brew on tap, Oatly & Almond milk',
    barAndDrinks: 'House Cold-Pressed Kombucha, Coconut Cold Brews, Iced Ceremonial Matcha, Organic Herbal Tonics',
    popularDishes: ['Smoked Salmon Sourdough Tartine', 'Dragonfruit Superfood Acai Bowl', 'Truffle Scrambled Brioche', 'Banana Walnut Protein Bread'],
    dietaryOptions: ['Vegan Friendly', 'Gluten-Free Bread', 'Oat & Almond Milk'],
    atmosphere: 'Modern Scandinavian-Balinese roastery with dedicated air-conditioned second-floor laptop mezzanine and lo-fi beats',
    openingHours: '7:00 AM - 9:00 PM Daily',
    phone: '+62 812 3456 7890',
    instagram: '@baturroastery',
    rating: 4.8,
    reviewCount: 219,
    priceLevel: '$',
    dayPassUSD: 0,
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      petFriendly: true,
      outdoorSeating: true,
      alcoholServed: false,
      veganFriendly: true,
      creditCardsAccepted: true,
      takeawayAvailable: true,
      roasteryOnSite: true
    },
    tags: ['AC Mezzanine', 'Specialty Roastery', 'Plugs At High Tables', 'Free Work'],
    reviews: [
      {
        id: 'rev-batur-1',
        author: 'Liam Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 5,
        noiseLevel: 'Moderate / Cafe Ambience',
        comment: 'The second-floor loft is dedicated to laptop workers. Air conditioning is ice cold and the pour-over coffee is the best in Canggu.',
        date: 'Yesterday',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'bali-shelter',
    name: 'Shelter Kitchen & Garden Co-dining',
    category: 'restaurant',
    city: 'Canggu, Bali',
    country: 'Indonesia',
    lat: -8.6508,
    lng: 115.1325,
    address: 'Jl. Pantai Pererenan No.133, Canggu, Bali',
    wifiSpeedMbps: 95,
    wifiSpeedText: '95 Mbps Business Line',
    wifiReliability: 'Fast & Stable (80-150 Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Good (Most Tables)',
    noiseLevel: 'Moderate / Cafe Ambience',
    seatingErgonomics: 'Cushioned Cafe Seating',
    airConditioning: false,
    foodAndCoffee: 'Mediterranean woodfired brunch, fresh cold-pressed tonics & protein bowls',
    coffeePriceUSD: '$3.00 Flat White',
    specialtyCoffee: 'Artisanal Bali roasted beans, double shot iced lattes, fresh young coconuts',
    barAndDrinks: 'Natural organic biodynamic wines, aperol spritzes, local island craft beers, fresh citrus tonics',
    popularDishes: ['Woodfired Za’atar Flatbread', 'Burrata & Heirloom Tomatoes', 'Slow Cooked Lamb Shakshuka', 'Chargrilled Octopus & Lemon'],
    dietaryOptions: ['Vegan Friendly', 'Vegetarian', 'Gluten-Free Options'],
    atmosphere: 'Lush tropical bamboo garden canopy with gentle breeze and spacious communal wooden work tables',
    openingHours: '8:00 AM - 10:30 PM Daily',
    phone: '+62 813 9876 5432',
    instagram: '@shelter.bali',
    rating: 4.7,
    reviewCount: 172,
    priceLevel: '$$',
    photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      petFriendly: true,
      outdoorSeating: true,
      alcoholServed: true,
      veganFriendly: true,
      creditCardsAccepted: true
    },
    tags: ['Garden Terrace', 'Healthy Dining', 'Fast WiFi', 'Lunch & Work'],
    reviews: [
      {
        id: 'rev-shelter-1',
        author: 'Emma Wilson',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 4,
        noiseLevel: 'Moderate / Cafe Ambience',
        comment: 'Great spot to do deep work over a long brunch. The staff is happy for you to stay 3+ hours on your laptop.',
        date: '4 days ago',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'bali-the-lawn',
    name: 'The Lawn Beach Lounge & Sunset Bar',
    category: 'bar',
    city: 'Canggu, Bali',
    country: 'Indonesia',
    lat: -8.6560,
    lng: 115.1275,
    address: 'Jl. Pura Dalem, Pantai Batu Bolong, Canggu, Bali',
    wifiSpeedMbps: 110,
    wifiSpeedText: '110 Mbps Beachside Fiber',
    wifiReliability: 'Fast & Stable (80-150 Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Upon Request',
    noiseLevel: 'Bustling',
    seatingErgonomics: 'Lounge / Sofas',
    airConditioning: false,
    foodAndCoffee: 'Artisan cocktails, chilled coconuts, wood-fired pizza & oceanfront tapas',
    coffeePriceUSD: '$3.50 Espresso Tonic / Cold Brew',
    specialtyCoffee: 'Cold Brews on Tap, Espresso Martinis, Iced Coconut Americáno',
    barAndDrinks: 'Signature Beachside Espresso Martinis, Smoked Pineapple Mezcal, Island Craft IPAs, Biodynamic Rosé',
    popularDishes: ['Truffle Parmesan Hand-Cut Fries', 'Tuna Tartare Crisp Wontons', 'Woodfired Margherita Pizza', 'Crispy Calamari Lime Aioli'],
    dietaryOptions: ['Vegetarian Friendly', 'Seafood Specialties', 'Gluten-Free Options'],
    atmosphere: 'Beachfront infinity pool daybeds overlooking world-class surf, transitioning to epic nomad sunset DJ sessions',
    openingHours: '10:00 AM - 11:00 PM Daily',
    phone: '+62 361 335 1055',
    instagram: '@thelawncanggu',
    rating: 4.8,
    reviewCount: 340,
    priceLevel: '$$',
    photoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      petFriendly: true,
      outdoorSeating: true,
      alcoholServed: true,
      creditCardsAccepted: true
    },
    tags: ['Sunset Cocktails', 'Ocean View', 'Pool Deck', 'Nomad Social Hours'],
    reviews: [
      {
        id: 'rev-lawn-1',
        author: 'Julian Cole',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 4,
        noiseLevel: 'Lively',
        comment: 'The go-to spot to wrap up a work afternoon. Close your laptop around 5 PM, order an espresso martini, and network with 50+ nomads watching the sunset.',
        date: '3 days ago',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'bali-tropical',
    name: 'Tropical Nomad Coworking Space',
    category: 'coworking',
    city: 'Canggu, Bali',
    country: 'Indonesia',
    lat: -8.6510,
    lng: 115.1430,
    address: 'Jl. Subak Canggu No.2, Canggu, Bali',
    wifiSpeedMbps: 210,
    wifiSpeedText: '210 Mbps Dedicated Fiber',
    wifiReliability: 'Ultra Fast (150+ Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Plentiful (Every Seat)',
    noiseLevel: 'Silent / Focus',
    seatingErgonomics: 'Ergonomic Mesh Chairs',
    airConditioning: true,
    foodAndCoffee: 'In-house healthy bistro, specialty coffee bar & fresh coconuts',
    openingHours: '24/7 Access for pass holders',
    rating: 4.8,
    reviewCount: 310,
    priceLevel: '$$',
    dayPassUSD: 14,
    photoUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
    tags: ['Ricefield View', 'Silent Room', 'Podcast Studio', '24/7', 'Standing Desks'],
    reviews: [
      {
        id: 'rev-tropical-1',
        author: 'David Meyer',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 5,
        noiseLevel: 'Silent / Focus',
        comment: 'The silent room with ricefield views is unmatched for programming and focused writing. Rock solid 200+ Mbps.',
        date: '5 days ago',
        verifiedNomad: true
      }
    ]
  },

  // --- LISBON (CHIADO, SANTOS, SALDANHA) ---
  {
    id: 'lisbon-second-home',
    name: 'Second Home Lisbon (Mercado da Ribeira)',
    category: 'coworking',
    city: 'Lisbon',
    country: 'Portugal',
    lat: 38.7071,
    lng: -9.1458,
    address: 'Praça Dom Luís I, Mercado da Ribeira, 1200-148 Lisboa',
    wifiSpeedMbps: 250,
    wifiSpeedText: '250 Mbps High Density',
    wifiReliability: 'Ultra Fast (150+ Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Plentiful (Every Seat)',
    noiseLevel: 'Call / Zoom Friendly',
    seatingErgonomics: 'Ergonomic Mesh Chairs',
    airConditioning: true,
    foodAndCoffee: 'Artisanal roastery coffee, wellness teas, adjacent to Time Out Market',
    openingHours: '8:00 AM - 8:00 PM Mon-Fri',
    rating: 4.9,
    reviewCount: 412,
    priceLevel: '$$$',
    dayPassUSD: 28,
    photoUrl: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80',
    tags: ['Indoor Botanical Jungle', 'Time Out Market', 'Phone Booths', 'Fast Fiber'],
    reviews: [
      {
        id: 'rev-sh-1',
        author: 'Camila Santos',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 5,
        noiseLevel: 'Quiet Focus',
        comment: 'A true architectural paradise filled with 1,000+ real plants. Wi-Fi has sub-5ms ping and lightning speeds.',
        date: '2 days ago',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'lisbon-copenhagen',
    name: 'Copenhagen Coffee Lab & Workspace',
    category: 'cafe',
    city: 'Lisbon',
    country: 'Portugal',
    lat: 38.7154,
    lng: -9.1505,
    address: 'Rua Poiais de São Bento 104, 1200-349 Lisboa',
    wifiSpeedMbps: 115,
    wifiSpeedText: '115 Mbps Dedicated Fiber',
    wifiReliability: 'Fast & Stable (80-150 Mbps)',
    hasBackupPower: false,
    powerOutlets: 'Good (Most Tables)',
    noiseLevel: 'Moderate / Cafe Ambience',
    seatingErgonomics: 'Cushioned Cafe Seating',
    airConditioning: true,
    foodAndCoffee: 'Nordic cinnamon rolls, sourdough cardamom buns, flat whites',
    coffeePriceUSD: '€2.80 Flat White / €2.20 Americano',
    specialtyCoffee: 'Nordic Light Roast Single-Origin Ethiopian & Brazilian beans, Batch Brew, V60, Oatly Oat Milk',
    barAndDrinks: 'Freshly squeezed Lisbon orange juice, craft ginger kombucha, organic cold infusions',
    popularDishes: ['Cardamom & Cinnamon Knots', 'Danish Rye Smørrebrød with Avocado', 'Toasted Croissant with Serpa Cheese', 'Granola Greek Yogurt Bowl'],
    dietaryOptions: ['Vegetarian', 'Vegan Pastries Available', 'Oat & Soy Milk'],
    atmosphere: 'Minimalist Scandinavian bakery with brick arches, quiet back laptop work room with power strips',
    openingHours: '7:30 AM - 7:00 PM Daily',
    phone: '+351 21 396 0014',
    instagram: '@cphcoffeelab',
    rating: 4.7,
    reviewCount: 260,
    priceLevel: '$',
    dayPassUSD: 0,
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      petFriendly: true,
      outdoorSeating: true,
      alcoholServed: false,
      veganFriendly: true,
      creditCardsAccepted: true,
      takeawayAvailable: true,
      roasteryOnSite: true
    },
    tags: ['Nordic Bakery', 'Quiet Mornings', 'Nomad Community', 'Outdoor Patio'],
    reviews: [
      {
        id: 'rev-cph-1',
        author: 'Antoine Laurent',
        avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 4,
        noiseLevel: 'Moderate / Cafe Ambience',
        comment: 'Great work tables in the back room with power strips. Best filter coffee in Santos.',
        date: '6 days ago',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'lisbon-honestly',
    name: 'Honest Greens & Remote Lounge',
    category: 'restaurant',
    city: 'Lisbon',
    country: 'Portugal',
    lat: 38.7202,
    lng: -9.1462,
    address: 'Rua Rodrigues Sampaio 52, 1150-281 Lisboa',
    wifiSpeedMbps: 90,
    wifiSpeedText: '90 Mbps Guest Network',
    wifiReliability: 'Fast & Stable (80-150 Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Good (Most Tables)',
    noiseLevel: 'Moderate / Cafe Ambience',
    seatingErgonomics: 'Cushioned Cafe Seating',
    airConditioning: true,
    foodAndCoffee: 'Whole-food plant-forward bowls, charcoal lattes, kombucha on tap',
    coffeePriceUSD: '€2.50 Specialty Latte / €2.00 Espresso',
    specialtyCoffee: 'Fair-trade organic espresso, activated charcoal lattes, golden turmeric matcha',
    barAndDrinks: 'Organic Portuguese craft beer, cold-pressed green juices, draft ginger lemon kombucha',
    popularDishes: ['Warm Ginger Chimichurri Chicken Bowl', 'Wild Mushroom Falafel Market Plate', 'Avocado Hummus Dip with Seed Crackers', 'Plant-Based Salted Caramel Tart'],
    dietaryOptions: ['100% Real Food', 'Keto & Paleo Options', 'Gluten-Free Certified', 'Vegan Friendly'],
    atmosphere: 'Spacious industrial greenhouse with abundant natural skylight, plush banquettes with plugs',
    openingHours: '8:30 AM - 11:00 PM Daily',
    phone: '+351 91 000 7820',
    instagram: '@honestgreens',
    rating: 4.8,
    reviewCount: 390,
    priceLevel: '$$',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      petFriendly: true,
      outdoorSeating: true,
      alcoholServed: true,
      veganFriendly: true,
      creditCardsAccepted: true,
      takeawayAvailable: true
    },
    tags: ['Nutritious Food', 'Spacious Tables', 'No Laptop Restrictions 2-6PM', 'Terrace'],
    reviews: [
      {
        id: 'rev-hg-1',
        author: 'Sara Lindqvist',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 4,
        noiseLevel: 'Moderate / Cafe Ambience',
        comment: 'Perfect afternoon workspace. Plugs under the banquet seating and incredible healthy food.',
        date: '1 week ago',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'lisbon-park-bar',
    name: 'Park Bar & Sunset Nomad Terrace',
    category: 'bar',
    city: 'Lisbon',
    country: 'Portugal',
    lat: 38.7118,
    lng: -9.1451,
    address: 'Calçada do Combro 58, 1200-115 Lisboa',
    wifiSpeedMbps: 85,
    wifiSpeedText: '85 Mbps Rooftop WiFi',
    wifiReliability: 'Fast & Stable (80-150 Mbps)',
    hasBackupPower: false,
    powerOutlets: 'Limited',
    noiseLevel: 'Bustling',
    seatingErgonomics: 'Lounge / Sofas',
    airConditioning: false,
    foodAndCoffee: 'Porto tonics, craft cocktails, burgers and panoramic Tagus River vistas',
    coffeePriceUSD: '€2.50 Espresso / €3.00 Iced Coffee',
    specialtyCoffee: 'Portuguese espresso, iced coffee tonics, fresh mint lemonade',
    barAndDrinks: 'White Port & Tonics, Lisbon Craft Beers, Sangria Pitchers, Passionfruit Caipirinhas',
    popularDishes: ['Artisan Beef & Vegan Brioche Burgers', 'Crispy Sweet Potato Wedges', 'Goat Cheese Crostini with Honey', 'Smoked Olives & Almonds'],
    dietaryOptions: ['Vegetarian Burgers', 'Local Tapas'],
    atmosphere: 'Legendary converted 6th-floor rooftop car park transformed into a lush botanical terrace with 180° river views',
    openingHours: '1:00 PM - 2:00 AM Daily',
    phone: '+351 21 591 4011',
    instagram: '@parklisboa',
    rating: 4.7,
    reviewCount: 420,
    priceLevel: '$$',
    photoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      petFriendly: true,
      outdoorSeating: true,
      alcoholServed: true,
      creditCardsAccepted: true
    },
    tags: ['Rooftop Views', 'Tagus Sunset', 'Cocktails & Burgers', 'Evening Nomad Hub'],
    reviews: [
      {
        id: 'rev-park-1',
        author: 'Duarte Silva',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 4,
        noiseLevel: 'Lively',
        comment: 'Early afternoon (1-4 PM) is surprisingly peaceful with great rooftop breezes for light laptop work. Then it turns into the best sunset spot in Lisbon.',
        date: '4 days ago',
        verifiedNomad: true
      }
    ]
  },

  // --- TOKYO (SHIBUYA, SHINJUKU, ROPPONGI) ---
  {
    id: 'tokyo-shibuya-scramble',
    name: 'SHIBUYA QWS & Innovation Workspace',
    category: 'coworking',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6585,
    lng: 139.7022,
    address: 'Shibuya Scramble Square 15F, 2-24-12 Shibuya, Tokyo',
    wifiSpeedMbps: 380,
    wifiSpeedText: '380 Mbps Ultra Fiber 6E',
    wifiReliability: 'Ultra Fast (150+ Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Plentiful (Every Seat)',
    noiseLevel: 'Silent / Focus',
    seatingErgonomics: 'Ergonomic Mesh Chairs',
    airConditioning: true,
    foodAndCoffee: 'Barista lounge, matcha bar, panoramic 15th floor view over Shibuya Crossing',
    openingHours: '8:00 AM - 10:00 PM Daily',
    rating: 5.0,
    reviewCount: 450,
    priceLevel: '$$$',
    dayPassUSD: 24,
    photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    tags: ['Skyline View', 'Wi-Fi 6E', 'Silent Focus', 'Herman Miller Chairs', 'Standing Desks'],
    reviews: [
      {
        id: 'rev-qws-1',
        author: 'Kenji Takahashi',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 5,
        noiseLevel: 'Silent / Focus',
        comment: 'Ridiculously fast internet (almost 400 Mbps). The view over Tokyo while coding is breathtaking.',
        date: '2 days ago',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'tokyo-fuglen',
    name: 'Fuglen Tokyo Roasters & Workspace',
    category: 'cafe',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6669,
    lng: 139.6934,
    address: '1-16-11 Tomigaya, Shibuya City, Tokyo 151-0063',
    wifiSpeedMbps: 160,
    wifiSpeedText: '160 Mbps Fast Fiber',
    wifiReliability: 'Ultra Fast (150+ Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Good (Most Tables)',
    noiseLevel: 'Moderate / Cafe Ambience',
    seatingErgonomics: 'Cushioned Cafe Seating',
    airConditioning: true,
    foodAndCoffee: 'Oslo-style Nordic filter coffee, freshly baked cardamom knots & craft tonics',
    coffeePriceUSD: '¥650 (~$4.30) Single-Origin Drip',
    specialtyCoffee: 'Nordic Light Roast Kenyas, Ethiopians, AeroPress Championship recipes, Oat Milk Lattes',
    barAndDrinks: 'Evening Norwegian Aquavit Cocktails, Japanese Microbrews, Highballs, Ginger Brew Tonics',
    popularDishes: ['Norwegian Brown Cheese Waffles', 'Cardamom Buns', 'Smoked Salmon Open Toast', 'Matcha Chia Pudding'],
    dietaryOptions: ['Vegetarian Friendly', 'Plant-Based Milk Options'],
    atmosphere: 'Iconic mid-century vintage Scandinavian design, record player jazz, quiet early mornings',
    openingHours: '8:00 AM - 7:00 PM (Cocktails until Midnight)',
    phone: '+81 3-3481-0884',
    instagram: '@fuglentokyo',
    rating: 4.8,
    reviewCount: 320,
    priceLevel: '$$',
    photoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      petFriendly: false,
      outdoorSeating: true,
      alcoholServed: true,
      creditCardsAccepted: true,
      takeawayAvailable: true,
      roasteryOnSite: true
    },
    tags: ['Vintage Midcentury', 'Quiet Morning Vibe', 'Nordic Coffee', 'Tomigaya'],
    reviews: [
      {
        id: 'rev-fuglen-1',
        author: 'Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 5,
        noiseLevel: 'Quiet Focus',
        comment: 'Quiet early mornings between 8 AM and 11 AM are magical for deep creative work. Wi-Fi is super stable and the V60 drip is exceptional.',
        date: '3 days ago',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'tokyo-bar-trench',
    name: 'Bar Trench & Nomad Mixology Salon',
    category: 'bar',
    city: 'Tokyo',
    country: 'Japan',
    lat: 35.6468,
    lng: 139.7093,
    address: '1-5-8 Ebisunishi, Shibuya City, Tokyo 150-0021',
    wifiSpeedMbps: 95,
    wifiSpeedText: '95 Mbps High Density Guest Line',
    wifiReliability: 'Fast & Stable (80-150 Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Limited',
    noiseLevel: 'Moderate / Cafe Ambience',
    seatingErgonomics: 'Lounge / Sofas',
    airConditioning: true,
    foodAndCoffee: 'World’s 50 Best Bars honoree, herbal absinthes, espresso martinis & curated small bites',
    coffeePriceUSD: '¥800 (~$5.20) Barista Espresso Martini',
    specialtyCoffee: 'Craft Cold Brew Negroni, Japanese Green Tea Infusions, Single Estate Espresso',
    barAndDrinks: 'World-renowned herbal bitter cocktails, Japanese craft gin & single malt whiskies',
    popularDishes: ['Truffle Edamame', 'Smoked Duck Breast Pintxos', 'Artisan Dark Chocolate Truffles'],
    dietaryOptions: ['Gluten-Free Snacks', 'Botanical Non-Alcoholic Mocktails'],
    atmosphere: 'Intimate European speakeasy aesthetics in Ebisu, perfect for relaxed evening notebook sketching and unwinding',
    openingHours: '5:00 PM - 2:00 AM Daily',
    phone: '+81 3-3780-5201',
    instagram: '@bar_trench',
    rating: 4.9,
    reviewCount: 380,
    priceLevel: '$$$',
    photoUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      petFriendly: false,
      outdoorSeating: false,
      alcoholServed: true,
      creditCardsAccepted: true
    },
    tags: ['Speakeasy', 'World Top 50', 'Artisan Bitters', 'Ebisu Nightlife'],
    reviews: [
      {
        id: 'rev-trench-1',
        author: 'Liam Chen',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 4,
        noiseLevel: 'Moderate / Cafe Ambience',
        comment: 'Remarkable cocktail craftsmanship. The quiet atmosphere in the early evening is sublime for reflecting on the day’s work.',
        date: '5 days ago',
        verifiedNomad: true
      }
    ]
  },

  // --- MEXICO CITY (ROMA NORTE & CONDESA) ---
  {
    id: 'cdmx-publico',
    name: 'Público Coworking Roma Norte',
    category: 'coworking',
    city: 'Mexico City',
    country: 'Mexico',
    lat: 19.4187,
    lng: -99.1610,
    address: 'Puebla 282, Roma Norte, Cuauhtémoc, 06700 Ciudad de México',
    wifiSpeedMbps: 195,
    wifiSpeedText: '195 Mbps Symmetrical',
    wifiReliability: 'Ultra Fast (150+ Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Plentiful (Every Seat)',
    noiseLevel: 'Call / Zoom Friendly',
    seatingErgonomics: 'Ergonomic Mesh Chairs',
    airConditioning: true,
    foodAndCoffee: 'Rooftop cafe terrace, specialty Mexican Chiapas & Oaxaca beans, mezcal tastings',
    openingHours: '24/7 Access · 8:00 AM - 8:00 PM Staffed',
    rating: 4.9,
    reviewCount: 290,
    priceLevel: '$$',
    dayPassUSD: 15,
    photoUrl: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=800&q=80',
    tags: ['Rooftop Terrace', 'US East Coast Timezone', 'Pet Friendly', 'Soundproof Pods'],
    reviews: [
      {
        id: 'rev-pub-1',
        author: 'Carlos Mendoza',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 5,
        noiseLevel: 'Zoom Friendly',
        comment: 'Best coworking in CDMX. Excellent US-compatible timezone for remote client calls, and the rooftop has great vibes.',
        date: 'Yesterday',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'cdmx-panaderia-rosetta',
    name: 'Cafe Nin & Panadería Work Garden',
    category: 'restaurant',
    city: 'Mexico City',
    country: 'Mexico',
    lat: 19.4292,
    lng: -99.1558,
    address: 'Havre 73, Juárez, Cuauhtémoc, 06600 Ciudad de México',
    wifiSpeedMbps: 85,
    wifiSpeedText: '85 Mbps Fiber',
    wifiReliability: 'Fast & Stable (80-150 Mbps)',
    hasBackupPower: false,
    powerOutlets: 'Good (Most Tables)',
    noiseLevel: 'Moderate / Cafe Ambience',
    seatingErgonomics: 'Cushioned Cafe Seating',
    airConditioning: true,
    foodAndCoffee: 'Guava pastries, artisanal sourdough, cold brews, roasted vegetable salads',
    openingHours: '7:00 AM - 9:00 PM Daily',
    rating: 4.8,
    reviewCount: 380,
    priceLevel: '$$',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    tags: ['World Famous Bakery', 'Quiet Courtyard', 'Work-Friendly AM', 'Charming Decor'],
    reviews: [
      {
        id: 'rev-nin-1',
        author: 'Maya Lin',
        avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 4,
        noiseLevel: 'Moderate / Cafe Ambience',
        comment: 'Sit in the shaded interior courtyard. Great breakfast, reliable Wi-Fi, and very comfortable for a morning sprint.',
        date: '4 days ago',
        verifiedNomad: true
      }
    ]
  },

  // --- CHIANG MAI (NIMMAN) ---
  {
    id: 'cm-punspace',
    name: 'Punspace Coworking Nimman',
    category: 'coworking',
    city: 'Chiang Mai',
    country: 'Thailand',
    lat: 18.7983,
    lng: 98.9686,
    address: '14 Siri Mangkalajarn Lane 7, Suthep, Chiang Mai 50200',
    wifiSpeedMbps: 220,
    wifiSpeedText: '220 Mbps Dual ISP',
    wifiReliability: 'Ultra Fast (150+ Mbps)',
    hasBackupPower: true,
    powerOutlets: 'Plentiful (Every Seat)',
    noiseLevel: 'Silent / Focus',
    seatingErgonomics: 'Ergonomic Mesh Chairs',
    airConditioning: true,
    foodAndCoffee: 'Unlimited Thai single-origin filter coffee, snacks, kitchen facilities',
    openingHours: '24/7 Access (Members) · 9:00 AM - 6:00 PM (Day Passes)',
    rating: 4.9,
    reviewCount: 460,
    priceLevel: '$',
    dayPassUSD: 9,
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    tags: ['24/7', 'Dual ISP', 'Nomad Hub', 'Ergonomic', 'Very Affordable'],
    reviews: [
      {
        id: 'rev-pun-1',
        author: 'Tobias Braun',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 5,
        noiseLevel: 'Silent / Focus',
        comment: 'The legendary birthplace of digital nomad culture. Dirt cheap, rock-solid dual fiber connection, and great silence for coders.',
        date: '3 days ago',
        verifiedNomad: true
      }
    ]
  },
  {
    id: 'cm-roast8ry',
    name: 'Roast8ry Lab & Specialty Coffee',
    category: 'cafe',
    city: 'Chiang Mai',
    country: 'Thailand',
    lat: 18.7961,
    lng: 98.9675,
    address: '14 Nimmanhaemin Soi 3, Suthep, Chiang Mai 50200',
    wifiSpeedMbps: 130,
    wifiSpeedText: '130 Mbps Fiber',
    wifiReliability: 'Fast & Stable (80-150 Mbps)',
    hasBackupPower: false,
    powerOutlets: 'Good (Most Tables)',
    noiseLevel: 'Moderate / Cafe Ambience',
    seatingErgonomics: 'Cushioned Cafe Seating',
    airConditioning: true,
    foodAndCoffee: 'World Latte Art Champion coffee, siphon brews, cold nitrogen espressos',
    coffeePriceUSD: '฿90 (~$2.50) World Champion Flat White',
    specialtyCoffee: 'World Latte Art Championship signature beans, Geisha pour-overs, Nitrogen cold brew on draft, Coconut milk latte',
    barAndDrinks: 'Artisan Espresso Tonics, Chilled Passionfruit Cascara Tea, Fresh Thai Coconuts',
    popularDishes: ['Matcha Burnt Basque Cheesecake', 'Fluffy Japanese Souffle Pancakes', 'Smoked Salmon Croissant Sandwiches', 'Almond Croissant'],
    dietaryOptions: ['Vegetarian Friendly', 'Oat & Soy Milk Available'],
    atmosphere: 'Modern sleek dark laboratory interior with baristas crafting coffee with scientific precision and smooth AC',
    openingHours: '8:00 AM - 5:00 PM Daily',
    phone: '+66 85 530 5360',
    instagram: '@roast8ry',
    rating: 4.9,
    reviewCount: 520,
    priceLevel: '$',
    photoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    photos: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80'
    ],
    features: {
      petFriendly: true,
      outdoorSeating: true,
      alcoholServed: false,
      veganFriendly: true,
      creditCardsAccepted: true,
      takeawayAvailable: true,
      roasteryOnSite: true
    },
    tags: ['World Champion Barista', 'Nimman Hub', 'Fast Fiber', 'Great AC'],
    reviews: [
      {
        id: 'rev-roast-1',
        author: 'Jessica Miller',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        wifiRating: 5,
        noiseLevel: 'Moderate / Cafe Ambience',
        comment: 'Incredible coffee and very fast Wi-Fi. Power outlets along the wall benches.',
        date: '5 days ago',
        verifiedNomad: true
      }
    ]
  }
];

export const CITY_COORDINATE_PRESETS: Record<string, { lat: number; lng: number; label: string; country: string }> = {
  'bali': { lat: -8.6500, lng: 115.1350, label: 'Canggu, Bali', country: 'Indonesia' },
  'lisbon': { lat: 38.7223, lng: -9.1393, label: 'Lisbon', country: 'Portugal' },
  'tokyo': { lat: 35.6580, lng: 139.7016, label: 'Tokyo (Shibuya)', country: 'Japan' },
  'cdmx': { lat: 19.4194, lng: -99.1601, label: 'Mexico City (Roma)', country: 'Mexico' },
  'chiangmai': { lat: 18.7983, lng: 98.9686, label: 'Chiang Mai (Nimman)', country: 'Thailand' },
};

export function findWorkSpotById(id: string): WorkSpot | undefined {
  return WORK_SPOTS_DATA.find((s) => s.id === id);
}

export function searchWorkSpots(query: string): WorkSpot[] {
  const q = query.toLowerCase().trim();
  if (!q) return WORK_SPOTS_DATA;
  return WORK_SPOTS_DATA.filter((s) =>
    s.name.toLowerCase().includes(q) ||
    s.city.toLowerCase().includes(q) ||
    s.foodAndCoffee.toLowerCase().includes(q) ||
    s.tags.some((t) => t.toLowerCase().includes(q)) ||
    (s.specialtyCoffee && s.specialtyCoffee.toLowerCase().includes(q)) ||
    (s.barAndDrinks && s.barAndDrinks.toLowerCase().includes(q)) ||
    s.category.toLowerCase().includes(q)
  );
}
