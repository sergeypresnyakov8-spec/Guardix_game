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
  { id: "code_operators", name: "Премия электрику", description: "Главный электрик получает премию — оборудование перестаёт глючить, датчики работают идеально, QR-коды печатаются без ошибок.", cost: 900, tag: "+2 за клик" },
  { id: "new_spare_parts", name: "Новые запчасти", description: "Свежие комплектующие снижают простои и делают линию заметно бодрее.", cost: 5000, tag: "+12% к выпуску" },
  { id: "introduce_fines", name: "Ввести штрафы", description: "Все резко вспоминают про выработку, дисциплину и почему нельзя стоять у линии.", cost: 18000, tag: "+18% к выпуску" },
  { id: "quality_call", name: "Звонок босса по браку", description: "После звонка руководителя процент брака почему-то сразу начинает падать.", cost: 55000, tag: "+25% к выпуску" },
  { id: "output_call", name: "Звонок босса по выработке", description: "План становится личным делом каждого участка на смене.", cost: 140000, tag: "+35% к выпуску" },
  { id: "install_cameras", name: "Установить камеры", description: "Контроль становится тотальным, а остановки линии подозрительно короткими.", cost: 350000, tag: "+50% к выпуску" },
];

const FACTORY_LEVELS = [
  { level: 1, name: "Гаражный цех", threshold: 0, bonus: 0 },
  { level: 2, name: "Мастерская", threshold: 1000, bonus: 0.05 },
  { level: 3, name: "Мини-завод", threshold: 5000, bonus: 0.1 },
  { level: 4, name: "Производственный цех", threshold: 25000, bonus: 0.15 },
  { level: 5, name: "Фабрика", threshold: 100000, bonus: 0.2 },
  { level: 6, name: "Крупная фабрика", threshold: 500000, bonus: 0.25 },
  { level: 7, name: "Промышленный комплекс", threshold: 2000000, bonus: 0.3 },
  { level: 8, name: "Корпорация", threshold: 10000000, bonus: 0.35 },
  { level: 9, name: "Империя", threshold: 50000000, bonus: 0.4 },
  { level: 10, name: "Глобальная сеть", threshold: 250000000, bonus: 0.5 },
];

const ACHIEVEMENTS = [
  { id: "first_click", name: "Первый шаг", description: "Сделайте первый клик", condition: (s) => s.clickCount >= 1, reward: 0.05, skillPoints: 0, type: "click" },
  { id: "hundred_clicks", name: "Разогрелись", description: "Сделайте 100 кликов", condition: (s) => s.clickCount >= 100, reward: 0.1, skillPoints: 1, type: "click" },
  { id: "thousand_clicks", name: "Клик-мастер", description: "Сделайте 1000 кликов", condition: (s) => s.clickCount >= 1000, reward: 0.15, skillPoints: 2, type: "click" },
  { id: "first_packages", name: "Начало положено", description: "Накопите 100 пакетов", condition: (s) => s.totalPackages >= 100, reward: 0.05, skillPoints: 0, type: "total" },
  { id: "thousand_packages", name: "Мелкосерийка", description: "Накопите 1000 пакетов", condition: (s) => s.totalPackages >= 1000, reward: 0.1, skillPoints: 1, type: "total" },
  { id: "millionaire", name: "Миллионер", description: "Накопите 1 млн пакетов", condition: (s) => s.totalPackages >= 1000000, reward: 0.2, skillPoints: 3, type: "total" },
  { id: "billionaire", name: "Миллиардер", description: "Накопите 1 млрд пакетов", condition: (s) => s.totalPackages >= 1000000000, reward: 0.3, skillPoints: 5, type: "total" },
  { id: "first_building", name: "Первый наём", description: "Купите первое здание", condition: (s) => Object.values(s.buildingsOwned).some(c => c > 0), reward: 0.05, skillPoints: 1, type: "building" },
  { id: "ten_buildings", name: "Расширение", description: "Иметь 10+ зданий всего", condition: (s) => Object.values(s.buildingsOwned).reduce((a, b) => a + b, 0) >= 10, reward: 0.1, skillPoints: 2, type: "building" },
  { id: "all_buildings", name: "Полный комплект", description: "Купите хотя бы по 1 каждого здания", condition: (s) => BUILDINGS.every(b => (s.buildingsOwned[b.id] || 0) > 0), reward: 0.25, skillPoints: 3, type: "building" },
  { id: "speed_demon", name: "Скоростной режим", description: "Достигните 100 пак/сек производства", condition: (s) => calculatePps(s) >= 100, reward: 0.15, skillPoints: 2, type: "speed" },
  { id: "mega_speed", name: "Гиперпроизводство", description: "Достигните 10000 пак/сек производства", condition: (s) => calculatePps(s) >= 10000, reward: 0.25, skillPoints: 4, type: "speed" },
];

