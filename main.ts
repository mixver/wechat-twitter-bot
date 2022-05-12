import { WechatyBuilder } from 'wechaty';
import qrcodeTerminal from 'qrcode-terminal';

import { Twitter } from './src/components/twitter/index';

const dotenv = require("dotenv");
dotenv.config();

const name = 'bot';
const bot = WechatyBuilder.build({
    name,
    puppet: 'wechaty-puppet-wechat',
});

function onScan(qrcode: any, status: any) {
    qrcodeTerminal.generate(qrcode, { small: true })
}
async function onLogin(user: any) {
    console.log(`${user}登录成功`);
}
bot.on('scan', onScan);
bot.on('login', onLogin);
bot.use(
    Twitter(),
)
bot.start()
    .then(() => console.log('开始登陆微信'))
    .catch((e: any) => console.error(e));