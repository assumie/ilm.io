/*
 * seed-data.ts — Seed data for the Water Cycle lesson.
 *
 * Contains pre-generated content for all 5 formats × 5 languages
 * for the "Kitaran Air / The Water Cycle (Sains Tahun 4)" lesson.
 * Used by the seed API route and the /learn page as fallback.
 */

import type {
  LessonOutputFormat,
  LessonOutputLanguage,
} from './supabase';
import type {
  ReaderOutput,
  FocusSlidesOutput,
  MindMapOutput,
  EasyReadOutput,
  AudioScriptOutput,
  QuickCheckOutput,
} from './agents';

export const SEED_TEACHER = {
  name: 'Puan Aishah',
  email: 'aishah@sekolah.edu.my',
};

export const SEED_CLASS = {
  name: '4 Bestari',
};

export const SEED_STUDENTS = [
  { name: 'Arif' },
  { name: 'Mei Ling' },
  { name: 'Kavin' },
  { name: 'Nurul' },
  { name: 'Daniel' },
];

export const SEED_LESSON_RAW_TEXT = `Kitaran Air / The Water Cycle (Sains Tahun 4)

The water cycle is how water moves around the Earth. Water changes between liquid, gas, and solid. The sun drives the water cycle.

Evaporation: The sun heats water in rivers, lakes, and seas. The water turns into water vapour (a gas). This is called evaporation. Warmth makes evaporation happen faster.

Condensation: Water vapour rises into the sky and cools down. When it cools, it turns back into tiny water drops. These drops form clouds. This is called condensation.

Precipitation: When clouds get heavy with water, the water falls back to Earth. It can fall as rain, snow, hail, or sleet. This is called precipitation.

Collection: Water that falls on land flows into rivers, lakes, and seas. Some water soaks into the ground. This is called collection. Then the cycle starts again.

Key terms:
- Evaporation: Water turns into gas because of heat.
- Condensation: Gas turns back into water drops when it cools.
- Precipitation: Water falls from clouds to the ground.
- Water vapour: Water in the form of a gas.
`;

export const SEED_READER_OUTPUT: ReaderOutput = {
  title: 'Kitaran Air / The Water Cycle',
  subject: 'Sains / Science',
  level: 'Tahun 4',
  key_ideas: [
    {
      heading: 'The Water Cycle',
      explanation:
        'The water cycle is how water moves around the Earth. Water changes between liquid, gas, and solid. The sun drives the water cycle.',
    },
    {
      heading: 'Evaporation',
      explanation:
        'The sun heats water in rivers, lakes, and seas. The water turns into water vapour, which is a gas. Warmth makes evaporation happen faster.',
    },
    {
      heading: 'Condensation',
      explanation:
        'Water vapour rises into the sky and cools down. When it cools, it turns back into tiny water drops. These drops form clouds.',
    },
    {
      heading: 'Precipitation',
      explanation:
        'When clouds get heavy with water, the water falls back to Earth. It can fall as rain, snow, hail, or sleet.',
    },
    {
      heading: 'Collection',
      explanation:
        'Water that falls on land flows into rivers, lakes, and seas. Some water soaks into the ground. Then the cycle starts again.',
    },
  ],
  key_terms: [
    {
      term: 'Evaporation',
      simple_definition: 'Water turns into gas because of heat from the sun.',
    },
    {
      term: 'Condensation',
      simple_definition: 'Gas turns back into water drops when it cools down.',
    },
    {
      term: 'Precipitation',
      simple_definition: 'Water falls from clouds to the ground as rain or snow.',
    },
    {
      term: 'Water vapour',
      simple_definition: 'Water in the form of a gas that we cannot see.',
    },
  ],
};

// ─── English outputs ─────────────────────────────────────────────────────