const SKILLS = [
  { id: "manual_skill", name: "Мастерство ручной работы", description: "Увеличивает силу клика", baseCost: 100, maxLevel: 25, effect: (lvl) => lvl * 0.8 },
  { id: "optimization", name: "Оптимизация линии", description: "Увеличивает производство всех зданий", baseCost: 500, maxLevel: 20, effect: (lvl) => lvl * 0.04 },
  { id: "quality", name: "Контроль качества", description: "Шанс двойной награды за клик", baseCost: 1000, maxLevel: 15, effect: (lvl) => lvl * 0.03 },
];

const DAILY_BONUSES = [
  { day: 1, packages: 100, description: "Небольшая премия за посещение" },
  { day: 2, packages: 250, description: "Ежедневная мотивация" },
  { day: 3, packages: 500, description: "Регулярность важна" },
  { day: 4, packages: 1000, description: "Надёжный работник" },
  { day: 5, packages: 2000, description: "Пятидневная норма" },
  { day: 6, packages: 3500, description: "Выходной бонус" },
  { day: 7, packages: 5000, description: "Недельная премия!" },
];

const PRESTIGE_LEVELS = [
  { level: 1, requiredPackages: 1000000000, bonus: 0.1, name: "Опытный производитель" },
  { level: 2, requiredPackages: 10000000000, bonus: 0.25, name: "Промышленный магнат" },
  { level: 3, requiredPackages: 100000000000, bonus: 0.5, name: "Король упаковки" },
  { level: 4, requiredPackages: 1000000000000, bonus: 1.0, name: "Легенда Guardix" },
];

const DAILY_TASKS = [
  { id: "click_100", name: "Рабочая смена", description: "Сделайте 100 кликов", reward: { packages: 500, skillPoints: 1 }, condition: (s) => s.dailyClicks >= 100 },
  { id: "produce_1000", name: "План на день", description: "Произведите 1000 пакетов", reward: { packages: 1000, skillPoints: 1 }, condition: (s) => s.dailyProduced >= 1000 },
  { id: "buy_building", name: "Расширение", description: "Купите любое здание", reward: { packages: 750, skillPoints: 1 }, condition: (s) => s.dailyBuildingsBought >= 1 },
  { id: "reach_10pps", name: "Эффективность", description: "Достигните 10 пакетов/сек", reward: { packages: 2000, skillPoints: 2 }, condition: (s) => calculatePps(s) >= 10 },
];

