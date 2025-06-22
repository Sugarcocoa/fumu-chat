// DOM要素の取得
const userInput = document.getElementById("user-input");
const expressionSelect = document.getElementById("expression-select");
const fumuBubble = document.getElementById("fumu-bubble");
const fumuImg = document.getElementById("fumu-img");
const sendBtn = document.getElementById("send-btn");
const bgSelect = document.getElementById("bg-select");
const chatWrapper = document.querySelector(".chat-wrapper");

// 表情と画像のマッピング
const imageMap = {
  base: "fumu_base.png",
  smile: "fumu_smile.png",
  alert: "fumu_alert.png",
  cry: "fumu_cry.png",
  sleepy: "fumu_sleepy.png",
  go: "fumu_go.png",
  dango: "fumu_dango.png",
  flower: "fumu_flower.png",
};

// 背景画像の配列
const backgroundImages = [
  "BG1.png",
  "BG2.png", 
  "BG3.png",
  "BG4.png",
  "BG5.png"
];

// 会話パターンデータベース (AIによる提案ベース)
const conversationDB = {
  // 基本的な感情パターン
  emotions: {
    tired: {
      keywords: ["疲れ", "つかれ", "しんど", "だるい", "眠い", "ねむ"],
      replies: [
        "よしよし、ふむふむパワー送るね〜！🫧",
        "お疲れさま！よしよし(´・ω・｀)",
        "あんまりムリしちゃだめだからねぇ",
        "ふむふむをハグハグしたら元気でる？",
        "たいへんだったね、ふむふむがそばにいるよ"
      ],
      expressions: ["cry", "base"],
      backgrounds: ["BG2.png", "BG5.png"]
    },
    happy: {
      keywords: ["嬉しい", "うれしい", "楽しい", "元気", "最高", "好き", "すき", "かわいい", "可愛い", "ありがとう"],
      replies: [
        "わぁい！ふむふむも嬉しい〜！",
        "うんうん、今日もいい日になる予感〜！",
        "たむたむが楽しそうだと、ふむふむも幸せ♪",
        "えへへ、ふむふむもわくわくする〜",
        "えへへ、ふむふむも大好きだよ〜！",
        "照れるなぁ〜、でも、ありがと！",
        "どういたしまして〜！いつでも言ってね！"
      ],
      expressions: ["smile", "flower"],
      backgrounds: ["BG3.png", "BG1.png"]
    },
    unmotivated: {
      keywords: ["やる気", "したくない", "めんどう", "動けない"],
      replies: [
        "そういう日もあるのでしょ。だいじょうぶ〜",
        "それじゃ「ふむふむファイブ」しようね",
        "ちょっとずつでいいからね〜",
        "無理しなくていいよ、ふむふむがついてる"
      ],
      expressions: ["sleepy", "base"],
      backgrounds: ["BG2.png"]
    },
    worried: {
      keywords: ["心配", "不安", "どうしよう", "困った"],
      replies: [
        "だいじょうぶ！たむたむが思ってるよりずっとちゃんとできてるよ",
        "自分がコントロールできないことは、あまり気にしないようにね",
        "もっと大切なことはたくさんあるからぁ",
        "ふむふむが一緒にいるから安心して"
      ],
      expressions: ["base", "cry"],
      backgrounds: ["BG5.png"]
    }
  },
  // 時間に基づく挨拶
  timeBasedGreetings: {
    morning: {
      keywords: ["おはよう"],
      replies: [
        "おはよ〜！朝ごはんちゃんと食べた？",
        "おはよう！今日もいい天気だね♪",
        "おはよ〜！今日も一日よろしくね"
      ],
      expressions: ["smile", "flower"],
      backgrounds: ["BG1.png", "BG3.png"]
    },
    evening: {
      keywords: ["おかえり", "ただいま", "こんばんは"],
      replies: [
        "おかえりおかえりー",
        "お疲れさま！今日はどうだった？",
        "おかえり〜、よく頑張ったね"
      ],
      expressions: ["smile", "base"],
      backgrounds: ["BG2.png"]
    },
    night: {
      keywords: ["おやすみ", "寝る", "眠る"],
      replies: [
        "おやすみ前に、ふむふむがぎゅ〜っ✨",
        "おやすみ〜、いい夢見てね",
        "明日も一緒だからね、おやすみ"
      ],
      expressions: ["sleepy", "base"],
      backgrounds: ["BG2.png", "BG4.png"]
    }
  },
  // 特別なアクション
  specialActions: {
    food: {
      keywords: ["だんご", "団子", "たい焼き", "和菓子", "おやつ", "食べる"],
      replies: [
        "おだんご！ふむふむの大好物〜♪",
        "和菓子っていいよね〜、ふむふむも大好き",
        "一緒に食べよ〜♪"
      ],
      expressions: ["dango", "smile"],
      backgrounds: ["BG3.png"]
    }
  },
  // デフォルト返事
  defaultReplies: [
    "ふむふむ、たむたむのこと聞いてるよ〜！",
    "うんうん、それでそれで？",
    "ふむふむはいつでもたむたむの味方だからね",
    "そうなんだ〜、教えてくれてありがと♪"
  ]
};