const focusSlidesEn: FocusSlidesOutput = {
  slides: [
    { heading: 'The Water Cycle', one_sentence: 'Water moves around the Earth in a cycle.' },
    { heading: 'The Sun Drives It', one_sentence: 'The sun gives energy to move the water.' },
    { heading: 'Three Forms of Water', one_sentence: 'Water can be liquid, gas, or solid.' },
    { type: 'break', heading: 'Time to move! Stretch for 30 seconds.' },
    { heading: 'Evaporation', one_sentence: 'The sun heats water until it becomes a gas.' },
    { heading: 'Condensation', one_sentence: 'Water vapour cools and forms clouds.' },
    { heading: 'Precipitation', one_sentence: 'Heavy clouds drop water as rain or snow.' },
    { type: 'break', heading: 'Time to move! Reach up high, then touch your toes.' },
    { heading: 'Collection', one_sentence: 'Water flows back into rivers and seas.' },
    { heading: 'The Cycle Continues', one_sentence: 'Then the whole cycle starts again.' },
  ],
};

const mindMapEn: MindMapOutput = {
  center: 'The Water Cycle',
  branches: [
    { label: 'The Sun', fact: 'The sun gives energy that drives the water cycle.' },
    { label: 'Evaporation', fact: 'Heat from the sun turns water into a gas called water vapour.' },
    { label: 'Condensation', fact: 'Water vapour cools in the sky and forms clouds.' },
    { label: 'Precipitation', fact: 'Water falls from clouds as rain, snow, hail, or sleet.' },
    { label: 'Collection', fact: 'Water flows into rivers, lakes, and seas, or soaks into the ground.' },
    { label: 'Three Forms', fact: 'Water can be liquid, gas (vapour), or solid (ice).' },
  ],
};

const easyReadEn: EasyReadOutput = [
  {
    heading: 'The Water Cycle',
    sentences: [
      'Water moves around the Earth.',
      'This is called the water cycle.',
      'The sun makes the cycle work.',
    ],
  },
  {
    heading: 'Evaporation',
    sentences: [
      'The sun heats the water.',
      'Rivers and seas get warm.',
      'Water turns into a gas.',
      'This gas is called water vapour.',
    ],
  },
  {
    heading: 'Condensation',
    sentences: [
      'Water vapour goes up to the sky.',
      'It cools down high above.',
      'Tiny water drops form.',
      'The drops make clouds.',
    ],
  },
  {
    heading: 'Precipitation',
    sentences: [
      'Clouds get very heavy.',
      'Water falls back down.',
      'It can be rain or snow.',
      'This is called precipitation.',
    ],
  },
  {
    heading: 'Collection',
    sentences: [
      'Water flows into rivers.',
      'It goes into lakes and seas.',
      'Some water goes into the ground.',
      'Then the cycle starts again.',
    ],
  },
  {
    heading: 'Key Words',
    sentences: [
      'Evaporation: water turns to gas from heat.',
      'Condensation: gas cools into water drops.',
      'Precipitation: water falls from clouds.',
      'Water vapour: water as a gas we cannot see.',
    ],
  },
];

const audioScriptEn: AudioScriptOutput = [
  'Today we are learning about the water cycle.',
  'The water cycle is how water moves around the Earth.',
  'The sun gives energy to make the cycle work.',
  'First, let us talk about evaporation.',
  'The sun heats water in rivers, lakes, and seas.',
  'The warm water turns into a gas called water vapour.',
  'Next, the water vapour rises into the sky.',
  'High up, the air is cold, so the vapour cools down.',
  'It turns back into tiny water drops that form clouds.',
  'This is called condensation.',
  'When the clouds get heavy, water falls back to Earth.',
  'It can fall as rain, snow, hail, or sleet.',
  'This is called precipitation.',
  'The water then flows into rivers, lakes, and seas.',
  'Some water soaks into the ground.',
  'This is called collection.',
  'Then the whole cycle starts all over again.',
  'That is the water cycle. Great job learning today!',
];

const quickCheckEn: QuickCheckOutput = [
  {
    question: 'What gives energy to drive the water cycle?',
    options: ['The sun', 'The wind', 'The moon'],
    answer_index: 0,
    why: 'Great thinking! The sun heats the water and gives energy to move the whole cycle.',
  },
  {
    question: 'What happens during evaporation?',
    options: [
      'Water turns into a gas',
      'Rain falls from clouds',
      'Water freezes into ice',
    ],
    answer_index: 0,
    why: 'Yes! Evaporation is when heat from the sun turns water into water vapour, which is a gas.',
  },
  {
    question: 'What is it called when water falls from clouds?',
    options: ['Collection', 'Precipitation', 'Evaporation'],
    answer_index: 1,
    why: 'Well done! Precipitation is when heavy clouds drop water back to Earth as rain or snow.',
  },
];

