require('dotenv').config();
const { WebClient } = require('@slack/web-api');

const client = new WebClient(process.env.SLACK_CARMEN_BOT_TOKEN);

/**
 * postMessage posts a message to the `#ask-carmen` Slack channel or any channel
 * via a provided Channel ID
 *
 * @param message The message body. Can contain plain text or an array with Slack's `blocks` structure
 * @param channel The desired channel ID to which the bot will respond. By default, the `#ask-carmen` channel.
 */
exports.postMessage = async (message, channel = 'C02H0L2RTRC') => {
	try {
		const postMessageBody = {
			token: process.env.SLACK_CARMEN_BOT_TOKEN,
			channel,
		};

		if (typeof message !== 'string') {
			postMessageBody.text = message[0].text.text;
			postMessageBody.blocks = message;
		} else postMessageBody.text = message;

		await client.chat.postMessage(postMessageBody);
	} catch (error) {
		console.error(error);
	}
};
