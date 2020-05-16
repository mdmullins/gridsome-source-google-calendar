# Gridsome Source for Google Calendar

![npm](https://img.shields.io/npm/v/gridsome-source-google-calendar.svg)
![npm](https://img.shields.io/npm/dt/gridsome-source-google-calendar.svg)
![NPM](https://img.shields.io/npm/l/gridsome-source-google-calendar.svg)

Source plugin for fetching events list from Google Calendar. 

## Requirements

Gridsome: >0.7.0

## Install 

```js
yarn add gridsome-source-google-calendar
```
npm
```js
npm install gridsome-source-google-calendar
```

## How to use

You will need to generate a google api key [here](https://console.developers.google.com/apis/credentials). The calendarId 
can be found in the calendar settings > integrate calendar. 

You will also need to make your calendar viewable to the public to use the api credentials.

```js
module.exports = {
  siteName: 'Gridsome',
  plugins: [
    {
      use: 'gridsome-source-google-calendar',
      options: {
        apiKey: 'GOOGLE_API_KEY',
        calendarId: "GOOGLE_CALENDAR_ID",
        maxResults: 25,
        // default max is one year from now
        timeMax: maxDate.toISOString(),
        // default min is now
        timeMin: minDate.toISOString(),
        timeZone: "Europe/London",
        type: "googleCalendar",
        // type: 'TYPE_NAME', //Optional - default is googleCalendar. Used for graphql queries.
      }
    }
  ]
}
```

### Example query on page template

```js
<page-query>
  query MyData {
    allGoogleCalendar {
      edges {
        node {
          id
          title
        }
      }
    }
  }
</page-query>
```

### To use data in page

```js
<template>
  <div>
    {{ $page.allGoogleCalendar.node.id }}
  </div>
  <div>
    {{ $page.allGoogleCalendar.node.title }}
  </div>
</template>
```

### Using Templates

To use this in a template first setup the template route in gridsome.config.js

```js
module.exports = {
  siteName: 'Gridsome',
  plugins: [
    {
      use: 'gridsome-source-google-calendar',
      options: {
        apiKey: 'GOOGLE_API_KEY',
        calendarId: "GOOGLE_CALENDAR_ID",
        maxResults: 25,
        // default max is one year from now
        timeMax: maxDate.toISOString(),
        // default min is now
        timeMin: minDate.toISOString(),
        timeZone: "Europe/London",
        type: "googleCalendar",
        // type: 'TYPE_NAME', //Optional - default is googleCal. Used for graphql queries.
      }
    }
  ],
  templates: {
    googleSheet: [
      {
        path: '/:id',
        component: './src/templates/googleCalendar.vue'
      }
    ]
  }
}

```

### Example template in src/template/googleSheet.vue

```js
<template>
  <layout>
    <div>{{$page.googleCal.title}}</div>
    <div>{{$page.googleCal.body}}</div>
  </layout>
</template>

<page-query>
query Post ($path: String!) {
  googleCal (path: $path) {
    title
    body
  }
}
</page-query>
```