function calculatePps(stateObj) {
  const basePps = BUILDINGS.reduce((sum, building) => {
    const owned = stateObj.buildingsOwned?.[building.id] || 0;
    return sum + owned * building.basePps;
  }, 0);
  return basePps * (stateObj.productionBoost || 1);
}

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
  factoryLevel: 1,
  skillPoints: 0,
  skillsLevel: Object.fromEntries(SKILLS.map((skill) => [skill.id, 0])),
  achievementsUnlocked: [],
  goldenPackages: 0,
  goldenChance: 0.01,
  events: [
    { title: "Смена запущена", text: "Производство Guardix готово к работе. Начните сборку первой партии вручную." },
    { title: "Подсказка", text: "Развивайте участки цеха, чтобы наращивать выпуск курьерских пакетов в секунду." },
  ],
  // Новые поля для долгосрочной игры
  lastPlayed: Date.now(),
  dailyStreak: 0,
  lastDailyBonus: null,
  prestigeLevel: 0,
  lifetimePackages: 0,
  totalClicks: 0,
  totalBuildingsBought: 0,
  // Ежедневные задачи
  dailyClicks: 0,
  dailyProduced: 0,
  dailyBuildingsBought: 0,
  lastDailyReset: null,
  completedDailyTasks: [],
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
    
    // Миграция старых сохранений - исправляем названия супер-улучшений
    if (parsed.superUpgradesOwned) {
      // Удаляем старые ID если они есть
      delete parsed.superUpgradesOwned["prem_suhovu"];
      delete parsed.superUpgradesOwned["ds_call"];
    }
    
    const newState = {
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
      skillsLevel: {
        ...defaultState().skillsLevel,
        ...(parsed.skillsLevel || {}),
      },
      achievementsUnlocked: parsed.achievementsUnlocked || [],
      factoryLevel: parsed.factoryLevel || 1,
      skillPoints: parsed.skillPoints || 0,
      goldenPackages: parsed.goldenPackages || 0,
      events: sanitizeEvents(parsed.events),
      // Новые поля с безопасными значениями по умолчанию
      lastPlayed: parsed.lastPlayed || Date.now(),
      dailyStreak: parsed.dailyStreak || 0,
      lastDailyBonus: parsed.lastDailyBonus || null,
      prestigeLevel: parsed.prestigeLevel || 0,
      lifetimePackages: parsed.lifetimePackages || 0,
      totalClicks: parsed.totalClicks || 0,
      totalBuildingsBought: parsed.totalBuildingsBought || 0,
      dailyClicks: parsed.dailyClicks || 0,
      dailyProduced: parsed.dailyProduced || 0,
      dailyBuildingsBought: parsed.dailyBuildingsBought || 0,
      lastDailyReset: parsed.lastDailyReset || null,
      completedDailyTasks: parsed.completedDailyTasks || [],
    };
    
    // Принудительно сохраняем обновленное состояние
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    
    return newState;
  } catch (error) {
    console.error("Ошибка загрузки сохранения", error);
    return defaultState();
  }
}

function saveState(updateLastPlayed = false) {
  if (updateLastPlayed) {
    state.lastPlayed = Date.now();
  }
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

  const levelBonus = getLevelBonus();
  const skillBonus = getSkillBonus("optimization");
  const totalBoost = state.productionBoost * (1 + levelBonus + skillBonus);

  return basePackagesPerSecond * totalBoost;
}

function getLevelBonus() {
  const currentLevel = FACTORY_LEVELS.find(l => l.level === state.factoryLevel);
  return currentLevel ? currentLevel.bonus : 0;
}

function getSkillBonus(skillId) {
  const skill = SKILLS.find(s => s.id === skillId);
  const level = state.skillsLevel[skillId] || 0;
  return skill ? skill.effect(level) : 0;
}

function checkLevelUp() {
  const nextLevel = FACTORY_LEVELS.find(l => l.level === state.factoryLevel + 1);
  if (nextLevel && state.totalPackages >= nextLevel.threshold) {
    state.factoryLevel = nextLevel.level;
    state.skillPoints += 1;
    addEvent("Уровень повышен!", `Завод достиг уровня "${nextLevel.name}". Получено очко навыка!`);
    return true;
  }
  return false;
}

function checkAchievements() {
  let newUnlocks = 0;
  let totalSkillPoints = 0;
  
  ACHIEVEMENTS.forEach(achievement => {
    if (!state.achievementsUnlocked.includes(achievement.id)) {
      if (achievement.condition(state)) {
        state.achievementsUnlocked.push(achievement.id);
        
        let eventText = `${achievement.name}: ${achievement.description}`;
        if (achievement.skillPoints > 0) {
          state.skillPoints += achievement.skillPoints;
          totalSkillPoints += achievement.skillPoints;
          eventText += ` (+${achievement.skillPoints} очко навыка${achievement.skillPoints > 1 ? 'а' : ''})`;
        }
        
        addEvent("Достижение!", eventText);
        newUnlocks++;
      }
    }
  });
  
  if (totalSkillPoints > 0) {
    addEvent("Очки навыков!", `Получено ${totalSkillPoints} очко навыка${totalSkillPoints > 1 ? 'а' : ''} за достижения!`);
  }
  
  return newUnlocks;
}

