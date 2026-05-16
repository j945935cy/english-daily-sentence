const baseUrl = process.env.SEED_BASE_URL ?? "https://english-daily-sentence.vercel.app";
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const courseId = "grammar-english";

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
  ["Be Verb: I am ready.", "be 動詞用來連接主詞和身分、狀態或位置。", "主詞不同時，be 動詞會變成 am、is、are。", "描述身分、心情、地點時常用。", "be verb: be 動詞；ready: 準備好的。", "She is ready for class."],
  ["Subject Pronouns: She is my friend.", "主詞代名詞放在句首，代替人或事物。", "I、you、he、she、it、we、they 都可以當主詞。", "避免一直重複名字時很常用。", "subject: 主詞；pronoun: 代名詞。", "They are my classmates."],
  ["Object Pronouns: Please help me.", "受詞代名詞放在動詞或介系詞後面。", "me、you、him、her、it、us、them 常當受詞。", "請求、描述動作對象時常用。", "object: 受詞；help: 幫助。", "Can you call him later?"],
  ["Possessive Adjectives: This is my book.", "所有格形容詞放在名詞前，表示屬於誰。", "my、your、his、her、its、our、their 後面要接名詞。", "介紹物品、家人、朋友時常用。", "possessive: 所有格；book: 書。", "Her bag is on the chair."],
  ["Articles: I have a pen.", "冠詞放在名詞前，幫助說明名詞是否特定。", "a/an 用於單數可數名詞，the 用於特定的人事物。", "第一次提到常用 a/an，再次提到常用 the。", "article: 冠詞；pen: 筆。", "I saw a dog. The dog was cute."],
  ["Plural Nouns: I have two books.", "複數名詞表示兩個以上的人或物。", "多數名詞加 s 或 es，但也有不規則複數。", "數量、清單、比較時常用。", "plural: 複數；book: 書。", "There are three buses here."],
  ["There Is: There is a cat.", "There is 用來表示某處有一個人或物。", "There is 後面接單數名詞或不可數名詞。", "描述房間、圖片、地點時很好用。", "there is: 有；cat: 貓。", "There is a desk in my room."],
  ["There Are: There are two chairs.", "There are 用來表示某處有兩個以上的人或物。", "There are 後面接複數名詞。", "描述場景或物品數量時常用。", "there are: 有；chair: 椅子。", "There are many students in the classroom."],
  ["Present Simple: I study English.", "一般現在式描述習慣、事實或固定狀態。", "主詞是 he、she、it 時，動詞通常加 s 或 es。", "說每天、通常、常常做的事時常用。", "present simple: 一般現在式；study: 讀書。", "She studies English every day."],
  ["Present Simple Negative: I do not like onions.", "一般現在式否定句用 do not 或 does not。", "he、she、it 用 does not，後面動詞用原形。", "表達不喜歡、不做某事時常用。", "negative: 否定；onion: 洋蔥。", "He does not eat fish."],
  ["Present Simple Question: Do you play soccer?", "一般現在式疑問句用 Do 或 Does 開頭。", "Does 後面的主要動詞要用原形。", "詢問習慣、喜好、日常活動時常用。", "question: 問句；soccer: 足球。", "Does she play the piano?"],
  ["Adverbs of Frequency: I usually walk to school.", "頻率副詞說明事情發生的頻率。", "always、usually、often、sometimes、never 常放在一般動詞前。", "描述生活習慣時很好用。", "frequency: 頻率；usually: 通常。", "He often reads before bed."],
  ["Present Continuous: I am reading now.", "現在進行式描述正在發生的動作。", "be 動詞加上 V-ing。", "說現在、此刻正在做什麼時常用。", "continuous: 進行式；read: 閱讀。", "They are playing outside."],
  ["Present Continuous Negative: She is not sleeping.", "現在進行式否定句在 be 動詞後加 not。", "主詞 + am/is/are + not + V-ing。", "說明某件事現在沒有發生。", "sleep: 睡覺；not: 不。", "I am not watching TV now."],
  ["Present Continuous Question: Are you listening?", "現在進行式疑問句把 be 動詞移到句首。", "Am/Is/Are + 主詞 + V-ing？", "確認對方是否正在做某事時常用。", "listen: 聽；question: 問句。", "Is he doing his homework?"],
  ["Past Simple: I visited my grandma.", "一般過去式描述過去發生並結束的事。", "規則動詞通常加 ed，不規則動詞要另外記。", "講昨天、上週、以前的事情時常用。", "past simple: 一般過去式；visit: 拜訪。", "We watched a movie last night."],
  ["Past Simple Negative: I did not go out.", "過去式否定句用 did not。", "did not 後面的主要動詞要用原形。", "說明過去沒有做某事。", "did not: 沒有；go out: 出門。", "She did not finish the book."],
  ["Past Simple Question: Did you call him?", "過去式疑問句用 Did 開頭。", "Did 後面的主要動詞用原形。", "詢問過去是否做過某事時常用。", "did: 助動詞；call: 打電話。", "Did they arrive on time?"],
  ["Future with Will: I will help you.", "will 用來表示未來、承諾或臨時決定。", "will 後面接原形動詞。", "承諾、預測、快速決定時常用。", "future: 未來；will: 將會。", "She will join us tomorrow."],
  ["Future with Be Going To: I am going to study.", "be going to 用來表示計畫或即將發生的事。", "be 動詞隨主詞變化，going to 後接原形動詞。", "說已經有安排的未來計畫。", "plan: 計畫；going to: 將要。", "They are going to visit Taipei."],
  ["Can: I can swim.", "can 表示能力、可能性或允許。", "can 後面接原形動詞。", "說會不會、可不可以時很常用。", "can: 能、可以；swim: 游泳。", "Can you help me?"],
  ["Must: You must wear a helmet.", "must 表示必須，語氣較強。", "must 後面接原形動詞。", "說規定、責任或強烈建議時常用。", "must: 必須；helmet: 安全帽。", "Students must be quiet here."],
  ["Should: You should rest.", "should 表示應該，常用來給建議。", "should 後面接原形動詞。", "給溫和建議或提醒時常用。", "should: 應該；rest: 休息。", "You should drink more water."],
  ["May: May I come in?", "may 可用來禮貌請求允許。", "May I + 原形動詞？是正式、禮貌的問法。", "進教室、借東西、請求協助時可用。", "may: 可以；come in: 進來。", "May I ask a question?"],
  ["Imperatives: Open your book.", "祈使句用來給指令、請求或建議。", "通常直接用原形動詞開頭。", "課堂指令、食譜、提醒都常見。", "imperative: 祈使句；open: 打開。", "Please write it down."],
  ["Countable Nouns: I have three apples.", "可數名詞可以用數字計算。", "單數前常有 a/an，複數常加 s 或 es。", "談數量、購物、清單時常用。", "countable: 可數的；apple: 蘋果。", "She has two pencils."],
  ["Uncountable Nouns: I need some water.", "不可數名詞不能直接加 a/an 或數字。", "常搭配 some、much、a cup of 等表達數量。", "談液體、材料、抽象概念時常用。", "uncountable: 不可數的；water: 水。", "We need a bottle of milk."],
  ["Some and Any: I have some questions.", "some 常用於肯定句，any 常用於否定句和疑問句。", "some 表示一些，any 表示任何或一些。", "詢問、提供或否定數量時常用。", "some: 一些；any: 任何。", "Do you have any questions?"],
  ["Much and Many: I have many books.", "many 修飾可數複數，much 修飾不可數名詞。", "many books，much water 是常見搭配。", "談數量多寡時常用。", "many: 很多；much: 很多。", "She does not have much time."],
  ["A Lot Of: I have a lot of homework.", "a lot of 可以修飾可數和不可數名詞。", "語氣自然，口語和書寫都常見。", "想簡單表示很多時很好用。", "a lot of: 很多；homework: 作業。", "There are a lot of people here."],
  ["Prepositions of Place: The bag is on the desk.", "地方介系詞說明位置。", "in、on、under、next to、between 都常用。", "描述物品位置或問路時常用。", "preposition: 介系詞；place: 地方。", "The cat is under the chair."],
  ["Prepositions of Time: I study at seven.", "時間介系詞說明時間點或期間。", "at 用時間點，on 用日期或星期，in 用月份、年份或時段。", "安排活動、說明時間時常用。", "time: 時間；at: 在。", "We meet on Monday."],
  ["Prepositions of Direction: Go to the library.", "方向介系詞說明移動方向。", "to、into、out of、through、across 都常見。", "問路、描述移動時常用。", "direction: 方向；library: 圖書館。", "She walked into the room."],
  ["Adjectives: It is a quiet room.", "形容詞描述名詞的樣子或狀態。", "形容詞常放在名詞前，也可放在 be 動詞後。", "描述人、物、地方時常用。", "adjective: 形容詞；quiet: 安靜的。", "The soup is hot."],
  ["Adverbs: She speaks clearly.", "副詞描述動詞、形容詞或整句話。", "許多副詞以 ly 結尾，但不是全部。", "說明動作怎麼發生時常用。", "adverb: 副詞；clearly: 清楚地。", "He runs quickly."],
  ["Comparatives: This bag is bigger.", "比較級用來比較兩個人或物。", "短形容詞常加 er，長形容詞常用 more。", "比較大小、速度、感受時常用。", "comparative: 比較級；bigger: 更大的。", "English is easier with practice."],
  ["Superlatives: This is the best day.", "最高級用來比較三個以上的人或物。", "常搭配 the，短形容詞加 est，長形容詞用 most。", "說最喜歡、最重要、最好時常用。", "superlative: 最高級；best: 最好的。", "She is the tallest student."],
  ["And: I like tea and coffee.", "and 連接相同類型的字、片語或句子。", "and 表示加上、以及。", "列舉喜好、物品或動作時常用。", "and: 和、以及；coffee: 咖啡。", "He sings and dances."],
  ["But: I am tired, but I am happy.", "but 連接相反或轉折的想法。", "but 前後常有對比。", "表達雖然如此但仍然怎樣時常用。", "but: 但是；tired: 累的。", "It is small, but it is useful."],
  ["Because: I stayed home because it rained.", "because 說明原因。", "because 後面接一個完整句子。", "回答為什麼時常用。", "because: 因為；rain: 下雨。", "She smiled because she was happy."],
  ["So: It rained, so we stayed home.", "so 表示結果。", "前面是原因，後面是結果。", "說明事情造成的結果時常用。", "so: 所以；stay home: 待在家。", "I was hungry, so I ate lunch."],
  ["If: If it rains, I will stay home.", "if 引導條件句。", "條件句常用 if + 現在式，主句用 will。", "說如果發生某事，就會做某事。", "if: 如果；condition: 條件。", "If I have time, I will call you."],
  ["When: Call me when you arrive.", "when 表示當某事發生時。", "when 後面接時間條件。", "安排順序、提醒動作時常用。", "when: 當……時；arrive: 到達。", "I brush my teeth when I wake up."],
  ["Before: Wash your hands before lunch.", "before 表示在……之前。", "before 後可接名詞或完整句子。", "說明事情先後順序時常用。", "before: 在……之前；lunch: 午餐。", "I read before I sleep."],
  ["After: I rest after school.", "after 表示在……之後。", "after 後可接名詞或完整句子。", "描述日常順序時常用。", "after: 在……之後；school: 學校。", "She studies after dinner."],
  ["Gerunds: I enjoy reading.", "動名詞是 V-ing 形式，當名詞使用。", "enjoy、finish、practice 後常接動名詞。", "說喜好、活動或習慣時常用。", "gerund: 動名詞；enjoy: 享受。", "He finished writing the letter."],
  ["Infinitives: I want to learn.", "不定詞是 to + 原形動詞。", "want、need、hope、plan 後常接不定詞。", "說目標、需求、計畫時常用。", "infinitive: 不定詞；learn: 學習。", "She hopes to travel next year."],
  ["Like + V-ing: I like swimming.", "like 後可接動名詞表示喜歡的活動。", "like + V-ing 強調活動本身。", "談興趣與休閒活動時常用。", "swimming: 游泳；activity: 活動。", "They like playing basketball."],
  ["Want + To: I want to improve.", "want 後常接 to + 原形動詞。", "want to 表示想要做某事。", "說目標、願望或選擇時常用。", "want: 想要；improve: 進步。", "I want to speak English better."],
  ["Have To: I have to study.", "have to 表示必須，常因外在規定或情況。", "主詞是 he、she、it 時用 has to。", "說責任、規定、不得不做的事。", "have to: 必須；study: 讀書。", "She has to finish her homework."],
  ["Used To: I used to play tennis.", "used to 表示過去常做但現在不一定做。", "used to 後接原形動詞。", "談過去習慣或以前的狀態時常用。", "used to: 過去常常；tennis: 網球。", "He used to live in Tainan."],
  ["Need To: I need to practice.", "need to 表示需要做某事。", "need to 後面接原形動詞。", "說學習目標、工作任務或生活需求時常用。", "need: 需要；practice: 練習。", "We need to leave early."],
  ["Would Like To: I would like to order.", "would like to 是禮貌表達想要做某事。", "比 want to 更客氣。", "點餐、請求、正式場合常用。", "would like to: 想要；order: 點餐。", "I would like to ask a question."],
  ["Passive Voice: The cake was made by Mom.", "被動語態強調動作承受者。", "be 動詞 + 過去分詞。", "不知道動作者或想強調結果時常用。", "passive voice: 被動語態；made: 製作。", "The window was broken yesterday."],
  ["Relative Clauses: The girl who sings is my sister.", "關係子句補充說明前面的名詞。", "who 指人，which 指物，that 可指人或物。", "想把兩句話合成一句時常用。", "relative clause: 關係子句；who: 關係代名詞。", "The book that I bought is useful."],
  ["Present Perfect: I have finished my homework.", "現在完成式連結過去和現在。", "have/has + 過去分詞。", "說經驗、完成、持續到現在的事時常用。", "present perfect: 現在完成式；finished: 完成。", "She has lived here for five years."],
  ["For and Since: I have studied for two hours.", "for 表示一段時間，since 表示起始點。", "for two days，since Monday 是常見搭配。", "搭配現在完成式描述持續時間。", "for: 持續；since: 自從。", "He has worked here since 2020."],
  ["Already and Yet: I have already eaten.", "already 表示已經，yet 常用在否定句或疑問句表示尚未。", "already 常放在 have/has 後，yet 常放句尾。", "談完成與否時常用。", "already: 已經；yet: 尚未。", "Have you finished yet?"],
  ["Too and Enough: The bag is too heavy.", "too 表示太過，enough 表示足夠。", "too + 形容詞；形容詞 + enough。", "描述程度是否合適時常用。", "too: 太；enough: 足夠。", "The room is big enough."],
  ["Either and Neither: I do not like either one.", "either 表示兩者之一或任一，neither 表示兩者都不。", "兩者選擇與否定時常見。", "比較兩個選項時常用。", "either: 任一；neither: 兩者都不。", "Neither answer is correct."],
  ["Both: Both answers are correct.", "both 表示兩者都。", "both 後常接複數名詞。", "說兩個人或物都有同樣情況。", "both: 兩者都；correct: 正確的。", "Both students are ready."],
  ["Each and Every: Every student has a book.", "each 強調個別，every 強調整體中的每一個。", "each 可用於兩個以上，every 常用於三個以上。", "描述群體中每個人時常用。", "each: 每一個；every: 每個。", "Each child got a gift."],
  ["Question Words: What do you need?", "疑問詞用來問特定資訊。", "what、where、when、who、why、how 各有不同功能。", "問人事時地物與原因方法時常用。", "question word: 疑問詞；need: 需要。", "Where do you live?"],
  ["Tag Questions: You are ready, aren't you?", "附加問句用在句尾確認資訊。", "前面肯定，後面通常否定；前面否定，後面通常肯定。", "確認對方同不同意時常用。", "tag question: 附加問句；ready: 準備好的。", "She can swim, can't she?"],
  ["Indirect Questions: Do you know where he is?", "間接問句語氣較禮貌。", "間接問句後面通常使用陳述句語序。", "正式詢問或不想太直接時常用。", "indirect question: 間接問句；know: 知道。", "Can you tell me what this means?"],
  ["Reported Speech: She said she was tired.", "間接引述用來轉述別人的話。", "常需要調整時態、代名詞和時間詞。", "報告、故事、轉述對話時常用。", "reported speech: 間接引述；said: 說。", "He said he liked the book."],
  ["First Conditional: If I study, I will pass.", "第一類條件句描述可能發生的未來結果。", "If + 現在式，will + 原形動詞。", "談真實可能的條件與結果。", "conditional: 條件句；pass: 通過。", "If it rains, we will stay home."],
  ["Second Conditional: If I had time, I would travel.", "第二類條件句描述不太真實或假設的情況。", "If + 過去式，would + 原形動詞。", "談想像、願望、假設時常用。", "would: 會；travel: 旅行。", "If I were rich, I would help more people."],
  ["Phrasal Verbs: Please turn off the light.", "片語動詞由動詞加副詞或介系詞組成。", "意思常不能只看單字直接推測。", "日常英文和口語非常常見。", "phrasal verb: 片語動詞；turn off: 關掉。", "Please put on your jacket."],
  ["Sentence Order: I read books at night.", "英文基本句序常是主詞 + 動詞 + 受詞。", "時間和地點通常放在句尾，強調時可調整。", "寫句子時先抓主詞和動詞。", "sentence order: 句序；at night: 在晚上。", "She drinks tea in the morning."],
  ["Capital Letters: My name is Amy.", "英文句首和專有名詞要大寫。", "人名、地名、星期、月份、I 都要大寫。", "寫作時這是很常見的基本規則。", "capital letter: 大寫字母；name: 名字。", "I live in Chiayi."],
  ["Commas: After dinner, I read a book.", "逗號可以幫助句子停頓與分隔資訊。", "句首時間片語或連接詞片語後常用逗號。", "讓長句更清楚時很有用。", "comma: 逗號；after dinner: 晚餐後。", "When I got home, I called her."],
];