// ランダム選択ヘルパー
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// ランダム初期化関数
function initializeRandomly() {
  // ランダムな表情を選択
  const randomExpression = getRandomItem(Object.keys(imageMap));
  
  // ランダムな背景を選択
  const randomBackground = getRandomItem(backgroundImages);
  
  // 表情を設定
  expressionSelect.value = randomExpression;
  fumuImg.src = imageMap[randomExpression];
  
  // 背景を設定
  bgSelect.value = randomBackground;
  chatWrapper.style.backgroundImage = `url("${randomBackground}")`;
  
  console.log(`ランダム初期化: 表情=${randomExpression}, 背景=${randomBackground}`);
}

// レスポンス生成ヘルパー
function generateResponse(data) {
  return {
    reply: getRandomItem(data.replies),
    expression: getRandomItem(data.expressions),
    background: data.backgrounds ? getRandomItem(data.backgrounds) : null
  };
}

// ふむふむの返事を生成する関数
function getFumuReply(input) {
  const lowerInput = input.toLowerCase();

  // 時間ベースの挨拶をチェック
  const hour = new Date().getHours();
  let timeCategory = "";
  if (hour >= 5 && hour < 12) timeCategory = "morning";
  else if (hour >= 17 && hour < 22) timeCategory = "evening";
  else if (hour >= 22 || hour < 5) timeCategory = "night";

  if (timeCategory && conversationDB.timeBasedGreetings[timeCategory]) {
    const timeData = conversationDB.timeBasedGreetings[timeCategory];
    if (timeData.keywords.some(keyword => lowerInput.includes(keyword))) {
      return generateResponse(timeData);
    }
  }

  // 感情パターンをチェック
  for (const emotionData of Object.values(conversationDB.emotions)) {
    if (emotionData.keywords.some(keyword => lowerInput.includes(keyword))) {
      return generateResponse(emotionData);
    }
  }
  
    // 特別なアクションをチェック
  for (const actionData of Object.values(conversationDB.specialActions)) {
    if (actionData.keywords.some(keyword => lowerInput.includes(keyword))) {
      return generateResponse(actionData);
    }
  }

  // デフォルト返事
  return {
    reply: getRandomItem(conversationDB.defaultReplies),
    expression: "base",
    background: null // 背景は変更しない
  };
}

// カウントダウン特別処理
function playCountdown() {
  const messages = [
    "ふむふむファイブ！",
    "ふむふむフォー！",
    "ふむふむスリー！",
    "ふむふむトゥー！",
    "ふむふむワーン！",
    "ふむふむGo！"
  ];
  
  sendBtn.disabled = true;
  userInput.disabled = true;
  
  let index = 0;
  fumuImg.src = imageMap.go;
  expressionSelect.value = "go";

  const interval = setInterval(() => {
    if(index < messages.length) {
      fumuBubble.innerText = messages[index];
      index++;
    } else {
      clearInterval(interval);
      fumuBubble.innerText = "よし、動けた！ありがと♪";
      fumuImg.src = imageMap.smile;
      expressionSelect.value = "smile";
      sendBtn.disabled = false;
      userInput.disabled = false;
    }
  }, 700);
}

