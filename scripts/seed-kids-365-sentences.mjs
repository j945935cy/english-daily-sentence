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

const situations = [
  ["Good morning.", "早安。", "Good morning. 是早上見面時的問候語。", "早上到學校、見到老師或同學時都可以使用。", "good: 好的；morning: 早上。", "Good morning, teacher."],
  ["Good afternoon.", "午安。", "Good afternoon. 是下午見面時的問候語。", "下午上課或遇到同學時，可以用這句打招呼。", "good: 好的；afternoon: 下午。", "Good afternoon, class."],
  ["Goodbye.", "再見。", "Goodbye. 是離開時說的再見。", "放學、下課或和朋友分開時都可以使用。", "goodbye: 再見。", "Goodbye, see you tomorrow."],
  ["See you tomorrow.", "明天見。", "See you tomorrow. 表示期待明天再見面。", "放學離開時對老師或同學說很自然。", "see: 看見；tomorrow: 明天。", "Goodbye. See you tomorrow."],
  ["Thank you.", "謝謝你。", "Thank you. 是表達感謝的基本句。", "別人幫你、借你東西或稱讚你時都可以說。", "thank: 感謝；you: 你。", "Thank you for your help."],
  ["You are welcome.", "不客氣。", "You are welcome. 是回應謝謝的禮貌說法。", "別人對你說 Thank you 時，可以用這句回答。", "welcome: 歡迎、不客氣。", "Thank you. You are welcome."],
  ["I am sorry.", "對不起。", "I am sorry. 用來道歉。", "不小心撞到別人、遲到或做錯事時可以使用。", "sorry: 抱歉的。", "I am sorry. Are you OK?"],
  ["It is OK.", "沒關係。", "It is OK. 表示事情沒問題。", "別人道歉時，可以用這句安慰對方。", "OK: 可以、沒問題。", "It is OK. Don't worry."],
  ["Excuse me.", "不好意思。", "Excuse me. 用來引起注意或禮貌打擾。", "要問路、借過或請老師幫忙前都可以說。", "excuse: 原諒、打擾；me: 我。", "Excuse me, may I ask a question?"],
  ["May I come in?", "我可以進來嗎？", "May I...? 是禮貌請求句型。", "遲到進教室或進辦公室前可以使用。", "may: 可以；come in: 進來。", "May I come in, teacher?"],
  ["May I go to the bathroom?", "我可以去洗手間嗎？", "May I go to...? 用來禮貌詢問是否能去某處。", "上課時需要離開座位，可以先問老師。", "bathroom: 洗手間；go to: 去。", "May I go to the bathroom, please?"],
  ["May I drink some water?", "我可以喝一些水嗎？", "May I + 動詞？表示禮貌請求。", "上課時口渴，可以用這句詢問老師。", "drink: 喝；water: 水。", "May I drink some water?"],
  ["May I borrow your pencil?", "我可以借你的鉛筆嗎？", "borrow 表示借入，your pencil 是你的鉛筆。", "忘記帶鉛筆時，這句很實用。", "borrow: 借入；pencil: 鉛筆。", "May I borrow your eraser?"],
  ["Here you are.", "給你。", "Here you are. 用在把東西交給別人時。", "借東西、分發物品或交作業時可以說。", "here: 這裡；you: 你。", "Here you are. Thank you."],
  ["Can you help me?", "你可以幫我嗎？", "Can you + 動詞？表示請求對方做某事。", "遇到困難、找不到東西或不會題目時可以使用。", "help: 幫助；can: 可以。", "Can you help me with this word?"],
  ["I need help.", "我需要幫忙。", "need 表示需要，help 表示幫助。", "當你不會或卡住時，可以清楚告訴老師。", "need: 需要；help: 幫忙。", "I need help with my homework."],
  ["I don't understand.", "我不懂。", "don't understand 表示不理解。", "聽不懂題目或說明時，這句很有用。", "understand: 理解。", "I don't understand this sentence."],
  ["Please say it again.", "請再說一次。", "Please + 動詞是禮貌請求，again 表示再一次。", "聽不清楚老師說話時可以使用。", "please: 請；again: 再一次。", "Please say it again slowly."],
  ["Please speak slowly.", "請說慢一點。", "speak slowly 表示慢慢說。", "聽英文時覺得太快，可以用這句請對方放慢。", "speak: 說話；slowly: 慢慢地。", "Please speak slowly, teacher."],
  ["What does this mean?", "這是什麼意思？", "What does this mean? 用來詢問意思。", "看到不懂的單字、句子或符號時可以問。", "mean: 意思是；this: 這個。", "What does this word mean?"],
  ["How do you spell it?", "這個怎麼拼？", "How do you spell...? 用來問拼字。", "學新單字時很常用。", "spell: 拼字；how: 如何。", "How do you spell apple?"],
  ["Can I try?", "我可以試試看嗎？", "Can I + 動詞？表示詢問自己是否可以做某事。", "想回答問題、玩遊戲或嘗試活動時可以說。", "try: 嘗試；can: 可以。", "Can I try this game?"],
  ["I know the answer.", "我知道答案。", "know 表示知道，answer 表示答案。", "上課時想回答問題可以舉手說這句。", "know: 知道；answer: 答案。", "I know the answer, teacher."],
  ["I don't know.", "我不知道。", "don't know 表示不知道。", "不知道答案時誠實回答即可。", "know: 知道。", "I don't know, but I can try."],
  ["Raise your hand.", "請舉手。", "raise 表示舉起，hand 是手。", "這是常見課堂指令。", "raise: 舉起；hand: 手。", "Please raise your hand."],
  ["Open your book.", "打開你的書。", "Open your book. 是常見上課指令。", "老師開始課本活動時會說這句。", "open: 打開；book: 書。", "Open your book to page ten."],
  ["Close your book.", "闔上你的書。", "close 表示關上，book 是書。", "結束閱讀或測驗前常用。", "close: 關上；book: 書。", "Please close your book."],
  ["Listen carefully.", "仔細聽。", "listen 表示聽，carefully 表示仔細地。", "老師講解、聽力練習或故事時間都常用。", "listen: 聽；carefully: 仔細地。", "Listen carefully to the story."],
  ["Look at the board.", "看黑板。", "look at 表示看著，board 是黑板或白板。", "上課看重點時常用。", "look at: 看；board: 黑板、白板。", "Look at the board, please."],
  ["Write it down.", "把它寫下來。", "write down 表示寫下。", "抄筆記或記作業時常用。", "write: 寫；down: 下來。", "Write the word down."],
  ["Read after me.", "跟我讀。", "Read after me. 是跟讀練習常用句。", "老師帶念單字或句子時會說。", "read: 讀；after: 在...之後。", "Read after me: good morning."],
  ["Repeat after me.", "跟我重複。", "repeat 表示重複。", "發音練習時非常常見。", "repeat: 重複；after: 在...之後。", "Repeat after me, please."],
  ["Line up, please.", "請排隊。", "line up 表示排隊。", "下課、午餐、集合時常用。", "line up: 排隊；please: 請。", "Line up at the door."],
  ["Be quiet, please.", "請安靜。", "be quiet 表示保持安靜。", "上課、聽故事或考試時常用。", "quiet: 安靜的；please: 請。", "Be quiet and listen."],
  ["Sit down, please.", "請坐下。", "sit down 表示坐下。", "課堂開始或活動結束時常用。", "sit: 坐；down: 下。", "Sit down in your chair."],
  ["Stand up, please.", "請站起來。", "stand up 表示站起來。", "唱歌、活動或回答時可能會用到。", "stand: 站；up: 向上。", "Stand up and say hello."],
  ["Come here, please.", "請過來這裡。", "come here 表示到這裡來。", "老師請學生到前面或旁邊時常用。", "come: 來；here: 這裡。", "Come here and try again."],
  ["Go back to your seat.", "回到你的座位。", "go back 表示回去，seat 是座位。", "活動結束後回座位時常用。", "seat: 座位；go back: 回去。", "Go back to your seat, please."],
  ["Take out your notebook.", "拿出你的筆記本。", "take out 表示拿出。", "準備上課或寫筆記時常用。", "notebook: 筆記本；take out: 拿出。", "Take out your notebook and pencil."],
  ["Put away your things.", "收好你的東西。", "put away 表示收好。", "下課、換課或放學前常用。", "things: 東西；put away: 收起來。", "Put away your books."],
  ["I am ready.", "我準備好了。", "ready 表示準備好的。", "活動開始前可以告訴老師自己已經準備好。", "ready: 準備好的。", "I am ready to start."],
  ["Are you ready?", "你準備好了嗎？", "Are you ready? 用來詢問對方是否準備好。", "遊戲、上台或活動開始前常用。", "ready: 準備好的。", "Are you ready for class?"],
  ["Let's start.", "我們開始吧。", "Let's + 動詞表示我們來做某事。", "開始上課、遊戲或練習時可以用。", "start: 開始；let's: 我們來。", "Let's start the lesson."],
  ["Let's play a game.", "我們來玩遊戲吧。", "Let's play 表示我們來玩。", "小學生課堂活動很常見。", "play: 玩；game: 遊戲。", "Let's play a word game."],
  ["Whose turn is it?", "輪到誰了？", "turn 表示輪次。", "玩遊戲、回答問題或排隊活動時常用。", "whose: 誰的；turn: 輪次。", "Whose turn is it now?"],
  ["It's my turn.", "輪到我了。", "my turn 表示我的輪次。", "遊戲和課堂活動中很常用。", "my: 我的；turn: 輪次。", "It's my turn to read."],
  ["It's your turn.", "輪到你了。", "your turn 表示你的輪次。", "提醒同學輪到他時可以說。", "your: 你的；turn: 輪次。", "It's your turn to answer."],
  ["Good job!", "做得好！", "Good job! 是稱讚別人做得好的說法。", "同學回答、完成任務或表現好時都可以用。", "good: 好的；job: 工作、表現。", "Good job! You did it."],
  ["Try again.", "再試一次。", "try again 表示再試一次。", "答錯或失敗時可以鼓勵自己或同學。", "try: 嘗試；again: 再一次。", "It's OK. Try again."],
  ["Don't give up.", "不要放棄。", "give up 表示放棄。", "遇到困難時鼓勵自己或朋友。", "give up: 放棄；don't: 不要。", "Don't give up. You can do it."],
  ["You can do it.", "你做得到。", "can 表示可以或有能力。", "鼓勵同學、朋友或自己時很常用。", "can: 可以；do: 做。", "You can do it. Try again."],
  ["I made a mistake.", "我犯了一個錯。", "make a mistake 表示犯錯。", "學習時犯錯很正常，可以用這句表達。", "mistake: 錯誤；made: 做了。", "I made a mistake, but I can fix it."],
  ["That's funny.", "那很好笑。", "funny 表示好笑的。", "聽到有趣故事或看到好玩事情時可以說。", "funny: 好笑的。", "That joke is funny."],
  ["I am happy.", "我很開心。", "I am + 形容詞表示自己的狀態。", "表達心情時很常用。", "happy: 開心的。", "I am happy today."],
  ["I am tired.", "我累了。", "tired 表示疲倦的。", "運動後、上課很久或想休息時可以說。", "tired: 累的。", "I am tired after running."],
  ["I am hungry.", "我餓了。", "hungry 表示肚子餓。", "午餐前或放學後很常用。", "hungry: 餓的。", "I am hungry. Let's eat."],
  ["I am thirsty.", "我口渴了。", "thirsty 表示口渴。", "想喝水時可以說。", "thirsty: 口渴的。", "I am thirsty. I need water."],
  ["I feel sick.", "我覺得不舒服。", "feel sick 表示覺得不舒服。", "身體不舒服時要告訴老師或家人。", "feel: 感覺；sick: 生病的、不舒服的。", "I feel sick. May I rest?"],
  ["My head hurts.", "我的頭痛。", "hurts 表示疼痛。", "身體不舒服時可用這句描述。", "head: 頭；hurt: 痛。", "My head hurts. I need help."],
  ["I lost my pencil.", "我的鉛筆不見了。", "lost 表示弄丟。", "找不到東西時可以說。", "lost: 遺失；pencil: 鉛筆。", "I lost my eraser."],
  ["I found it.", "我找到了。", "found 是 find 的過去式，表示找到了。", "找回東西時可以說這句。", "found: 找到；it: 它。", "I found my book."],
  ["This is mine.", "這是我的。", "mine 表示我的東西。", "辨認物品時可以使用。", "mine: 我的。", "This pencil is mine."],
  ["Is this yours?", "這是你的嗎？", "yours 表示你的東西。", "撿到物品或確認東西主人時可用。", "yours: 你的。", "Is this book yours?"],
  ["I forgot my homework.", "我忘了帶作業。", "forgot 是 forget 的過去式，表示忘記了。", "忘記帶作業時要誠實告訴老師。", "forgot: 忘記；homework: 作業。", "I forgot my homework. I am sorry."],
  ["I finished my homework.", "我完成作業了。", "finished 表示完成。", "交作業或回報進度時可以說。", "finish: 完成；homework: 作業。", "I finished my homework last night."],
  ["May I hand in my homework?", "我可以交作業嗎？", "hand in 表示繳交。", "交作業給老師時很實用。", "hand in: 繳交；homework: 作業。", "May I hand in my homework now?"],
  ["I have a question.", "我有一個問題。", "have a question 表示有問題。", "上課聽不懂時可以先說這句。", "question: 問題；have: 有。", "I have a question about this word."],
  ["Can we work together?", "我們可以一起做嗎？", "work together 表示一起合作。", "分組活動或作業時可以使用。", "work: 工作、做事；together: 一起。", "Can we work together on this?"],
  ["Let's share.", "我們一起分享吧。", "share 表示分享。", "玩具、點心或學習材料都可以分享。", "share: 分享；let's: 我們來。", "Let's share the crayons."],
  ["Please wait for me.", "請等我。", "wait for 表示等待某人。", "排隊、遊戲或一起走路時常用。", "wait: 等待；me: 我。", "Please wait for me at the door."],
  ["Hurry up, please.", "請快一點。", "hurry up 表示快一點。", "趕時間時可以用，但加 please 比較有禮貌。", "hurry up: 快一點；please: 請。", "Hurry up, please. The bell is ringing."],
  ["Slow down, please.", "請慢一點。", "slow down 表示放慢。", "走路、說話或做動作太快時可以說。", "slow down: 放慢；please: 請。", "Slow down, please. I can't follow."],
  ["Be careful.", "小心。", "careful 表示小心的。", "走樓梯、拿剪刀或玩遊戲時常用。", "careful: 小心的。", "Be careful with the scissors."],
  ["Watch your step.", "小心腳步。", "watch your step 用來提醒走路小心。", "上下樓梯、地板濕或路不平時可用。", "watch: 注意；step: 腳步。", "Watch your step on the stairs."],
  ["Wash your hands.", "洗手。", "wash 表示清洗，hands 是手。", "吃飯前、上完廁所後常用。", "wash: 洗；hands: 手。", "Wash your hands before lunch."],
  ["It's lunch time.", "午餐時間到了。", "It's ... time. 表示某個時間到了。", "學校生活中很常聽到。", "lunch: 午餐；time: 時間。", "It's lunch time. Let's eat."],
  ["I like my lunch.", "我喜歡我的午餐。", "I like + 名詞，表示喜歡某物。", "談食物和喜好時常用。", "lunch: 午餐；like: 喜歡。", "I like my lunch today."],
  ["I don't like carrots.", "我不喜歡紅蘿蔔。", "don't like 表示不喜歡。", "談食物喜好時可以用。", "carrot: 紅蘿蔔；like: 喜歡。", "I don't like carrots, but I like corn."],
  ["Can I have more rice?", "我可以再多一點飯嗎？", "Can I have...? 用來禮貌地要東西。", "午餐或家裡吃飯時常用。", "more: 更多；rice: 飯。", "Can I have more soup?"],
];

