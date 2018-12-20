const bot = require('./bot.js');
//
const registerLowercaseListener = (listener) => bot.message((msg) => listener(msg, msg.content.toLowerCase()));
var searchScope = 20; // number of chars the bot searches after a key for further cues
var msgHelp =       'Positivity bot is here to help! \n \n' + 
                    'If someone says something sad, I try to make them feel better. I\'m not perfect, but I\'m trying! \n' + 
                    '/love: Sends love \n' +
//                  '/joinvoice: Lets me join your voice channel. ' +
//                  '/happysong: plays a happy little tune. Requires Rythm bot and me to be in a voice channel. \n' +
                    '/help: Makes me do this, silly! \n \n' +
                    'Want to contribute to PositivityBot? You can feed me words and sentences here: \n' +
                    'https://docs.google.com/spreadsheets/d/1LT3wWfJN1o1vEx_IF_zxT_jQ1j1IhQmnqFV0wJxL6Jo';
var iAm =           ['im', 'i\'m', 'i\"m', 'i am', 'i feel'];
var badWords =      ['bad', 'lame', 'stupid', 'crazy', 'awful', 'worthless', 'pathetic', 'dumb',
                        'an idiot', 'thoughtless', 'a disaster', 'broken', 'a loser', 'horrible',
                        'terrible', 'a burden'];
var notBads =       ['stable', 'ok', 'safe', 'happy', 'good', 'loved', 'wanted', 'liked'];
var goodAdjs =      ['lovely', 'beautiful', 'gorgeous', 'brilliant', 'radiant', 'wonderful', 'glorious',
                        'sweet', 'kind', 'bubbly', 'lighthearted', 'comedic', 'handsome', 'fulfilling', 
                        'comforting', 'gentle', 'warm', 'amazing', 'loveable'];
var goodNouns =     ['moonbeam', 'unicorn', 'miracle', 'star', 'inspiration', 'blessing', 'sunshine',
                        'rainbow', 'bubble bath', 'smile', 'sweetheart', 'snuggle', 'breeze', 'puppy',
                        'giraffe', 'cutie']
var affirm =        ['You are loved and respected!', 
                        'You deserve the world!', 
                        'We\'re all happy you are a part of our group!', 
                        'If you need anything, we are here to help you!', 
                        'We care about you friend!',
                        'We are glad you are with us and care about you.',
                        'You are a superstar!',
                        'We\'re always happy to hear from you!',
                        'Your thoughts are valued, and your existence is valuable; you are someone to cherish.',
                        'Your happiness has worth, and you are worthy of happiness.',
                        'We love you soooo much!'];
var affirmations = [selectRandom(affirm), selectRandom(affirm), selectRandom(affirm), selectRandom(affirm), goodCombo1(), goodCombo2()];
var songMap = new Map();
populateSongMap();
var songList = Array.from(songMap.keys());

lowMessage = msg.content.toLowerCase();
searchImBad(msg, lowMessage);
        searchNotGood(msg, lowMessage);
        searchIsHard(msg, lowMessage);
        runSlashFunctions(msg, lowMessage);
        //searchImBadFunc(msg, lowMessage);
// If anyone says something like "I am stupid", bot says they aren't 
// Search for key "iAm" and key "badWord"
registerLowercaseListener((message, lowMessage)=> {
    for(i = 0; i < iAm.length; i++){
        var decLocation = lowMessage.search(iAm[i]);
        if(decLocation != -1) {
            for(i = 0; i < badWords.length; i++) {
                if(lowMessage.substr(decLocation, searchScope).includes(' ' + badWords[i])) {
                    return 'You are not ' + badWords[i] + '! ' + getAffirmation();
                }
            }
        }
    }
})

/*registerLowercaseListener((message, lowMessage) => {
    var strings = iAm.filter((iam) => lowMessage.includes(iam))
    .map((iam) => lowMessage.substr(lowMessage.search(iam), searchScope))
    .filter((selected) => selected.includes(badWords));
})*/

