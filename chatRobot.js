const { Wechaty } = require('wechaty')

Wechaty.instance()
.on('scan',(url,code) => console.log(`Scan QR Code to login: ${code}\n${url}`))
.on('login',     user => console.log(`User ${user} logined`))
.on('message',message => console.log(`Message: ${message}`))
.start()