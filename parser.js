// parser

const Slimbot = require('slimbot');
const Controller = require('./controller');
const fs = require('fs');

const slimbot = new Slimbot(process.env['TELEGRAM_BOT_TOKEN']);

exports.parseQuery = function (query) {
    console.log(query);
    let chars = Controller.Characters();
    results = JSON.stringify(chars.map(function (c) {
        console.log(c);
        return {
            type: 'article',
            id: c.name,
            title: c.name,
            description: 'roleplay character',
            input_message_content: {
                message_text: 'This is ' + c + '.',
                parse_mode: 'Markdown',
                disable_web_page_preview: false
            }
        }
    }));

    slimbot.answerInlineQuery(query.id, results);
}

exports.parseMessage = function (message) {

    var charMatch = /^\/char (.*)/g.exec(message.text);
    if (charMatch) {
        name = charMatch[1];
        character = Controller.Character(name);
        if (character) {
            //slimbot.sendMessage(message.chat.id, 'Character *' + name + '*\'s JSON description :```\n' + JSON.stringify(character, null, 4) + '```', {parse_mode: 'Markdown'});
            //slimbot.sendDocument(message.chat.id, fs.createReadStream(Controller.CharacterSheet(name)));
            let optionalParams = {
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify({
                    inline_keyboard: [[
                        { text: 'JSON', callback_data: 'hello' }
                    ], [
                        { text: 'SVG', callback_data: 'good' }
                    ]]
                })
            };
            // reply when user sends a message, and send him our inline keyboard as well
            slimbot.sendMessage(message.chat.id, 'Message received', optionalParams);
        }
        else {
            slimbot.sendMessage(message.chat.id, 'Character *' + name + '* unknown', { parse_mode: 'Markdown' });
        }
    }
    //slimbot.sendMessage(message.chat.id, 'received message :"' + message.text + '" from ' + message.from.username)
}

function sendJSON(name)
{
    
}