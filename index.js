const schedule = require("node-schedule");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
class JohnIndent {
  constructor(
    topTitle = "",
    coinName = "",
    imgCoin = "",
    date = "",
    middleTxt = "",
    sellPriceCoin = "",
    buyPriceCoin = "",
    tPrice = ""
  ) {
    this.topTitle = topTitle;
    this.coinName = coinName;
    this.date = date;
    this.middleTxt = middleTxt;
    this.buyPriceCoin = buyPriceCoin;
    this.targetPrice = tPrice;
    this.sellPriceCoin = sellPriceCoin;
    this.imgCoin = imgCoin;
    this.token = "bot131728:3010a435-d549-4c37-9cc7-2f38b7b0ab2c";
  }

  async sendRequest(reqInf, body) {
    try {
      const response = await axios.post(
        `https://eitaayar.ir/api/${this.token}/${reqInf}`,
        body,
        {
          headers: {
            ...body.getHeaders(),
          },
        }
      );
      console.log(
        `Request sent successfully for ${this.coinName}:`,
        response.data
      );
    } catch (error) {
      console.error(
        `Error sending request for ${this.coinName}:`,
        error.message
      );
    }
  }

  async getPrice(coinName) {
    try {
      const response = await axios.post(
        `http://admin.alanchand.com/api/arz/${coinName}`,
        { lang: "fa" }
      );
      this.topTitle = response.data.top_text;
      this.buyPriceCoin = response.data.price[0].price;
      this.targetPrice = response.data.price[1].price;
      this.sellPriceCoin = response.data.price[2].price;
      this.middleTxt = response.data.middle_text;
      this.imgCoin = response.data.cash_image[2];
      this.coinName = response.data.name;
      console.log(`Fetched price for ${this.coinName}`);
    } catch (error) {
      console.error(`Error fetching price for ${coinName}:`, error.message);
    }
  }

  async sendMessage(coin) {
    const form = new FormData();
    if (coin == "eur") {
      form.append("file", fs.createReadStream("./eur.jpg"));
    } else {
      form.append("file", fs.createReadStream("./usd.jpg"));
    }
    form.append("chat_id", "masin123");
    const caption = `
💵 ${this.coinName} 💵

📰${this.topTitle}

${this.middleTxt}

🔵قیمت خرید ${this.coinName}: ${this.buyPriceCoin}
🔴 قیمت فروش ${this.coinName}: ${this.sellPriceCoin}
✅قیمت نهایی ${this.coinName}: ${this.targetPrice}

#ارز_دیجیتال #ارز #دلار #یورو #دلارهرات #بورس #ترید #اخبار_بازار #اخبار #بازار #استراتژی #فارکس #بازار_مالی #ترید #تحلیل #تحلیل_بازار #دلار_هرات #طلا #سکه

ID | : 💎@chappar_office`;
    form.append("caption", caption);
    await this.sendRequest("sendFile", form);
  }
}

async function sendRq() {
  const coins = ["usd", "usd-herat", "eur"];
  for (let i = 0; i < coins.length; i++) {
    const john = new JohnIndent();
    await john.getPrice(coins[i]);
    await john.sendMessage(coins[i]);
  }
}

const times = [
  { hour: 9, minute: 0 },
  { hour: 12, minute: 0 },
  { hour: 19, minute: 0 },
];
times.forEach((t) => {
  schedule.scheduleJob(
    { hour: t.hour, minute: t.minute, tz: "Asia/Tehran" },
    sendRq
      .then(() => {
        console.log("All requests sent successfully.");
      })
      .catch((error) => {
        console.error("Error in sendRq:", error);
      })
  );
});

console.log("Bot is running...");
