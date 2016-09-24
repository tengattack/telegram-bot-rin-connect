
import request from 'request'

export default class RinApi {
  constructor(api) {
    this.api = api
  }
  getApiData() {
    const { url, body } = this.api
    return new Promise((resolve, reject) => {
      request({
        method: 'POST',
        url,
        body,
        json: true,
      }, (err, resp, body) => {
        if (err) {
          reject(err)
        } else {
          resolve(body)
        }
      })
    })
  }
  async getTorrentList() {
    const body = await this.getApiData()
    if (!body || !body.torrents) {
      return []
    }
    return body.torrents
  }
}
