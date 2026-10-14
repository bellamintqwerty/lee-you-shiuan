
const scenes = {
  room1: {
    name: "場景 01｜測試房間",
    background: "assets/room1.png",
    message: "點擊物件，尋找線索。",
    objects: [
      {
        id: "book",
        icon: "📖",
        x: 25,
        y: 35,
        type: "clue",
        text: "書頁上寫著：密碼是 1234。"
      },
      {
        id: "key",
        icon: "🗝️",
        x: 75,
        y: 55,
        type: "item",
        name: "銀色鑰匙",
        text: "妳獲得了一把銀色鑰匙！"
      },
      {
        id: "door",
        icon: "🚪",
        x: 50,
        y: 80,
        type: "puzzle",
        title: "封印之門",
        hint: "找到鑰匙，再輸入四位數密碼。",
        requiredItem: "key",
        answer: "1234",
        nextScene: "room2"
      }
    ]
  },

  room2: {
    name: "場景 02｜測試終點",
    message: "成功解開第一個場景！",
    objects: [
      {
        id: "star",
        icon: "🌟",
        x: 50,
        y: 45,
        type: "clue",
        text: "恭喜！遊戲場景切換成功。"
      }
    ]
  }
};

let currentScene = "room1";
let inventory = [];
let activePuzzle = null;

const sceneElement = document.getElementById("scene");
const messageElement = document.getElementById("message");
const inventoryElement = document.getElementById("inventory");
const puzzleElement = document.getElementById("puzzle");

function showMessage(text) {
  messageElement.textContent = text;
}

function loadScene(sceneId) {
  const scene = scenes[sceneId];

  if (!scene) return;

  currentScene = sceneId;
  sceneElement.innerHTML = "";
  sceneElement.style.backgroundImage =
  scene.background ? `url("${scene.background}")` : "";

sceneElement.style.backgroundSize = "cover";
sceneElement.style.backgroundPosition = "center";

  document.getElementById("scene-name").textContent =
    scene.name;

  showMessage(scene.message);

  inventoryElement.hidden = true;
  puzzleElement.hidden = true;
  activePuzzle = null;

  scene.objects.forEach(object => {
    // 已收集的道具不再出現
    if (
      object.type === "item" &&
      inventory.includes(object.id)
    ) return;

    const button = document.createElement("button");
button.className = "object";

if (object.image) {
  const img = document.createElement("img");
  img.src = object.image;
  img.alt = object.name || object.id;
  button.appendChild(img);
} else {
  button.textContent = object.icon;
}

button.setAttribute("aria-label", object.name || object.id);

    button.style.left = object.x + "%";
    button.style.top = object.y + "%";

    button.addEventListener("click", () => {
      interact(object);
    });

    sceneElement.appendChild(button);
  });
}

function interact(object) {
  if (object.type === "clue") {
    showMessage(object.text);
  }

  if (object.type === "item") {
    if (!inventory.includes(object.id)) {
      inventory.push(object.id);
    }

    showMessage(object.text);
    updateInventory();
    loadObjectsOnly();
  }

  if (object.type === "puzzle") {
    if (
      object.requiredItem &&
      !inventory.includes(object.requiredItem)
    ) {
      showMessage("還缺少某個重要道具……");
      return;
    }

    activePuzzle = object;

    document.getElementById("puzzle-title").textContent =
      object.title;

    document.getElementById("puzzle-hint").textContent =
      object.hint;

    document.getElementById("answer").value = "";
    puzzleElement.hidden = false;
    inventoryElement.hidden = true;
  }
}

function loadObjectsOnly() {
  // 重新繪製場景，保留目前的提示訊息
  const lastMessage = messageElement.textContent;
  loadScene(currentScene);
  showMessage(lastMessage);
}

function updateInventory() {
  const container = document.getElementById("inventory-items");
  container.innerHTML = "";

  inventory.forEach(itemId => {
    const item = Object.values(scenes)
      .flatMap(scene => scene.objects)
      .find(object => object.id === itemId);

    if (!item) return;

    const button = document.createElement("button");
    button.textContent = item.icon + " " + item.name;

    button.addEventListener("click", () => {
      showMessage(item.text);
      inventoryElement.hidden = true;
    });

    container.appendChild(button);
  });

  document.getElementById("item-count").textContent =
    inventory.length;
}

document.getElementById("bag-button")
  .addEventListener("click", () => {
    inventoryElement.hidden = !inventoryElement.hidden;
    puzzleElement.hidden = true;
  });

document.getElementById("submit-answer")
  .addEventListener("click", () => {
    if (!activePuzzle) return;

    const answer = document.getElementById("answer")
      .value.trim();

    if (answer === activePuzzle.answer) {
      loadScene(activePuzzle.nextScene);
    } else {
      showMessage("密碼不正確，再試一次。");
    }
  });

document.getElementById("close-puzzle")
  .addEventListener("click", () => {
    puzzleElement.hidden = true;
    activePuzzle = null;
  });

loadScene(currentScene);
updateInventory();
// 點擊首頁後進入解謎遊戲
const homeScreen = document.getElementById("home-screen");

homeScreen.addEventListener("click", () => {
  homeScreen.classList.add("hide");
});