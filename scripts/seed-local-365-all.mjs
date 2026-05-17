import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const startDate = new Date(Date.UTC(2026, 4, 16));
const selectedCourseIds = new Set(
  (process.env.SEED_COURSES ?? "")
    .split(",")
    .map((courseId) => courseId.trim())
    .filter(Boolean),
);

const courses = [
  {
    id: "daily-english",
    slug: "daily-english",
    name: "每日一句英文",
    description: "每天一句實用英文，搭配文法、用法、單字與延伸例句。",
  },
  {
    id: "kids-english",
    slug: "kids-english",
    name: "小學生每日一句英語",
    description: "適合小學生的日常與課堂英語，每天用短句建立英文信心。",
  },
  {
    id: "motivational-english",
    slug: "motivational-english",
    name: "每日一勵志英語",
    description: "每天一句短而有力量的英文，陪你練習語感，也練習往前走。",
  },
  {
    id: "grammar-english",
    slug: "grammar-english",
    name: "每日一文法",
    description: "每天一個英文文法小單元，用規則、例句與練習慢慢建立句子能力。",
  },
  {
    id: "phrase-english",
    slug: "phrase-english",
    name: "每日一片語",
    description: "每天一個常用英文片語，學意思、用法、搭配詞與自然例句。",
  },
  {
    id: "pattern-english",
    slug: "pattern-english",
    name: "每日一句型",
    description: "每天拆解一個實用英文句型，練會替換主詞、動詞和情境。",
  },
  {
    id: "ai-knowledge-english",
    slug: "ai-knowledge-english",
    name: "每日一AI知識英文學習",
    description: "每天用一句英文認識 AI 概念、工具、風險與應用情境。",
  },
];

const dailyTopics = [
  ["review new words", "複習新單字", "review: 複習；new words: 新單字"],
  ["listen for key words", "聽關鍵字", "listen for: 留意聽；key words: 關鍵字"],
  ["repeat the sentence aloud", "大聲重複句子", "repeat: 重複；aloud: 大聲地"],
  ["ask a clear question", "問一個清楚的問題", "ask: 問；clear: 清楚的；question: 問題"],
  ["write one simple example", "寫一個簡單例句", "write: 寫；simple: 簡單的；example: 例子"],
  ["speak more slowly", "說慢一點", "speak: 說；slowly: 慢慢地"],
  ["check the meaning first", "先確認意思", "check: 確認；meaning: 意思；first: 先"],
  ["notice the verb tense", "注意動詞時態", "notice: 注意；verb tense: 動詞時態"],
  ["compare two similar words", "比較兩個相似單字", "compare: 比較；similar: 相似的"],
  ["use the word in context", "在情境中使用單字", "context: 情境；use: 使用"],
  ["make a short note", "做一則短筆記", "make a note: 做筆記；short: 短的"],
  ["read the sentence twice", "把句子讀兩次", "twice: 兩次；read: 讀"],
  ["focus on pronunciation", "專注在發音", "focus on: 專注於；pronunciation: 發音"],
  ["learn from small mistakes", "從小錯誤中學習", "learn from: 從...學習；mistake: 錯誤"],
  ["try a different expression", "試著用不同說法", "different: 不同的；expression: 表達"],
  ["summarize the main idea", "摘要主要意思", "summarize: 摘要；main idea: 主要概念"],
  ["answer in a full sentence", "用完整句子回答", "answer: 回答；full sentence: 完整句"],
  ["practice a useful phrase", "練習一個實用片語", "useful: 實用的；phrase: 片語"],
  ["build a daily habit", "建立每日習慣", "build: 建立；daily habit: 每日習慣"],
  ["listen before speaking", "先聽再說", "before: 在...之前；speaking: 說話"],
];

