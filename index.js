const axios = require('axios')
const dayjs = require('dayjs')

class GoogleCalendarSource {
  static defaultOptions() {
    const currentDate = dayjs().format()
    const yearFromNow = currentDate.add(1, 'year')
    return {
      calendarId: '',
      maxResults: 25,
      timeZone: 'Europe/London',
      type: 'googleCalendar',
      calendarId: '',
      timeMin: currentDate,
      timeMax: yearFromNow,
      apiKey: ''
    }   
  }

  constructor(api, options = GoogleCalendarSource.defaultOptions()) {
    this.options = options

    api.loadSource(async store => {
      try {
        const contentType = store.addCollection({
          typeName: this.options.type
        })
        const maxTime = `&timeMax=${this.options.timeMax}`
        const minTime = `&timeMin=${this.options.timeMin}`
        const baseURL = `https://www.googleapis.com/calendar/v3/calendars/`
        const getURL = `${baseURL}${this.options.calendarId}/events?maxResults=${this.options.maxResults}${maxTime}&key=${this.options.apiKey}`

        const res = await axios.get(getURL)

        if (res) {
          contentType.addNode(res.items)
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

