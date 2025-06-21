function sendMessage() {
  const input = document.getElementById("userInput").value.trim();
  const expression = document.getElementById("expression").value;
  const fumuText = document.getElementById("fumuText");
  const fumuImage = document.getElementById("fumuImage");

  if (input !== "") {
    fumuText.innerText = input;
  }

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

  fumuImage.src = imageMap[expression] || "fumu_base.png";
}
