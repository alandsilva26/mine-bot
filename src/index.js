// Main Library
const mineflayer = require("mineflayer");

const ChatUtils = require("./chat-utils").ChatUtils;
// Pathfinder
const pathfinder = require("mineflayer-pathfinder").pathfinder;
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear, GoalFollow } = require("mineflayer-pathfinder").goals;
// other
const autoeat = require("mineflayer-auto-eat");
const armorManager = require("mineflayer-armor-manager");
const inventoryViewer = require("mineflayer-web-inventory");

// Load options
const { options } = require("./config.js");

// flags
let operator = process.env.MCOPERATOR; // value of person operating
let autoJump = true; // default value
let autoJumpTimeout = 180000; // default in seconds(3 minutes)
let autoSleep = true;
let alreadySleeping = false;

const bot = mineflayer.createBot(options);

bot.loadPlugins([armorManager, pathfinder, autoeat]);

inventoryViewer(bot);

const chatUtils = new ChatUtils(bot, operator);

bot.once("spawn", () => {
  const mcData = require("minecraft-data")(bot.version);
  const defaultMove = new Movements(bot, mcData);

  chatUtils.chat("Sujoy");
  console.log(bot.entity.position);

  bot.armorManager.equipAll();

  bot.autoEat.options = {
    priority: "foodPoints",
    startAt: 17,
    bannedFood: ["golden_apple", "enchanted_golden_apple", "rotten_flesh"],
  };

  avoidAfk();

  bot.on("chat", (username, message) => {
    if (username == bot.username) return;
    const target = bot.players[username] ? bot.players[username].entity : null;
    if (message === "come") {
      if (!target) {
        bot.chat("I don't see you !");
        return;
      }
      const p = target.position;

      bot.pathfinder.setMovements(defaultMove);
      bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));
    }

    if (message == "sleep") {
      goToSleep();
    }

    if (message == "autosleep") {
      if (autoSleep) {
        chatUtils.whisper("Setting autosleep false");
        autoSleep = false;
      } else {
        chatUtils.whisper("Setting autosleep true");
        autoSleep = true;
      }
    }
  });

  // Custom chat patterns
  bot.addChatPattern("hello_world", /hello/gi, {
    repeat: true,
  });
  bot.addChatPattern("bot_position", /bot pos/, { repeat: true });
});

function avoidAfk() {
  setInterval(() => {
    if (autoJump) {
      // Jump Once if autojump enabled
      chatUtils.whisper("Jumping Once");
      bot.setControlState("jump", true);
      bot.setControlState("jump", false);
    }
  }, autoJumpTimeout);
}

async function goToSleep() {
  const bed = bot.findBlock({
    matching: (block) => bot.isABed(block),
    maxDistance: 100,
  });
  if (bed) {
    try {
      alreadySleeping = true;
      await bot.sleep(bed);
      chatUtils.chat("I'm sleeping");
    } catch (err) {
      if (!alreadySleeping) {
        chatUtils.whisper(`I can't sleep: ${err.message}`);
      }
    }
  } else {
    chatUtils.whisper("No nearby bed");
  }
}

bot.on("health", () => {
  chatUtils.whisper(`Food: ${parseInt(bot.food)}`);
  chatUtils.whisper(`Health: ${parseInt(bot.health)}`);
});

bot.on("error", console.log);

bot.on("sleep", () => {
  bot.chat("Good night!");
});

bot.on("time", () => {
  if (!bot.time.isDay) {
    if (!alreadySleeping) {
      goToSleep();
    }
  }
});

// Other chat commands
bot.on("chat:hello_world", (username, message) => {
  if (username == bot.username) return;
  chatUtils.chat("Hello");
});

bot.on("chat:bot_position", (username, message) => {
  if (username == bot.username) return;
  let coords = Object.values(bot.entity.position).map((co) => {
    return parseInt(co);
  });

  chatUtils.chat(`${coords.join(" ")}`);
});
