#!/usr/bin/env babel-node

import BotApi from './lib/botapi'
import RinApi from './lib/rinapi'

import config from './config'

const { allowChatIds } = config

process.on('uncaughtException', err => {
  console.error('Error caught in uncaughtException event:', err)
})

const rin = new RinApi(config.rinTorrentApi)
const bot = new BotApi(config.botToken)

let torrentIds = []
function torrentsMessageHTML(torrents) {
  const torrentLines = torrents.map((t, i) => {
    return `${i + 1}. `
         + '<a href="https://bangumi.moe/torrent/' + t._id + '">'
         +   t.title
         + '</a>'
  })
  return torrentLines.join('\n')
}
function notifyUpdates(torrents) {
  if (!allowChatIds) {
    return
  }
  const html = '新的種子：\n'
             + torrentsMessageHTML(torrents)
  allowChatIds.forEach(chat_id => {
    bot.sendMessage({
      chat_id,
      text: html,
    }, err => {
      if (err) {
        console.log(err)
      }
    })
  })
}
function startCheckTorrentsUpdates() {
  setInterval(() => {
    rin.getTorrentList().then(torrents => {
      const newTorrents = torrents.filter(t => !torrentIds.includes(t._id))
      if (newTorrents.length > 0) {
        // notify all
        notifyUpdates(newTorrents)
        // update
        torrentIds = torrents.map(t => t._id)
      }
    })
  }, config.checkInterval)
}
rin.getTorrentList().then(torrents => {
  // init first torrent ids
  torrentIds = torrents.map(t => t._id)
  startCheckTorrentsUpdates()
})

bot.setCheck((cmd, upd) => {
  if (upd.message && upd.message.chat) {
    const chat = upd.message.chat
    // only allow group `KNA-Subs`
    if (!allowChatIds || allowChatIds.includes(chat.id)) {
      return false
    }
  }
  return true
})

bot.commands.on('list', (upd, followString) => {
  const chat = upd.message.chat
  rin.getTorrentList().then(torrents => {
    const html = torrentsMessageHTML(torrents.slice(0, 10))
    bot.sendMessage({
      chat_id: chat.id,
      text: html,
    }, err => {
      if (err) {
        console.log(err)
      }
    })
  })
})

bot.start()
