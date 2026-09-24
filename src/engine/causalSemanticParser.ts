// C-Link Semantic Action & Natural Language Parser
// Supports both English & Bengali (বাংলা) natural language inputs for C-Link Reality Loops

export interface ParsedWant {
  item: string;
  quantity: string;
  destination: string;
  dueTime: string;
  committedAmount?: string;
  gapAmount?: string;
  committedActor?: string;
  committedPrice?: string;
}

export type CausalActionType =
  | 'MATERIALIZE_WANT'
  | 'INQUIRE_SUPPLY'
  | 'ACCEPT_OFFER'
  | 'DECLINE_OFFER'
  | 'ASSIGN_LOGISTICS'
  | 'VERIFY_PROOF'
  | 'SETTLE_REALITY'
  | 'EXPLAIN_BLOCKAGE'
  | 'SWITCH_SCOPE_RAHIM'
  | 'SWITCH_SCOPE_TARIQ'
  | 'SWITCH_SCOPE_COORDINATOR'
  | 'SWITCH_DESKTOP_TOPOLOGY'
  | 'RESET_REALITY'
  | 'SHOW_CANDIDATES'
  | 'UNIVERSAL_INTENT';

export interface ParsedSemanticResult {
  action: CausalActionType;
  actorName?: string;
  targetCandidate?: 'karim' | 'mina' | 'faruk';
  wantData?: ParsedWant;
  explanationBn?: string;
  explanationEn?: string;
  rawQuery: string;
}

// Helper to convert Bengali numbers to English
export function bengaliToEnglishDigits(str: string): string {
  const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[০-৯]/g, (char) => bn.indexOf(char).toString());
}