function calculateTotalClickPower() {
  const basePower = state.clickPower;
  const skillBonus = getSkillBonus("manual_skill");
  const levelBonus = getLevelBonus();
  return basePower * (1 + skillBonus + levelBonus * 0.5);
}

function getGoldenPackageChance() {
  const baseChance = state.goldenChance || 0.01;
  const qualityBonus = getSkillBonus("quality");
  return Math.min(baseChance + qualityBonus, 0.5);
}

function calculateOfflineReward() {
  const now = Date.now();
  const timeDiff = now - state.lastPlayed;
  const hoursOffline = Math.floor(timeDiff / (1000 * 60 * 60));
  
  if (hoursOffline < 1) return null;
  
  const packagesPerSecond = calculatePackagesPerSecond();
  const maxHours = 24; // Максимум за 24 часа
  const rewardHours = Math.min(hoursOffline, maxHours);
  const offlinePackages = Math.floor(packagesPerSecond * rewardHours * 3600);
  
  return {
    packages: offlinePackages,
    hours: rewardHours,
    efficiency: Math.min(0.8 + (rewardHours / maxHours) * 0.2, 1.0)
  };
}

function checkDailyBonus() {
  const now = new Date();
  const today = now.toDateString();
  const lastBonus = state.lastDailyBonus ? new Date(state.lastDailyBonus).toDateString() : null;
  
  if (lastBonus === today) return null;
  
  // Проверяем разрыв в днях
  if (state.lastDailyBonus) {
    const lastDate = new Date(state.lastDailyBonus);
    const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 1) {
      state.dailyStreak = 0; // Прерываем серию
    }
  }
  
  state.dailyStreak++;
  const bonusDay = Math.min(state.dailyStreak, 7);
  const bonus = DAILY_BONUSES.find(b => b.day === bonusDay);
  
  state.lastDailyBonus = now;
  state.packages += bonus.packages;
  state.totalPackages += bonus.packages;
  state.lifetimePackages += bonus.packages;
  
  return bonus;
}

function checkDailyReset() {
  const now = new Date();
  const today = now.toDateString();
  const lastReset = state.lastDailyReset ? new Date(state.lastDailyReset).toDateString() : null;
  
  if (lastReset !== today) {
    // Сбрасываем ежедневные задачи
    state.dailyClicks = 0;
    state.dailyProduced = 0;
    state.dailyBuildingsBought = 0;
    state.completedDailyTasks = [];
    state.lastDailyReset = now;
    
    return true;
  }
  return false;
}

function checkDailyTasks() {
  const completedTasks = [];
  
  DAILY_TASKS.forEach(task => {
    if (!state.completedDailyTasks.includes(task.id) && task.condition(state)) {
      state.completedDailyTasks.push(task.id);
      state.packages += task.reward.packages;
      state.totalPackages += task.reward.packages;
      state.lifetimePackages += task.reward.packages;
      state.skillPoints += task.reward.skillPoints || 0;
      completedTasks.push(task);
    }
  });
  
  return completedTasks;
}

function checkPrestige() {
  const nextPrestige = PRESTIGE_LEVELS.find(p => p.level === state.prestigeLevel + 1);
  if (!nextPrestige) return false;
  
  if (state.lifetimePackages >= nextPrestige.requiredPackages) {
    state.prestigeLevel = nextPrestige.level;
    state.productionBoost += nextPrestige.bonus;
    addEvent("ПРЕСТИЖ!", `Достигнут уровень "${nextPrestige.name}"! Постоянный бонус +${(nextPrestige.bonus * 100).toFixed(0)}% к производству!`);
    return true;
  }
  return false;
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
  const totalClickPower = calculateTotalClickPower();
  const currentLevel = FACTORY_LEVELS.find(l => l.level === state.factoryLevel);

  elements.packageCount.textContent = formatNumber(state.packages);
  elements.packagesPerSecond.textContent = formatNumber(packagesPerSecond);
  elements.clickPower.textContent = formatNumber(totalClickPower);
  elements.manualLevel.textContent = state.manualUpgradeLevel;
  elements.manualUpgradeCost.textContent = formatNumber(state.manualUpgradeCost);
  elements.manualUpgradeButton.disabled = state.packages < state.manualUpgradeCost;

  // Обновляем заголовок с уровнем завода
  const brandTitle = document.querySelector('.topbar h1');
  if (brandTitle && currentLevel) {
    brandTitle.textContent = `Guardix — ${currentLevel.name}`;
  }
}

