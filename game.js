// 1. В массиве SUPER_UPGRADES меняем первый элемент:
const SUPER_UPGRADES = [
  { 
    id: "premium_suhov", // Изменили ID для ясности
    name: "Поднять премию Сухову", 
    description: "Оборудование, настройка машин, принтеров и сетей теперь под полным контролем Сухова.", 
    cost: 900, 
    tag: "+2 за клик" 
  },
  { id: "new_spare_parts", name: "Новые запчасти", description: "Свежие комплектующие снижают простои и делают линию заметно бодрее.", cost: 5000, tag: "+12% к выпуску" },
  // ... остальные без изменений
];

// 2. В функции purchaseSuperUpgrade обновляем условие:
function purchaseSuperUpgrade(upgradeId) {
  const upgrade = SUPER_UPGRADES.find((item) => item.id === upgradeId);
  if (!upgrade || state.superUpgradesOwned[upgradeId] || state.packages < upgrade.cost) {
    return;
  }

  state.packages -= upgrade.cost;
  state.superUpgradesOwned[upgradeId] = true;

  // ОБНОВЛЕННЫЙ БЛОК:
  if (upgradeId === "premium_suhov") {
    state.clickPower += 2;
    addEvent("Супер-улучшение", "Сухов заряжен энергией: сети летают, принтеры печатают, ручной выпуск ускорился!");
  }
  // Конец обновленного блока

  if (upgradeId === "new_spare_parts") {
    state.productionBoost *= 1.12;
    addEvent("Супер-улучшение", "Новые запчасти сократили простои на линии.");
  }
  
  // ... дальше без изменений
  playPurchaseEffect("super");
  render();
  saveState();
}
