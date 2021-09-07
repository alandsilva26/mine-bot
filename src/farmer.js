const { Vec3 } = require("vec3");
const mineflayer = require("mineflayer");
const { options } = require("./config");

const bot = mineflayer.createBot(options);

let mcData;
bot.on("inject_allowed", () => {
  mcData = require("minecraft-data")(bot.version);
});

// To fish we have to give bot the seeds
// /give farmer wheat_seeds 64

function blockToSow() {
  return bot.findBlock({
    point: bot.entity.position,
    matching: mcData.blocksByName.farmland.id,
    maxDistance: 6,
    useExtraInfo: (block) => {
      const blockAbove = bot.blockAt(block.position.offset(0, 1, 0));
      return !blockAbove || blockAbove.type === 0;
    },
  });
}

function blockToHarvest() {
  return bot.findBlock({
    point: bot.entity.position,
    maxDistance: 6,
    matching: (block) => {
      return (
        block &&
        block.type === mcData.blocksByName.wheat.id &&
        block.metadata === 7
      );
    },
  });
}

async function loop() {
  try {
    while (1) {
      const toHarvest = blockToHarvest();
      if (toHarvest) {
        await bot.dig(toHarvest);
      } else {
        break;
      }
    }
    while (1) {
      const toSow = blockToSow();
      if (toSow) {
        await bot.equip(mcData.itemsByName.wheat_seeds.id, "hand");
        await bot.placeBlock(toSow, new Vec3(0, 1, 0));
      } else {
        break;
      }
    }
  } catch (e) {
    console.log(e);
  }

  // No block to harvest or sow. Postpone next loop a bit
  setTimeout(loop, 1000);
}

bot.once("login", loop);