// ─── Bahasa Melayu outputs ────────────────────────────────────────────────

const focusSlidesBm: FocusSlidesOutput = {
  slides: [
    { heading: 'Kitaran Air', one_sentence: 'Air bergerak sekeliling bumi dalam satu kitaran.' },
    { heading: 'Matahari Memacu', one_sentence: 'Matahari memberi tenaga untuk gerakkan air.' },
    { heading: 'Tiga Bentuk Air', one_sentence: 'Air boleh jadi cecair, gas, atau pepejal.' },
    { type: 'break', heading: 'Masa untuk bergerak! Regang selama 30 saat.' },
    { heading: 'Penyejatan', one_sentence: 'Matahari memanaskan air menjadi gas.' },
    { heading: 'Pemeluwapan', one_sentence: 'Wap air menjadi sejuk dan membentuk awan.' },
    { heading: 'Kerpasan', one_sentence: 'Awan berat menjatuhkan air sebagai hujan.' },
    { type: 'break', heading: 'Masa untuk bergerak! Capai tinggi, kemudian sentuh jari kaki.' },
    { heading: 'Pengumpulan', one_sentence: 'Air mengalir kembali ke sungai dan laut.' },
    { heading: 'Kitaran Berulang', one_sentence: 'Kemudian kitaran bermula semula.' },
  ],
};

const mindMapBm: MindMapOutput = {
  center: 'Kitaran Air',
  branches: [
    { label: 'Matahari', fact: 'Matahari memberi tenaga yang memacu kitaran air.' },
    { label: 'Penyejatan', fact: 'Haba matahari menukar air menjadi wap, iaitu gas.' },
    { label: 'Pemeluwapan', fact: 'Wap air sejuk di langit dan membentuk awan.' },
    { label: 'Kerpasan', fact: 'Air jatuh dari awan sebagai hujan, salji, atau hujan batu.' },
    { label: 'Pengumpulan', fact: 'Air mengalir ke sungai, tasik, dan laut atau meresap ke tanah.' },
    { label: 'Tiga Bentuk', fact: 'Air boleh jadi cecair, gas (wap), atau pepejal (ais).' },
  ],
};

const easyReadBm: EasyReadOutput = [
  {
    heading: 'Kitaran Air',
    sentences: [
      'Air bergerak sekeliling bumi.',
      'Ini dipanggil kitaran air.',
      'Matahari membuatkan kitaran berjalan.',
    ],
  },
  {
    heading: 'Penyejatan',
    sentences: [
      'Matahari memanaskan air.',
      'Sungai dan laut menjadi panas.',
      'Air bertukar menjadi gas.',
      'Gas ini dipanggil wap air.',
    ],
  },
  {
    heading: 'Pemeluwapan',
    sentences: [
      'Wap air naik ke langit.',
      'Ia menjadi sejuk di atas.',
      'Titisan air kecil terbentuk.',
      'Titisan itu membuat awan.',
    ],
  },
  {
    heading: 'Kerpasan',
    sentences: [
      'Awan menjadi sangat berat.',
      'Air jatuh kembali ke bumi.',
      'Ia boleh jadi hujan atau salji.',
      'Ini dipanggil kerpasan.',
    ],
  },
  {
    heading: 'Pengumpulan',
    sentences: [
      'Air mengalir ke sungai.',
      'Ia masuk ke tasik dan laut.',
      'Sesetengah air masuk ke tanah.',
      'Kemudian kitaran bermula semula.',
    ],
  },
  {
    heading: 'Perkataan Penting',
    sentences: [
      'Penyejatan: air jadi gas kerana haba.',
      'Pemeluwapan: gas jadi titisan air.',
      'Kerpasan: air jatuh dari awan.',
      'Wap air: air sebagai gas yang tak nampak.',
    ],
  },
];