function renderDailyBonuses() {
  const dailyStreakEl = document.getElementById("daily-streak");
  const dailyBonusListEl = document.getElementById("daily-bonus-list");
  
  if (dailyStreakEl) {
    dailyStreakEl.textContent = state.dailyStreak;
  }
  
  if (!dailyBonusListEl) return;
  
  dailyBonusListEl.innerHTML = "";
  
  const today = new Date().toDateString();
  const lastBonus = state.lastDailyBonus ? new Date(state.lastDailyBonus).toDateString() : null;
  const claimedToday = lastBonus === today;
  
  DAILY_BONUSES.forEach((bonus, index) => {
    const isClaimed = claimedToday && index < state.dailyStreak;
    const isNext = !claimedToday && index === state.dailyStreak % 7;
    
    const item = document.createElement("div");
    item.className = "daily-bonus-item";
    if (isClaimed) item.classList.add("claimed");
    if (isNext) item.classList.add("next");
    
    item.innerHTML = `
      <h6>День ${bonus.day}: ${bonus.description}</h6>
      <p>Награда: ${formatNumber(bonus.packages)} пакетов</p>
      <div class="reward">${isClaimed ? "Получено" : isNext ? "Доступно" : `День ${index + 1}`}</div>
    `;
    
    dailyBonusListEl.appendChild(item);
  });
}

function renderDailyTasks() {
  const dailyTasksCompletedEl = document.getElementById("daily-tasks-completed");
  const dailyTasksListEl = document.getElementById("daily-tasks-list");
  
  if (dailyTasksCompletedEl) {
    dailyTasksCompletedEl.textContent = state.completedDailyTasks.length;
  }
  
  if (!dailyTasksListEl) return;
  
  dailyTasksListEl.innerHTML = "";
  
  DAILY_TASKS.forEach(task => {
    const isCompleted = state.completedDailyTasks.includes(task.id);
    const progress = getTaskProgress(task);
    
    const item = document.createElement("div");
    item.className = "daily-task-item";
    if (isCompleted) item.classList.add("completed");
    
    item.innerHTML = `
      <h6>${task.name}</h6>
      <p>${task.description}</p>
      <p>Прогресс: ${progress.current}/${progress.target}</p>
      <div class="reward">${isCompleted ? "Выполнено!" : `Награда: ${formatNumber(task.reward.packages)} пакетов${task.reward.skillPoints ? ` +${task.reward.skillPoints} очко навыка` : ""}`}</div>
    `;
    
    dailyTasksListEl.appendChild(item);
  });
}

function getTaskProgress(task) {
  switch (task.id) {
    case "click_100":
      return { current: state.dailyClicks, target: 100 };
    case "produce_1000":
      return { current: Math.floor(state.dailyProduced), target: 1000 };
    case "buy_building":
      return { current: state.dailyBuildingsBought, target: 1 };
    case "reach_10pps":
      return { current: Math.floor(calculatePackagesPerSecond()), target: 10 };
    default:
      return { current: 0, target: 1 };
  }
}

function render() {
  renderStats();
  renderBuildings();
  renderSuperUpgrades();
  renderSkills();
  renderAchievements();
  renderDailyBonuses();
  renderDailyTasks();
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

  elements.packagePanel.classList.remove("purchase-flash", "purchase-flash-strong", "purchase-flash-golden");
  elements.packageScore.classList.remove("score-pop", "score-pop-strong", "score-pop-golden");

  void elements.packagePanel.offsetWidth;

  if (effectType === "golden") {
    elements.packagePanel.classList.add("purchase-flash-golden");
    elements.packageScore.classList.add("score-pop-golden");
  } else if (effectType === "super") {
    elements.packagePanel.classList.add("purchase-flash-strong");
    elements.packageScore.classList.add("score-pop-strong");
  } else {
    elements.packagePanel.classList.add("purchase-flash");
    elements.packageScore.classList.add("score-pop");
  }
}