const repeatNotes = [
  ["Read it with a smile.", "帶著笑容讀一次。"],
  ["Say it to a friend.", "對朋友說一次。"],
  ["Use it in class today.", "今天在課堂上用一次。"],
  ["Practice it with your family.", "和家人一起練習。"],
  ["Write it in your notebook.", "把它寫在筆記本裡。"],
];

function dateStringFromStart(index) {
  const date = new Date(Date.UTC(2026, 4, 16 + index));
  return date.toISOString().slice(0, 10);
}

function buildItems() {
  const items = [];
  for (let day = 0; day < 365; day += 1) {
    const base = situations[day % situations.length];
    const round = Math.floor(day / situations.length);
    const note = repeatNotes[round % repeatNotes.length];
    items.push({
      courseId,
      publishDate: dateStringFromStart(day),
      sentence: base[0],
      translation: base[1],
      grammarNote: base[2],
      usageNote: `${base[3]} 今日小練習：${note[1]}`,
      vocabulary: base[4],
      example: base[5] || note[0],
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
    throw new Error(`Seed failed for ${item.publishDate}: ${result.response.status} ${JSON.stringify(result.data)}`);
  }

  ok += 1;
}

console.log(`Seeded ${ok} common kids English sentences from ${items[0].publishDate} to ${items.at(-1).publishDate}.`);