export function parseCausalSemanticQuery(input: string): ParsedSemanticResult {
  const raw = input.trim();
  const normalized = bengaliToEnglishDigits(raw.toLowerCase());

  // 1. Reset
  if (
    normalized.includes('reset') ||
    normalized.includes('empty') ||
    normalized.includes('রিসেট') ||
    normalized.includes('শুরু') ||
    normalized.includes('নতুন') ||
    normalized.includes('clear')
  ) {
    return {
      action: 'RESET_REALITY',
      rawQuery: raw,
      explanationEn: '✦ Reality cleared to initial empty state.',
      explanationBn: '✦ বাস্তবতা প্রাথমিক শূন্য অবস্থায় ফিরিয়ে নেওয়া হয়েছে।',
    };
  }

  // 2. Explanations / Blockers
  if (
    normalized.includes('blocked') ||
    normalized.includes('why') ||
    normalized.includes('karon') ||
    normalized.includes('কারন') ||
    normalized.includes('কারণ') ||
    normalized.includes('আটকে') ||
    normalized.includes('সমস্যা') ||
    normalized.includes('কেন') ||
    normalized.includes('block')
  ) {
    return {
      action: 'EXPLAIN_BLOCKAGE',
      rawQuery: raw,
      explanationEn: '✦ Inspecting causal dependency frontier...',
      explanationBn: '✦ কজাল নির্ভরতার বাধা পরীক্ষা করা হচ্ছে...',
    };
  }

  // 3. Desktop Topology
  if (
    normalized.includes('desktop') ||
    normalized.includes('topology') ||
    normalized.includes('ডেস্কটপ') ||
    normalized.includes('টপোলজি') ||
    normalized.includes('ওয়ার্কস্পেস')
  ) {
    return {
      action: 'SWITCH_DESKTOP_TOPOLOGY',
      rawQuery: raw,
      explanationEn: '✦ Switching to Desktop Horizontal Causal Topology.',
      explanationBn: '✦ ডেস্কটপ কজাল টপোলজিতে প্রবেশ করা হচ্ছে।',
    };
  }

  // 4. Actor Scopes
  if (
    normalized.includes('rahim') ||
    normalized.includes('রহিম') ||
    normalized.includes('কৃষক') ||
    normalized.includes('farmer')
  ) {
    return {
      action: 'SWITCH_SCOPE_RAHIM',
      rawQuery: raw,
      explanationEn: "✦ Scoped to Rahim's causal responsibility.",
      explanationBn: '✦ রহিমের দায়িত্বের প্রজেকশনে স্যুইচ করা হয়েছে।',
    };
  }

  if (
    normalized.includes('tariq') ||
    normalized.includes('driver') ||
    normalized.includes('তারিক') ||
    normalized.includes('ড্রাইভার') ||
    normalized.includes('van') ||
    normalized.includes('গাড়ি')
  ) {
    if (
      normalized.includes('view') ||
      normalized.includes('scope') ||
      normalized.includes('ভিউ') ||
      normalized.includes('দেখাও')
    ) {
      return {
        action: 'SWITCH_SCOPE_TARIQ',
        rawQuery: raw,
        explanationEn: "✦ Scoped to Driver Tariq's logistics manifest.",
        explanationBn: '✦ ড্রাইভার তারিকের পরিবহন ভিউ দেখানো হচ্ছে।',
      };
    }
  }

  if (
    normalized.includes('coordinator') ||
    normalized.includes('full') ||
    normalized.includes('মূল') ||
    normalized.includes('সমন্বয়ক') ||
    normalized.includes('সবাই')
  ) {
    return {
      action: 'SWITCH_SCOPE_COORDINATOR',
      rawQuery: raw,
      explanationEn: '✦ Returning to Central Reality Projection.',
      explanationBn: '✦ কেন্দ্রীয় সার্বিক বাস্তবতায় ফেরা হয়েছে।',
    };
  }

  // 5. Proof & Settlement
  if (
    normalized.includes('done') ||
    normalized.includes('complete') ||
    normalized.includes('deliver') ||
    normalized.includes('settle') ||
    normalized.includes('সম্পন্ন') ||
    normalized.includes('শেষ') ||
    normalized.includes('হয়ে গেছে') ||
    normalized.includes('সেটেল')
  ) {
    return {
      action: 'SETTLE_REALITY',
      rawQuery: raw,
      explanationEn: '✦ All requirements fulfilled. Reality settled.',
      explanationBn: '✦ সকল শর্ত পূরণ হয়েছে। বাস্তবতা নিষ্পত্তি হয়েছে।',
    };
  }

  if (
    normalized.includes('proof') ||
    normalized.includes('weigh') ||
    normalized.includes('slip') ||
    normalized.includes('receipt') ||
    normalized.includes('স্লিপ') ||
    normalized.includes('ওজন') ||
    normalized.includes('প্রমাণ') ||
    normalized.includes('রশিদ')
  ) {
    return {
      action: 'VERIFY_PROOF',
      rawQuery: raw,
      explanationEn: '✦ Weighbridge proof of loading verified (50.2 kg net).',
      explanationBn: '✦ ওয়েইব্রিজ ওজন স্লিপ যাচাইকৃত (নিট ৫০.২ কেজি)।',
    };
  }

  // 6. Logistics / Driver Assignment
  if (
    normalized.includes('assign') ||
    normalized.includes('gari') ||
    normalized.includes('van') ||
    normalized.includes('pathao') ||
    normalized.includes('tariq') ||
    normalized.includes('পাঠাও') ||
    normalized.includes('ঠিক করো') ||
    normalized.includes('এসাইন')
  ) {
    return {
      action: 'ASSIGN_LOGISTICS',
      rawQuery: raw,
      explanationEn: '✦ Driver Tariq assigned (৳800). Pickup in progress.',
      explanationBn: '✦ ড্রাইভার তারিক নির্ধারিত হয়েছে (৮০০ টাকা)। পিকআপ চলমান।',
    };
  }

  // 7. Accept / Decline
  if (
    normalized.includes('accept') ||
    normalized.includes('agree') ||
    normalized.includes('confirm') ||
    normalized.includes('yes') ||
    normalized.includes('kobul') ||
    normalized.includes('gohon') ||
    normalized.includes('গ্রহণ') ||
    normalized.includes('সম্মতি') ||
    normalized.includes('কবুল') ||
    normalized.includes('ঠিক আছে') ||
    normalized.includes('হ্যাঁ')
  ) {
    return {
      action: 'ACCEPT_OFFER',
      rawQuery: raw,
      explanationEn: '✦ Offer committed. Transport is now the critical frontier.',
      explanationBn: '✦ প্রস্তাব গৃহীত হয়েছে। এখন পরিবহনই প্রধান নির্ভরতা।',
    };
  }

  if (
    normalized.includes('decline') ||
    normalized.includes('reject') ||
    normalized.includes('cancel') ||
    normalized.includes('no') ||
    normalized.includes('batil') ||
    normalized.includes('বাতিল') ||
    normalized.includes('প্রত্যাখ্যান') ||
    normalized.includes('না')
  ) {
    return {
      action: 'DECLINE_OFFER',
      rawQuery: raw,
      explanationEn: '✦ Candidate offer declined. Gap reopened with alternatives.',
      explanationBn: '✦ প্রস্তাব বাতিল করা হয়েছে। শূন্যতা পূরণে বিকল্প খোঁজা হচ্ছে।',
    };
  }

  // 8. Candidates / Inquiry
  if (
    normalized.includes('mina') ||
    normalized.includes('মিনা')
  ) {
    return {
      action: 'INQUIRE_SUPPLY',
      targetCandidate: 'mina',
      actorName: 'Mina',
      rawQuery: raw,
      explanationEn: '✦ Inquiring candidate Mina (15kg available @ Savar Mill).',
      explanationBn: '✦ বিকল্প সরবরাহকারী মিনার খোঁজ নেওয়া হচ্ছে (১৫ কেজি সাভার মিল)।',
    };
  }

  if (
    normalized.includes('faruk') ||
    normalized.includes('ফারুক')
  ) {
    return {
      action: 'INQUIRE_SUPPLY',
      targetCandidate: 'faruk',
      actorName: 'Faruk',
      rawQuery: raw,
      explanationEn: '✦ Inquiring candidate Faruk (20kg available @ Dhanmondi).',
      explanationBn: '✦ বিকল্প সরবরাহকারী ফারুকের সাথে যোগাযোগ করা হচ্ছে (২০ কেজি)।',
    };
  }

  if (
    normalized.includes('karim') ||
    normalized.includes('করিম') ||
    normalized.includes('ask') ||
    normalized.includes('inquire') ||
    normalized.includes('jiggesh') ||
    normalized.includes('খোঁজ') ||
    normalized.includes('জিজ্ঞেস') ||
    normalized.includes('find') ||
    normalized.includes('খোঁচ') ||
    normalized.includes('search')
  ) {
    return {
      action: 'INQUIRE_SUPPLY',
      targetCandidate: 'karim',
      actorName: 'Karim',
      rawQuery: raw,
      explanationEn: '✦ Inquiring Karim regarding 20kg supply timeline...',
      explanationBn: '✦ ২০ কেজি চালের জন্য করীমের কাছে খোঁজ নেওয়া হচ্ছে...',
    };
  }

  // 9. Generic Materialize / Custom Want Parsing
  const customWant = extractCustomWant(raw, normalized);
  // Check if customWant has default filler values like 'Supply Item' meaning we didn't understand it
  if (customWant.item === 'Supply Item' || customWant.item === raw.split(/\s+/).slice(0, 3).join(' ')) {
    return {
      action: 'UNIVERSAL_INTENT',
      rawQuery: raw,
      explanationEn: '✦ Contextualizing Universal Goal...',
      explanationBn: '✦ নতুন উদ্দেশ্য বিশ্লেষণ করা হচ্ছে...',
    };
  }

  return {
    action: 'MATERIALIZE_WANT',
    wantData: customWant,
    rawQuery: raw,
    explanationEn: `✦ Causal intent materialized: ${customWant.quantity} ${customWant.item}.`,
    explanationBn: `✦ নতুন উদ্দেশ্য বাস্তবায়িত হয়েছে: ${customWant.quantity} ${customWant.item}।`,
  };
}