// メッセージ送信機能
function sendMessage() {
  const input = userInput.value.trim();
  if (input === "") return;

  // ユーザーのメッセージを表示
  addMessage(input, 'user');

  userInput.value = ""; // 入力欄をクリア

  // カウントダウンのキーワードをチェック
  const countdownKeywords = ["ファイブ", "カウントダウン", "やる気だして"];
  if (countdownKeywords.some(keyword => input.includes(keyword))) {
    setTimeout(playCountdown, 500); // 少し間を置いてから実行
    return;
  }
  
  // ふむふむの返事を少し遅れて表示
  setTimeout(() => {
    const response = getFumuReply(input);
    addMessage(response.reply, 'fumu', response.expression, response.background);
  }, 800);
}

// チャットエリアにメッセージを追加する関数
function addMessage(text, sender, expression = 'base', background = null) {
  const chatArea = document.getElementById('chat-area');

  if (sender === 'user') {
    const userContainer = document.createElement('div');
    userContainer.className = 'user-container';

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerText = text;

    userContainer.appendChild(bubble);
    chatArea.appendChild(userContainer);

  } else if (sender === 'fumu') {
    // 既存のふむふむの要素をクローンして新しいメッセージとして追加
    const fumuContainer = document.querySelector('.fumu-container').cloneNode(true);
    const fumuImg = fumuContainer.querySelector('#fumu-img');
    const fumuBubble = fumuContainer.querySelector('#fumu-bubble');

    fumuBubble.innerText = text;
    fumuImg.src = imageMap[expression];
    expressionSelect.value = expression;
    
    if (background) {
      chatWrapper.style.backgroundImage = `url("${background}")`;
      bgSelect.value = background;
    }

    // 最初のメッセージを置き換えるか、新しいメッセージを追加するか
    const initialFumuMessage = document.querySelector('.fumu-container');
    if (initialFumuMessage && chatArea.children.length === 1) {
      chatArea.replaceChild(fumuContainer, initialFumuMessage);
    } else {
      // 古いふむふむ画像を非表示にする（オプション）
      const allFumuImages = chatArea.querySelectorAll('.fumu-container #fumu-img');
      allFumuImages.forEach(img => img.style.visibility = 'hidden');
      fumuContainer.querySelector('#fumu-img').style.visibility = 'visible';

      chatArea.appendChild(fumuContainer);
    }
  }
  
  // 一番下までスクロール
  chatArea.scrollTop = chatArea.scrollHeight;
}

// 背景変更機能
function changeBackground() {
  const selectedBg = bgSelect.value;
  chatWrapper.style.backgroundImage = `url("${selectedBg}")`;
}

// イベントリスナーの設定
sendBtn.addEventListener("click", sendMessage);

// Enterキーでも送信できるように
userInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// 表情選択時にリアルタイムで変更
expressionSelect.addEventListener("change", function() {
  const expression = expressionSelect.value;
  fumuImg.src = imageMap[expression] || "fumu_base.png";
});

// 背景選択時にリアルタイムで変更
bgSelect.addEventListener("change", changeBackground);

// ページ読み込み時の初期設定
document.addEventListener("DOMContentLoaded", function() {
  // 初期化を少し遅らせて、ユーザーが初期メッセージを認識しやすくする
  setTimeout(initializeRandomly, 200);

  // 最初のメッセージをセット
  const chatArea = document.getElementById('chat-area');
  chatArea.innerHTML = `
    <div class="fumu-container">
      <img id="fumu-img" src="fumu_base.png" alt="fumu">
      <div class="bubble" id="fumu-bubble">たむたむー～！きょうもげんき？</div>
    </div>
  `;
});