const kidsTopics = [
  ["Good morning.", "早安。", "good: 好的；morning: 早晨"],
  ["I like apples.", "我喜歡蘋果。", "I: 我；like: 喜歡；apple: 蘋果"],
  ["This is my bag.", "這是我的書包。", "this: 這個；bag: 書包"],
  ["May I drink water?", "我可以喝水嗎？", "may I: 我可以嗎；water: 水"],
  ["Please open your book.", "請打開你的書。", "please: 請；open: 打開；book: 書"],
  ["I can read.", "我會閱讀。", "can: 會；read: 閱讀"],
  ["She is my friend.", "她是我的朋友。", "friend: 朋友"],
  ["The cat is small.", "貓很小。", "cat: 貓；small: 小的"],
  ["I have two pencils.", "我有兩支鉛筆。", "two: 二；pencil: 鉛筆"],
  ["Let us play together.", "我們一起玩吧。", "play: 玩；together: 一起"],
  ["It is sunny today.", "今天是晴天。", "sunny: 晴朗的；today: 今天"],
  ["I am ready.", "我準備好了。", "ready: 準備好的"],
  ["Please listen carefully.", "請仔細聽。", "listen: 聽；carefully: 仔細地"],
  ["Can you help me?", "你可以幫我嗎？", "help: 幫助"],
  ["I am happy.", "我很開心。", "happy: 開心的"],
];

const motivationTopics = [
  ["Small steps lead to big changes.", "小小的步伐會帶來大的改變。", "step: 步伐；change: 改變"],
  ["You can start again today.", "你今天可以重新開始。", "start again: 重新開始"],
  ["Progress is better than perfection.", "進步比完美更重要。", "progress: 進步；perfection: 完美"],
  ["Keep going, even slowly.", "就算慢，也要繼續走。", "keep going: 繼續前進；slowly: 慢慢地"],
  ["One brave sentence is enough.", "勇敢說出一句就夠了。", "brave: 勇敢的；enough: 足夠的"],
  ["Practice turns fear into confidence.", "練習會把害怕變成自信。", "fear: 害怕；confidence: 自信"],
  ["Every mistake can teach you.", "每個錯誤都能教會你。", "mistake: 錯誤；teach: 教"],
  ["Your effort is building skill.", "你的努力正在累積能力。", "effort: 努力；skill: 技能"],
  ["Stay curious and keep learning.", "保持好奇，繼續學習。", "curious: 好奇的；learn: 學習"],
  ["A little review still matters.", "一點點複習也很重要。", "review: 複習；matter: 重要"],
];

const grammarTopics = [
  ["Be Verb: I am ready.", "be 動詞用來連接主詞和狀態。", "be verb: be 動詞；ready: 準備好的", "She is ready for class."],
  ["Subject Pronouns: She is my friend.", "主詞代名詞可放在句首當主詞。", "subject: 主詞；pronoun: 代名詞", "They are my classmates."],
  ["Object Pronouns: Please help me.", "受詞代名詞放在動詞或介系詞後面。", "object: 受詞；help: 幫助", "Can you call him later?"],
  ["Articles: I have a pen.", "a/an 表示一個未特定的單數名詞。", "article: 冠詞；pen: 筆", "I saw a dog. The dog was cute."],
  ["Plural Nouns: I have two books.", "複數名詞通常加 s 或 es。", "plural: 複數；book: 書", "There are three buses here."],
  ["There Is: There is a cat.", "There is 用於單數或不可數名詞。", "there is: 有；cat: 貓", "There is a desk in my room."],
  ["There Are: There are two chairs.", "There are 用於複數名詞。", "there are: 有；chair: 椅子", "There are many students in the classroom."],
  ["Present Simple: I study English.", "一般現在式描述習慣、事實與固定狀態。", "present simple: 一般現在式；study: 學習", "She studies English every day."],
  ["Present Continuous: I am reading now.", "現在進行式表示正在發生的動作。", "continuous: 進行式；read: 讀", "They are playing outside."],
  ["Past Simple: I visited my grandma.", "過去式描述已經發生的動作。", "past simple: 過去式；visit: 拜訪", "We watched a movie last night."],
  ["Future with Will: I will help you.", "will 後接原形動詞，表示未來或意願。", "future: 未來；will: 將會", "She will join us tomorrow."],
  ["Can: I can swim.", "can 後接原形動詞，表示能力或可能。", "can: 能夠；swim: 游泳", "Can you help me?"],
  ["Should: You should rest.", "should 用來提出建議。", "should: 應該；rest: 休息", "You should drink more water."],
  ["Imperatives: Open your book.", "祈使句常用原形動詞開頭。", "imperative: 祈使句；open: 打開", "Please write it down."],
  ["Because: I stayed home because it rained.", "because 用來說明原因。", "because: 因為；rain: 下雨", "She smiled because she was happy."],
  ["If: If it rains, I will stay home.", "if 引導條件句，說明可能情況。", "if: 如果；condition: 條件", "If I have time, I will call you."],
  ["Gerunds: I enjoy reading.", "動名詞 V-ing 可當名詞使用。", "gerund: 動名詞；enjoy: 享受", "He finished writing the letter."],
  ["Infinitives: I want to learn.", "不定詞 to + 原形動詞可表示目的或想法。", "infinitive: 不定詞；learn: 學習", "She hopes to travel next year."],
  ["Passive Voice: The cake was made by Mom.", "被動語態強調動作承受者。", "passive voice: 被動語態；made: 製作", "The window was broken yesterday."],
  ["Present Perfect: I have finished my homework.", "現在完成式連結過去動作和現在結果。", "present perfect: 現在完成式；finished: 完成", "She has lived here for five years."],
];

