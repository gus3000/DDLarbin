const Slimbot = require('slimbot');
const Parser = require('./parser')

const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN']);

// Register listeners

slimbot.on('inline_query', Parser.parseQuery);

slimbot.on('message', Parser.parseMessage);

slimbot.on('callback_query', Parser.callbackQuery);

// Call API

slimbot.startPolling();
