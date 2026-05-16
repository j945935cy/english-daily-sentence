const baseUrl = process.env.SEED_BASE_URL ?? "https://english-daily-sentence.vercel.app";
const email = process.env.SEED_ADMIN_EMAIL;
const password = process.env.SEED_ADMIN_PASSWORD;
const courseId = "phrase-english";

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

const phrases = [
  ["look up", "查詢；抬頭看。", "look up 是片語動詞，可接資料、單字或資訊。", "遇到不懂的英文時，很自然會說 look up the word。", "look up a word: 查單字；look up information: 查資料。", "I need to look up this word."],
  ["write down", "寫下來。", "write down 表示把資訊記錄下來。", "上課、開會、聽到重點時都常用。", "write down notes: 記筆記；write down an address: 寫下地址。", "Please write down your answer."],
  ["find out", "查明；弄清楚。", "find out 強調經過詢問、搜尋後得知。", "想知道原因、答案或真相時常用。", "find out why: 查明原因；find out the truth: 查明真相。", "Let's find out the answer."],
  ["give up", "放棄。", "give up 表示停止嘗試或不再繼續。", "鼓勵別人時常說 Don't give up。", "give up easily: 輕易放棄；never give up: 永不放棄。", "Do not give up on your dream."],
  ["try on", "試穿。", "try on 用於衣服、鞋子、帽子等。", "逛街買衣服時非常常用。", "try on a jacket: 試穿外套；try on shoes: 試穿鞋子。", "Can I try on this shirt?"],
  ["turn on", "打開電器或設備。", "turn on 後可接 light、TV、computer 等。", "開燈、開電視、開機時都能用。", "turn on the light: 開燈；turn on the TV: 開電視。", "Please turn on the light."],
  ["turn off", "關掉電器或設備。", "turn off 是 turn on 的相反。", "離開房間或省電時常用。", "turn off the phone: 關手機；turn off the computer: 關電腦。", "Remember to turn off the computer."],
  ["put on", "穿上；戴上。", "put on 表示把衣物或配件穿戴上。", "出門前穿外套、戴帽子時常用。", "put on a coat: 穿外套；put on glasses: 戴眼鏡。", "Put on your jacket before you go out."],
  ["take off", "脫下；起飛。", "take off 可指脫衣物，也可指飛機起飛。", "鞋子、帽子、外套都可以用 take off。", "take off shoes: 脫鞋；take off a hat: 脫帽。", "Please take off your shoes."],
  ["pick up", "撿起；接人。", "pick up 有把東西拿起，也有開車接人的意思。", "接小孩、接朋友、撿東西都常用。", "pick up a pen: 撿起筆；pick up my brother: 接我弟弟。", "I will pick you up at five."],
  ["drop off", "送某人下車；放下。", "drop off 常用於送人到某地。", "家長接送、寄放物品時常用。", "drop off a package: 放下包裹；drop off my child: 送小孩。", "Can you drop me off at school?"],
  ["come back", "回來。", "come back 表示回到原本地方。", "談回家、回學校、重新回來時常用。", "come back home: 回家；come back soon: 快回來。", "Please come back before dinner."],
  ["go back", "回去。", "go back 表示回到先前的地方或狀態。", "回座位、回家、回到上一頁都能用。", "go back to school: 回學校；go back home: 回家。", "Go back to your seat, please."],
  ["get up", "起床；站起來。", "get up 常用於早上起床。", "談作息時非常常見。", "get up early: 早起；get up late: 晚起。", "I get up at six every morning."],
  ["wake up", "醒來；叫醒。", "wake up 強調從睡眠中醒來。", "鬧鐘、早晨、叫醒別人時常用。", "wake up early: 早醒；wake someone up: 叫醒某人。", "My alarm wakes me up at seven."],
  ["hang out", "閒逛；一起待著。", "hang out 常用於朋友之間輕鬆相處。", "週末和朋友出去時很自然。", "hang out with friends: 和朋友出去；hang out at a cafe: 在咖啡店待著。", "We like to hang out after school."],
  ["work out", "運動；解決。", "work out 可指健身，也可指事情順利解決。", "談運動計畫或問題結果時常用。", "work out at the gym: 在健身房運動；work out a problem: 解決問題。", "I work out three times a week."],
  ["check in", "辦理報到；入住。", "check in 常用於旅館、機場、活動報到。", "旅行英文裡非常實用。", "check in at a hotel: 飯店入住；check in online: 線上報到。", "We need to check in before noon."],
  ["check out", "結帳離開；查看。", "check out 可指退房，也可指看看某物。", "旅行、購物、推薦東西時常用。", "check out of a hotel: 退房；check out this book: 看看這本書。", "Let's check out the new store."],
  ["fill out", "填寫表格。", "fill out 後常接 form、application。", "申請、報名、看診時常用。", "fill out a form: 填表格；fill out an application: 填申請表。", "Please fill out this form."],
  ["hand in", "繳交。", "hand in 常用於作業、報告、文件。", "學生交作業時很好用。", "hand in homework: 交作業；hand in a report: 交報告。", "Please hand in your homework today."],
  ["run out of", "用完；耗盡。", "run out of 後接被用完的東西。", "時間、錢、食物、電量都能用。", "run out of time: 時間不夠；run out of money: 錢用完。", "We ran out of milk."],
  ["take care of", "照顧；處理。", "take care of 可指照顧人，也可指處理事情。", "家庭、工作、責任都常用。", "take care of kids: 照顧孩子；take care of a problem: 處理問題。", "I need to take care of my dog."],
  ["look after", "照顧。", "look after 和 take care of 意思接近。", "英式英文中特別常見。", "look after a child: 照顧孩子；look after a pet: 照顧寵物。", "Can you look after my cat?"],
  ["look for", "尋找。", "look for 表示正在找某人或某物。", "找鑰匙、找資料、找人時常用。", "look for keys: 找鑰匙；look for a job: 找工作。", "I am looking for my phone."],
  ["look forward to", "期待。", "look forward to 後面接名詞或 V-ing。", "寫信、邀約、期待活動時很自然。", "look forward to seeing you: 期待見到你；look forward to the trip: 期待旅行。", "I look forward to meeting you."],
  ["get along with", "和某人相處融洽。", "get along with 後接人。", "談朋友、同事、家人關係時常用。", "get along with classmates: 和同學相處；get along well: 相處得好。", "I get along with my classmates."],
  ["keep up with", "跟上。", "keep up with 表示跟上速度、進度或消息。", "學習、工作、新聞都可用。", "keep up with the class: 跟上課程；keep up with news: 跟上新聞。", "It is hard to keep up with the lesson."],
  ["catch up with", "趕上；敘舊。", "catch up with 可指追上進度，也可指和朋友聊近況。", "補進度和朋友聚會都常見。", "catch up with homework: 補作業；catch up with a friend: 和朋友敘舊。", "I need to catch up with my work."],
  ["come up with", "想出。", "come up with 表示提出想法或解法。", "討論、解題、企劃時常用。", "come up with an idea: 想出點子；come up with a plan: 想出計畫。", "She came up with a good idea."],
  ["carry on", "繼續。", "carry on 表示繼續做某事。", "鼓勵別人或描述活動繼續時常用。", "carry on working: 繼續工作；carry on with the plan: 繼續計畫。", "Please carry on with your work."],
  ["calm down", "冷靜下來。", "calm down 用於情緒變平穩。", "安慰別人或提醒自己時很常用。", "calm down first: 先冷靜；help someone calm down: 幫某人冷靜。", "Take a deep breath and calm down."],
  ["cheer up", "振作；開心起來。", "cheer up 用來鼓勵心情低落的人。", "朋友難過時可用。", "cheer someone up: 讓某人振作；cheer up soon: 快點振作。", "I hope this song cheers you up."],
  ["show up", "出現；到場。", "show up 表示人出現或赴約。", "會議、課程、約會時常用。", "show up on time: 準時出現；show up late: 遲到。", "He showed up late for class."],
  ["set up", "建立；設置。", "set up 可指建立帳號、安排設備或成立組織。", "科技、工作、活動準備時常用。", "set up an account: 建立帳號；set up a meeting: 安排會議。", "Can you help me set up the computer?"],
  ["clean up", "清理。", "clean up 表示把地方整理乾淨。", "家務、教室、活動結束後常用。", "clean up the room: 清理房間；clean up after dinner: 飯後整理。", "Let's clean up the classroom."],
  ["grow up", "長大。", "grow up 指人成長，也可指變成熟。", "談童年、未來、成熟時常用。", "grow up in Taiwan: 在台灣長大；grow up fast: 長很快。", "I grew up in Chiayi."],
  ["slow down", "放慢。", "slow down 可用於速度、說話、生活節奏。", "請別人說慢一點時很好用。", "slow down the car: 放慢車速；slow down please: 請慢一點。", "Please slow down when you speak."],
  ["speed up", "加快。", "speed up 表示讓速度變快。", "趕時間、電腦效能、進度都可用。", "speed up the process: 加快流程；speed up a little: 稍微快一點。", "We need to speed up."],
  ["break down", "故障；崩潰；拆解。", "break down 有機器故障，也有情緒崩潰或拆解問題的意思。", "車子、設備、分析問題時常用。", "car breaks down: 車故障；break down a problem: 拆解問題。", "My car broke down yesterday."],
  ["break up", "分手；解散。", "break up 常用於關係結束，也可指團體散開。", "談感情或會議結束時會出現。", "break up with someone: 和某人分手；break up a group: 拆散小組。", "They broke up last year."],
  ["bring up", "提起；養育。", "bring up 可指提出話題，也可指養大孩子。", "會議、聊天、家庭背景時常用。", "bring up a topic: 提起話題；bring up children: 養育孩子。", "She brought up an important question."],
  ["call off", "取消。", "call off 常用於取消活動、會議、比賽。", "天氣不好或計畫改變時很實用。", "call off a meeting: 取消會議；call off a game: 取消比賽。", "The game was called off because of rain."],
  ["come across", "偶然遇見；偶然發現。", "come across 表示沒有特別找卻遇到。", "閱讀、逛街、查資料時常用。", "come across an article: 偶然看到文章；come across an old friend: 偶遇老朋友。", "I came across this photo yesterday."],
  ["deal with", "處理；應付。", "deal with 後接問題、人或情況。", "工作、情緒、問題處理時非常常用。", "deal with stress: 處理壓力；deal with a problem: 處理問題。", "We need to deal with this issue."],
  ["depend on", "依靠；取決於。", "depend on 可表示依賴或結果取決於某事。", "談條件、選擇、信任時常用。", "depend on the weather: 取決於天氣；depend on friends: 依靠朋友。", "It depends on the weather."],
  ["focus on", "專注於。", "focus on 後接目標、工作或主題。", "學習、工作、練習時很常用。", "focus on grammar: 專注文法；focus on one thing: 專注一件事。", "Focus on your next step."],
  ["get over", "克服；從情緒中恢復。", "get over 可指克服困難或走出傷心。", "失敗、疾病、情緒低潮都能用。", "get over a cold: 感冒康復；get over fear: 克服恐懼。", "It took time to get over the mistake."],
  ["give back", "歸還。", "give back 表示把東西還給原主人。", "借東西後歸還時常用。", "give back a book: 還書；give back money: 還錢。", "Please give back my pen."],
  ["go over", "複習；檢查。", "go over 表示再次看過或檢查。", "考前複習、會議前確認時常用。", "go over notes: 複習筆記；go over details: 檢查細節。", "Let's go over the answers."],
  ["hold on", "等一下；堅持。", "hold on 可用於電話中請人稍等，也可表示撐住。", "接電話或鼓勵人時常用。", "hold on a second: 等一下；hold on to hope: 抓住希望。", "Hold on, I will check it."],
  ["leave out", "遺漏；省略。", "leave out 表示沒有包含某人或某物。", "寫作、名單、說明漏掉資訊時常用。", "leave out details: 省略細節；leave someone out: 忽略某人。", "Do not leave out your name."],
  ["make up", "編造；和好；組成。", "make up 有多個意思，要看上下文。", "故事、關係、比例都可能用到。", "make up a story: 編故事；make up with a friend: 和朋友和好。", "He made up a funny story."],
  ["pass out", "昏倒；分發。", "pass out 可指昏倒，也可指分發資料。", "健康狀況或課堂發紙時常用。", "pass out papers: 分發紙張；pass out from heat: 熱到昏倒。", "The teacher passed out the worksheets."],
  ["point out", "指出。", "point out 表示指出問題、事實或細節。", "報告、討論、修改時常用。", "point out a mistake: 指出錯誤；point out a detail: 指出細節。", "She pointed out a spelling mistake."],
  ["put away", "收起來。", "put away 表示把東西放回適當位置。", "收書、收玩具、整理房間時常用。", "put away books: 收書；put away clothes: 收衣服。", "Put away your phone, please."],
  ["put off", "延後；拖延。", "put off 表示把事情延到之後。", "談拖延、延期會議時常用。", "put off homework: 拖延作業；put off a meeting: 延後會議。", "Do not put off your practice."],
  ["run into", "偶然遇到；撞上。", "run into 可指偶遇某人，也可指撞到問題。", "街上遇到朋友或遇到麻煩時常用。", "run into a friend: 偶遇朋友；run into trouble: 遇到麻煩。", "I ran into my teacher at the store."],
  ["take over", "接手；接管。", "take over 表示接下工作或控制權。", "工作交接、公司管理時常用。", "take over a job: 接手工作；take over a company: 接管公司。", "Can you take over this task?"],
  ["think over", "仔細考慮。", "think over 表示在決定前好好想。", "重要選擇、邀請、提案時常用。", "think over a plan: 考慮計畫；think it over: 仔細想想。", "Please think it over before you decide."],
  ["throw away", "丟掉。", "throw away 表示把不要的東西丟掉。", "整理房間、清垃圾時常用。", "throw away trash: 丟垃圾；throw away old papers: 丟舊文件。", "Do not throw away this receipt."],
  ["turn down", "調低；拒絕。", "turn down 可指音量降低，也可指拒絕邀請。", "音量、工作邀約、邀請都常用。", "turn down the music: 調低音樂；turn down an offer: 拒絕提議。", "Please turn down the volume."],
  ["use up", "用完。", "use up 表示把某物全部用掉。", "時間、金錢、資源用完時常用。", "use up time: 用完時間；use up paper: 用完紙。", "We used up all the paper."],
  ["watch out", "小心；注意。", "watch out 用來提醒危險。", "看到危險或提醒朋友時很自然。", "watch out for cars: 小心車子；watch out for steps: 小心階梯。", "Watch out! The floor is wet."],
  ["work on", "從事；努力改善。", "work on 後接任務、技能或問題。", "學習、工作、專案時很常用。", "work on English: 練英文；work on a project: 做專案。", "I am working on my pronunciation."],
  ["look into", "調查；研究。", "look into 表示深入了解或調查。", "問題、投訴、可能性都常用。", "look into a problem: 調查問題；look into options: 研究選項。", "We will look into the issue."],
  ["go through", "經歷；仔細查看。", "go through 可指經歷困難，也可指仔細檢查。", "文件審查、人生經歷都能用。", "go through files: 查看文件；go through hard times: 經歷困難。", "Let's go through the list together."],
  ["get rid of", "擺脫；丟掉。", "get rid of 表示除去不想要的人事物。", "清理東西、改掉壞習慣時常用。", "get rid of trash: 清掉垃圾；get rid of a bad habit: 改掉壞習慣。", "I want to get rid of this old chair."],
  ["make sure", "確認；確保。", "make sure 後常接句子或 of。", "提醒、檢查、確認時非常實用。", "make sure that: 確認；make sure of the time: 確認時間。", "Make sure you lock the door."],
  ["take part in", "參加。", "take part in 後接活動、比賽或計畫。", "正式一點的 participate in 也可用。", "take part in a contest: 參加比賽；take part in an event: 參加活動。", "She will take part in the speech contest."],
  ["be good at", "擅長。", "be good at 後接名詞或 V-ing。", "介紹能力與專長時常用。", "good at math: 擅長數學；good at drawing: 擅長畫畫。", "He is good at solving problems."],
  ["be interested in", "對……有興趣。", "be interested in 後接名詞或 V-ing。", "談興趣、課程、活動時常用。", "interested in music: 對音樂有興趣；interested in learning: 對學習有興趣。", "I am interested in learning English."],
  ["be proud of", "為……感到驕傲。", "be proud of 後接人、事或成果。", "肯定自己或別人的努力時常用。", "proud of you: 以你為榮；proud of my work: 對作品感到驕傲。", "I am proud of your progress."],
  ["be afraid of", "害怕。", "be afraid of 後接名詞或 V-ing。", "談恐懼、擔心時常用。", "afraid of dogs: 怕狗；afraid of speaking: 害怕說話。", "She is afraid of making mistakes."],
  ["be ready for", "準備好面對。", "be ready for 後接名詞。", "考試、活動、挑戰前常用。", "ready for class: 準備好上課；ready for the test: 準備好考試。", "I am ready for the presentation."],
  ["be used to", "習慣於。", "be used to 後接名詞或 V-ing。", "談已經習慣的新環境或新作息時常用。", "used to the weather: 習慣天氣；used to getting up early: 習慣早起。", "I am used to speaking English every day."],
];

const practiceNotes = [
  "今日小練習：把例句換成自己的生活情境。",
  "今日小練習：大聲朗讀例句三次。",
  "今日小練習：用這個片語寫一個問句。",
  "今日小練習：把片語和一個新名詞搭配使用。",
  "今日小練習：今天找一次機會說出這個片語。",
];

function dateStringFromStart(index) {
  const date = new Date(Date.UTC(2026, 4, 16));
  date.setUTCDate(date.getUTCDate() + index);
  return date.toISOString().slice(0, 10);
}

function buildItems() {
  const items = [];
  for (let day = 0; day < 365; day += 1) {
    const base = phrases[day % phrases.length];
    const round = Math.floor(day / phrases.length);
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

console.log(`Seeded ${ok} phrase English lessons from ${items[0].publishDate} to ${items.at(-1).publishDate}.`);