const practiceNotes = [
  "今日小練習：照例句換一個主詞再寫一次。",
  "今日小練習：把例句改成否定句。",
  "今日小練習：把例句改成疑問句。",
  "今日小練習：用這個文法寫一句跟自己有關的句子。",
  "今日小練習：大聲朗讀例句三次，注意動詞位置。",
];

function dateStringFromStart(index) {
  const date = new Date(Date.UTC(2026, 4, 16));
  date.setUTCDate(date.getUTCDate() + index);
  return date.toISOString().slice(0, 10);
}

function buildItems() {
  const items = [];
  for (let day = 0; day < 365; day += 1) {
    const base = topics[day % topics.length];
    const round = Math.floor(day / topics.length);
    items.push({
      courseId,
      publishDate: dateStringFromStart(day),
      sentence: base[0],
      translation: base[1],
      grammarNote: base[2],
      usageNote: `${base[3]} ${practiceNotes[round % practiceNotes.length]}`,
      vocabulary: base[4],
      example: base[5],
    });
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
    throw new Error(`Seed failed at ${item.publishDate}: ${result.response.status} ${JSON.stringify(result.data)}`);
  }
  ok += 1;
}

console.log(`Seeded ${ok} grammar English lessons from ${items[0].publishDate} to ${items.at(-1).publishDate}.`);
