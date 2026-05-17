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
  {
    id: "travel-english",
    slug: "travel-english",
    name: "每日一旅遊英文學習",
    description: "每天學一個旅遊情境英文句子，涵蓋機場、飯店、交通、點餐、問路與購物等實用場景。",
  },
  {
    id: "life-english",
    slug: "life-english",
    name: "每日一生活英文學習",
    description: "每天學一個日常生活英文句子，涵蓋居家、購物、工作、社交、健康與日常溝通等實用場景。",
  },
  {
    id: "business-english",
    slug: "business-english",
    name: "每日一商管英文學習",
    description: "每天學一個商業管理英文句子，涵蓋會議、簡報、策略、財務、行銷、營運與領導等實用場景。",
  },
  {
    id: "chat-english",
    slug: "chat-english",
    name: "每日一閒聊英語學習",
    description: "每天學一個自然閒聊英語句子，涵蓋寒暄、聊天回應、邀約、近況、興趣與日常社交等實用場景。",
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

const travelTopics = [
  ["Could you tell me where the train station is?", "請問你可以告訴我火車站在哪裡嗎？", "Could you tell me where...? 是禮貌問路句型，後面接完整子句。", "train station: 火車站; tell me: 告訴我; where: 哪裡", "Could you tell me where the check-in counter is?"],
  ["I would like to check in, please.", "您好，我想辦理入住。", "I would like to... 比 I want to... 更禮貌，適合飯店與服務櫃台。", "check in: 辦理入住/報到; reservation: 訂位; passport: 護照", "I would like to check in for my flight."],
  ["How much is a one-way ticket?", "單程票多少錢？", "How much is...? 用來詢問價格，one-way ticket 表示單程票。", "one-way ticket: 單程票; round-trip ticket: 來回票; fare: 票價", "How much is a round-trip ticket to Kyoto?"],
  ["Can I have the menu, please?", "可以給我菜單嗎？", "Can I have...? 是點餐和索取物品時常用的禮貌句。", "menu: 菜單; bill: 帳單; water: 水", "Can I have the bill, please?"],
  ["Is this seat taken?", "這個座位有人坐嗎？", "Is this...? 用來確認狀態，taken 在這裡表示已被使用。", "seat: 座位; taken: 被佔用; available: 可用的", "Is this table available?"],
  ["I am looking for Gate 12.", "我正在找 12 號登機門。", "I am looking for... 表示正在尋找某個地方或物品。", "gate: 登機門; terminal: 航廈; boarding pass: 登機證", "I am looking for the baggage claim area."],
  ["Could you recommend a local restaurant?", "可以推薦一家當地餐廳嗎？", "Could you recommend...? 適合請人推薦餐廳、景點或行程。", "recommend: 推薦; local: 當地的; restaurant: 餐廳", "Could you recommend a quiet cafe nearby?"],
  ["Where can I buy a SIM card?", "我可以在哪裡買 SIM 卡？", "Where can I...? 用來詢問可以在哪裡完成某件事。", "SIM card: SIM 卡; buy: 購買; nearby: 附近", "Where can I exchange money?"],
  ["I have a reservation under Chen.", "我有一筆陳先生/小姐名下的訂位。", "under + 姓氏 可表示訂位或預約登記在某個名字底下。", "reservation: 訂位; under: 以...名義; front desk: 櫃台", "I have a booking under Wang."],
  ["Could you take a photo for us?", "可以幫我們拍張照嗎？", "Could you...? 是禮貌請求句，適合向陌生人請求協助。", "take a photo: 拍照; for us: 幫我們; camera: 相機", "Could you take one more photo for us?"],
  ["Does this bus go to the airport?", "這班公車有到機場嗎？", "Does this bus go to...? 用來確認交通工具是否到某地。", "bus: 公車; airport: 機場; stop: 站牌", "Does this train go to the city center?"],
  ["I need a taxi to the hotel.", "我需要一台計程車到飯店。", "I need + 名詞 + to + 地點，可以清楚表達交通需求。", "taxi: 計程車; hotel: 飯店; address: 地址", "I need a taxi to the airport."],
  ["Could I try this on?", "我可以試穿這件嗎？", "try on 用於試穿衣服、鞋子或配件。", "try on: 試穿; size: 尺寸; fitting room: 試衣間", "Could I try these shoes on?"],
  ["Do you accept credit cards?", "你們收信用卡嗎？", "Do you accept...? 用來詢問店家是否接受某種付款方式。", "credit card: 信用卡; cash: 現金; receipt: 收據", "Do you accept mobile payments?"],
  ["I think I am lost.", "我想我迷路了。", "I think... 可以降低語氣，讓求助聽起來自然。", "lost: 迷路; map: 地圖; direction: 方向", "I think I got on the wrong train."],
  ["What time does the museum open?", "博物館幾點開門？", "What time does...? 用來詢問營業、開放或出發時間。", "museum: 博物館; open: 開門; close: 關門", "What time does the last train leave?"],
  ["Could you speak more slowly?", "可以請你說慢一點嗎？", "more slowly 用來請對方放慢速度，適合聽不清楚時使用。", "slowly: 慢慢地; repeat: 重複; understand: 了解", "Could you repeat that more slowly?"],
  ["I would like a room with a view.", "我想要一間有景觀的房間。", "with a view 用來描述有景觀的房型或座位。", "room: 房間; view: 景觀; upgrade: 升等", "I would like a table with a view."],
  ["Is there a convenience store nearby?", "附近有便利商店嗎？", "Is there...? 用來詢問某地是否有某項設施。", "convenience store: 便利商店; nearby: 附近; pharmacy: 藥局", "Is there an ATM nearby?"],
  ["Could you help me call the hotel?", "可以幫我打電話給飯店嗎？", "help me + 動詞原形 用來請人協助完成某個動作。", "call: 打電話; help me: 幫我; hotel: 飯店", "Could you help me call a taxi?"],
];

const travelFrames = [
  "旅行時先用禮貌句型開頭，像 Could you...? 或 I would like to...，通常更自然。",
  "這句適合在機場、飯店、車站或餐廳使用，先說清楚需求，再補充地點或時間。",
  "如果聽不懂對方回答，可以接著說 Could you repeat that, please? 請對方再說一次。",
  "把句中的地點、交通工具或物品替換掉，就能變成很多旅行現場可用的句子。",
  "出國時可先練關鍵單字，再練完整句，臨場比較容易說出口。",
];

const lifeTopics = [
  ["I need to pick up some groceries after work.", "我下班後需要去買一些日用品和食材。", "need to + 動詞原形 表示需要做某事，pick up 在生活英文中常表示順路買或拿。", "pick up: 順路買/拿; groceries: 日用品與食材; after work: 下班後", "I need to pick up my package after work."],
  ["Could you turn down the volume?", "可以把音量調小一點嗎？", "Could you + 動詞原形 是禮貌請求句，turn down 可表示調低音量或溫度。", "turn down: 調低; volume: 音量; noisy: 吵的", "Could you turn down the air conditioner?"],
  ["I am running late this morning.", "我今天早上快遲到了。", "be running late 表示行程延誤或快遲到。", "run late: 快遲到; this morning: 今天早上; hurry: 趕快", "I am running late for the meeting."],
  ["Can you remind me to pay the bill?", "你可以提醒我繳帳單嗎？", "remind me to + 動詞原形 表示提醒我做某事。", "remind: 提醒; pay the bill: 繳帳單; due date: 到期日", "Can you remind me to call Mom tonight?"],
  ["I have to clean up the kitchen.", "我必須整理廚房。", "have to + 動詞原形 表示必須做某事，clean up 表示清理整理。", "clean up: 清理; kitchen: 廚房; mess: 混亂", "I have to clean up my desk."],
  ["Let's grab lunch nearby.", "我們在附近簡單吃個午餐吧。", "Let's + 動詞原形 用來提出建議，grab lunch 是口語的吃午餐。", "grab lunch: 吃午餐; nearby: 附近; quick: 快速的", "Let's grab coffee after class."],
  ["I forgot to bring my umbrella.", "我忘了帶雨傘。", "forgot to + 動詞原形 表示忘記要做某事。", "forget: 忘記; bring: 帶來; umbrella: 雨傘", "I forgot to bring my keys."],
  ["The laundry is still wet.", "衣服還是濕的。", "still 表示仍然，常用來描述狀態還沒有改變。", "laundry: 洗好的衣物; wet: 濕的; dry: 乾的", "The towel is still wet."],
  ["Could you help me carry this box?", "可以幫我搬這個箱子嗎？", "help me + 動詞原形 用來請人協助完成動作。", "carry: 搬/拿; box: 箱子; heavy: 重的", "Could you help me carry these bags?"],
  ["I need to make a quick phone call.", "我需要快速打一通電話。", "make a phone call 表示打電話，quick 表示短時間的。", "phone call: 電話; quick: 快速的; message: 訊息", "I need to make a quick call before dinner."],
  ["What should I wear today?", "我今天應該穿什麼？", "What should I...? 用來詢問建議。", "wear: 穿; weather: 天氣; jacket: 外套", "What should I bring to the party?"],
  ["I am out of toothpaste.", "我的牙膏用完了。", "be out of + 名詞 表示某物用完了。", "out of: 用完; toothpaste: 牙膏; shampoo: 洗髮精", "We are out of milk."],
  ["Could you leave the package at the door?", "可以把包裹放在門口嗎？", "leave + 物品 + 地點 表示把東西留在某處。", "package: 包裹; door: 門口; delivery: 配送", "Please leave the keys on the table."],
  ["I need to reschedule my appointment.", "我需要改約時間。", "reschedule 表示重新安排時間，常用於預約、會議或看診。", "reschedule: 改期; appointment: 預約; available: 有空的", "Can I reschedule my dentist appointment?"],
  ["This shirt does not fit me well.", "這件襯衫不太合身。", "fit 表示尺寸合適，does not fit well 表示不太合身。", "fit: 合身; shirt: 襯衫; size: 尺寸", "These shoes do not fit me well."],
  ["I feel a little under the weather.", "我覺得有點不舒服。", "under the weather 是口語片語，表示身體不太舒服。", "under the weather: 身體不適; rest: 休息; medicine: 藥", "She feels under the weather today."],
  ["Can we split the bill?", "我們可以分開付帳嗎？", "split the bill 表示分帳或各付各的。", "split: 分開; bill: 帳單; cash: 現金", "Let's split the bill evenly."],
  ["I need to charge my phone.", "我需要幫手機充電。", "charge + 物品 表示為某物充電。", "charge: 充電; phone: 手機; battery: 電池", "I need to charge my laptop."],
  ["Could you send me the address?", "可以把地址傳給我嗎？", "send me + 名詞 表示傳某物給我，也可用 email me 或 text me。", "send: 傳送; address: 地址; text: 傳訊息", "Could you send me the meeting link?"],
  ["I will take care of it today.", "我今天會處理這件事。", "take care of 表示處理或照顧某事物。", "take care of: 處理/照顧; today: 今天; task: 任務", "I will take care of the dishes tonight."],
];

const lifeFrames = [
  "這句適合日常生活情境，先練核心動詞，再替換人、時間或物品。",
  "生活英文常用簡短自然的說法，像 need to、have to、Can you...? 都很實用。",
  "如果想更客氣，可以把 Can you...? 換成 Could you...?。",
  "把句子放進自己的生活行程裡練習，臨時要說時會更容易想起來。",
  "這類句子適合用在家裡、公司、商店、餐廳或朋友聊天時。",
];

const businessTopics = [
  ["We need to align our strategy with customer needs.", "我們需要讓策略與客戶需求保持一致。", "align A with B 表示讓 A 與 B 對齊或一致，是商管會議中常用句型。", "align: 對齊; strategy: 策略; customer needs: 客戶需求", "We need to align our budget with our priorities."],
  ["The team should focus on measurable outcomes.", "團隊應該專注在可衡量的成果。", "focus on + 名詞/V-ing 表示專注於某事，measurable outcomes 指可衡量成果。", "measurable: 可衡量的; outcome: 成果; focus on: 專注於", "The project should focus on measurable impact."],
  ["Our revenue grew by twelve percent this quarter.", "本季我們的營收成長了百分之十二。", "grow by + 百分比 表示增加了某個幅度，常用於財務報告。", "revenue: 營收; quarter: 季度; grow by: 成長了", "Our user base grew by ten percent this month."],
  ["Let's review the key risks before we decide.", "我們決定前先檢視主要風險。", "Let's + 動詞原形 用來提出會議建議，before we decide 說明決策前動作。", "review: 檢視; key risks: 主要風險; decide: 決定", "Let's review the data before we launch."],
  ["This proposal can improve operational efficiency.", "這項提案可以提升營運效率。", "can improve + 名詞 表示能提升某項指標或能力。", "proposal: 提案; operational efficiency: 營運效率; improve: 改善", "This tool can improve team productivity."],
  ["We should prioritize the highest-impact tasks.", "我們應該優先處理影響最大的任務。", "prioritize + 名詞 表示優先排序或優先處理。", "prioritize: 優先處理; high-impact: 高影響力的; task: 任務", "We should prioritize customer-facing issues."],
  ["The market trend is shifting quickly.", "市場趨勢正在快速轉變。", "be shifting 表示正在轉變，適合描述市場、需求或策略方向。", "market trend: 市場趨勢; shift: 轉變; quickly: 快速地", "Customer expectations are shifting quickly."],
  ["We need a clear timeline for implementation.", "我們需要一個清楚的執行時程。", "need a clear + 名詞 表示需要明確的計畫、目標或流程。", "timeline: 時程; implementation: 執行; clear: 清楚的", "We need a clear timeline for the product launch."],
  ["The campaign increased brand awareness.", "這個行銷活動提升了品牌知名度。", "increase + 名詞 表示提升某項商業指標。", "campaign: 行銷活動; brand awareness: 品牌知名度; increase: 提升", "The campaign increased customer engagement."],
  ["Let's define the success metrics first.", "我們先定義成功指標。", "define + 名詞 表示定義範圍、目標或衡量指標。", "define: 定義; success metrics: 成功指標; first: 先", "Let's define the project scope first."],
  ["The budget needs to support our growth plan.", "預算需要支持我們的成長計畫。", "support + 名詞 表示支援某個目標、策略或計畫。", "budget: 預算; growth plan: 成長計畫; support: 支持", "The roadmap needs to support our business goals."],
  ["We need to improve cross-functional communication.", "我們需要改善跨部門溝通。", "cross-functional 表示跨職能或跨部門，常用於組織管理。", "cross-functional: 跨部門的; communication: 溝通; improve: 改善", "We need to improve cross-functional collaboration."],
  ["Customer feedback should guide product decisions.", "客戶回饋應該引導產品決策。", "should guide + 名詞 表示應該引導某項決策或方向。", "customer feedback: 客戶回饋; guide: 引導; product decisions: 產品決策", "User research should guide design decisions."],
  ["The leadership team approved the new initiative.", "領導團隊核准了新的計畫。", "approve + 名詞 表示核准方案、預算或計畫。", "leadership team: 領導團隊; approve: 核准; initiative: 計畫", "The board approved the annual budget."],
  ["We need to reduce unnecessary costs.", "我們需要減少不必要的成本。", "reduce + 名詞 表示降低成本、風險或浪費。", "reduce: 減少; unnecessary: 不必要的; cost: 成本", "We need to reduce operational waste."],
  ["The report highlights three major opportunities.", "這份報告強調三個主要機會。", "highlight + 名詞 表示強調或指出重點。", "highlight: 強調; major: 主要的; opportunity: 機會", "The analysis highlights a new market opportunity."],
  ["We should set realistic quarterly goals.", "我們應該設定實際可行的季度目標。", "set + 目標 表示設定目標，realistic 表示實際可達成。", "realistic: 實際可行的; quarterly: 每季的; goal: 目標", "We should set realistic sales targets."],
  ["The process needs more accountability.", "這個流程需要更明確的責任歸屬。", "accountability 指責任歸屬與負責機制，是管理常用字。", "process: 流程; accountability: 責任歸屬; need: 需要", "The project needs clear accountability."],
  ["Let's negotiate terms that work for both sides.", "我們來協商對雙方都可行的條件。", "work for both sides 表示對雙方都有效或可接受。", "negotiate: 協商; terms: 條件; both sides: 雙方", "Let's negotiate a timeline that works for both teams."],
  ["We need to communicate the change clearly.", "我們需要清楚傳達這項變更。", "communicate + 名詞 + clearly 表示清楚傳達資訊、變更或決策。", "communicate: 傳達; change: 變更; clearly: 清楚地", "We need to communicate the new policy clearly."],
];

const businessFrames = [
  "商管英文常用清楚、直接的動詞，例如 align、prioritize、review、define 和 communicate。",
  "這句適合用在會議、簡報、策略討論或跨部門協作，先說目標，再補充數據或原因。",
  "如果要更正式，可以加上 based on the data 或 from a business perspective。",
  "練習時把句中的部門、指標、產品或客戶替換掉，就能套用到實際工作情境。",
  "商務溝通重點是精準，句子不必長，但要說清楚目的、責任與下一步。",
];

const chatTopics = [
  ["How has your day been so far?", "你今天到目前為止過得怎麼樣？", "How has your day been...? 是自然寒暄句，用現在完成式詢問到目前為止的狀態。", "so far: 到目前為止; day: 一天; how has...been: ...過得如何", "How has your week been so far?"],
  ["That sounds really interesting.", "那聽起來真的很有趣。", "That sounds + 形容詞 用來回應對方分享，讓聊天更自然。", "sound: 聽起來; interesting: 有趣的; really: 真的", "That sounds really fun."],
  ["What have you been up to lately?", "你最近都在忙些什麼？", "What have you been up to? 是口語問近況的自然說法。", "lately: 最近; be up to: 在忙/在做; what: 什麼", "What have you been up to this week?"],
  ["I have been meaning to ask you about that.", "我一直想問你那件事。", "have been meaning to + 動詞 表示一直有某個打算但還沒做。", "mean to: 打算; ask: 詢問; about that: 關於那件事", "I have been meaning to call you."],
  ["No worries, take your time.", "別擔心，慢慢來。", "No worries 是輕鬆口語回應，take your time 表示不用急。", "no worries: 沒關係; take your time: 慢慢來; rush: 趕", "No worries, take your time with the reply."],
  ["I totally get what you mean.", "我完全懂你的意思。", "get what you mean 是口語的 understand what you mean。", "totally: 完全; get: 理解; mean: 意思是", "I get what you mean now."],
  ["Do you feel like grabbing coffee later?", "你晚點想一起喝咖啡嗎？", "Do you feel like + V-ing? 用來輕鬆邀約。", "feel like: 想要; grab coffee: 喝咖啡; later: 晚點", "Do you feel like watching a movie tonight?"],
  ["I am just taking it easy today.", "我今天就是放輕鬆一點。", "take it easy 表示放輕鬆或慢慢來。", "take it easy: 放輕鬆; just: 就只是; today: 今天", "I am taking it easy this weekend."],
  ["That reminds me of something funny.", "那讓我想到一件有趣的事。", "remind me of + 名詞 表示讓我想起某事。", "remind: 使想起; funny: 有趣的; something: 某件事", "That reminds me of my first trip abroad."],
  ["I am not sure, but I can check.", "我不確定，但我可以查一下。", "I am not sure, but... 是自然委婉的回應方式。", "not sure: 不確定; check: 查一下; but: 但是", "I am not sure, but I can ask someone."],
  ["That is a good point.", "這點說得很好。", "good point 用來肯定對方提出的觀點。", "point: 觀點; good: 好的; that is: 那是", "That is a fair point."],
  ["I have heard good things about it.", "我聽說那個不錯。", "have heard good things about... 表示聽過不錯的評價。", "hear: 聽說; good things: 好評; about it: 關於它", "I have heard good things about that restaurant."],
  ["Let me know how it goes.", "到時候跟我說結果如何。", "Let me know... 用來請對方之後告知情況。", "let me know: 告訴我; how it goes: 進展如何; later: 之後", "Let me know how the meeting goes."],
  ["I would love to, but I already have plans.", "我很想去，但我已經有安排了。", "I would love to, but... 是婉拒邀約的禮貌句。", "would love to: 很想; plans: 安排; already: 已經", "I would love to, but I have a class tonight."],
  ["That makes sense.", "這樣說得通。", "make sense 表示合理、說得通或能理解。", "make sense: 說得通; understand: 理解; reasonable: 合理的", "That makes sense to me."],
  ["I am in the mood for something light.", "我現在想吃/做點輕鬆的東西。", "be in the mood for + 名詞 表示現在想要某事物。", "in the mood for: 想要; light: 輕鬆/清淡; something: 某物", "I am in the mood for a light dinner."],
  ["How did you get into that hobby?", "你是怎麼開始那個興趣的？", "get into + 名詞 表示開始對某事產生興趣。", "get into: 開始喜歡; hobby: 興趣; how: 如何", "How did you get into photography?"],
  ["I have never thought about it that way.", "我從來沒那樣想過。", "have never thought about... 表示從未想過某件事。", "never: 從未; think about: 思考; that way: 那種方式", "I have never thought about English that way."],
  ["Let's catch up sometime soon.", "我們找時間好好聊聊近況吧。", "catch up 表示聊近況，sometime soon 表示近期找時間。", "catch up: 聊近況; sometime soon: 近期某時; let's: 我們來", "Let's catch up over lunch sometime soon."],
  ["I am glad you brought that up.", "我很高興你提到那件事。", "bring up 表示提起某個話題。", "bring up: 提起; glad: 高興; topic: 話題", "I am glad you brought up that question."],
];

const chatFrames = [
  "閒聊英語重點是自然回應，不一定要說很長，但要讓對方感覺你有在接話。",
  "這句適合朋友、同事或剛認識的人聊天，可以接著問一個簡短 follow-up question。",
  "如果想更輕鬆，可以加上 actually、kind of、really 這類口語副詞。",
  "練習時先記住整句，再替換時間、活動或對象，就能用在不同聊天場景。",
  "自然聊天常用 That sounds...、I get it、Let me know... 這類簡短回應來延續話題。",
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

  if (courseId === "travel-english") {
    const topic = travelTopics[day % travelTopics.length];
    const note = travelFrames[Math.floor(day / travelTopics.length) % travelFrames.length];
    return {
      sentence: topic[0],
      translation: topic[1],
      grammarNote: topic[2],
      usageNote: note,
      vocabulary: topic[3],
      example: topic[4],
    };
  }

  if (courseId === "life-english") {
    const topic = lifeTopics[day % lifeTopics.length];
    const note = lifeFrames[Math.floor(day / lifeTopics.length) % lifeFrames.length];
    return {
      sentence: topic[0],
      translation: topic[1],
      grammarNote: topic[2],
      usageNote: note,
      vocabulary: topic[3],
      example: topic[4],
    };
  }

  if (courseId === "business-english") {
    const topic = businessTopics[day % businessTopics.length];
    const note = businessFrames[Math.floor(day / businessTopics.length) % businessFrames.length];
    return {
      sentence: topic[0],
      translation: topic[1],
      grammarNote: topic[2],
      usageNote: note,
      vocabulary: topic[3],
      example: topic[4],
    };
  }

  if (courseId === "chat-english") {
    const topic = chatTopics[day % chatTopics.length];
    const note = chatFrames[Math.floor(day / chatTopics.length) % chatFrames.length];
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
