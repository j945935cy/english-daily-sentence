const baseUrl = process.env.SEED_BASE_URL ?? "https://english-daily-sentence.vercel.app";
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;

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
  let result = await request("/api/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ name: "Seed Admin", email, password }),
  });

  if (!result.response.ok && result.response.status === 409) {
    result = await request("/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ email, password }),
    });
  }

  if (!result.response.ok) {
    throw new Error(`Authentication failed: ${result.response.status} ${JSON.stringify(result.data)}`);
  }
}

const topics = [
  ["review new words", "複習新單字", "review: 複習；new words: 新單字"],
  ["listen for key words", "聽出關鍵字", "listen for: 留意聽；key words: 關鍵字"],
  ["repeat the sentence aloud", "大聲重複句子", "repeat: 重複；aloud: 大聲地"],
  ["ask a clear question", "問一個清楚的問題", "ask: 詢問；clear: 清楚的；question: 問題"],
  ["write one simple example", "寫一個簡單例句", "write: 寫；simple: 簡單的；example: 例子"],
  ["speak more slowly", "說得更慢一點", "speak: 說話；slowly: 慢慢地"],
  ["check the meaning first", "先確認意思", "check: 確認；meaning: 意思；first: 首先"],
  ["notice the verb tense", "注意動詞時態", "notice: 注意；verb tense: 動詞時態"],
  ["compare two similar words", "比較兩個相似單字", "compare: 比較；similar: 相似的"],
  ["use the word in context", "在語境中使用單字", "context: 語境；use: 使用"],
  ["make a short note", "做一則簡短筆記", "make a note: 做筆記；short: 簡短的"],
  ["read the sentence twice", "把句子讀兩次", "twice: 兩次；read: 閱讀"],
  ["focus on pronunciation", "專注在發音", "focus on: 專注於；pronunciation: 發音"],
  ["learn from small mistakes", "從小錯誤中學習", "learn from: 從...學習；mistake: 錯誤"],
  ["try a different expression", "試一種不同說法", "different: 不同的；expression: 說法"],
  ["summarize the main idea", "總結主要想法", "summarize: 總結；main idea: 主要想法"],
  ["answer in a full sentence", "用完整句回答", "answer: 回答；full sentence: 完整句"],
  ["practice a useful phrase", "練習一個實用片語", "useful: 實用的；phrase: 片語"],
  ["build a daily habit", "建立每日習慣", "build: 建立；daily habit: 每日習慣"],
  ["listen before speaking", "先聽再說", "before: 在...之前；speaking: 說話"],
  ["organize my thoughts", "整理自己的想法", "organize: 整理；thoughts: 想法"],
  ["describe the picture", "描述圖片", "describe: 描述；picture: 圖片"],
  ["explain my opinion", "說明自己的意見", "explain: 說明；opinion: 意見"],
  ["give a polite response", "給出禮貌回應", "polite: 禮貌的；response: 回應"],
  ["start with an easy sentence", "從簡單句開始", "start with: 從...開始；easy: 簡單的"],
  ["connect two ideas", "連接兩個想法", "connect: 連接；idea: 想法"],
  ["check the word order", "確認字詞順序", "word order: 字詞順序；check: 確認"],
  ["use a natural tone", "使用自然語氣", "natural: 自然的；tone: 語氣"],
  ["notice common patterns", "注意常見句型", "common: 常見的；pattern: 模式、句型"],
  ["review yesterday's sentence", "複習昨天的句子", "yesterday: 昨天；sentence: 句子"],
  ["listen to a short clip", "聽一段短音檔", "clip: 短片段；short: 短的"],
  ["say the phrase with confidence", "有自信地說出片語", "confidence: 自信；phrase: 片語"],
  ["turn a mistake into practice", "把錯誤變成練習", "turn into: 變成；practice: 練習"],
  ["notice how natives say it", "注意母語者怎麼說", "native: 母語者；notice: 注意"],
  ["choose the right preposition", "選對介系詞", "choose: 選擇；preposition: 介系詞"],
  ["keep the sentence simple", "讓句子保持簡單", "keep: 保持；simple: 簡單的"],
  ["ask for one more example", "多請對方給一個例子", "ask for: 請求；one more: 再一個"],
  ["practice active listening", "練習主動聆聽", "active listening: 主動聆聽"],
  ["notice the stress in a word", "注意單字重音", "stress: 重音；word: 單字"],
  ["write a better answer", "寫出更好的回答", "better: 更好的；answer: 回答"],
  ["use English for one task", "用英文完成一件事", "task: 任務；use: 使用"],
  ["explain the reason clearly", "清楚說明原因", "reason: 原因；clearly: 清楚地"],
  ["learn one collocation", "學一組搭配詞", "collocation: 搭配詞"],
  ["notice the article before a noun", "注意名詞前的冠詞", "article: 冠詞；noun: 名詞"],
  ["turn notes into sentences", "把筆記變成句子", "turn into: 變成；notes: 筆記"],
  ["practice asking follow-up questions", "練習追問問題", "follow-up question: 追問問題"],
  ["speak in a calm voice", "用平穩語氣說話", "calm: 平靜的；voice: 聲音"],
  ["read for the general meaning", "閱讀時先抓大意", "general meaning: 大意"],
  ["learn a phrase I can use today", "學一句今天用得到的片語", "phrase: 片語；today: 今天"],
  ["describe my plan briefly", "簡短描述自己的計畫", "briefly: 簡短地；plan: 計畫"],
  ["check whether it sounds natural", "確認它聽起來是否自然", "whether: 是否；natural: 自然的"],
  ["make the sentence more polite", "讓句子更有禮貌", "polite: 禮貌的；more: 更"],
  ["replace a difficult word", "替換一個困難單字", "replace: 替換；difficult: 困難的"],
  ["practice saying numbers", "練習說數字", "numbers: 數字；practice: 練習"],
  ["notice how questions are formed", "注意疑問句如何形成", "form: 形成；question: 問題"],
  ["use one new word today", "今天使用一個新單字", "new word: 新單字；today: 今天"],
  ["listen for the speaker's attitude", "聽出說話者態度", "attitude: 態度；speaker: 說話者"],
  ["give a short presentation", "做一段簡短報告", "presentation: 報告；short: 簡短的"],
  ["explain a simple process", "說明一個簡單流程", "process: 流程；simple: 簡單的"],
  ["practice small talk", "練習簡短寒暄", "small talk: 寒暄、閒聊"],
  ["notice useful sentence starters", "注意實用開頭句", "sentence starter: 句子開頭"],
  ["read the example carefully", "仔細閱讀例句", "carefully: 仔細地；example: 例句"],
  ["make my point directly", "直接說出重點", "point: 重點；directly: 直接地"],
  ["use a friendly expression", "使用友善說法", "friendly: 友善的；expression: 說法"],
  ["review the grammar pattern", "複習文法句型", "grammar pattern: 文法句型"],
  ["try speaking without translating", "試著不翻譯就開口", "without: 沒有；translate: 翻譯"],
  ["learn from a real conversation", "從真實對話中學習", "real: 真實的；conversation: 對話"],
  ["write a sentence about my day", "寫一句關於今天的句子", "about: 關於；day: 一天"],
  ["ask for clarification", "請對方釐清意思", "clarification: 釐清、說明"],
  ["notice the ending sound", "注意結尾音", "ending sound: 結尾音"],
  ["say the sentence three times", "把句子說三次", "three times: 三次；say: 說"],
  ["choose a clearer word", "選一個更清楚的字", "clearer: 更清楚的；choose: 選擇"],
  ["keep learning even when it feels slow", "即使覺得慢也持續學習", "even when: 即使；slow: 慢的"],
];

