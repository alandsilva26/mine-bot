// const ChatMessage = require("prismarine-chat")("1.17");
// const { MessageBuilder } = require("prismarine-chat")("1.17");

class ChatUtils {
  prefix = ""; // light purple color

  constructor(bot, operator) {
    this.bot = bot;
    this.operator = operator;
  }

  chat(message) {
    this.bot.chat(`${this.prefix}${message}`);
  }

  whisper(message) {
    this.bot.whisper(this.operator, `${message}`);
  }
}

module.exports = {
  ChatUtils,
};