const phrases = [
  ["look up", "查詢；抬頭看。", "look up 可接字典、資料或資訊，也可表示往上看。", "look up a word: 查單字；look up information: 查資料", "I need to look up this word."],
  ["write down", "寫下來。", "write down 表示把資訊記錄下來。", "write down notes: 寫筆記；write down an address: 寫下地址", "Please write down your answer."],
  ["find out", "查明；弄清楚。", "find out 表示透過詢問或調查得到答案。", "find out why: 查明原因；find out the truth: 查明真相", "Let's find out the answer."],
  ["give up", "放棄。", "give up 表示停止嘗試或停止做某事。", "give up easily: 輕易放棄；never give up: 永不放棄", "Do not give up on your dream."],
  ["try on", "試穿。", "try on 用於衣服、鞋子、帽子等。", "try on a jacket: 試穿外套；try on shoes: 試穿鞋子", "Can I try on this shirt?"],
  ["turn on", "打開電器或設備。", "turn on 可用於 light、TV、computer 等。", "turn on the light: 開燈；turn on the TV: 開電視", "Please turn on the light."],
  ["turn off", "關掉電器或設備。", "turn off 是 turn on 的相反。", "turn off the phone: 關手機；turn off the computer: 關電腦", "Remember to turn off the computer."],
  ["put on", "穿上；戴上。", "put on 表示把衣物或配件穿戴上去。", "put on a coat: 穿外套；put on glasses: 戴眼鏡", "Put on your jacket before you go out."],
  ["take off", "脫下；起飛。", "take off 可用於衣物，也可用於飛機起飛。", "take off shoes: 脫鞋；take off a hat: 脫帽子", "Please take off your shoes."],
  ["pick up", "撿起；接人。", "pick up 可表示從地上拿起，也可表示開車接人。", "pick up a pen: 撿起筆；pick up my brother: 接我弟弟", "I will pick you up at five."],
  ["come back", "回來。", "come back 表示回到原本的地方。", "come back home: 回家；come back soon: 快點回來", "Please come back before dinner."],
  ["get up", "起床。", "get up 常用來說從床上起來。", "get up early: 早起；get up late: 晚起", "I get up at six every morning."],
  ["wake up", "醒來；叫醒。", "wake up 可表示自己醒來，也可表示叫醒別人。", "wake up early: 早醒；wake someone up: 叫醒某人", "My alarm wakes me up at seven."],
  ["work out", "運動；解決。", "work out 可表示健身，也可表示想出解法。", "work out at the gym: 在健身房運動；work out a problem: 解決問題", "I work out three times a week."],
  ["check in", "報到；登記入住。", "check in 常用於旅館、機場或活動。", "check in at a hotel: 在旅館入住；check in online: 線上報到", "We need to check in before noon."],
  ["fill out", "填寫。", "fill out 常用於表格或申請書。", "fill out a form: 填表格；fill out an application: 填申請書", "Please fill out this form."],
  ["run out of", "用完。", "run out of 表示某物已經不夠或用完。", "run out of time: 時間用完；run out of money: 錢用完", "We ran out of milk."],
  ["look for", "尋找。", "look for 表示正在找某人或某物。", "look for keys: 找鑰匙；look for a job: 找工作", "I am looking for my phone."],
  ["focus on", "專注於。", "focus on 後面接名詞或 V-ing。", "focus on grammar: 專注文法；focus on one thing: 專注一件事", "Focus on your next step."],
  ["make sure", "確認。", "make sure 後可接 that 子句或 of。", "make sure that: 確認；make sure of the time: 確認時間", "Make sure you lock the door."],
];