const audioScriptBm: AudioScriptOutput = [
  'Hari ini kita belajar tentang kitaran air.',
  'Kitaran air ialah cara air bergerak sekeliling bumi.',
  'Matahari memberi tenaga untuk menjalankan kitaran.',
  'Pertama, mari kita bercakap tentang penyejatan.',
  'Matahari memanaskan air di sungai, tasik, dan laut.',
  'Air yang panas bertukar menjadi gas dipanggil wap air.',
  'Seterusnya, wap air naik ke langit.',
  'Di atas, udara sejuk, jadi wap menjadi sejuk.',
  'Ia bertukar kembali menjadi titisan air kecil yang membentuk awan.',
  'Ini dipanggil pemeluwapan.',
  'Apabila awan menjadi berat, air jatuh kembali ke bumi.',
  'Ia boleh jatuh sebagai hujan, salji, atau hujan batu.',
  'Ini dipanggil kerpasan.',
  'Air kemudian mengalir ke sungai, tasik, dan laut.',
  'Sesetengah air meresap ke dalam tanah.',
  'Ini dipanggil pengumpulan.',
  'Kemudian seluruh kitaran bermula semula.',
  'Itulah kitaran air. Bagus belajar hari ini!',
];

const quickCheckBm: QuickCheckOutput = [
  {
    question: 'Apa memberi tenaga untuk memacu kitaran air?',
    options: ['Matahari', 'Angin', 'Bulan'],
    answer_index: 0,
    why: 'Pemikiran yang bagus! Matahari memanaskan air dan memberi tenaga untuk gerakkan kitaran.',
  },
  {
    question: 'Apa berlaku semasa penyejatan?',
    options: [
      'Air bertukar menjadi gas',
      'Hujan jatuh dari awan',
      'Air membeku menjadi ais',
    ],
    answer_index: 0,
    why: 'Ya! Penyejatan ialah apabila haba matahari menukar air menjadi wap air, iaitu gas.',
  },
  {
    question: 'Apakah nama apabila air jatuh dari awan?',
    options: ['Pengumpulan', 'Kerpasan', 'Penyejatan'],
    answer_index: 1,
    why: 'Bagus! Kerpasan ialah apabila awan berat menjatuhkan air ke bumi sebagai hujan atau salji.',
  },
];

// ─── Chinese outputs ──────────────────────────────────────────────────────

const focusSlidesZh: FocusSlidesOutput = {
  slides: [
    { heading: '水循环', one_sentence: '水在地球上不断循环流动。' },
    { heading: '太阳驱动', one_sentence: '太阳提供能量让水流动。' },
    { heading: '水的三种形态', one_sentence: '水可以是液体、气体或固体。' },
    { type: 'break', heading: '活动时间！伸展30秒。' },
    { heading: '蒸发', one_sentence: '太阳把水加热变成气体。' },
    { heading: '凝结', one_sentence: '水蒸气冷却形成云。' },
    { heading: '降水', one_sentence: '重的云把水落下来。' },
    { type: 'break', heading: '活动时间！向上伸手，然后摸脚趾。' },
    { heading: '收集', one_sentence: '水流回河流和海洋。' },
    { heading: '循环继续', one_sentence: '然后整个循环重新开始。' },
  ],
};

const mindMapZh: MindMapOutput = {
  center: '水循环',
  branches: [
    { label: '太阳', fact: '太阳提供能量驱动水循环。' },
    { label: '蒸发', fact: '太阳的热把水变成水蒸气，一种气体。' },
    { label: '凝结', fact: '水蒸气在天空冷却形成云。' },
    { label: '降水', fact: '水从云中落下，变成雨、雪或冰雹。' },
    { label: '收集', fact: '水流入河流、湖泊和海洋，或渗入地面。' },
    { label: '三种形态', fact: '水可以是液体、气体（蒸气）或固体（冰）。' },
  ],
};

