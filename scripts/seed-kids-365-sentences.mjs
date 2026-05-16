const baseUrl = process.env.SEED_BASE_URL ?? "https://english-daily-sentence.vercel.app";
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const courseId = "kids-english";

if (!email || !password) {
  throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD before running this script.");
}

let cookie = "";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.headers ?? {}),
      ...(cookie ? { cookie } : {}),
    },
  });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    cookie = setCookie.split(";")[0];
  }
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { response, data };
}

async function authenticate() {
  const result = await request("/api/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ email, password }),
  });

  if (!result.response.ok) {
    throw new Error(`Authentication failed: ${result.response.status} ${JSON.stringify(result.data)}`);
  }
}

const topics = [
  ["apple", "蘋果", "an apple"],
  ["banana", "香蕉", "a banana"],
  ["cat", "貓", "a cat"],
  ["dog", "狗", "a dog"],
  ["book", "書", "a book"],
  ["pencil", "鉛筆", "a pencil"],
  ["bag", "書包", "a bag"],
  ["desk", "書桌", "a desk"],
  ["chair", "椅子", "a chair"],
  ["ball", "球", "a ball"],
  ["red", "紅色", "red"],
  ["blue", "藍色", "blue"],
  ["green", "綠色", "green"],
  ["yellow", "黃色", "yellow"],
  ["happy", "開心", "happy"],
  ["sad", "難過", "sad"],
  ["hungry", "肚子餓", "hungry"],
  ["thirsty", "口渴", "thirsty"],
  ["sunny", "晴朗", "sunny"],
  ["rainy", "下雨", "rainy"],
  ["mother", "媽媽", "my mother"],
  ["father", "爸爸", "my father"],
  ["teacher", "老師", "my teacher"],
  ["friend", "朋友", "my friend"],
  ["school", "學校", "school"],
  ["home", "家", "home"],
  ["morning", "早上", "morning"],
  ["night", "晚上", "night"],
  ["rice", "飯", "rice"],
  ["milk", "牛奶", "milk"],
  ["water", "水", "water"],
  ["juice", "果汁", "juice"],
  ["bird", "鳥", "a bird"],
  ["fish", "魚", "a fish"],
  ["rabbit", "兔子", "a rabbit"],
  ["tiger", "老虎", "a tiger"],
  ["one", "一", "one"],
  ["two", "二", "two"],
  ["three", "三", "three"],
  ["four", "四", "four"],
  ["run", "跑步", "run"],
  ["jump", "跳", "jump"],
  ["read", "閱讀", "read"],
  ["write", "寫字", "write"],
  ["sing", "唱歌", "sing"],
  ["draw", "畫畫", "draw"],
  ["play", "玩", "play"],
  ["help", "幫忙", "help"],
  ["hand", "手", "my hand"],
  ["eye", "眼睛", "my eye"],
  ["nose", "鼻子", "my nose"],
  ["mouth", "嘴巴", "my mouth"],
  ["big", "大的", "big"],
  ["small", "小的", "small"],
  ["long", "長的", "long"],
  ["short", "短的", "short"],
  ["hot", "熱的", "hot"],
  ["cold", "冷的", "cold"],
  ["clean", "乾淨的", "clean"],
  ["cute", "可愛的", "cute"],
  ["hello", "哈囉", "hello"],
  ["goodbye", "再見", "goodbye"],
  ["please", "請", "please"],
  ["thank you", "謝謝", "thank you"],
  ["sorry", "對不起", "sorry"],
  ["yes", "是", "yes"],
  ["no", "不是", "no"],
  ["here", "這裡", "here"],
  ["there", "那裡", "there"],
  ["today", "今天", "today"],
  ["tomorrow", "明天", "tomorrow"],
  ["family", "家人", "my family"],
  ["classroom", "教室", "the classroom"],
];

const frames = [
  {
    sentence: (word) => `Can you say ${word}?`,
    translation: (_word, zh) => `你會說「${zh}」嗎？`,
    grammar: () => "Can you + 原形動詞？表示「你會……嗎？」",
    usage: "這句適合課堂互動，老師或同學可以用它練習單字發音。",
    vocabulary: (word, zh) => `${word}: ${zh}；can: 會、可以；say: 說。`,
    example: (word) => `Can you say ${word} again?`,
  },
  {
    sentence: (word) => `I can say ${word}.`,
    translation: (_word, zh) => `我會說「${zh}」。`,
    grammar: () => "I can + 原形動詞，表示「我會……」。",
    usage: "這句能幫孩子建立信心，也很適合每天複習一個新單字。",
    vocabulary: (word, zh) => `${word}: ${zh}；I: 我；can: 會、可以。`,
    example: (word) => `I can say ${word} clearly.`,
  },
  {
    sentence: (word) => `The word is ${word}.`,
    translation: (_word, zh) => `這個單字是「${zh}」。`,
    grammar: () => "The word is + 單字，用來介紹今天要學的字。",
    usage: "這句很適合做單字卡，也能讓孩子練習清楚說出目標單字。",
    vocabulary: (word, zh) => `${word}: ${zh}；word: 單字；is: 是。`,
    example: (word) => `The word is ${word}. Please repeat it.`,
  },
  {
    sentence: (word) => `Let's practice ${word}.`,
    translation: (_word, zh) => `我們來練習「${zh}」。`,
    grammar: () => "Let's + 原形動詞，表示「我們來……」。",
    usage: "這句適合老師帶讀，也適合親子一起複習單字。",
    vocabulary: (word, zh) => `${word}: ${zh}；let's: 我們來；practice: 練習。`,
    example: (word) => `Let's practice ${word} together.`,
  },
  {
    sentence: (word) => `${word} is today's word.`,
    translation: (_word, zh) => `「${zh}」是今天的單字。`,
    grammar: () => "A is today's word. 表示「A 是今天的單字」。",
    usage: "這句簡單、固定，很適合每天開始學習時使用。",
    vocabulary: (word, zh) => `${word}: ${zh}；today: 今天；word: 單字。`,
    example: (word) => `${word} is today's word. Say it three times.`,
  },
];

function dateStringFromStart(index) {
  const date = new Date(Date.UTC(2026, 4, 16 + index));
  return date.toISOString().slice(0, 10);
}

function buildItems() {
  const items = [];
  for (const [topicIndex, topic] of topics.entries()) {
    for (const [frameIndex, frame] of frames.entries()) {
      const [word, zh, phrase] = topic;
      items.push({
        courseId,
        publishDate: dateStringFromStart(topicIndex * frames.length + frameIndex),
        sentence: frame.sentence(word, zh, phrase),
        translation: frame.translation(word, zh, phrase),
        grammarNote: frame.grammar(word, zh, phrase),
        usageNote: frame.usage,
        vocabulary: frame.vocabulary(word, zh, phrase),
        example: frame.example(word, zh, phrase),
      });
    }
  }
  return items.slice(0, 365);
}

await authenticate();

const items = buildItems();
let ok = 0;
for (const item of items) {
  const result = await request("/api/admin/sentences", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(item),
  });

  if (!result.response.ok) {
    throw new Error(`Seed failed for ${item.publishDate}: ${result.response.status} ${JSON.stringify(result.data)}`);
  }

  ok += 1;
}

console.log(`Seeded ${ok} kids English sentences from ${items[0].publishDate} to ${items.at(-1).publishDate}.`);