// Sends affirmations for text with "not [good]" instead
registerLowercaseListener((message, lowMessage) => {
    for(i = 0; i < iAm.length; i++){
        var decLocation = lowMessage.search(iAm[i]);
        if(decLocation != -1) {
            if (lowMessage.substr(decLocation, searchScope).includes('not')) {
                for (i = 0; i < notBads.length; i++) {
                    if (lowMessage.substr(lowMessage.search('not'), searchScope).includes(' ' + notBads[i])) {
                        message.reply('I\'m sorry you feel that way, and I believe you can be ' + notBads[i] + '. ' + getAffirmation());
                    }
                }
            }
        }
    }
});

// Validates when people say that a specific word is hard
registerLowercaseListener((message, lowMessage) => {
    var hardLocation = lowMessage.search(" is hard");
    if (hardLocation != -1) {
        for (var i = 1; i < searchScope; i++) {
            if (hardLocation - i == 0) {
                return 'Yeah, I understand that ' + lowMessage.substring(hardLocation - i, hardLocation) + ' can be really hard at times. We are here to support you!';
            } else if (lowMessage.charAt(hardLocation - i).match(" ")) {
                return 'Yeah, I understand that ' + lowMessage.substring(hardLocation - i + 1, hardLocation) + ' can be really hard at times. We are here to support you!';
            }
        }
    }
});

// Checks for commands run by users
registerLowercaseListener((message, lowMessage) => {
    if (lowMessage.substring(0, 1) == '/') {
        var args = lowMessage.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        switch(cmd) {
            case 'love':
                if (args.length > 1) {

                } else {
                    message.reply(getAffirmation());
                }
            break;
/*          case 'joinvoice':
                // Only try to join the sender's voice channel if they are in one themselves
                if (message.member.voiceChannel) {
                    message.member.voiceChannel.join()
                            .then(connection => { // Connection is an instance of VoiceConnection
                        message.reply('I am now in a voice channel!');
                    })
                    .catch(console.log);
                } else {
                    message.reply('You need to join a voice channel first!');
                }
            break;
            case 'happysong':
                var song = selectRandom(songList)
                message.channel.send('Now playing: ' + song);
                message.channel.send('!play ' + songMap.get(song));
                message.channel.send('If Rythm isn\'t playing a song, check my connection to a voice channel.');
            break; */
            case 'help':
                message.channel.send(msgHelp);
            break;
        }
    }
})

// Refreshes affirmations, then returns a random one
function getAffirmation() {
    affirmations = [selectRandom(affirm), selectRandom(affirm), selectRandom(affirm), selectRandom(affirm), goodCombo1(), goodCombo2()];
    return selectRandom(affirmations);
}

// combos 1 and 2 generate compliments based on good adjectives and nouns
function goodCombo1() {
    return 'You are a ' + selectRandom(goodAdjs) + ' ' + selectRandom(goodNouns) + '!'
}
function goodCombo2() {
    return 'You\'re a ' + selectRandom(goodAdjs) + ' ' + selectRandom(goodAdjs) + ' ' + selectRandom(goodNouns) + '!'
}

// Adds songs to songMap
function populateSongMap() {
    songMap.set('One by Sleeping At Last', 'https://www.youtube.com/watch?v=kPgH4eBTAPk');
    songMap.set('I Want You to Have It All by Lee Jacks and Tory Rines', 'https://www.youtube.com/watch?v=1NPiH7LmP3U');
    songMap.set('Bohemian Rhapsody', 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ');
    songMap.set('Hooked on a Feeling by Blue Suede', 'https://www.youtube.com/watch?v=NrI-UBIB8Jk');
    songMap.set('Africa by Toto', 'https://www.youtube.com/watch?v=FTQbiNvZqaY');
    songMap.set('Lisztomania by Phoenix', 'https://youtu.be/uF3reVVUbio');
}

// Selects random element within array
function selectRandom(array) {
    return array[Math.floor(Math.random()*array.length)]
}