const easyReadZh: EasyReadOutput = [
  {
    heading: '水循环',
    sentences: [
      '水在地球上流动。',
      '这叫做水循环。',
      '太阳让水循环运作。',
    ],
  },
  {
    heading: '蒸发',
    sentences: [
      '太阳加热水。',
      '河流和海洋变暖。',
      '水变成气体。',
      '这气体叫水蒸气。',
    ],
  },
  {
    heading: '凝结',
    sentences: [
      '水蒸气升到天空。',
      '在高处它变冷。',
      '形成小水滴。',
      '水滴变成云。',
    ],
  },
  {
    heading: '降水',
    sentences: [
      '云变得很重。',
      '水落回地面。',
      '可以是雨或雪。',
      '这叫做降水。',
    ],
  },
  {
    heading: '收集',
    sentences: [
      '水流入河流。',
      '进入湖泊和海洋。',
      '一些水渗入地下。',
      '然后循环重新开始。',
    ],
  },
  {
    heading: '重要词语',
    sentences: [
      '蒸发：热把水变成气体。',
      '凝结：气体冷却成水滴。',
      '降水：水从云中落下。',
      '水蒸气：看不见的水气体。',
    ],
  },
];

const audioScriptZh: AudioScriptOutput = [
  '今天我们学习水循环。',
  '水循环是水在地球上流动的方式。',
  '太阳提供能量让水循环运作。',
  '首先，我们来谈谈蒸发。',
  '太阳加热河流、湖泊和海洋里的水。',
  '温暖的水变成一种气体，叫做水蒸气。',
  '接着，水蒸气升到天空。',
  '在高处，空气很冷，所以水蒸气冷却。',
  '它变回小水滴，形成云。',
  '这叫做凝结。',
  '当云变得很重时，水落回地面。',
  '它可以变成雨、雪或冰雹。',
  '这叫做降水。',
  '水然后流入河流、湖泊和海洋。',
  '一些水渗入地下。',
  '这叫做收集。',
  '然后整个循环重新开始。',
  '这就是水循环。今天学得很好！',
];

const quickCheckZh: QuickCheckOutput = [
  {
    question: '什么提供能量驱动水循环？',
    options: ['太阳', '风', '月亮'],
    answer_index: 0,
    why: '想得很好！太阳加热水，提供能量让整个循环运作。',
  },
  {
    question: '蒸发时会发生什么？',
    options: [
      '水变成气体',
      '雨从云中落下',
      '水结成冰',
    ],
    answer_index: 0,
    why: '对了！蒸发是太阳的热把水变成水蒸气，一种气体。',
  },
  {
    question: '水从云中落下叫什么？',
    options: ['收集', '降水', '蒸发'],
    answer_index: 1,
    why: '很好！降水是重的云把水落回地面，变成雨或雪。',
  },
];

// ─── Tamil outputs ────────────────────────────────────────────────────────

const focusSlidesTa: FocusSlidesOutput = {
  slides: [
    { heading: 'நீர் சுழற்சி', one_sentence: 'நீர் பூமியைச் சுற்றி வருகிறது.' },
    { heading: 'சூரியன் இயக்குகிறான்', one_sentence: 'சூரியன் நீரை நகர்த்த ஆற்றல் தருகிறான்.' },
    { heading: 'மூன்று நிலைகள்', one_sentence: 'நீர் திரவம், வாயு, அல்லது திடம்.' },
    { type: 'break', heading: 'நகர நேரம்! 30 வினாடி நீட்டவும்.' },
    { heading: 'ஆவியாதல்', one_sentence: 'சூரியன் நீரை வாயுவாக மாற்றுகிறான்.' },
    { heading: 'ஒடுக்கம்', one_sentence: 'நீராவி குளிர்ந்து மேகமாகிறது.' },
    { heading: 'வீழ்படிவு', one_sentence: 'கனமேகம் நீரை கீழே போடுகிறது.' },
    { type: 'break', heading: 'நகர நேரம்! மேலே சென்று காலை தொடவும்.' },
    { heading: 'சேகரிப்பு', one_sentence: 'நீர் ஆறுகளில் மீண்டும் வருகிறது.' },
    { heading: 'சுழற்சி தொடரும்', one_sentence: 'பிறகு சுழற்சி மீண்டும் தொடங்கும்.' },
  ],
};

