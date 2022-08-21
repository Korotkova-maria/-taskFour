const readlineSync = require("readline-sync");

const monster = {
  maxHealth: 10,
  name: "Лютый",
  moves: [
    {
      name: "Удар когтистой лапой",
      physicalDmg: 3, // физический урон
      magicDmg: 0, // магический урон
      physicArmorPercents: 20, // физическая броня
      magicArmorPercents: 20, // магическая броня
      cooldown: 0, // ходов на восстановление
    },
    {
      name: "Огненное дыхание",
      physicalDmg: 0,
      magicDmg: 4,
      physicArmorPercents: 0,
      magicArmorPercents: 0,
      cooldown: 3,
    },
    {
      name: "Удар хвостом",
      physicalDmg: 2,
      magicDmg: 0,
      physicArmorPercents: 50,
      magicArmorPercents: 0,
      cooldown: 2,
    },
  ],
};

const mage = {
  name: "Евстафий",
  moves: [
    {
      name: "Удар боевым кадилом",
      physicalDmg: 2,
      magicDmg: 0,
      physicArmorPercents: 0,
      magicArmorPercents: 50,
      cooldown: 0,
    },
    {
      name: "Вертушка левой пяткой",
      physicalDmg: 4,
      magicDmg: 0,
      physicArmorPercents: 0,
      magicArmorPercents: 0,
      cooldown: 4,
    },
    {
      name: "Каноничный фаербол",
      physicalDmg: 0,
      magicDmg: 5,
      physicArmorPercents: 0,
      magicArmorPercents: 0,
      cooldown: 3,
    },
    {
      name: "Магический блок",
      physicalDmg: 0,
      magicDmg: 0,
      physicArmorPercents: 100,
      magicArmorPercents: 100,
      cooldown: 4,
    },
  ],
};

// массив недоступных ходов
let impossibleMovesMonsterArr = [];
let impossibleMovesMageArr = [];

// функция для проверки доступных ходов
const possibleMoves = (impossibleArr, hero) => {
  let possibleArr = [];
  possibleArr = hero.moves.filter((move) =>
    impossibleArr.every((item) => item.name !== move.name)
  );
  return possibleArr;
};

// функция для контроля недоступных ходов
const checkImpossibleMoves = (impossibleArr) => {
  for (let i = 0; i < impossibleArr.length; i++) {
    impossibleArr[i].cooldown = impossibleArr[i].cooldown - 1;
  }

  for (let i = 0; i < impossibleArr.length; i++) {
    if (impossibleArr[i].cooldown < 0) {
      impossibleArr.splice(i, 1);
    }
  }
  return impossibleArr;
};

// функция ход монстра
const moveMonster = () => {
  const possibleMonsterMovesArr = possibleMoves(
    impossibleMovesMonsterArr,
    monster
  );
  // рандомный выбор хода монстра
  let rand = Math.floor(Math.random() * possibleMonsterMovesArr.length);
  let moveMonster = possibleMonsterMovesArr[rand];
  impossibleMovesMonsterArr.push({
    name: possibleMonsterMovesArr[rand].name,
    cooldown: possibleMonsterMovesArr[rand].cooldown,
  });

  return moveMonster;
};

const moveMage = () => {
  const possibleMageMovesArr = possibleMoves(impossibleMovesMageArr, mage);
  console.log("Вам доступны следующие действия:");
  for (let move of possibleMageMovesArr) {
    console.log(move);
  }
  let nameMageMove = readlineSync.question(
    "Введите выбронное вами название хода (введите name хода без кавычек!): "
  );
  let mageMove;
  for (let move of possibleMageMovesArr) {
    if (String(nameMageMove) == move.name) {
      mageMove = { ...move };
      break;
    }
  }
  impossibleMovesMageArr.push({
    name: mageMove.name,
    cooldown: mageMove.cooldown,
  });
  console.log(impossibleMovesMageArr);
  return mageMove;
};

// БАТТЛ
console.log(`введите начальное здоровье мага Евстафия`);
let maxHealth = readlineSync.question("Ваше число: ");
mage.maxHealth = Number(maxHealth);

while (monster.maxHealth > 0 && mage.maxHealth > 0) {
  // ход монстра
  const currentMoveMonster = moveMonster();
  console.log("ЛЮТЫЙ СДЕЛАЛ ХОД:", currentMoveMonster);
  // ход мага
  let currentMoveMage = moveMage();
  console.log("ЕВСТАФИЙ СДЕЛАЛ ХОД:", currentMoveMage);
  // удар лютого
  if (currentMoveMonster.physicalDmg > currentMoveMage.physicArmorPercents) {
    mage.maxHealth--;
  }

  if (currentMoveMonster.magicDmg > currentMoveMage.magicArmorPercents) {
    mage.maxHealth--;
  }

  // удар евстафия
  if (currentMoveMage.physicalDmg > currentMoveMonster.physicArmorPercents) {
    monster.maxHealth--;
  }

  if (currentMoveMage.magicDmg > currentMoveMonster.magicArmorPercents) {
    monster.maxHealth--;
  }
  //  блок проверки победителя игры
  if (monster.maxHealth <= 0 && mage.maxHealth <= 0) {
    console.log(`Игра окончена! НИЧЬЯ`);
    break;
  }
  if (monster.maxHealth <= 0 && mage.maxHealth > 0) {
    console.log(`Игра окончена! ЕВСТАФИЙ ПОБЕДИЛ`);
    break;
  }
  if (mage.maxHealth <= 0 && monster.maxHealth > 0) {
    console.log(`Игра окончена! ЛЮТЫЙ ПОБЕДИЛ`);
    break;
  }
  checkImpossibleMoves(impossibleMovesMonsterArr);
  checkImpossibleMoves(impossibleMovesMageArr);
  console.log(
    `----------------------------------------------СЛЕДУЮЩИЙ ХОД----------------------------------------------`
  );
  console.log(
    `Уровень здоровья ЛЮТОГО после удара ${monster.maxHealth}. Уровень здоровья ЕВСТАФИЯ после удара ${mage.maxHealth} `
  );
}
