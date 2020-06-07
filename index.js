const axios = require('axios')
const dayjs = require('dayjs')

class GoogleCalendarSource {
  static defaultOptions() {
    const currentDate = dayjs().format()
    const yearFromNow = dayjs()
      .add(1, 'year')
      .format()
    return {
      calendarId: '',
      maxResults: 25,
      timeZone: 'Europe/London',
      type: 'googleCalendar',
      calendarId: '',
      timeMin: currentDate,
      timeMax: yearFromNow,
      apiKey: '',
      singleEvents: true,
    }
  }

  constructor(api, options = GoogleCalendarSource.defaultOptions()) {
    this.options = options

    api.loadSource(async store => {
      try {
        const contentType = store.addCollection({
          typeName: this.options.type,
        })
        const maxTime = this.options.timeMax
          ? `&maxTime=${this.options.timeMax}`
          : ''
        const minTime = this.options.timeMin
          ? `&minTime=${this.options.timeMin}`
          : ''
        const singleEvents = `&singleEvents=${this.options.singleEvents}`
        const baseURL = `https://www.googleapis.com/calendar/v3/calendars/`
        const getURL = `${baseURL}${this.options.calendarId}/events?maxResults=${this.options.maxResults}${maxTime}${minTime}${singleEvents}&key=${this.options.apiKey}`
        const res = await axios.get(getURL)
        if (res) {
          const items = await res.data.items
          items.forEach(event => {
            contentType.addNode(event)
          })
        } else {
          throw new Error('no events found')
        }
      } catch (error) {
        console.error('error fetching events', error)
      }
    })
  }
}

module.exports = GoogleCalendarSource