const mindMapTa: MindMapOutput = {
  center: 'நீர் சுழற்சி',
  branches: [
    { label: 'சூரியன்', fact: 'சூரியன் நீர் சுழற்சியை இயக்கும் ஆற்றலை தருகிறான்.' },
    { label: 'ஆவியாதல்', fact: 'சூரியனின் வெப்பம் நீரை வாயுவாக மாற்றுகிறது.' },
    { label: 'ஒடுக்கம்', fact: 'வாயு வானில் குளிர்ந்து மேகமாக மாறுகிறது.' },
    { label: 'வீழ்படிவு', fact: 'நீர் மேகத்திலிருந்து மழை அல்லது பனியாக விழுகிறது.' },
    { label: 'சேகரிப்பு', fact: 'நீர் ஆறுகள், ஏரிகள், கடல்களில் அல்லது நிலத்தில் செல்கிறது.' },
    { label: 'மூன்று நிலைகள்', fact: 'நீர் திரவம், வாயு (ஆவி), அல்லது திடம் (பனி) ஆக இருக்கலாம்.' },
  ],
};

const easyReadTa: EasyReadOutput = [
  {
    heading: 'நீர் சுழற்சி',
    sentences: [
      'நீர் பூமியைச் சுற்றி வருகிறது.',
      'இது நீர் சுழற்சி என்று அழைக்கப்படுகிறது.',
      'சூரியன் சுழற்சியை இயக்குகிறான்.',
    ],
  },
  {
    heading: 'ஆவியாதல்',
    sentences: [
      'சூரியன் நீரை சூடாக்குகிறான்.',
      'ஆறுகளும் கடல்களும் சூடாகின்றன.',
      'நீர் வாயுவாக மாறுகிறது.',
      'இந்த வாயு நீராவி எனப்படுகிறது.',
    ],
  },
  {
    heading: 'ஒடுக்கம்',
    sentences: [
      'நீராவி வானத்திற்கு செல்கிறது.',
      'அங்கே அது குளிர்கிறது.',
      'சிறிய நீர் துளிகள் உருவாகின்றன.',
      'அது மேகமாக மாறுகிறது.',
    ],
  },
  {
    heading: 'வீழ்படிவு',
    sentences: [
      'மேகம் கனமாகிறது.',
      'நீர் கீழே விழுகிறது.',
      'அது மழை அல்லது பனியாக இருக்கலாம்.',
      'இது வீழ்படிவு எனப்படுகிறது.',
    ],
  },
  {
    heading: 'சேகரிப்பு',
    sentences: [
      'நீர் ஆறுகளில் ஓடுகிறது.',
      'ஏரிகளிலும் கடல்களிலும் செல்கிறது.',
      'சில நீர் நிலத்திற்குள் செல்கிறது.',
      'பிறகு சுழற்சி மீண்டும் தொடங்குகிறது.',
    ],
  },
  {
    heading: 'முக்கிய சொற்கள்',
    sentences: [
      'ஆவியாதல்: வெப்பம் நீரை வாயுவாக்கும்.',
      'ஒடுக்கம்: வாயு குளிர்ந்து துளியாகும்.',
      'வீழ்படிவு: நீர் மேகத்திலிருந்து விழுகிறது.',
      'நீராவி: கண்ணுக்கு தெரியாத வாயு நீர்.',
    ],
  },
];

const audioScriptTa: AudioScriptOutput = [
  'இன்று நாம் நீர் சுழற்சியைப் பற்றி கற்போம்.',
  'நீர் சுழற்சி என்பது நீர் பூமியைச் சுற்றி வரும் முறை.',
  'சூரியன் சுழற்சியை இயக்க ஆற்றல் தருகிறான்.',
  'முதலில், ஆவியாதல் பற்றி பேசுவோம்.',
  'சூரியன் ஆறுகள், ஏரிகள், கடல்களில் உள்ள நீரை சூடாக்குகிறான்.',
  'சூடான நீர் வாயுவாக மாறுகிறது, அது நீராவி.',
  'பிறகு, நீராவி வானத்திற்கு எழுகிறது.',
  'மேலே, காற்று குளிர், எனவே ஆவி குளிர்கிறது.',
  'அது சிறிய நீர் துளிகளாக மாறி மேகமாகிறது.',
  'இது ஒடுக்கம் எனப்படுகிறது.',
  'மேகம் கனமாகும்போது, நீர் பூமிக்கு விழுகிறது.',
  'அது மழை, பனி, அல்லது ஆலங்கட்டி மழையாக விழலாம்.',
  'இது வீழ்படிவு எனப்படுகிறது.',
  'நீர் பிறகு ஆறுகள், ஏரிகள், கடல்களில் ஓடுகிறது.',
  'சில நீர் நிலத்திற்குள் உறிஞ்சப்படுகிறது.',
  'இது சேகரிப்பு எனப்படுகிறது.',
  'பிறகு முழு சுழற்சியும் மீண்டும் தொடங்குகிறது.',
  'இதுதான் நீர் சுழற்சி. இன்று நன்றாக கற்றீர்கள்!',
];