const frames = [
  {
    sentence: (verb) => `I can ${verb} a little better every day.`,
    translation: (zh) => `我每天都能更好地${zh}一點。`,
    grammar: (verb) => `I can ${verb} 使用 can 加原形動詞，表示能力或可能性。`,
    usage: "這句適合用來鼓勵自己持續練習，語氣自然，也很適合寫在學習日記裡。",
    example: (verb) => `With practice, I can ${verb} more naturally.`,
  },
  {
    sentence: (verb) => `It helps me to ${verb} before I move on.`,
    translation: (zh) => `在繼續下一步之前，${zh}對我很有幫助。`,
    grammar: (verb) => `It helps me to ${verb} 使用 it 作形式主詞，to 後面接原形動詞。`,
    usage: "這句常用來描述有效的學習方法，也能用在工作或生活習慣。",
    example: (verb) => `It helps me to ${verb} when I feel unsure.`,
  },
  {
    sentence: (verb) => `Today, I will ${verb} with more attention.`,
    translation: (zh) => `今天，我會更專心地${zh}。`,
    grammar: (verb) => `will ${verb} 表示今天的計畫或決定，with more attention 表示更專注地。`,
    usage: "這句適合設定每日小目標，簡單明確，也能幫助建立學習節奏。",
    example: (verb) => `Today, I will ${verb} for five minutes.`,
  },
  {
    sentence: (verb) => `The best way to improve is to ${verb} regularly.`,
    translation: (zh) => `進步最好的方式，就是規律地${zh}。`,
    grammar: (verb) => `The best way to improve is to ${verb} 使用 to 不定詞說明方法。`,
    usage: "這句很適合談學習建議，語氣肯定，也容易套用到不同技能。",
    example: (verb) => `The best way to remember it is to ${verb} regularly.`,
  },
  {
    sentence: (verb) => `I do not need to be perfect; I just need to ${verb}.`,
    translation: (zh) => `我不需要完美；我只需要${zh}。`,
    grammar: () => `do not need to 加原形動詞，表示不必做某事；just need to 表示只需要。`,
    usage: "這句能降低學習壓力，提醒自己把注意力放在行動而不是完美。",
    example: (verb) => `I do not need to know every word; I just need to ${verb}.`,
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
      const [verb, zh, vocabulary] = topic;
      items.push({
        publishDate: dateStringFromStart(topicIndex * frames.length + frameIndex),
        sentence: frame.sentence(verb),
        translation: frame.translation(zh),
        grammarNote: frame.grammar(verb),
        usageNote: frame.usage,
        vocabulary,
        example: frame.example(verb),
      });
    }
  }
  return items;
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

console.log(`Seeded ${ok} daily sentences from ${items[0].publishDate} to ${items.at(-1).publishDate}.`);
