const { google } = require('googleapis')

class GoogleCalendarSource {
  static defaultOptions() {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const oneYearFromNowDate = new Date(year + 1)
    return {
      apiKey: "",
      calendarId: "",
      maxResults: 25,
      timeMax: oneYearFromNowDate.toISOString(),
      timeMin: currentDate.toISOString(),
      timeZone: "Europe/London",
      type: "googleCalendar",
    };   
  }

  constructor(api, options = GoogleCalendarSource.defaultOptions()) {
    this.options = options

    api.loadSource(async store => {
      const contentType = store.addCollection({
        typeName: this.options.type
      })

      const calendar = google.calendar({
        version: 'v3',
        auth: this.options.apiKey
      })

      await calendar.events.get({
        auth: this.options.apiKey,
        calendarId: this.options.calendarId,
        maxResults: this.options.maxResults,
        orderBy: this.options.orderBy,
        timeMax: this.options.timeMax,
        timeMin: this.options.timeMin,
        timeZone: this.options.timeZone
      }).then(response => {
        const data = response.items
        contentType.addNode(data)
      }).catch(error => console.log('error fetching calendar', error))
    })
  }
}

module.exports = GoogleCalendarSource