const patterns = [
  ["It is easy to + verb.", "做某件事很容易。", "It is + 形容詞 + to + 原形動詞，用來說明做某事的難易或感受。", "easy: 容易的；verb: 動詞；pattern: 句型", "It is easy to practice English for five minutes."],
  ["I want to + verb.", "我想要做某事。", "want to 後接原形動詞，表示想做的事。", "want: 想要；learn: 學習；improve: 進步", "I want to improve my speaking."],
  ["I need to + verb.", "我需要做某事。", "need to 後接原形動詞，表示必要的行動。", "need: 需要；practice: 練習；finish: 完成", "I need to review this sentence."],
  ["Can you help me + verb?", "你可以幫我做某事嗎？", "Can you help me 後接原形動詞，常用於請求協助。", "help: 幫助；check: 檢查；understand: 理解", "Can you help me check my answer?"],
  ["I am going to + verb.", "我打算做某事。", "be going to 表示計畫或即將發生的事。", "going to: 打算；plan: 計畫；tomorrow: 明天", "I am going to read one article."],
  ["I have to + verb.", "我必須做某事。", "have to 表示外在需求或必須完成的事。", "have to: 必須；task: 任務；today: 今天", "I have to finish my homework."],
  ["I am good at + V-ing.", "我擅長做某事。", "be good at 後接名詞或 V-ing。", "good at: 擅長；speaking: 說話；drawing: 畫畫", "I am good at remembering words."],
  ["I am interested in + noun/V-ing.", "我對某事有興趣。", "be interested in 後接名詞或 V-ing。", "interested: 感興趣的；topic: 主題", "I am interested in learning grammar."],
  ["Could you tell me + question word + sentence?", "你可以告訴我某件事嗎？", "Could you tell me 後接間接問句，語氣較有禮貌。", "could: 可以；tell: 告訴；where: 哪裡", "Could you tell me where the station is?"],
  ["The best way to + verb is to + verb.", "做某事最好的方法是做某事。", "The best way to...is to... 用來說明方法。", "best way: 最好的方法；regularly: 規律地", "The best way to improve is to practice regularly."],
  ["I used to + verb.", "我以前常做某事。", "used to 表示過去常做但現在不一定如此。", "used to: 過去常常；live: 居住", "I used to study at night."],
  ["I would like to + verb.", "我想要做某事。", "would like to 比 want to 更有禮貌。", "would like: 想要；order: 點餐；ask: 問", "I would like to ask a question."],
  ["Let me + verb.", "讓我做某事。", "Let me 後接原形動詞，用於主動提出協助或行動。", "let me: 讓我；try: 試試；explain: 解釋", "Let me explain the answer."],
  ["Do you know how to + verb?", "你知道如何做某事嗎？", "how to 後接原形動詞，表示方法。", "how to: 如何；solve: 解決；use: 使用", "Do you know how to use this word?"],
  ["I am afraid of + V-ing.", "我害怕做某事。", "be afraid of 後接名詞或 V-ing。", "afraid: 害怕的；mistake: 錯誤", "I am afraid of making mistakes."],
  ["It depends on + noun.", "這取決於某事。", "depend on 後接名詞，表示依情況而定。", "depend on: 取決於；weather: 天氣；time: 時間", "It depends on the weather."],
  ["I prefer + noun to + noun.", "比起某物，我更喜歡某物。", "prefer A to B 表示偏好 A 勝過 B。", "prefer: 偏好；tea: 茶；coffee: 咖啡", "I prefer tea to coffee."],
  ["The more..., the more....", "越...就越...。", "The more A, the more B 用來說明兩件事一起增加。", "more: 更多；practice: 練習；confident: 有自信的", "The more I practice, the more confident I feel."],
  ["Not only..., but also....", "不只...也...。", "not only...but also... 用來連接兩個重點。", "not only: 不只；also: 也", "She is not only kind but also smart."],
  ["There is no need to + verb.", "沒有必要做某事。", "There is no need to 後接原形動詞，表示不需要。", "no need: 沒必要；worry: 擔心", "There is no need to worry."],
];

