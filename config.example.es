
const config = {
  rinTorrentApi: {
    url: 'https://bangumi.moe/api/torrent/search',
    body: {
      p: 1,
      tag_id: '549306ae5c4651317663a274',
      type: 'tag',
    },
  },
  botToken: '[bot token]',
  // check every 2 minutes
  checkInterval: 120000,
  // allowChatIds: [ -1001025727615 ],
}

export default config
