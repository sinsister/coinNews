const axios = require("axios")
const schedule = require('node-schedule');
const fs = require("fs")
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
    async generateRandomName(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }
    async sendRequest(reqInf, body) {
        console.log();
        axios.post(`https://eitaayar.ir/api/${this.token}/${reqInf}`, body)
            .then(res => {
                console.log(res.data);
            })
    }
    // async editMessage(message) {
    //     const url = 'https://eitaayar.ir/admin/message/77809813';
    //     const formData = new FormData();
    //     formData.append('___TOKEN_FORM___', '29cae28d2eeb831e15ce0eeee3f974c5');
    //     formData.append('title', 'testMesage');
    //     formData.append('text', `${message}`);
    //     formData.append('datetimeSend', '۱۴۰۳/۰۹/۲۱ ۱۰:۳۱:٠٠');
    //     formData.append('state', 'sending');
    //     formData.append('m_dateTimeDelete', '');
    //     formData.append('d_dateTimeDelete', '');
    //     formData.append('h_dateTimeDelete', '');
    //     formData.append('i_dateTimeDelete', '');
    //     formData.append('viewCountForDelete', '');

    //     fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Cookie': 'SESSIONID=78da2d4ec96d00410c6ac9f7d8e5f8ecbf846c9420011f4020fc81fe5dc376aa606b6478ecb1317c7caf630c47a0aca08a420b4baf69ddd90f711e96472e27313d78414432e5993d6e229b2abc078b7935a7f9aa11efebb19872901f7c091e462b5347329ec88367bdf008f8da07ba33fa686ac09fc0b5058040dbd9efef6fa8789438507a1ae9051b929adaa2a4e470b3a5707b2f0608dabe4a3f3d4b85f2556b398eed51a46290ddc1ef85bae3dea72fbea423a86be50f296e5591',
    //             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    //             'Origin': 'https://eitaayar.ir',
    //             'Referer': 'https://eitaayar.ir/admin/message/77809813',
    //         },
    //         body: formData,
    //     })
    //         .then(response => response.text())
    //         .then(data => {
    //         })
    // }
    async getPrice(coinName) {
        await axios.post(`http://admin.alanchand.com/api/arz/${coinName}`, { lang: "fa" }).then(response => {
            this.topTitle = response.data.top_text
            this.buyPriceCoin = response.data.price[0].price
            this.targetPrice = response.data.price[1].price
            this.sellPriceCoin = response.data.price[2].price
            this.middleTxt = response.data.middle_text
            this.imgCoin = response.data.cash_image[2]
            this.coinName = response.data.name
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

#ارز_دیجیتال #ارز #دلار #یورو #دلارهرات #بورس #ترید #اخبار_بازار #اخبار #بازار #استراتژی #فارکس #بازار_مالی #ترید #تحلیل #تحلیل_بازار #دلار_هرات #طلا #سکه

ID | : 💎@chappar_office`,
            chat_id: 'chappar_office',
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
// const times = [
//     { hour: 9, minute: 0 },
//     { hour: 12, minute: 0 },
//     { hour: 19, minute: 0 },
// ];
// times.forEach(t => {

//     schedule.scheduleJob({ hour: t.hour, minute: t.minute, tz: 'Asia/Tehran' }, sendRq);
// })
sendRq()
console.log("bot is running...")