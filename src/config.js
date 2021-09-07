require("dotenv").config();

var options = {
  host: process.env.MCHOST,
  port: 25565, // default minecraft server port
  username: process.env.MCUSERNAME,
};

module.exports = { options };
