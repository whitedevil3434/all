export interface ScenarioPreset {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  categoryBn: string;
  item: string;
  itemBn: string;
  totalQuantity: string;
  destination: string;
  destinationBn: string;
  dueTime: string;
  dueTimeBn: string;
  primaryActor: {
    name: string;
    nameBn: string;
    role: string;
    roleBn: string;
    location: string;
    quantity: string;
    price: string;
    ratePerUnit: string;
  };
  gapQuantity: string;
  candidates: {
    id: 'karim' | 'mina' | 'faruk';
    name: string;
    nameBn: string;
    quantity: string;
    location: string;
    locationBn: string;
    ratePerUnit: number;
    totalPrice: number;
    rating: string;
    speed: string;
  }[];
  driver: {
    name: string;
    nameBn: string;
    phone: string;
    vehicle: string;
    cost: string;
  };
  escrowTotal: number;
  escrowBreakdown: {
    primary: number;
    secondary: number;
    logistics: number;
  };
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: 'rice-50kg',
    name: '50kg Miniket Rice',
    nameBn: '৫০ কেজি মিনিকেট চাল',
    category: 'Staple Agri Goods',
    categoryBn: 'কৃষি পণ্য',
    item: '৫০ কেজি মিনিকেট চাল',
    itemBn: '৫০ কেজি মিনিকেট চাল',
    totalQuantity: '50kg',
    destination: 'Gulshan-2 Office, Dhaka',
    destinationBn: 'গুলশান-২ অফিস, ঢাকা',
    dueTime: 'Tomorrow 10:00 AM',
    dueTimeBn: 'কাল সকাল ১০:০০ টা',
    primaryActor: {
      name: 'Rahim (Farmer)',
      nameBn: 'রহিম (কৃষক)',
      role: 'Organic Rice Grower',
      roleBn: 'জৈব ধান চাষী',
      location: 'Sherpur Farm',
      quantity: '30kg',
      price: '৳৩,৬০০',
      ratePerUnit: '৳১২০/কেজি',
    },
    gapQuantity: '20kg',
    candidates: [
      {
        id: 'karim',
        name: 'Karim (Mill No. 4)',
        nameBn: 'করিম (মিল নং ৪)',
        quantity: '20kg',
        location: 'Mirpur, Dhaka',
        locationBn: 'মিরপুর, ঢাকা',
        ratePerUnit: 120,
        totalPrice: 2400,
        rating: '4.9 ★',
        speed: 'Ready for pickup in 30 mins',
      },
      {
        id: 'mina',
        name: 'Mina (Mill No. 2)',
        nameBn: 'মিনা (মিল নং ২)',
        quantity: '15kg',
        location: 'Savar, Dhaka',
        locationBn: 'সাভার, ঢাকা',
        ratePerUnit: 125,
        totalPrice: 1875,
        rating: '4.8 ★',
        speed: 'Packed & ready',
      },
      {
        id: 'faruk',
        name: 'Faruk Agro Depot',
        nameBn: 'ফারুক এগ্রো ডিপো',
        quantity: '20kg',
        location: 'Dhanmondi, Dhaka',
        locationBn: 'ধানমন্ডি, ঢাকা',
        ratePerUnit: 125,
        totalPrice: 2500,
        rating: '4.7 ★',
        speed: 'Same-day dispatch',
      },
    ],
    driver: {
      name: 'Tariq Ahmed',
      nameBn: 'তারিক আহমেদ',
      phone: '01712-482910',
      vehicle: 'Covered Van (Dhaka Metro-Ta 11-4821)',
      cost: '৳৮০০',
    },
    escrowTotal: 6800,
    escrowBreakdown: {
      primary: 3600,
      secondary: 2400,
      logistics: 800,
    },
  },
  {
    id: 'mustard-oil-100l',
    name: '100L Cold-Pressed Mustard Oil',
    nameBn: '১০০ লিটার ঘানিভাঙ্গা সরিষার তেল',
    category: 'Edible Oil Supply',
    categoryBn: 'ভোজ্য তেল সরবরাহ',
    item: '১০০ লিটার সরিষার তেল',
    itemBn: '১০০ লিটার খাঁটি সরিষার তেল',
    totalQuantity: '100L',
    destination: 'Banani Central Kitchen, Dhaka',
    destinationBn: 'বনানী সেন্ট্রাল কিচেন, ঢাকা',
    dueTime: 'Today 5:00 PM',
    dueTimeBn: 'আজ বিকাল ৫:০০ টা',
    primaryActor: {
      name: 'Jalal Uddin (Oil Mill)',
      nameBn: 'জালাল উদ্দিন (ঘানি মিল)',
      role: 'Master Presser',
      roleBn: 'ঐতিহ্যবাহী তেল প্রস্তুতকারক',
      location: 'Natore Depot',
      quantity: '60L',
      price: '৳১৩,২০০',
      ratePerUnit: '৳২২০/লিটার',
    },
    gapQuantity: '40L',
    candidates: [
      {
        id: 'karim',
        name: 'Bhai Bhai Oil Depot',
        nameBn: 'ভাই ভাই অয়েল ডিপো',
        quantity: '40L',
        location: 'Pabna Station',
        locationBn: 'পাবনা স্টেশন রোড',
        ratePerUnit: 220,
        totalPrice: 8800,
        rating: '4.9 ★',
        speed: 'Filtered & packed in food-grade drums',
      },
      {
        id: 'mina',
        name: 'Kushtia Mustard House',
        nameBn: 'কুষ্টিয়া সরিষা হাউস',
        quantity: '40L',
        location: 'Kushtia',
        locationBn: 'কুষ্টিয়া বাজার',
        ratePerUnit: 230,
        totalPrice: 9200,
        rating: '4.7 ★',
        speed: 'Available for immediate pickup',
      },
      {
        id: 'faruk',
        name: 'Sirajganj Agro Press',
        nameBn: 'সিরাজগঞ্জ এগ্রো প্রেস',
        quantity: '40L',
        location: 'Sirajganj',
        locationBn: 'সিরাজগঞ্জ ঘাট',
        ratePerUnit: 225,
        totalPrice: 9000,
        rating: '4.8 ★',
        speed: 'Lab tested cold-pressed',
      },
    ],
    driver: {
      name: 'Shafiqul Islam',
      nameBn: 'শফিকুল ইসলাম',
      phone: '01819-334455',
      vehicle: 'Refrigerated Pickup (Dhaka Metro-Ta 14-9912)',
      cost: '৳১,৫০০',
    },
    escrowTotal: 23500,
    escrowBreakdown: {
      primary: 13200,
      secondary: 8800,
      logistics: 1500,
    },
  },
  {
    id: 'oxygen-5cyl',
    name: '5x Medical Oxygen Cylinders',
    nameBn: '৫টি মেডিকেল অক্সিজেন সিলিন্ডার',
    category: 'Emergency Medical Logistics',
    categoryBn: 'জরুরি চিকিৎসা সরবরাহ',
    item: '৫টি জরুরি অক্সিজেন সিলিন্ডার',
    itemBn: '৫টি মেডিকেল গ্রেড অক্সিজেন সিলিন্ডার',
    totalQuantity: '5 Cylinders (46.7L)',
    destination: 'Dhanmondi Care Hospital, Dhaka',
    destinationBn: 'ধানমন্ডি কেয়ার হাসপাতাল, ঢাকা',
    dueTime: 'Urgent: Within 2 Hours',
    dueTimeBn: 'জরুরি: ২ ঘণ্টার মধ্যে',
    primaryActor: {
      name: 'Linde Gas Agent Tongi',
      nameBn: 'লিন্ডে গ্যাস এজেন্ট টঙ্গী',
      role: 'Certified Medical Gas Provider',
      roleBn: 'প্রত্যয়িত মেডিকেল গ্যাস সরবরাহকারী',
      location: 'Tongi Industrial Area',
      quantity: '3 Cylinders',
      price: '৳১২,০০০',
      ratePerUnit: '৳৪,০০০/সিলিন্ডার',
    },
    gapQuantity: '2 Cylinders',
    candidates: [
      {
        id: 'karim',
        name: 'Tejgaon Gas Depot',
        nameBn: 'তেজগাঁও গ্যাস ডিপো',
        quantity: '2 Cylinders',
        location: 'Tejgaon I/A, Dhaka',
        locationBn: 'তেজগাঁও শিল্প এলাকা, ঢাকা',
        ratePerUnit: 4000,
        totalPrice: 8000,
        rating: '5.0 ★',
        speed: 'Pressure certified 150 bar',
      },
      {
        id: 'mina',
        name: 'Mirpur MedSupply Hub',
        nameBn: 'মিরপুর মেডসাপ্লাই হাব',
        quantity: '2 Cylinders',
        location: 'Mirpur-10, Dhaka',
        locationBn: 'মিরপুর-১০, ঢাকা',
        ratePerUnit: 4200,
        totalPrice: 8400,
        rating: '4.9 ★',
        speed: 'Includes regulator set',
      },
      {
        id: 'faruk',
        name: 'Narayanganj Cryo Depot',
        nameBn: 'নারায়ণগঞ্জ ক্রায়ো ডিপো',
        quantity: '2 Cylinders',
        location: 'Narayanganj',
        locationBn: 'নারায়ণগঞ্জ',
        ratePerUnit: 3900,
        totalPrice: 7800,
        rating: '4.8 ★',
        speed: 'Hydrostatic tested cylinder',
      },
    ],
    driver: {
      name: 'Alamgir Hossain',
      nameBn: 'আলমগীর হোসেন',
      phone: '01911-778899',
      vehicle: 'Medical Transit Van (Emergency Beacon)',
      cost: '৳১,২০০',
    },
    escrowTotal: 21200,
    escrowBreakdown: {
      primary: 12000,
      secondary: 8000,
      logistics: 1200,
    },
  },
];