function createFloatingNumber(x, y, value, isGolden = false) {
  const el = document.createElement("div");
  el.className = "floating-number";
  if (isGolden) el.classList.add("golden");
  el.textContent = "+" + formatNumber(value);

  // Позиция относительно кнопки пакета
  const rect = elements.packageButton.getBoundingClientRect();
  const randomX = (Math.random() - 0.5) * 60;
  const startY = rect.height * 0.3;

  el.style.left = `calc(50% + ${randomX}px)`;
  el.style.top = `${startY}px`;

  elements.packageButton.appendChild(el);

  window.setTimeout(() => el.remove(), 1000);
}

function handlePackageClick() {
  const totalClickPower = calculateTotalClickPower();
  const goldenChance = getGoldenPackageChance();
  const isGolden = Math.random() < goldenChance;

  const finalPower = isGolden ? totalClickPower * 10 : totalClickPower;

  createFloatingNumber(0, 0, finalPower, isGolden);

  if (isGolden) {
    state.goldenPackages += 1;
    addEvent("Золотой пакет!", "Редкая находка! x10 к награде за этот клик!");
    playPurchaseEffect("golden");
  }

  gainPackages(finalPower);
  state.clickCount += 1;
  state.totalClicks += 1;
  state.dailyClicks += 1;
  state.dailyProduced += Math.floor(finalPower);
  state.lifetimePackages += Math.floor(finalPower);
  
  elements.packageButton.classList.add("is-pressed");
  window.setTimeout(() => elements.packageButton.classList.remove("is-pressed"), 120);

  if (state.clickCount === 25) {
    addEvent("Бригада разогрелась", "Первые 25 пакетов собраны вручную. Производство входит в ритм.");
  }

  checkAchievements();
  checkLevelUp();
  checkDailyTasks();
  checkPrestige();
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
  state.totalBuildingsBought += 1;
  state.dailyBuildingsBought += 1;
  addEvent("Новое здание", `${building.name} запущен(а) в работу.`);
  playPurchaseEffect("building");
  checkAchievements();
  checkLevelUp();
  checkDailyTasks();
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
    addEvent("Супер-улучшение", "Электрик настроил оборудование: ручной выпуск стал заметно быстрее.");
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
    addEvent("Супер-улучшение", "Звонок босса по браку резко повысил внимание к качеству.");
  }

  if (upgradeId === "output_call") {
    state.productionBoost *= 1.35;
    addEvent("Супер-улучшение", "Звонок босса по выработке ускорил всю смену.");
  }

  if (upgradeId === "install_cameras") {
    state.productionBoost *= 1.5;
    addEvent("Супер-улучшение", "Камеры установлены: простои стали подозрительно короткими.");
  }

  playPurchaseEffect("super");
  checkAchievements();
  checkLevelUp();
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
  checkAchievements();
  checkLevelUp();
  render();
  saveState();
}

function calculateSkillCost(skill) {
  const level = state.skillsLevel[skill.id] || 0;
  return Math.floor(skill.baseCost * Math.pow(1.5, level));
}

function upgradeSkill(skillId) {
  const skill = SKILLS.find(s => s.id === skillId);
  if (!skill || state.skillPoints < 1) return;

  const currentLevel = state.skillsLevel[skillId] || 0;
  if (currentLevel >= skill.maxLevel) return;

  state.skillPoints -= 1;
  state.skillsLevel[skillId] = currentLevel + 1;

  const newLevel = currentLevel + 1;
  addEvent("Навык улучшен!", `${skill.name} достиг уровня ${newLevel}. ${skill.description}`);
  playPurchaseEffect("skill");
  render();
  saveState();
}

