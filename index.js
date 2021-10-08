const express = require('express');
const app = express();

const { postMessage } = require('./handlers/slack');
const { getNhtsaData } = require('./handlers/nhtsa');
const { parseMessageParams, verifyParams, formatBlockMessage } = require('./util');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const COMMON_ERROR_MESSAGE =
	"I'm sorry, you're either missing a value or at least one of the values entered is wrong :cry:\nPlease, check your input and try again";

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.post('/slack/events', async (req) => {
	const { event } = req.body;
	const { text, type, user } = event;

	if (type === 'app_mention') {
		try {
			const params = parseMessageParams(text);
			const dataResults = await getNhtsaData(params);
			const paramCheck = verifyParams(params, dataResults);

			if (paramCheck) {
				postMessage(COMMON_ERROR_MESSAGE);
			} else {
				const messageBlock = formatBlockMessage(user, dataResults);
				postMessage(messageBlock);
			}
		} catch (err) {
			console.error(err);
			postMessage(COMMON_ERROR_MESSAGE);
		}
	}
});

app.listen(process.env.FUNCTIONS_PORT || 8000, function () {
	console.log(`Awaiting inputs... 👀`);
});