const quickCheckTa: QuickCheckOutput = [
  {
    question: 'நீர் சுழற்சியை இயக்க ஆற்றல் தருவது எது?',
    options: ['சூரியன்', 'காற்று', 'சந்திரன்'],
    answer_index: 0,
    why: 'நன்றாக சிந்தித்தீர்கள்! சூரியன் நீரை சூடாக்கி சுழற்சியை இயக்குகிறான்.',
  },
  {
    question: 'ஆவியாதலின் போது என்ன நடக்கிறது?',
    options: [
      'நீர் வாயுவாக மாறுகிறது',
      'மழை மேகத்திலிருந்து விழுகிறது',
      'நீர் பனியாக உறைகிறது',
    ],
    answer_index: 0,
    why: 'சரி! ஆவியாதல் என்பது சூரியனின் வெப்பம் நீரை நீராவியாக, ஒரு வாயுவாக மாற்றுவது.',
  },
  {
    question: 'நீர் மேகத்திலிருந்து விழுவது என்ன எனப்படுகிறது?',
    options: ['சேகரிப்பு', 'வீழ்படிவு', 'ஆவியாதல்'],
    answer_index: 1,
    why: 'நன்றாக செய்தீர்கள்! வீழ்படிவு என்பது கனமேகம் நீரை மழை அல்லது பனியாக பூமிக்கு போடுவது.',
  },
];

// ─── Rojak outputs (Malaysian mix) ────────────────────────────────────────

const focusSlidesRojak: FocusSlidesOutput = {
  slides: [
    { heading: 'The Water Cycle', one_sentence: 'Air moves around the earth in a cycle.' },
    { heading: 'Sun Powers It', one_sentence: 'Matahari gives energy to move the water.' },
    { heading: 'Three Forms of Air', one_sentence: 'Air can be liquid, gas, or solid one.' },
    { type: 'break', heading: 'Time to move! Stretch 30 seconds lah.' },
    { heading: 'Evaporation', one_sentence: 'Sun heats water until it jadi gas.' },
    { heading: 'Condensation', one_sentence: 'Wap air cools and jadi clouds.' },
    { heading: 'Precipitation', one_sentence: 'Heavy clouds drop water as hujan.' },
    { type: 'break', heading: 'Time to move! Reach up, then touch kaki.' },
    { heading: 'Collection', one_sentence: 'Air flows back to sungai and laut.' },
    { heading: 'Cycle Repeat', one_sentence: 'Then the whole cycle start again.' },
  ],
};

const mindMapRojak: MindMapOutput = {
  center: 'The Water Cycle',
  branches: [
    { label: 'Matahari', fact: 'Matahari gives energy that drives the water cycle.' },
    { label: 'Evaporation', fact: 'Haba from sun turns water into wap, which is gas.' },
    { label: 'Condensation', fact: 'Wap air cools in the sky and jadi clouds.' },
    { label: 'Precipitation', fact: 'Air jatuh from clouds as hujan, salji, or hail.' },
    { label: 'Collection', fact: 'Air flows to sungai, tasik, and laut or soaks into tanah.' },
    { label: 'Three Forms', fact: 'Air can be cecair, gas (wap), or pepejal (ais).' },
  ],
};