const aiTopics = [
  ["AI can help people find patterns in data.", "AI 可以幫助人們在資料中找出模式。", "AI 可用來分析資料、找出重複特徵或提供預測。", "AI: 人工智慧；pattern: 模式；data: 資料", "AI can help doctors review medical images."],
  ["A chatbot can answer questions in natural language.", "聊天機器人可以用自然語言回答問題。", "chatbot 指能以文字或語音和使用者互動的 AI 系統。", "chatbot: 聊天機器人；natural language: 自然語言", "A chatbot can help customers find basic information."],
  ["Machine learning improves through examples.", "機器學習會透過範例改進。", "machine learning 指模型從資料範例中學習規則。", "machine learning: 機器學習；example: 範例", "Machine learning can improve when it receives better data."],
  ["A prompt tells AI what to do.", "提示詞會告訴 AI 要做什麼。", "prompt 是給 AI 的指令、問題或上下文。", "prompt: 提示詞；instruction: 指令；context: 上下文", "A clear prompt can lead to a better answer."],
  ["Generative AI can create text, images, and code.", "生成式 AI 可以創作文字、圖片和程式碼。", "generative AI 指能產生新內容的 AI。", "generative AI: 生成式AI；create: 創作；code: 程式碼", "Generative AI can draft an email quickly."],
  ["A model learns from training data.", "模型會從訓練資料中學習。", "training data 是用來訓練模型的資料集合。", "model: 模型；training data: 訓練資料", "A model needs reliable training data."],
  ["Bias can affect AI results.", "偏見可能影響 AI 結果。", "bias 指資料或設計造成的不公平傾向。", "bias: 偏見；result: 結果；fairness: 公平性", "Teams should test AI systems for bias."],
  ["Human review can reduce AI mistakes.", "人工審查可以減少 AI 錯誤。", "human review 指由人檢查 AI 輸出的正確性。", "human review: 人工審查；mistake: 錯誤", "Human review is important for sensitive decisions."],
  ["AI tools can summarize long documents.", "AI 工具可以摘要長文件。", "summarize 表示抓出重點並縮短內容。", "summarize: 摘要；document: 文件；tool: 工具", "AI tools can summarize meeting notes."],
  ["Data privacy is important when using AI.", "使用 AI 時，資料隱私很重要。", "data privacy 指保護個人或敏感資料。", "data privacy: 資料隱私；sensitive: 敏感的", "Do not paste private data into public AI tools."],
  ["AI can assist, but people remain responsible.", "AI 可以協助，但人仍然要負責。", "assist 表示協助而不是完全取代判斷。", "assist: 協助；responsible: 負責的", "AI can assist writers, but writers should check the final text."],
  ["Automation can save time on repeated tasks.", "自動化可以節省重複任務的時間。", "automation 指讓系統自動完成固定流程。", "automation: 自動化；repeated task: 重複任務", "Automation can save time on weekly reports."],
  ["AI search can combine retrieval and generation.", "AI 搜尋可以結合檢索與生成。", "retrieval 是先找資料，generation 是生成回答。", "retrieval: 檢索；generation: 生成", "AI search can retrieve sources before answering."],
  ["An AI agent can plan and use tools.", "AI agent 可以規劃並使用工具。", "agent 指能根據目標執行多步驟工作的 AI 系統。", "agent: 代理系統；plan: 規劃；tool: 工具", "An AI agent can schedule tasks and summarize results."],
  ["Evaluation helps measure AI quality.", "評估可以衡量 AI 品質。", "evaluation 指用標準測試輸出的正確性、可靠性或安全性。", "evaluation: 評估；quality: 品質；reliable: 可靠的", "Evaluation helps teams compare model performance."],
  ["A hallucination is an incorrect AI answer.", "幻覺是 AI 給出的不正確回答。", "hallucination 指 AI 看似自信但內容錯誤。", "hallucination: 幻覺；incorrect: 不正確的", "Checking sources can reduce hallucination risk."],
  ["Multimodal AI can understand more than text.", "多模態 AI 可以理解文字以外的內容。", "multimodal 指能處理文字、圖片、聲音或影片。", "multimodal: 多模態；image: 圖片；audio: 聲音", "Multimodal AI can describe an image in English."],
  ["AI literacy helps people use tools wisely.", "AI 素養能幫助人們明智使用工具。", "AI literacy 指理解 AI 能力、限制與風險。", "AI literacy: AI素養；wisely: 明智地", "AI literacy is useful for students and workers."],
  ["A workflow can include AI at one step.", "工作流程可以在某一步加入 AI。", "workflow 指完成任務的一連串步驟。", "workflow: 工作流程；step: 步驟", "A workflow can use AI to draft a first version."],
  ["Clear instructions improve AI output.", "清楚的指令會改善 AI 輸出。", "output 指 AI 產生的回答或結果。", "instruction: 指令；output: 輸出；improve: 改善", "Clear instructions improve AI output in writing tasks."],
];

