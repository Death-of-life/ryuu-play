const { BotManager, SimpleBot, config } = require('@ptcg/server');
const { CardManager } = require('@ptcg/common');

// Backend config
config.backend.address = '127.0.0.1';
config.backend.port = 12021;
config.backend.avatarsDir = __dirname + '/avatars';
config.backend.webUiDir = __dirname + '/packages/play/dist/ptcg-play';

// Storage config
config.storage.type = 'sqlite';
config.storage.database = __dirname + '/database.sq3';

// Bots config
config.bots.defaultPassword = 'bot';

// Sets/scans config
config.sets.scansDir = __dirname + '/scans';
config.sets.scansDownloadUrl = 'https://ptcg.ryuu.eu/scans'; // Deprecated: missing scans are not downloaded at startup

// Define available sets
const { standardSets } = require('@ptcg/sets');

const cardManager = CardManager.getInstance();

cardManager.defineFormat('Standard', [
  standardSets.setH,
  standardSets.setFgh,
]);

// Define bots
const botManager = BotManager.getInstance();
botManager.registerBot(new SimpleBot('bot'));