const easyReadRojak: EasyReadOutput = [
  {
    heading: 'The Water Cycle',
    sentences: [
      'Air moves around the earth.',
      'Ini we call the water cycle.',
      'Matahari makes the cycle work.',
    ],
  },
  {
    heading: 'Evaporation',
    sentences: [
      'Matahari heats the water.',
      'Sungai and laut get warm.',
      'Air turns into gas.',
      'Gas ini we call wap air.',
    ],
  },
  {
    heading: 'Condensation',
    sentences: [
      'Wap air goes up to langit.',
      'It cools down up there.',
      'Titisan air kecil form.',
      'Titisan make clouds.',
    ],
  },
  {
    heading: 'Precipitation',
    sentences: [
      'Clouds get very heavy.',
      'Air jatuh back to bumi.',
      'It can be hujan or salji.',
      'Ini we call precipitation.',
    ],
  },
  {
    heading: 'Collection',
    sentences: [
      'Air flows into sungai.',
      'Goes into tasik and laut.',
      'Some air goes into tanah.',
      'Then cycle start again.',
    ],
  },
  {
    heading: 'Important Words',
    sentences: [
      'Evaporation: air jadi gas from haba.',
      'Condensation: gas jadi water drops.',
      'Precipitation: air jatuh from clouds.',
      'Wap air: air as gas we cannot see.',
    ],
  },
];

const audioScriptRojak: AudioScriptOutput = [
  'Today we learn about the water cycle.',
  'Water cycle is how air moves around the earth.',
  'Matahari gives energy to make the cycle work.',
  'First, let us talk about evaporation.',
  'Matahari heats water in sungai, tasik, and laut.',
  'Air yang panas turns into gas, we call it wap air.',
  'Next, wap air goes up to the langit.',
  'Up there, the air is cold, so wap cools down.',
  'It turns back to titisan kecil that form clouds.',
  'Ini we call condensation.',
  'When clouds get heavy, air jatuh back to bumi.',
  'It can be hujan, salji, or hail.',
  'Ini we call precipitation.',
  'Air then flows to sungai, tasik, and laut.',
  'Some air soaks into the tanah.',
  'Ini we call collection.',
  'Then the whole cycle starts all over again.',
  'That is the water cycle. Bagus belajar today!',
];

const quickCheckRojak: QuickCheckOutput = [
  {
    question: 'What gives energy to drive the water cycle?',
    options: ['Matahari', 'Angin', 'Bulan'],
    answer_index: 0,
    why: 'Pemikiran yang bagus! Matahari heats the water and gives energy to move the cycle.',
  },
  {
    question: 'What happens during evaporation?',
    options: [
      'Air turns into gas',
      'Hujan jatuh from clouds',
      'Air freezes jadi ais',
    ],
    answer_index: 0,
    why: 'Yes! Evaporation is when haba from matahari turns water into wap air, a gas.',
  },
  {
    question: 'What do we call it when air jatuh from clouds?',
    options: ['Collection', 'Precipitation', 'Evaporation'],
    answer_index: 1,
    why: 'Well done! Precipitation is when heavy clouds drop air back to bumi as hujan or salji.',
  },
];

// ─── Assemble all outputs ─────────────────────────────────────────────────

export const SEED_OUTPUTS: Record<
  LessonOutputLanguage,
  Record<LessonOutputFormat, unknown>
> = {
  en: {
    focus_slides: focusSlidesEn,
    mind_map: mindMapEn,
    easy_read: easyReadEn,
    audio_script: audioScriptEn,
    quick_check: quickCheckEn,
  },
  bm: {
    focus_slides: focusSlidesBm,
    mind_map: mindMapBm,
    easy_read: easyReadBm,
    audio_script: audioScriptBm,
    quick_check: quickCheckBm,
  },
  zh: {
    focus_slides: focusSlidesZh,
    mind_map: mindMapZh,
    easy_read: easyReadZh,
    audio_script: audioScriptZh,
    quick_check: quickCheckZh,
  },
  ta: {
    focus_slides: focusSlidesTa,
    mind_map: mindMapTa,
    easy_read: easyReadTa,
    audio_script: audioScriptTa,
    quick_check: quickCheckTa,
  },
  rojak: {
    focus_slides: focusSlidesRojak,
    mind_map: mindMapRojak,
    easy_read: easyReadRojak,
    audio_script: audioScriptRojak,
    quick_check: quickCheckRojak,
  },
};
