const result = require('dotenv').config();
const { Client, Intents } = require('discord.js');
var cron = require('node-cron');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const axios = require('axios');

const cryptocurrency = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com/v1/",
  headers: { 'X-CMC_PRO_API_KEY': process.env.APIKEY }
})

list = [
  'USDT',
  'BTC',
  'ETH',
  'WETH',
  'BNB',
  'WAXP',
  'TLM',
  'SLP',
  'AXS',
  'PVU',
  'SAND']

  // 'DINOP',

coin = []
text = ''


bot.login(process.env.TOKEN);
bot.on("ready", () => {
  console.log('bot Ready!')
})

cron.schedule('59 * * * * *', async () => {
  console.log('start coin');
  var ts = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var time = ts.toLocaleTimeString("en-US", { timeZone: "Asia/Bangkok", hour12: false });
  var day = ts.toLocaleDateString("en-US", { timeZone: "Asia/Bangkok", options });
  cryptocurrency.get('/cryptocurrency/listings/latest?start=1&limit=5000&convert=THB',
    {
      json: true,
      gzip: true
    }).then((result) => {
      list.map(name => {
        coin.push(result.data.data.find(x => x.symbol === name))
      })
      coin.forEach(data=> text+=textAnnouce(data.symbol, data.quote.THB.price, 'THB'));
      bot.guilds.cache.forEach((guild) => {
        if ('notheartbottester' === guild.name) {
          guild.channels.cache.forEach((room) => {
            if (room.isText()) {
              if (room.name === 'test-announce') {
                room.send(`อัพเดทราคาของวันที่ ${day} ณ เวลา ${time} น.\n `);
                room.send(text);
              }
            }
          })
        }
      })
    })
}, 'Asia/Bangkok')


function textAnnouce(symbol, price, unit) {
  return `ราคาของ ${symbol} อยู่ที่ ${price.toFixed(4).replace(/\d(?=(\d{3})+\.)/g, '$&,')} ${unit}\n`
}
