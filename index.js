const axios = require("axios")
const schedule = require('node-schedule');
class johnIndent {
    constructor(topTitle, coinName, imgCoin, date, middleTxt, sellPriceCoin, buyPriceCoin, tPrice) {
        this.topTitle = topTitle
        this.coinName = coinName
        this.date = date
        this.middleTxt = middleTxt
        this.buyPriceCoin = buyPriceCoin
        this.targetPrice = tPrice
        this.sellPriceCoin = sellPriceCoin
        this.imgCoin = imgCoin
        this.token = "bot131728:3010a435-d549-4c37-9cc7-2f38b7b0ab2c"
    }
    async sendRequest(reqInf, body) {
        axios.post(`https://eitaayar.ir/api/${this.token}/${reqInf}`, body)
            .then(res => {
                console.log(res.data);
            })
    }
    async getPrice(coinName) {
        await axios.post(`http://admin.alanchand.com/api/arz/${coinName}`, { lang: "fa" }).then(response => {
            this.topTitle = response.data.top_text
            this.buyPriceCoin = response.data.price[0].price
            this.targetPrice = response.data.price[1].price
            this.sellPriceCoin = response.data.price[2].price
            this.middleTxt = response.data.middle_text
            this.coinName = response.data.name
        })
    }
    async getTime() {
        await axios.get('https://www.time.ir/Tools/GetDate.aspx?t=1733617293915&_=1733617242072').then(date => {

        })
    }
    async sendMessage() {
        const body = {
            text: `
            
💵 ${this.coinName} 💵

📰${this.topTitle}

${this.middleTxt}

🔵قیمت خرید ${this.coinName}: ${this.buyPriceCoin}
🔴 قیمت فروش ${this.coinName}: ${this.sellPriceCoin}
✅قیمت نهایی ${this.coinName}: ${this.targetPrice}

#ارز_دیجیتال #ارز #دلار #یورو #دلارهرات #بورس #ترید #اخبار_بازار #اخبار

ID | : 💎@chappar_office
`,
            chat_id: 'chappar_office'
        }
        this.sendRequest("sendMessage", body)
    }
}
async function sendRq() {
    const coins = ["usd", "usd-herat", "eur",]
    const john = new johnIndent

    for (let i = 0; i < coins.length; i++) {
        await john.getPrice(coins[i])
        await john.sendMessage()
    }

}
const times = [
    { hour: 8, minute: 0 },
    { hour: 12, minute: 0 },
    { hour: 19, minute: 0 },
    { hour: 22, minute: 0 },
    { hour: 2, minute: 15 }
];
times.forEach(t => {

    schedule.scheduleJob({ hour: t.hour, minute: t.minute, tz: 'Asia/Tehran' }, sendRq);
})
console.log("bot is running...")