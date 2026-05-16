const baseUrl = process.env.SEED_BASE_URL ?? "https://english-daily-sentence.vercel.app";
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const courseId = "motivational-english";

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

const sentences = [
  ["Small steps lead to big changes.", "小小的步伐會帶來大的改變。", "Small steps 是主詞，lead to 表示「帶來」。", "適合提醒自己每天前進一點就有力量。", "small: 小的；step: 步伐；lead to: 帶來；change: 改變。", "Small steps today can change tomorrow."],
  ["Keep going, even when it is hard.", "就算困難，也要繼續前進。", "Keep going 表示持續前進，even when 表示即使在某種情況下。", "遇到挫折時可用來鼓勵自己。", "keep going: 繼續前進；hard: 困難的。", "Keep going, even when you feel tired."],
  ["You are stronger than you think.", "你比自己想像的更堅強。", "stronger than 表示「比……更強」。", "適合在缺乏信心時提醒自己。", "stronger: 更強的；think: 想、認為。", "You are braver than you think."],
  ["Progress matters more than perfection.", "進步比完美更重要。", "more than 用來比較兩件事的重要性。", "適合提醒自己不要被完美主義卡住。", "progress: 進步；matter: 重要；perfection: 完美。", "Practice matters more than perfection."],
  ["Start where you are.", "從你現在的位置開始。", "Start where... 表示從某個狀態或地方開始。", "不知道怎麼開始時，先從眼前能做的事做起。", "start: 開始；where: 在哪裡；are: 是、在。", "Start where you are and take one step."],
  ["Your effort is not wasted.", "你的努力不會白費。", "is not wasted 表示沒有被浪費。", "適合在看不到成果時給自己信心。", "effort: 努力；wasted: 被浪費的。", "Every effort is not wasted."],
  ["One good choice can change your day.", "一個好的選擇可以改變你的一天。", "can + 原形動詞表示可能或能力。", "早上開始時可以用這句提醒自己做出好選擇。", "choice: 選擇；change: 改變；day: 一天。", "One kind word can change your day."],
  ["Believe in your next step.", "相信你的下一步。", "Believe in 表示相信、信任。", "面對不確定時，先相信自己能走下一步。", "believe in: 相信；next: 下一個；step: 步伐。", "Believe in your next small step."],
  ["A little practice builds confidence.", "一點練習會建立信心。", "A little + 名詞表示一點點。", "適合語言學習或技能練習。", "practice: 練習；build: 建立；confidence: 信心。", "Daily practice builds confidence."],
  ["Do one thing well today.", "今天把一件事做好。", "Do + 受詞 + well 表示把某件事做好。", "任務太多時，可以先專注一件事。", "thing: 事情；well: 好地；today: 今天。", "Do one small thing well today."],
  ["Your pace is still progress.", "你的速度仍然是進步。", "still 表示仍然，pace 表示步調。", "適合提醒自己慢一點也沒關係。", "pace: 步調；still: 仍然；progress: 進步。", "A slow pace is still progress."],
  ["Learn from every mistake.", "從每個錯誤中學習。", "learn from 表示從……學習。", "犯錯後可以用這句轉換心態。", "learn: 學習；mistake: 錯誤；every: 每一個。", "Learn from every mistake and try again."],
  ["Try again with a calm heart.", "帶著平靜的心再試一次。", "Try again 表示再試一次，with 表示帶著。", "失敗後先穩住情緒，再重新嘗試。", "try again: 再試一次；calm: 平靜的；heart: 心。", "Try again with a clear mind."],
  ["Hard days can teach strong lessons.", "艱難的日子能教會深刻的課。", "can teach 表示能教導。", "適合把困難看成學習的一部分。", "hard: 艱難的；teach: 教；lesson: 課、教訓。", "Hard moments can teach strong lessons."],
  ["You can begin again.", "你可以重新開始。", "begin again 表示重新開始。", "適合用在失敗、拖延或中斷後。", "begin: 開始；again: 再一次；can: 可以。", "You can begin again tomorrow."],
  ["Focus on what you can do.", "專注在你能做的事。", "what you can do 是名詞子句，表示你能做的事情。", "遇到壓力時先回到可控制的行動。", "focus on: 專注於；can: 能；do: 做。", "Focus on what you can do today."],
  ["Your future grows from today.", "你的未來從今天開始成長。", "grow from 表示從……成長而來。", "適合提醒自己今天的行動會累積成未來。", "future: 未來；grow: 成長；today: 今天。", "A better future grows from small habits."],
  ["Be patient with your growth.", "對自己的成長有耐心。", "Be patient with 表示對……有耐心。", "適合在進步很慢時鼓勵自己。", "patient: 有耐心的；growth: 成長。", "Be patient with your learning."],
  ["Courage starts with one step.", "勇氣從一步開始。", "starts with 表示從……開始。", "適合在害怕時提醒自己先行動一點點。", "courage: 勇氣；start with: 從……開始；step: 步伐。", "Courage starts with one honest step."],
  ["Turn pressure into power.", "把壓力變成力量。", "turn A into B 表示把 A 變成 B。", "適合面對考試、工作或挑戰前使用。", "pressure: 壓力；power: 力量；turn into: 變成。", "Turn fear into power."],
  ["Stay steady and keep learning.", "保持穩定，繼續學習。", "Stay + 形容詞表示保持某種狀態。", "適合長期學習者每天提醒自己。", "steady: 穩定的；keep learning: 持續學習。", "Stay steady and keep moving."],
  ["A better habit starts small.", "更好的習慣從小開始。", "starts small 表示從小規模開始。", "適合建立新習慣，例如每天讀一句英文。", "habit: 習慣；better: 更好的；small: 小的。", "A strong habit starts small."],
  ["Choose hope over fear.", "選擇希望，而不是恐懼。", "over 在這裡表示優先於、勝過。", "適合在擔心時提醒自己選擇正向行動。", "choose: 選擇；hope: 希望；fear: 恐懼。", "Choose action over fear."],
  ["Make today count.", "讓今天有意義。", "make ... count 表示讓某事有價值。", "適合一天開始時設定心態。", "today: 今天；count: 有價值、有意義。", "Make this lesson count."],
  ["Your mind grows with practice.", "你的心智會隨著練習成長。", "grow with 表示隨著……成長。", "適合提醒自己能力可以透過練習變強。", "mind: 心智；grow: 成長；practice: 練習。", "Your English grows with practice."],
  ["Rest, then rise again.", "休息，然後再次站起來。", "then 表示然後，rise again 表示再次起身。", "適合疲累時提醒自己休息不是放棄。", "rest: 休息；rise: 起身；again: 再次。", "Rest today, then rise again tomorrow."],
  ["Every day is a new chance.", "每一天都是新的機會。", "Every day is... 表示每天都是某種可能。", "適合重新開始或調整心情。", "chance: 機會；new: 新的；every: 每一個。", "Every morning is a new chance."],
  ["Keep your goal in sight.", "把目標放在視線中。", "in sight 表示看得見、在眼前。", "適合提醒自己不要忘記方向。", "goal: 目標；sight: 視線；keep: 保持。", "Keep your dream in sight."],
  ["Small wins build big energy.", "小勝利會累積大能量。", "Small wins 是主詞，build 表示建立、累積。", "適合記錄每天完成的小進展。", "win: 勝利；energy: 能量；build: 建立。", "Small wins build strong confidence."],
  ["The next try may work.", "下一次嘗試可能會成功。", "may + 原形動詞表示可能。", "適合在失敗後鼓勵自己再試一次。", "next: 下一個；try: 嘗試；work: 奏效。", "The next try may be the one."],
  ["Keep your promise to yourself.", "遵守對自己的承諾。", "keep a promise 表示遵守承諾。", "適合建立自律與每日練習。", "promise: 承諾；yourself: 你自己；keep: 遵守。", "Keep one small promise to yourself."],
  ["You can grow through this.", "你可以透過這件事成長。", "grow through 表示經歷某事而成長。", "適合面對困難時轉換角度。", "grow: 成長；through: 透過、穿越；this: 這件事。", "You can grow through this challenge."],
  ["Kind words give strength.", "溫柔的話語會給人力量。", "give strength 表示給予力量。", "適合提醒自己也鼓勵身邊的人。", "kind: 友善的；word: 話語；strength: 力量。", "Kind words give people strength."],
  ["Your attitude shapes your day.", "你的態度會塑造你的一天。", "shape 在這裡表示塑造、影響。", "適合在一天開始時調整心態。", "attitude: 態度；shape: 塑造；day: 一天。", "A calm attitude shapes your day."],
  ["Move forward with purpose.", "帶著目標往前走。", "with purpose 表示帶著目的。", "適合提醒自己行動要有方向。", "move forward: 前進；purpose: 目的。", "Move forward with a clear purpose."],
  ["Your work has meaning.", "你的努力有意義。", "has meaning 表示有意義。", "適合在成果還沒出現時穩住自己。", "work: 努力、工作；meaning: 意義。", "Your daily work has meaning."],
  ["A brave start is enough.", "勇敢開始就已經足夠。", "enough 表示足夠。", "適合鼓勵自己先開始，不必等完全準備好。", "brave: 勇敢的；start: 開始；enough: 足夠。", "A small brave start is enough."],
  ["Let today be your reset.", "讓今天成為你的重新開始。", "let + 受詞 + 原形動詞表示讓某事發生。", "適合用在想重新整理節奏時。", "reset: 重置、重新開始；today: 今天。", "Let this morning be your reset."],
  ["Trust the process.", "相信過程。", "trust 表示相信，process 表示過程。", "適合提醒自己成果需要時間。", "trust: 信任；process: 過程。", "Trust the process and keep learning."],
  ["Your courage can inspire others.", "你的勇氣可以鼓舞別人。", "can inspire 表示能鼓舞。", "適合提醒自己行動會影響身邊的人。", "courage: 勇氣；inspire: 鼓舞；others: 其他人。", "Your courage can inspire your friends."],
  ["Keep learning from life.", "持續從生活中學習。", "learn from 表示從……學習。", "適合把每天的經驗當成教材。", "life: 生活；keep learning: 持續學習。", "Keep learning from every day."],
  ["One focused hour can matter.", "專注的一小時也會很重要。", "focused 是形容詞，matter 表示重要。", "適合讀書、工作或練習前提醒自己。", "focused: 專注的；hour: 小時；matter: 重要。", "One focused hour can change your week."],
  ["Do not quit on a hard day.", "不要在艱難的日子放棄。", "Do not + 原形動詞表示不要做某事。", "適合提醒自己不要讓一時低潮決定結果。", "quit: 放棄；hard: 艱難的；day: 日子。", "Do not quit on a bad day."],
  ["Your dream needs daily action.", "你的夢想需要每天行動。", "needs + 名詞表示需要某物。", "適合把夢想拆成每天能做的小行動。", "dream: 夢想；daily: 每日的；action: 行動。", "Your goal needs daily action."],
  ["Slow growth is still growth.", "慢慢成長仍然是成長。", "still 表示仍然。", "適合在進步不明顯時安慰自己。", "slow: 慢的；growth: 成長；still: 仍然。", "Slow learning is still learning."],
  ["Let effort speak for you.", "讓努力替你說話。", "let + 受詞 + 動詞表示讓某事發生。", "適合提醒自己用行動累積實力。", "effort: 努力；speak: 說話；for: 為了。", "Let your work speak for you."],
  ["A clear goal makes action easier.", "清楚的目標讓行動更容易。", "make + 受詞 + 形容詞表示使某事變得如何。", "適合在開始前先想清楚方向。", "clear: 清楚的；goal: 目標；action: 行動。", "A clear plan makes practice easier."],
  ["Stay humble and stay hungry.", "保持謙虛，也保持渴望。", "stay + 形容詞表示保持某種狀態。", "適合提醒自己持續學習，不自滿。", "humble: 謙虛的；hungry: 渴望的。", "Stay humble and keep growing."],
  ["What you repeat becomes stronger.", "你重複做的事會變得更強。", "what you repeat 是名詞子句，becomes 表示變成。", "適合建立每日練習與好習慣。", "repeat: 重複；become: 變成；stronger: 更強。", "What you practice becomes stronger."],
  ["Protect your focus.", "保護你的專注力。", "protect 表示保護。", "適合在容易分心時提醒自己。", "protect: 保護；focus: 專注。", "Protect your focus during study time."],
  ["You are allowed to improve slowly.", "你可以慢慢進步。", "be allowed to 表示被允許做某事。", "適合給自己一點耐心與空間。", "allowed: 被允許的；improve: 進步；slowly: 慢慢地。", "You are allowed to learn slowly."],
  ["Discipline creates freedom.", "自律會創造自由。", "create 表示創造。", "適合提醒自己規律不是限制，而是讓人生更有選擇。", "discipline: 自律；create: 創造；freedom: 自由。", "Daily discipline creates more freedom."],
  ["Choose progress every morning.", "每天早上選擇進步。", "Choose + 名詞表示選擇某事。", "適合早晨設定今天的方向。", "choose: 選擇；progress: 進步；morning: 早晨。", "Choose courage every morning."],
  ["Be proud of small progress.", "為小小的進步感到驕傲。", "be proud of 表示為……感到驕傲。", "適合肯定自己的努力。", "proud: 驕傲的；progress: 進步；small: 小的。", "Be proud of your daily progress."],
  ["Your best can change each day.", "你的最好狀態每天都可能不同。", "can change 表示可能改變。", "適合提醒自己不要用同一標準苛責每一天。", "best: 最好；change: 改變；each day: 每一天。", "Your best can look different each day."],
  ["Start before you feel ready.", "在覺得準備好之前就開始。", "before 表示在……之前。", "適合克服拖延與等待完美時機。", "ready: 準備好的；before: 在……之前；start: 開始。", "Start before you feel perfect."],
  ["Energy follows action.", "能量會跟著行動而來。", "follow 表示跟隨。", "適合提醒自己先動起來，狀態常會慢慢出現。", "energy: 能量；follow: 跟隨；action: 行動。", "Motivation often follows action."],
  ["You can handle this moment.", "你可以應付這一刻。", "handle 表示處理、應付。", "適合在緊張時把焦點縮小到現在。", "handle: 處理；moment: 時刻；this: 這個。", "You can handle this challenge."],
  ["A calm mind sees more clearly.", "平靜的心看得更清楚。", "see clearly 表示看清楚。", "適合提醒自己先冷靜再做決定。", "calm: 平靜的；mind: 心智；clearly: 清楚地。", "A calm mind makes better choices."],
  ["Every lesson makes you wiser.", "每一課都讓你更有智慧。", "make + 受詞 + 形容詞表示使某人變得如何。", "適合把經驗、錯誤與挑戰都當成學習。", "lesson: 課；wise: 有智慧的；wiser: 更有智慧的。", "Every mistake makes you wiser."],
  ["Hold on to your reason.", "緊緊記住你的理由。", "hold on to 表示抓住、堅持。", "適合提醒自己為什麼開始。", "reason: 理由；hold on to: 緊握、堅持。", "Hold on to your reason when it gets hard."],
  ["Your habits shape your future.", "你的習慣塑造你的未來。", "shape 表示塑造、影響。", "適合提醒自己每天的小習慣很重要。", "habit: 習慣；shape: 塑造；future: 未來。", "Good habits shape a better future."],
  ["Keep showing up.", "持續出現，持續做到。", "show up 可表示出現、到場，也可指持續投入。", "適合提醒自己穩定比偶爾爆發更可靠。", "keep: 持續；show up: 出現、投入。", "Keep showing up for your goals."],
  ["Light grows in small places.", "光會在小地方長大。", "grow 表示成長，in small places 表示在小地方。", "適合提醒自己微小希望也值得保護。", "light: 光；grow: 成長；place: 地方。", "Hope grows in small places."],
  ["Let kindness guide your strength.", "讓善意引導你的力量。", "guide 表示引導。", "適合提醒自己有力量時也保持溫柔。", "kindness: 善意；guide: 引導；strength: 力量。", "Let kindness guide your words."],
  ["A strong finish begins now.", "強而有力的完成從現在開始。", "begins now 表示現在開始。", "適合在接近結尾或想重新衝刺時使用。", "finish: 完成、結尾；begin: 開始；now: 現在。", "A strong week begins now."],
  ["Do less, but do it well.", "少做一點，但做好它。", "but 連接兩個相反或轉折的想法。", "適合提醒自己不要貪多，先求穩定完成。", "less: 較少；well: 好地；do: 做。", "Do one thing, but do it well."],
  ["Your voice can encourage someone.", "你的話語可以鼓勵某個人。", "can encourage 表示可以鼓勵。", "適合提醒自己一句好話也有力量。", "voice: 聲音、話語；encourage: 鼓勵；someone: 某人。", "Your words can encourage a friend."],
  ["Stand tall after the storm.", "風雨過後，挺直站好。", "stand tall 表示挺直站立，也有堅強面對的意思。", "適合經歷困難後重新整理自己。", "stand tall: 挺直站立；storm: 風暴。", "Stand tall after a hard day."],
  ["Give yourself another chance.", "再給自己一次機會。", "give someone a chance 表示給某人機會。", "適合犯錯後提醒自己重新來過。", "chance: 機會；another: 另一個；yourself: 你自己。", "Give yourself another chance to learn."],
  ["Better days need brave choices.", "更好的日子需要勇敢的選擇。", "need + 名詞表示需要某物。", "適合提醒自己改變通常從選擇開始。", "better: 更好的；brave: 勇敢的；choice: 選擇。", "Better habits need brave choices."],
  ["Make room for growth.", "為成長留出空間。", "make room for 表示為……騰出空間。", "適合提醒自己要留時間學習、休息和調整。", "room: 空間；growth: 成長；make room for: 留空間給。", "Make room for new habits."],
  ["Today is enough to begin.", "今天就足夠開始了。", "enough to + 動詞表示足以做某事。", "適合提醒自己不必等到完美日期。", "today: 今天；enough: 足夠；begin: 開始。", "This moment is enough to begin."],
];

const repeatNotes = [
  "把這句大聲讀三次，感受句子的節奏。",
  "把這句寫在今天的筆記或手機備忘錄。",
  "想一件今天可以實際做到的小行動。",
  "用這句鼓勵一位朋友或同學。",
  "睡前回想今天哪一刻用到了這個精神。",
];

function dateStringFromStart(index) {
  const date = new Date(Date.UTC(2026, 4, 16));
  date.setUTCDate(date.getUTCDate() + index);
  return date.toISOString().slice(0, 10);
}

function buildItems() {
  const items = [];
  for (let day = 0; day < 365; day += 1) {
    const base = sentences[day % sentences.length];
    const round = Math.floor(day / sentences.length);
    items.push({
      courseId,
      publishDate: dateStringFromStart(day),
      sentence: base[0],
      translation: base[1],
      grammarNote: base[2],
      usageNote: `${base[3]} 今日小練習：${repeatNotes[round % repeatNotes.length]}`,
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

console.log(`Seeded ${ok} motivational English sentences from ${items[0].publishDate} to ${items.at(-1).publishDate}.`);
