const { Wechaty, MediaMessage } = require("wechaty");
// 坑#1 ： 发送MediaMessage的时候没有在最上面引入。

// import {Wechaty, Contact} from 'wechaty'
// import { config, Contact, Room, Wechaty, log } from "wechaty";

var qrcode = require("qrcode-terminal");
var ramda = require("ramda");
var top250 = require("./top250.json");
const fs = require("fs");
const bot = Wechaty.instance();

bot
  .on("scan", (url, code) => {
    if (!/201|200/.test(String(code))) {
      const loginUrl = url.replace(/\/qrcode\//, "/l/");
      qrcode.generate(loginUrl);
    }
    console.log(`${url}\n[${code}] Scan QR Code in above url to login: `);
  })

  .on("login", user => {
    console.log(`User ${user} logined`);
  })

  .on("message", async m => {
    if (m.room()) {
      var group = m.room().topic();
    }
    var sender = m.from().name(),
      content = m.content();

    if (/^.*帅不帅.*$/i.test(m.content())) {
      await m.say("帅");
    }

    if (/^.*最帅.*$/i.test(m.content())) {
      await m.say("徐帅");
    }

    if (!m.self() && m.room()) {
      if (/^ding$/i.test(m.content())) {
        await m.say("dong");
      }
      if (/^dong$/i.test(m.content())) {
        await m.say("ding");
      }
    }

    if (!m.self() && m.room()) {
      console.log(`#群聊 <${group}> ${sender}：${content}`);
    } else {
      console.log(`#私聊 ${sender}：${content}`);
    }

    if (!m.self() && m.room()) {
      if (/^.*随便.*电影.*$/i.test(m.content())) {
        let index = Math.floor(Math.random() * 250);
        let body = top250[index];
        m.say(
          `电影史排名#${body.index}
${body.title}
(${body.original_title})
豆瓣评分：${body.average}
影片类型：${body.genres[0]} ${body.genres[1]}
上映年份：${body.year}
导演：${body.directors[0]}
主演：${body.casts[0]} ${body.casts[1]}
`
        );
      }
    }

    if (!m.self() && m.room()) {
      if (/^.*前一百.*$/i.test(m.content())) {
        let index = Math.floor(Math.random() * 100);
        let body = top250[index];
        m.say(
          `电影史排名#${body.index}
${body.title}
(${body.original_title})
豆瓣评分：${body.average}
影片类型：${body.genres[0]}
上映年份：${body.year}
导演：${body.directors[0]}
主演：${body.casts[0]}
`
        );
        m.say(new MediaMessage(`./posts/${body.index}.${body.title}.jpg`));
      }
    }
  })
  .start();