function renderSkills() {
  let skillsSection = document.getElementById("skills-section");
  if (!skillsSection) {
    skillsSection = document.createElement("section");
    skillsSection.id = "skills-section";
    skillsSection.className = "shop-section";
    skillsSection.innerHTML = `
      <div class="section-title-row">
        <h4>Навыки цеха</h4>
        <span>Очки: <strong id="skill-points">0</strong></span>
      </div>
      <div id="skills-list" class="shop-list"></div>
    `;
    const shopPanel = document.querySelector(".shop-panel");
    if (shopPanel) {
      shopPanel.insertBefore(skillsSection, shopPanel.children[1]);
    }
  }

  const skillPointsEl = document.getElementById("skill-points");
  if (skillPointsEl) {
    skillPointsEl.textContent = state.skillPoints;
  }

  const skillsList = document.getElementById("skills-list");
  if (!skillsList) return;

  skillsList.innerHTML = "";

  SKILLS.forEach(skill => {
    const level = state.skillsLevel[skill.id] || 0;
    const maxed = level >= skill.maxLevel;
    const canUpgrade = state.skillPoints > 0 && !maxed;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "building-card";
    button.disabled = !canUpgrade;
    if (maxed) button.classList.add("is-purchased");

    const effectText = skill.id === "manual_skill" ? `+${formatNumber(skill.effect(level))} к клику` :
                       skill.id === "optimization" ? `+${(skill.effect(level) * 100).toFixed(0)}% производства` :
                       `${(skill.effect(level) * 100).toFixed(0)}% шанс золотого`;

    button.innerHTML = `
      <div class="building-card-main">
        <div>
          <h5 class="building-name">${skill.name}</h5>
          <p class="building-description">${skill.description}</p>
        </div>
        <div class="building-meta">
          <strong class="building-count">${level}/${skill.maxLevel}</strong>
          <span class="building-pps">${effectText}</span>
        </div>
      </div>
      <div class="building-card-footer">
        <span class="building-cost">${maxed ? "Максимум" : "1 очко навыка"}</span>
        <span class="building-next">${maxed ? "Макс" : "Улучшить"}</span>
      </div>
    `;

    button.addEventListener("click", () => upgradeSkill(skill.id));
    skillsList.appendChild(button);
  });
}

function renderAchievements() {
  let achvPanel = document.getElementById("achievements-panel");
  if (!achvPanel) {
    achvPanel = document.createElement("div");
    achvPanel.id = "achievements-panel";
    achvPanel.className = "stat-pill stat-pill-total";
    achvPanel.innerHTML = `
      <span>Достижения</span>
      <strong id="achievements-count">0/${ACHIEVEMENTS.length}</strong>
    `;
    const topbarStats = document.querySelector(".topbar-stats");
    if (topbarStats) {
      topbarStats.appendChild(achvPanel);
    }
  }

  const countEl = document.getElementById("achievements-count");
  if (countEl) {
    countEl.textContent = `${state.achievementsUnlocked.length}/${ACHIEVEMENTS.length}`;
  }
}

function resetGame() {
  const confirmed = window.confirm("Вы уверены, что хотите сбросить весь прогресс? Это действие нельзя отменить!");
  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  Object.assign(state, defaultState());
  saveState();
  render();
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

let lastTick = performance.now();
function initializeGame() {
  // Проверяем ежедневный бонус
  checkDailyReset();
  const dailyBonus = checkDailyBonus();
  if (dailyBonus) {
    addEvent("Ежедневный бонус!", `${dailyBonus.description}: +${formatNumber(dailyBonus.packages)} пакетов. Серия: ${state.dailyStreak} дней!`);
  }
  
  // Проверяем престиж
  checkPrestige();
  
  render();
  saveState();
}

function gameLoop(now) {
  const deltaSeconds = (now - lastTick) / 1000;
  lastTick = now;

  const packagesPerSecond = calculatePackagesPerSecond();
  if (packagesPerSecond > 0) {
    const packagesBeforeTick = state.packages;
    gainPackages(packagesPerSecond * deltaSeconds);
    
    // Обновляем ежедневную статистику
    const produced = Math.floor(packagesPerSecond * deltaSeconds);
    state.dailyProduced += produced;
    state.lifetimePackages += produced;

    // Периодическая проверка достижений и уровней
    checkAchievements();
    const leveledUp = checkLevelUp();
    checkDailyTasks();
    checkPrestige();

    if (shouldRefreshShop(packagesBeforeTick, state.packages) || leveledUp) {
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

initializeGame();
window.requestAnimationFrame(gameLoop);
window.setInterval(saveState, 5000);
window.addEventListener("beforeunload", () => saveState(true));