const aiFrames = [
  "今天先理解這個 AI 概念，再試著用自己的話說一次。",
  "注意句中的科技詞彙，試著把它放進另一個工作或學習情境。",
  "讀完後想一個真實例子，確認你知道這個概念能用在哪裡。",
  "把例句念三次，熟悉 AI 英文常見搭配。",
  "留意這個概念的限制或風險，不要只記住工具好處。",
];

const dailyFrames = [
  {
    sentence: (topic) => `I can ${topic[0]} a little better every day.`,
    translation: (topic) => `我可以每天把「${topic[1]}」做得更好一點。`,
    grammarNote: (topic) => `I can ${topic[0]} 使用 can + 原形動詞，表示能力或可做到的事。`,
    usageNote: "適合描述每日學習目標，也能換成任何你正在練習的英文動作。",
    example: (topic) => `With practice, I can ${topic[0]} more naturally.`,
  },
  {
    sentence: (topic) => `Today, I will ${topic[0]} with more attention.`,
    translation: (topic) => `今天，我會更專心地${topic[1]}。`,
    grammarNote: (topic) => `will ${topic[0]} 表示今天要做的決定或計畫。`,
    usageNote: "用 Today, I will... 可以幫自己設定明確又簡短的每日行動。",
    example: (topic) => `Today, I will ${topic[0]} for ten minutes.`,
  },
  {
    sentence: (topic) => `It helps me to ${topic[0]} before I move on.`,
    translation: (topic) => `在繼續之前，${topic[1]}對我有幫助。`,
    grammarNote: (topic) => `It helps me to ${topic[0]} 使用 it 當形式主詞，to 後接原形動詞。`,
    usageNote: "適合說明某個學習步驟為什麼有幫助。",
    example: (topic) => `It helps me to ${topic[0]} when I feel unsure.`,
  },
];

const kidsFrames = [
  {
    grammarNote: "這是小學生最常用的基本句型，先掌握主詞和動詞。",
    usageNote: "可以在家裡、教室或日常對話中練習說一次。",
  },
  {
    grammarNote: "句子短，重點是把單字發音說清楚。",
    usageNote: "先慢慢念，再換一個單字做替換練習。",
  },
  {
    grammarNote: "注意句首大寫和句尾標點，養成完整句習慣。",
    usageNote: "可以請孩子畫出句子裡的人、物或動作。",
  },
];

const motivationFrames = [
  {
    grammarNote: "這句使用簡潔主詞加動詞，語氣直接有力量。",
    usageNote: "適合早上複誦，當成今天的英文提醒。",
  },
  {
    grammarNote: "句中可替換名詞或動詞，改成自己的目標。",
    usageNote: "把它寫在筆記本，旁邊加上一個今天能完成的小行動。",
  },
  {
    grammarNote: "這類句子常用現在式，表達穩定的信念或原則。",
    usageNote: "讀完後試著用中文說出自己的理解，再念英文一次。",
  },
];

const grammarFrames = [
  "今天先理解規則，再把例句換一個主詞。",
  "注意動詞位置，確認句子是否需要助動詞。",
  "練習把肯定句改成否定句或疑問句。",
  "把例句唸三次，聽聽語順是否自然。",
  "用同一個文法點寫一個自己的生活句子。",
];

const phraseFrames = [
  "今天把片語和一個常見名詞一起背，避免只記中文意思。",
  "練習用這個片語說一個自己的生活句。",
  "注意片語是否可以拆開，以及受詞放在哪裡。",
  "把例句唸三次，熟悉片語的自然節奏。",
  "試著把例句改成疑問句或否定句。",
];

const patternFrames = [
  "今天先背句型骨架，再替換一個動詞或名詞。",
  "把這個句型改成自己的生活句，至少說三次。",
  "注意固定搭配和動詞型態，不要只翻中文。",
  "先看例句，再遮住例句自己造一句。",
  "把句型念慢一點，確認每個位置放什麼詞。",
];

