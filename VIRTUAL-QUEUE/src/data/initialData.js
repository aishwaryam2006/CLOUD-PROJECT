// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
// This will be replaced by Azure Cosmos DB calls when you integrate Azure

export const EMOJI_MAP = {
  Food: '🍱', Juice: '🥤', Snacks: '🍿', Coffee: '☕',
  'South Indian': '🍛', 'North Indian': '🥘', Chinese: '🍜', Bakery: '🥐',
};

export const INITIAL_CAFETERIAS = [
  { id: 1, name: 'Campus Kitchen',  type: 'Food',   emoji: '🍱', open: true,  vendorId: 'v1', description: 'Main cafeteria — hot meals all day' },
  { id: 2, name: 'Juice Junction',  type: 'Juice',  emoji: '🥤', open: true,  vendorId: 'v2', description: 'Fresh fruit juices & smoothies' },
  { id: 3, name: 'Snack Shack',     type: 'Snacks', emoji: '🍿', open: true,  vendorId: null, description: 'Quick bites & evening snacks' },
  { id: 4, name: 'Coffee Corner',   type: 'Coffee', emoji: '☕', open: false, vendorId: null, description: 'Coffee & light pastries' },
];

export const INITIAL_MENUS = {
  1: [
    { id: 101, name: 'Veg Thali',       desc: 'Rice, dal, sabzi, roti, salad',     price: 60, category: 'Food',   emoji: '🍱', available: true  },
    { id: 102, name: 'Sambar Rice',      desc: 'South Indian comfort food',          price: 40, category: 'Food',   emoji: '🍛', available: true  },
    { id: 103, name: 'Egg Biryani',      desc: 'Aromatic rice with boiled eggs',     price: 70, category: 'Food',   emoji: '🥘', available: true  },
    { id: 104, name: 'Chapati + Curry',  desc: '2 chapatis with veg curry',          price: 35, category: 'Food',   emoji: '🫓', available: false },
  ],
  2: [
    { id: 201, name: 'Mango Shake',      desc: 'Fresh mango blended with milk',      price: 45, category: 'Juice',  emoji: '🥭', available: true  },
    { id: 202, name: 'Lemon Soda',       desc: 'Fresh lime + sparkling water',       price: 25, category: 'Juice',  emoji: '🍋', available: true  },
    { id: 203, name: 'Watermelon Juice', desc: 'Chilled fresh watermelon',           price: 30, category: 'Juice',  emoji: '🍉', available: true  },
  ],
  3: [
    { id: 301, name: 'Masala Maggi',     desc: 'Spicy noodles with vegetables',      price: 30, category: 'Snacks', emoji: '🍜', available: true  },
    { id: 302, name: 'Vada Pav',         desc: 'Mumbai street style classic',        price: 20, category: 'Snacks', emoji: '🫔', available: true  },
    { id: 303, name: 'Paneer Sandwich',  desc: 'Grilled with mint chutney',          price: 40, category: 'Snacks', emoji: '🥪', available: true  },
  ],
  4: [
    { id: 401, name: 'Filter Coffee',    desc: 'South Indian decoction',             price: 20, category: 'Coffee', emoji: '☕', available: true  },
    { id: 402, name: 'Croissant',        desc: 'Buttery flaky pastry',               price: 35, category: 'Coffee', emoji: '🥐', available: false },
  ],
};

export const INITIAL_USERS = [
  { id: 'v1', name: 'Rajan Kumar',  email: 'rajan@college.edu',  password: '1234', role: 'vendor',  shopName: 'Campus Kitchen', shopType: 'Food',  cafeId: 1, rollNo: '' },
  { id: 'v2', name: 'Priya S',      email: 'priya@college.edu',  password: '1234', role: 'vendor',  shopName: 'Juice Junction', shopType: 'Juice', cafeId: 2, rollNo: '' },
  { id: 's1', name: 'Arjun M',      email: 'arjun@college.edu',  password: '1234', role: 'student', shopName: '',               shopType: '',      cafeId: null, rollNo: '20CS001' },
];