function extractCustomWant(rawText: string, normalized: string): ParsedWant {
  // Check if standard rice example
  if (
    normalized.includes('rice') ||
    normalized.includes('চাল') ||
    normalized.includes('office') ||
    normalized.includes('অফিস')
  ) {
    return {
      item: normalized.includes('চাল') ? 'মিনিকেট চাল' : 'Rice',
      quantity: '50kg',
      destination: normalized.includes('চাল') ? 'অফিস (গুলশান ২)' : 'Office · Gulshan 2',
      dueTime: normalized.includes('চাল') ? 'আগামীকাল সকাল ১০টা' : 'Tomorrow 10 AM',
      committedAmount: '30kg',
      gapAmount: '20kg',
      committedActor: 'Rahim',
      committedPrice: '৳3,600',
    };
  }

  // Extract quantity e.g., "100kg", "20 bags", "৫০ কেজি"
  const qtyMatch = normalized.match(/(\d+)\s*(kg|বস্তা|কেজি|bags|liters|pieces|mon|টন|ton)?/i);
  const qty = qtyMatch ? `${qtyMatch[1]}${qtyMatch[2] ? ` ${qtyMatch[2]}` : ' units'}` : '50 units';

  // Extract item name
  let item = 'Supply Item';
  if (normalized.includes('potato') || normalized.includes('আলু')) item = 'Potato';
  else if (normalized.includes('oil') || normalized.includes('তেল')) item = 'Mustard Oil';
  else if (normalized.includes('cement') || normalized.includes('সিমেন্ট')) item = 'Cement Bags';
  else if (normalized.includes('wheat') || normalized.includes('গম')) item = 'Wheat Flour';
  else if (normalized.includes('laptop') || normalized.includes('ল্যাপটপ')) item = 'Laptops';
  else {
    // Try to take the first 2-3 words
    const words = rawText.split(/\s+/).slice(0, 3).join(' ');
    if (words.length > 2) item = words;
  }

  return {
    item,
    quantity: qty,
    destination: normalized.includes('warehouse') || normalized.includes('গুদাম') ? 'Warehouse' : 'Office Depot',
    dueTime: 'Tomorrow 10 AM',
    committedAmount: '60%',
    gapAmount: '40%',
    committedActor: 'Primary Supplier',
    committedPrice: '৳4,500',
  };
}
