# MineBOT (doesn't actually mine this is just a custom implementation for personal use)
* Still in development

## How to use
* I personally use this bot to avoid the minimal afk time. AFKing for too long is not recommened.
* When the bot spawns it is advised to drop some food next to him.
* Keeping a bed right next to the bot makes him sleep when nighttime.
* Autosleep can be disabled just by typing `autosleep` in minecraft chat.

## OTHER UTILS
* Type `localhost:3000` in your browser to view the inventory of the bot.

### Env file example

```
MCOPERATOR=admin
MCUSERNAME=bot
MCHOST=minecraftip
```

## NOTE
* AFKing for too long on [Aternos](https://aternos.org/:en/) did seem to get me banned!!!. Would have to add some random movement to avoid afk.
* Tested on PloudOs server

## Developer notes
* The current follow player api has a basic pathfinding ability. It gets easily blocked. Manually controls can be added to fix this. Or mabey I am using the api wrong.

## Features that I plan on adding
- [ ] - Dashboard
- [ ] - Better movement
- [ ] - Ability to control bot from browser