function publishDate(day) {
  const date = new Date(startDate);
  date.setUTCDate(startDate.getUTCDate() + day);
  return date;
}

function itemForCourse(courseId, day) {
  if (courseId === "daily-english") {
    const topic = dailyTopics[day % dailyTopics.length];
    const frame = dailyFrames[Math.floor(day / dailyTopics.length) % dailyFrames.length];
    return {
      sentence: frame.sentence(topic),
      translation: frame.translation(topic),
      grammarNote: frame.grammarNote(topic),
      usageNote: frame.usageNote,
      vocabulary: topic[2],
      example: frame.example(topic),
    };
  }

  if (courseId === "kids-english") {
    const topic = kidsTopics[day % kidsTopics.length];
    const frame = kidsFrames[Math.floor(day / kidsTopics.length) % kidsFrames.length];
    return {
      sentence: topic[0],
      translation: topic[1],
      grammarNote: frame.grammarNote,
      usageNote: frame.usageNote,
      vocabulary: topic[2],
      example: topic[0].replace(".", "!"),
    };
  }

  if (courseId === "motivational-english") {
    const topic = motivationTopics[day % motivationTopics.length];
    const frame = motivationFrames[Math.floor(day / motivationTopics.length) % motivationFrames.length];
    return {
      sentence: topic[0],
      translation: topic[1],
      grammarNote: frame.grammarNote,
      usageNote: frame.usageNote,
      vocabulary: topic[2],
      example: topic[0],
    };
  }

  if (courseId === "grammar-english") {
    const topic = grammarTopics[day % grammarTopics.length];
    const note = grammarFrames[Math.floor(day / grammarTopics.length) % grammarFrames.length];
    return {
      sentence: topic[0],
      translation: topic[1],
      grammarNote: topic[1],
      usageNote: note,
      vocabulary: topic[2],
      example: topic[3],
    };
  }

  if (courseId === "phrase-english") {
    const topic = phrases[day % phrases.length];
    const note = phraseFrames[Math.floor(day / phrases.length) % phraseFrames.length];
    return {
      sentence: topic[0],
      translation: topic[1],
      grammarNote: topic[2],
      usageNote: note,
      vocabulary: topic[3],
      example: topic[4],
    };
  }

  if (courseId === "pattern-english") {
    const topic = patterns[day % patterns.length];
    const note = patternFrames[Math.floor(day / patterns.length) % patternFrames.length];
    return {
      sentence: topic[0],
      translation: topic[1],
      grammarNote: topic[2],
      usageNote: note,
      vocabulary: topic[3],
      example: topic[4],
    };
  }

  if (courseId === "ai-knowledge-english") {
    const topic = aiTopics[day % aiTopics.length];
    const note = aiFrames[Math.floor(day / aiTopics.length) % aiFrames.length];
    return {
      sentence: topic[0],
      translation: topic[1],
      grammarNote: topic[2],
      usageNote: note,
      vocabulary: topic[3],
      example: topic[4],
    };
  }

  throw new Error(`Unknown course: ${courseId}`);
}

async function main() {
  const targetCourses = selectedCourseIds.size
    ? courses.filter((course) => selectedCourseIds.has(course.id))
    : courses;

  if (targetCourses.length === 0) {
    throw new Error(`No matching courses for SEED_COURSES=${process.env.SEED_COURSES}`);
  }

  for (const course of targetCourses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        slug: course.slug,
        name: course.name,
        description: course.description,
      },
      create: course,
    });
  }

  for (const course of targetCourses) {
    for (let day = 0; day < 365; day += 1) {
      const data = {
        ...itemForCourse(course.id, day),
        courseId: course.id,
        publishDate: publishDate(day),
      };

      await prisma.dailySentence.upsert({
        where: {
          courseId_publishDate: {
            courseId: course.id,
            publishDate: data.publishDate,
          },
        },
        update: data,
        create: data,
      });
    }
  }

  const counts = await prisma.dailySentence.groupBy({
    by: ["courseId"],
    _count: { _all: true },
    orderBy: { courseId: "asc" },
  });

  console.table(
    counts.map((row) => ({
      courseId: row.courseId,
      count: row._count._all,
    })),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
