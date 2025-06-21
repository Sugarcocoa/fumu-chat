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

// ふむふむの返事を生成する関数
function getFumuReply(input) {
  if (input.includes("疲れ") || input.includes("つかれ")) {
    return "よしよし、ふむふむパワー送るね〜！🫧";
  } else if (input.includes("元気")) {
    return "うんうん、今日もいい日になる予感〜！";
  } else if (input.includes("したくない") || input.includes("やる気ない")) {
    return "そういう日もあるのでしょ。だいじょうぶ〜";
  } else if (input.includes("ねむ") || input.includes("眠")) {
    return "おやすみ前に、ふむふむがぎゅ〜っ✨";
  } else {
    return "ふむふむ、たむたむのこと聞いてるよ〜！";
  }
}

// メッセージ送信機能
function sendMessage() {
  const input = userInput.value.trim();
  const expression = expressionSelect.value;

  // テキストが入力されている場合は吹き出しを更新
  if (input !== "") {
    // ふむふむの返事を生成して表示
    const fumuReply = getFumuReply(input);
    fumuBubble.innerText = fumuReply;
    userInput.value = ""; // 入力欄をクリア
  }

  // 表情を更新
  fumuImg.src = imageMap[expression] || "fumu_base.png";
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
  // 初期表情を設定
  fumuImg.src = imageMap.base;
  
  // 初期背景を設定
  changeBackground();
});