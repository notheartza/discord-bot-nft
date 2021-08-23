const result = require('dotenv').config();
const { Client, Intents } = require('discord.js');
var cron = require('node-cron');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const axios = require('axios');

const cryptocurrency = axios.create({
  baseURL: "https://pro-api.coinmarketcap.com/v1/",
  headers: { 'X-CMC_PRO_API_KEY': '2e4fc99b-3658-4b86-805c-48f78d2c9ef9' }
})


bot.login(process.env.TOKEN);
bot.on("ready", () => {
  console.log('bot Ready!')
})

cron.schedule('0 0 * * * *', async () => {
  console.log('start coin');
  var ts = new Date()
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  var time = ts.toLocaleTimeString("en-US", { timeZone: "Asia/Bangkok",  hour12: false  });
  var day = ts.toLocaleDateString("en-US", { timeZone: "Asia/Bangkok", options});
  cryptocurrency.get('/cryptocurrency/listings/latest?convert=THB',
    {
      json: true,
      gzip: true
    }).then((result) => {
      let index_btc = result.data.data.findIndex(x => x.symbol === 'BTC')
      let index_bnb = result.data.data.findIndex(x => x.symbol === 'BNB')
      let btc = result.data.data[index_btc]
      let bnb = result.data.data[index_bnb]
      console.log(btc)
      bot.guilds.cache.forEach((guild) => {
        if ('notheartbottester' === guild.name) {
          guild.channels.cache.forEach((room) => {
            if (room.isText()) {
              if (room.name === 'test-announce') {
                room.send(`ราคาของ ${btc.symbol} อัพเดทวันที่ ${day} ณ เวลา ${time} น. ราคาอยู่ที่ ${btc.quote.THB.price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} THB`+"\n"+
                `ราคาของ ${bnb.symbol} อัพเดทวันที่ ${day} ณ เวลา ${time} น. ราคาอยู่ที่ ${bnb.quote.THB.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} THB`)
              }
            }
          })
        }
      })
    })
}, 'Asia/Bangkok')
