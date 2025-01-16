// This Google Apps Script Will Send a POST to a Slack Webhook creating a messages of any events starting within the next minute of execution. It will use the event description as the person's name.
// Any events that have already started will not appear. 
// This script should be triggered every minute using Google Triggers.
const WEBHOOK_URL = ""; 
const CALENDAR_ID = "";
const NO_VALUE_FOUND = "N/A";
const minsInAdvance = 1; // Set the number of minutes in advance you'd like events to be posted to Slack. Must be 1 or greater

// Import Luxon
eval(UrlFetchApp.fetch('https://cdn.jsdelivr.net/npm/luxon@2.0.2/build/global/luxon.min.js').getContentText());
let DateTime = luxon.DateTime;
const DTnow = DateTime.now().startOf('minute'); // Will consider 'now' as the beginning of the minute to handle second offset issues with triggers over time.

function postEventsToChannel() {
  let optionalArgs = {
    timeMin: DTnow.toISO(),
    timeMax: DTnow.plus({ minutes: minsInAdvance }).toISO(), // Only show events starting in the next x minutes
    showDeleted: false,
    singleEvents: true,
    orderBy: 'startTime'
  };
  
  let response = Calendar.Events.list(CALENDAR_ID, optionalArgs);
  let events = response.items;
  Logger.log(`Found ${events.length} events`);

  if (events.length > 0) {
    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      let ISOStartDate = event.start.dateTime || event.start.date;
      let ISOEndDate = event.end.dateTime || event.end.date;

      if (DateTime.fromISO(ISOStartDate) < DTnow.plus({ minutes: minsInAdvance - 1 })) {
        Logger.log(`Event ${event.summary} [${event.id}] has already started. Skipping. Event started at ${DateTime.fromISO(ISOStartDate)}`);
        continue;
      }

      // Build the POST request for Slack
     let options = {
      "method": "post",
      "headers": {
        "Content-Type": "application/json",
      },
      "payload": JSON.stringify({
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": `🎉 It's ${event.description}'s Birthday Today! 🥳`,
              "emoji": true
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `:alert: Prepare the confetti cannons and inflate the balloons! 🎈 Because ${event.description} is officially one year closer to getting senior citizen discounts.`
            },
            "accessory": {
              "type": "image",
              "image_url": "https://cdn-icons-png.flaticon.com/512/2454/2454297.png", // Replace with your preferred birthday icon
              "alt_text": "birthday cake"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": `:celebrate: Don't forget to wish them a happy birthday! :angry-gun-man:`
              }
            ]
          }
        ]
      })
    };


      Logger.log(options, null, 2);
      UrlFetchApp.fetch(WEBHOOK_URL, options);
    }
  } else {
    Logger.log(`No events starting within ${minsInAdvance} minute(s) found.`);
  }
}

/**
 * Converts an ISO string into Slack's date/time format
 */
function formatSlackTime(isoString) {
  return `<!date^${Math.floor(DateTime.fromISO(isoString).toSeconds())}^{date_short_pretty} at {time}|${isoString}>`;
}
