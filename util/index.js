const paramNames = ['vin', 'make', 'model', 'year', 'fuels'];

/**
 * parseMessageParams parses the required parameters from a text input, returning said parameters
 * in a defined structure
 *
 * @param messageInput The request message text
 * @returns an object of the structured parameters from the text input or `null` if any parameter
 * is missing
 */
exports.parseMessageParams = (messageInput) => {
	const baseFragments = messageInput?.toLowerCase()?.trim()?.split('.');
	if (baseFragments?.length !== 5) return null;

	const fragments = {};
	paramNames.forEach(
		(name) =>
			(fragments[name] = baseFragments
				.find((fragment) => fragment.indexOf(`${name}: `) !== -1)
				.split(`${name}: `)[1]
				.trim())
	);

	const fuels = fragments.fuels.split(',');
	return { ...fragments, fuels: { primary: fuels[0], secondary: fuels[1] ?? '' } };
};

/**
 * verifyParams checks for equality of the two input parameter objects
 *
 * @param messageParams The object of the user's inputted parameters
 * @param nhtsaParams The object of the parameters returned from the NHTSA API call
 * @returns a string of the first parameter that is different between both objects
 */
exports.verifyParams = (messageParams, nhtsaParams) =>
	paramNames.find((name) => {
		if (name === 'fuels') {
			return ['primary', 'secondary'].find(
				(fuelName) =>
					messageParams[name][fuelName] !== nhtsaParams[name][fuelName].toLowerCase()
			);
		}
		return messageParams[name] !== nhtsaParams[name].toLowerCase();
	});

/**
 * formatBlockMessage formats parameters into a [Slack's block message structure](https://api.slack.com/block-kit)
 *
 * @param user A string containing the user id to be tagged in the reponse
 * @param data The object of the parameters returned from the NHTSA API call
 *
 * @see getNhtsaData for a detailed list of the parameters
 *
 * @returns an array of objects with a structured [Slack's block message](https://api.slack.com/block-kit)
 */
exports.formatBlockMessage = (user, data) => {
	const { make, model, year, vin, fuels } = data;
	return [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `<@${user}>, here's that vehicle's information:`,
			},
		},
		{
			type: 'section',
			fields: [
				{
					type: 'mrkdwn',
					text: `*Make:*\n${make}`,
				},
				{
					type: 'mrkdwn',
					text: `*Model:*\n${model}`,
				},
				{
					type: 'mrkdwn',
					text: `*Year:*\n${year}`,
				},
				{
					type: 'mrkdwn',
					text: `*VIN:*\n${vin}`,
				},
				{
					type: 'mrkdwn',
					text: `*Fuel types:*\n\t- *Primary*: ${fuels.primary}${
						fuels.secondary !== '' ? `- *Secondary: ${fuels.secondary}` : ''
					}`,
				},
			],
		},
	];
};
