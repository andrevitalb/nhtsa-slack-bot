# CarMen

CarMen is a Slack Bot that works with [NHTSA's API](https://vpic.nhtsa.dot.gov/api/) to provide information related to vehicles directly to a Slack channel.

## Basic structure

The application was fully developed using [Node.js](https://nodejs.org/en/), along with the [Express](https://expressjs.com/) framework.

It also makes use of [Slack's Web API](https://api.slack.com/web) to fetch & post messages.

The application is hosted & deployed to a [Heroku instance](https://www.heroku.com/), which is accessible through [this](https://nhtsa-slack-bot.herokuapp.com/) endpoint, although all the bot's logic is accessed through the `/slack/events` as per Slack Docs.

## About the application

Currently, this application isn't publicly distributed. It's only available inside my own workspace. There are currently no plans to distribute it.

## Using the application

To interact with the application send a message to the `#ask-carmen` channel, tagging **@CarMen** and adding all 5 parameters (VIN, make, model, year and fuels) inside of the message, starting with the parameter name, followed by a colon and the value. All parameters have to be separated by a dot:

E.g.:

```
@CarMen Vin: 5UXWX7C5*BA. Make: BMW. Model: X3. Year: 2011. Fuels: Gasoline
```

In case of having two fuels, values for both `FuelTypePrimary` and `FuelTypeSecondary` must be entered separated by a comma:

```
@CarMen Vin: 5UXWX7C5*BA. Make: BMW. Model: X3. Year: 2011. Fuels: Gasoline, Diesel
```

If the inputted values match those of NHTSA's API, the bot will respond with a formatted message containing the vehicles data.

<p align="center">
	<img src="https://www.andrevital.com/extra/nhtsa-slack-bot/response.png" width="45%">
</p>
