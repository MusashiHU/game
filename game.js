const hp = {
  player: 100,
  enemy: 100,
};

const guards = ["上段", "中段", "下段"];

const refs = {
  playerHp: document.getElementById("player-hp"),
  enemyHp: document.getElementById("enemy-hp"),
  playerGuard: document.getElementById("player-guard"),
  enemyGuard: document.getElementById("enemy-guard"),
  log: document.getElementById("log"),
  restart: document.getElementById("restart"),
  buttons: Array.from(document.querySelectorAll("button[data-action]")),
};

let playerGuard = "上段";
let enemyGuard = pick(guards);
let gameOver = false;

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function attackZone(action) {
  if (action.endsWith("high")) return "上段";
  if (action.endsWith("mid")) return "中段";
  return "下段";
}

function addLog(message, type = "") {
  const li = document.createElement("li");
  li.textContent = message;
  li.className = type;
  refs.log.prepend(li);
}

function refresh() {
  refs.playerHp.textContent = hp.player;
  refs.enemyHp.textContent = hp.enemy;
  refs.playerGuard.textContent = playerGuard;
  refs.enemyGuard.textContent = enemyGuard;
}

function finish(winner) {
  gameOver = true;
  refs.buttons.forEach((button) => {
    button.disabled = true;
  });
  refs.restart.hidden = false;
  addLog(`勝負あり！ ${winner}の勝ち！`);
}

function resolveTurn(action) {
  if (gameOver) return;

  const zone = attackZone(action);
  if (action.startsWith("guard")) {
    playerGuard = zone;
    addLog(`あなたは${zone}に構えた。`, "block");
  } else {
    const damage = zone === enemyGuard ? 8 : 22;
    hp.enemy = Math.max(0, hp.enemy - damage);
    const type = zone === enemyGuard ? "block" : "hit";
    addLog(
      zone === enemyGuard
        ? `敵は${zone}を読んで防いだ…（${damage}ダメージ）`
        : `会心！ ${zone}斬りが入った！（${damage}ダメージ）`,
      type,
    );
  }

  if (hp.enemy <= 0) {
    refresh();
    finish("あなた");
    return;
  }

  const enemyMove = Math.random() < 0.5 ? "attack" : "guard";
  const enemyZone = pick(guards);

  if (enemyMove === "guard") {
    enemyGuard = enemyZone;
    addLog(`敵は${enemyZone}に構えを変えた。`, "block");
  } else {
    const damage = enemyZone === playerGuard ? 6 : 16;
    hp.player = Math.max(0, hp.player - damage);
    const type = enemyZone === playerGuard ? "block" : "hit";
    addLog(
      enemyZone === playerGuard
        ? `あなたは敵の${enemyZone}攻撃を受け流した！（${damage}ダメージ）`
        : `敵の${enemyZone}攻撃が命中！（${damage}ダメージ）`,
      type,
    );
  }

  if (hp.player <= 0) {
    refresh();
    finish("敵");
    return;
  }

  if (enemyMove === "attack") {
    enemyGuard = pick(guards);
  }

  refresh();
}

refs.buttons.forEach((button) => {
  button.addEventListener("click", () => {
    resolveTurn(button.dataset.action);
  });
});

refs.restart.addEventListener("click", () => {
  hp.player = 100;
  hp.enemy = 100;
  playerGuard = "上段";
  enemyGuard = pick(guards);
  gameOver = false;
  refs.restart.hidden = true;
  refs.buttons.forEach((button) => {
    button.disabled = false;
  });
  refs.log.innerHTML = "";
  addLog("仕切り直し！");
  refresh();
});

addLog("開幕！ まずは間合いを測れ。");
refresh();
