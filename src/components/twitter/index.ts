import { Wechaty, WechatyPlugin } from "wechaty";
import { FileBox } from 'file-box';
import axios from "axios";

function Twitter(): WechatyPlugin {
    return function TwitterPlugin(bot: Wechaty) {
        bot.on('message', async msg => {
            if (msg.text().startsWith("。推特图")) {
                let twitterToken = ""
                if (process.env.TWITTER_TOKEN) {
                    twitterToken = process.env.TWITTER_TOKEN
                }
                let msgArr = msg.text().split(" ")
                if (msgArr.length > 3) {
                    var reg = new RegExp("\\d{15,}")
                    var result = reg.exec(msgArr[3])
                    if (result) {
                        const resp = await axios.get(`https://api.twitter.com/1.1/statuses/show.json?id=${result[0]}`, {
                            headers: {
                                Authorization: twitterToken
                            }
                        })
                        if (resp.data) {
                            if (resp.data.extended_entities) {
                                if (resp.data.extended_entities.media) {
                                    let responseImageData = resp.data.extended_entities.media;
                                    if (responseImageData.length > 1) {
                                        responseImageData.forEach(async (item: any) => {
                                            const fileBox = FileBox.fromUrl(item.media_url_https)
                                            await msg.say(fileBox)
                                        })
                                    } else {
                                        const fileBox = FileBox.fromUrl(resp.data.extended_entities.media[0].media_url_https)
                                        await msg.say(fileBox)
                                    }

                                    if (resp.data.extended_entities.media[0].video_info) {
                                        let responseVideoData = resp.data.extended_entities.media[0].video_info.variants;
                                        responseVideoData.forEach(async (item: any) => {
                                            if (item.bitrate == 2176000) {
                                                const fileBox = FileBox.fromUrl(item.url)
                                                await msg.say(fileBox)
                                            }
                                        });
                                    }
                                } else {
                                    await msg.say("无法获取媒体文件")
                                }
                            } else {
                                await msg.say("无法获取媒体文件")
                            }
                        }
                    }
                }
            }
        })
    }
}

export {
    Twitter
}