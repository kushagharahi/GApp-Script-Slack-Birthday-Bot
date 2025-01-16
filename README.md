# GApp-Script-Slack-Birthday-Bot

![Message Preview](screenshots/message.png)

## A Google Apps Script that connects to your Google Calendar and sends birthday messages to Slack

Ensure that the description of your calendar events is the person's name.

![Calendar Event](screenshots/calevent.png)

To get started, copy and paste this script into a Google Cloud Apps Script project at [Google Apps Script](https://script.google.com).

You will need to replace `WEBHOOK_URL` and `CALENDAR_ID` in the script with your [Slack Webhook URL](https://slack.com/marketplace/A0F7XDUAZ) and your Google Calendar's [Calendar ID](https://docs.simplecalendar.io/find-google-calendar-id/) respectively. You can also adjust the `minInAdvance` variable to change how many minutes before an event it will appear—by default, this is set to 1 minute.

Next, enable the Calendar API in the Apps Script by navigating to **Services** on the left-hand side. Click the + button, search for the **Calendar API**, and enable it. Version 3 of the Calendar API will work perfectly.

Next, set up a trigger to run the `postEventsToChannel`` function every minute by navigating to Triggers in the Apps Script interface. Click the + Add Trigger button, select postEventsToChannel from the dropdown, and set it to run every minute.

![Trigger Setup](screenshots/trigger.png)

With everything set up, you’ll see upcoming events (starting within the next minute) posted as an embed in the Slack channel connected to your webhook.