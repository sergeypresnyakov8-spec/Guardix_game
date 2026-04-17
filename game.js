const STORAGE_KEY = "pak-click-save-v1";

const BUILDINGS = [
  { id: "manual_line", name: "Оператор", description: "Выполняет первые ручные операции и помогает запускать выпуск курьерских пакетов.", baseCost: 15, basePps: 0.2 },
  { id: "mechanic", name: "Наладчик", description: "Следит за состоянием линии, ускоряет переналадку и снижает простои.", baseCost: 60, basePps: 1 },
  { id: "pfm_machine", name: "Машина ПФМ", description: "Полуавтоматически формирует заготовки для курьерских пакетов и ускоряет старт производства.", baseCost: 250, basePps: 4 },
  { id: "extruder", name: "Экструдер", description: "Непрерывно выпускает пленку нужной толщины для дальнейшей переработки.", baseCost: 1100, basePps: 10 },
  { id: "cutting_line", name: "Уголок", description: "Складывает пленку перед дальнейшей обработкой и выравнивает поток материала.", baseCost: 5000, basePps: 22 },
  { id: "printing_module", name: "Флексопечать", description: "Наносит печать на пакеты и ускоряет прохождение партии через линию.", baseCost: 12000, basePps: 48 },
  { id: "welding_station", name: "Слиттер", description: "Разделяет и подготавливает полотно к следующему этапу выпуска.", baseCost: 30000, basePps: 100 },
  { id: "quality_control", name: "ОТК", description: "Контролирует качество шва, печати и геометрии пакета без остановки потока.", baseCost: 85000, basePps: 210 },
  { id: "conveyor", name: "Упаковочный участок", description: "Собирает готовую продукцию в партии и подготавливает ее к размещению на складе.", baseCost: 220000, basePps: 450 },
  { id: "warehouse", name: "Склад готовой продукции", description: "Организует хранение готовых партий и ускоряет комплектацию заказов.", baseCost: 600000, basePps: 1000 },
  { id: "robotic_cell", name: "Зона отгрузки", description: "Автоматизирует финальную обработку заказов и отправку партий клиентам.", baseCost: 1500000, basePps: 2200 },
];

const SUPER_UPGRADES = [
  { id: "code_operators", name: "Премия Сухову А. А.", description: "Машины заметно становятся бодрее, датчики работают без сбоев, QR-коды печатаются без ошибок, и все ПК на заводе перестают глючить и ломаться.", cost: 900, tag: "+2 за клик" },
  { id: "new_spare_parts", name: "Новые запчасти", description: "Свежие комплектующие снижают простои и делают линию заметно бодрее.", cost: 5000, tag: "+12% к выпуску" },
  { id: "introduce_fines", name: "Ввести штрафы", description: "Все резко вспоминают про выработку, дисциплину и почему нельзя стоять у линии.", cost: 18000, tag: "+18% к выпуску" },
  { id: "quality_call", name: "Звонок ДС по браку", description: "После такого звонка процент брака почему-то сразу начинает падать.", cost: 55000, tag: "+25% к выпуску" },
  { id: "output_call", name: "Звонок ДС по выработке", description: "План становится личным делом каждого участка на смене.", cost: 140000, tag: "+35% к выпуску" },
  { id: "install_cameras", name: "Установить камеры", description: "Контроль становится тотальным, а остановки линии подозрительно короткими.", cost: 350000, tag: "+50% к выпуску" },
];

const defaultState = () => ({
  packages: 0,
  totalPackages: 0,
  packageRemainder: 0,
  clickPower: 1,
  clickCount: 0,
  manualUpgradeLevel: 1,
  manualUpgradeCost: 50,
  buildingsOwned: Object.fromEntries(BUILDINGS.map((building) => [building.id, 0])),
  superUpgradesOwned: Object.fromEntries(SUPER_UPGRADES.map((upgrade) => [upgrade.id, false])),
  productionBoost: 1,
  events: [
    { title: "Смена запущена", text: "Производство Guardix готово к работе. Начните сборку первой партии вручную." },
    { title: "Подсказка", text: "Развивайте участки цеха, чтобы наращивать выпуск курьерских пакетов в секунду." },
  ],
});

const state = loadState();

const elements = {
  packageCount: document.getElementById("package-count"),
  packagesPerSecond: document.getElementById("packages-per-second"),
  clickPower: document.getElementById("click-power"),
  manualLevel: document.getElementById("manual-level"),
  manualUpgradeCost: document.getElementById("manual-upgrade-cost"),
  packageButton: document.getElementById("package-button"),
  manualUpgradeButton: document.getElementById("manual-upgrade-button"),
  buildingsList: document.getElementById("buildings-list"),
  superUpgradesList: document.getElementById("super-upgrades-list"),
  buildingTemplate: document.getElementById("building-card-template"),
  eventsLog: document.getElementById("events-log"),
  resetButton: document.getElementById("reset-button"),
  packagePanel: document.querySelector(".package-panel"),
  packageScore: document.querySelector(".package-score"),
};

function isMojibakeText(value) {
  return typeof value === "string" && /Р.|С.|р./.test(value);
}

