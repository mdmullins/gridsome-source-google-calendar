const axios = require('axios')
const dayjs = require('dayjs')

class GoogleCalendarSource {
  static defaultOptions() {
    const currentDate = dayjs().toISOString()
    const yearFromNow = dayjs()
      .add(1, 'year')
      .toISOString()
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
      orderBy: 'startTime',
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
          ? `&timeMax=${this.options.timeMax}`
          : ''
        const minTime = this.options.timeMin
          ? `&timeMin=${this.options.timeMin}`
          : ''
        const orderBy = this.options.orderBy
          ? `&orderBy=${this.options.orderBy}`
          : ''
        const singleEvents = `&singleEvents=${this.options.singleEvents}`
        const baseURL = `https://www.googleapis.com/calendar/v3/calendars/`
        const getURL = `${baseURL}${this.options.calendarId}/events?maxResults=${this.options.maxResults}${minTime}${maxTime}${singleEvents}${orderBy}&key=${this.options.apiKey}`
        const res = await axios.get(getURL)
        if (res) {
          const items = await res.data.items
          const sortedItems = items.sort(function(a, b) {
            a = new Date(a.start.dateTime)
            b = new Date(b.start.dateTime)
            return a > b ? -1 : a < b ? 1 : 0
          })
          sortedItems.forEach(event => {
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