function sanitizeEvents(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return defaultState().events;
  }

  const validEvents = events.filter((event) => {
    if (!event || typeof event !== "object") {
      return false;
    }

    return !isMojibakeText(event.title) && !isMojibakeText(event.text);
  });

  return validEvents.length ? validEvents : defaultState().events;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultState();
    }

    const parsed = JSON.parse(raw);
    return {
      ...defaultState(),
      ...parsed,
      buildingsOwned: {
        ...defaultState().buildingsOwned,
        ...(parsed.buildingsOwned || {}),
      },
      superUpgradesOwned: {
        ...defaultState().superUpgradesOwned,
        ...(parsed.superUpgradesOwned || {}),
      },
      events: sanitizeEvents(parsed.events),
    };
  } catch (error) {
    console.error("Ошибка загрузки сохранения", error);
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatNumber(value) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} млрд`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} млн`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)} тыс`;
  }

  if (value >= 100) {
    return value.toFixed(0);
  }

  return value.toFixed(1).replace(/\.0$/, "");
}

function calculateBuildingCost(building) {
  const owned = state.buildingsOwned[building.id] || 0;
  return Math.floor(building.baseCost * Math.pow(1.15, owned));
}

function calculatePackagesPerSecond() {
  const basePackagesPerSecond = BUILDINGS.reduce((sum, building) => {
    const owned = state.buildingsOwned[building.id] || 0;
    return sum + owned * building.basePps;
  }, 0);

  return basePackagesPerSecond * state.productionBoost;
}

function addEvent(title, text) {
  state.events.unshift({ title, text });
  state.events = state.events.slice(0, 6);
}

function renderEvents() {
  elements.eventsLog.innerHTML = "";

  state.events.forEach((event) => {
    const eventNode = document.createElement("article");
    eventNode.className = "event-item";
    eventNode.innerHTML = `<strong>${event.title}</strong><span>${event.text}</span>`;
    elements.eventsLog.appendChild(eventNode);
  });
}

function renderBuildings() {
  elements.buildingsList.innerHTML = "";

  BUILDINGS.forEach((building) => {
    const owned = state.buildingsOwned[building.id] || 0;
    const cost = calculateBuildingCost(building);
    const fragment = elements.buildingTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".building-card");

    fragment.querySelector(".building-name").textContent = building.name;
    fragment.querySelector(".building-description").textContent = building.description;
    fragment.querySelector(".building-count").textContent = `${owned} шт.`;
    fragment.querySelector(".building-pps").textContent = `+${formatNumber(building.basePps)} / сек`;
    fragment.querySelector(".building-cost").textContent = `Цена: ${formatNumber(cost)}`;

    if (state.packages < cost) {
      button.disabled = true;
    }

    button.addEventListener("click", () => purchaseBuilding(building.id));
    elements.buildingsList.appendChild(fragment);
  });
}

function renderSuperUpgrades() {
  elements.superUpgradesList.innerHTML = "";

  SUPER_UPGRADES.forEach((upgrade) => {
    const purchased = state.superUpgradesOwned[upgrade.id];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "building-card";
    button.innerHTML = `
      <div class="building-card-main">
        <div>
          <h5 class="building-name">${upgrade.name}</h5>
          <p class="building-description">${upgrade.description}</p>
        </div>
        <div class="building-meta">
          <span class="building-card-tag">${upgrade.tag}</span>
        </div>
      </div>
      <div class="building-card-footer">
        <span class="building-cost">Цена: ${formatNumber(upgrade.cost)}</span>
        <span class="building-next">${purchased ? "Куплено" : "Разово"}</span>
      </div>
    `;

    if (purchased) {
      button.disabled = true;
      button.classList.add("is-purchased");
    } else if (state.packages < upgrade.cost) {
      button.disabled = true;
    }

    button.addEventListener("click", () => purchaseSuperUpgrade(upgrade.id));
    elements.superUpgradesList.appendChild(button);
  });
}

function renderStats() {
  const packagesPerSecond = calculatePackagesPerSecond();
  elements.packageCount.textContent = formatNumber(state.packages);
  elements.packagesPerSecond.textContent = formatNumber(packagesPerSecond);
  elements.clickPower.textContent = formatNumber(state.clickPower);
  elements.manualLevel.textContent = state.manualUpgradeLevel;
  elements.manualUpgradeCost.textContent = formatNumber(state.manualUpgradeCost);
  elements.manualUpgradeButton.disabled = state.packages < state.manualUpgradeCost;
}

function render() {
  renderStats();
  renderBuildings();
  renderSuperUpgrades();
  renderEvents();
}

function gainPackages(amount) {
  const totalAmount = state.packageRemainder + amount;
  const wholePackages = Math.floor(totalAmount);
  state.packageRemainder = totalAmount - wholePackages;

  if (wholePackages > 0) {
    state.packages += wholePackages;
    state.totalPackages += wholePackages;
  }
}

function shouldRefreshShop(previousPackages, nextPackages) {
  if (nextPackages <= previousPackages) {
    return false;
  }

  const buildingBecameAffordable = BUILDINGS.some((building) => {
    const cost = calculateBuildingCost(building);
    return previousPackages < cost && nextPackages >= cost;
  });

  if (buildingBecameAffordable) {
    return true;
  }

  return SUPER_UPGRADES.some((upgrade) => {
    if (state.superUpgradesOwned[upgrade.id]) {
      return false;
    }

    return previousPackages < upgrade.cost && nextPackages >= upgrade.cost;
  });
}

function playPurchaseEffect(effectType) {
  if (!elements.packagePanel || !elements.packageScore) {
    return;
  }

  elements.packagePanel.classList.remove("purchase-flash", "purchase-flash-strong");
  elements.packageScore.classList.remove("score-pop", "score-pop-strong");

  void elements.packagePanel.offsetWidth;

  const isStrongEffect = effectType === "super";
  elements.packagePanel.classList.add(isStrongEffect ? "purchase-flash-strong" : "purchase-flash");
  elements.packageScore.classList.add(isStrongEffect ? "score-pop-strong" : "score-pop");
}

function handlePackageClick() {
  gainPackages(state.clickPower);
  state.clickCount += 1;
  elements.packageButton.classList.add("is-pressed");
  window.setTimeout(() => elements.packageButton.classList.remove("is-pressed"), 120);

  if (state.clickCount === 25) {
    addEvent("Бригада разогрелась", "Первые 25 пакетов собраны вручную. Производство входит в ритм.");
  }

  render();
  saveState();
}

function purchaseBuilding(buildingId) {
  const building = BUILDINGS.find((item) => item.id === buildingId);
  if (!building) {
    return;
  }

  const cost = calculateBuildingCost(building);
  if (state.packages < cost) {
    return;
  }

  state.packages -= cost;
  state.buildingsOwned[buildingId] += 1;
  addEvent("Новое здание", `${building.name} запущен(а) в работу.`);
  playPurchaseEffect("building");
  render();
  saveState();
}

function purchaseSuperUpgrade(upgradeId) {
  const upgrade = SUPER_UPGRADES.find((item) => item.id === upgradeId);
  if (!upgrade || state.superUpgradesOwned[upgradeId] || state.packages < upgrade.cost) {
    return;
  }

  state.packages -= upgrade.cost;
  state.superUpgradesOwned[upgradeId] = true;

  if (upgradeId === "code_operators") {
    state.clickPower += 2;
    addEvent("Супер-улучшение", "Операторов закодировали: ручной выпуск стал заметно быстрее.");
  }

  if (upgradeId === "new_spare_parts") {
    state.productionBoost *= 1.12;
    addEvent("Супер-улучшение", "Новые запчасти сократили простои на линии.");
  }

  if (upgradeId === "introduce_fines") {
    state.productionBoost *= 1.18;
    addEvent("Супер-улучшение", "После введения штрафов участки неожиданно ускорились.");
  }

  if (upgradeId === "quality_call") {
    state.productionBoost *= 1.25;
    addEvent("Супер-улучшение", "Звонок ДС по браку резко повысил внимание к качеству.");
  }

  if (upgradeId === "output_call") {
    state.productionBoost *= 1.35;
    addEvent("Супер-улучшение", "Звонок ДС по выработке ускорил всю смену.");
  }

  if (upgradeId === "install_cameras") {
    state.productionBoost *= 1.5;
    addEvent("Супер-улучшение", "Камеры установлены: простои стали подозрительно короткими.");
  }

  playPurchaseEffect("super");
  render();
  saveState();
}

function upgradeManualProduction() {
  if (state.packages < state.manualUpgradeCost) {
    return;
  }

  state.packages -= state.manualUpgradeCost;
  state.manualUpgradeLevel += 1;
  state.clickPower += 1;
  state.manualUpgradeCost = Math.floor(state.manualUpgradeCost * 2.25);
  addEvent("Мастер усилил участок", `Теперь ручной участок Guardix выпускает ${formatNumber(state.clickPower)} пак. за клик.`);
  playPurchaseEffect("manual");
  render();
  saveState();
}

function resetGame() {
  const confirmed = window.confirm("Сбросить весь прогресс производства?");
  if (!confirmed) {
    return;
  }

  Object.assign(state, defaultState());
  saveState();
  render();
}

let lastTick = performance.now();
function gameLoop(now) {
  const deltaSeconds = (now - lastTick) / 1000;
  lastTick = now;

  const packagesPerSecond = calculatePackagesPerSecond();
  if (packagesPerSecond > 0) {
    const packagesBeforeTick = state.packages;
    gainPackages(packagesPerSecond * deltaSeconds);
    if (shouldRefreshShop(packagesBeforeTick, state.packages)) {
      render();
    } else {
      renderStats();
    }
  }

  window.requestAnimationFrame(gameLoop);
}

elements.packageButton.addEventListener("click", handlePackageClick);
elements.manualUpgradeButton.addEventListener("click", upgradeManualProduction);
elements.resetButton.addEventListener("click", resetGame);

render();
window.requestAnimationFrame(gameLoop);
window.setInterval(saveState, 5000);
window.addEventListener("beforeunload", saveState);
