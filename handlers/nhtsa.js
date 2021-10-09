const axios = require('axios');

const baseUrl = 'https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/';

/**
 * getNhtsaData gets the make, model, year, VIN & fuels for a specific VIN number
 *
 * @param params An object containing the five parameters to look for
 * @param params.make A string containing the make of the car
 * @param params.model A string containing the model of the car
 * @param params.year A string containing the year of the car
 * @param params.vin A string containing the VIN of the car
 * @param params.fuels An objecet containing the fuels for the car
 * @param params.fuels.primary A string containing the primary fuel for the car
 * @param params.fuels.secondary A string containing the secondary fuel for the car
 *
 * @returns An object containing the same structure of the entered parameters,
 * which are fetched from NHTSA's API. Will return `null` if either any of the
 * parameters is empty or the request to NHTSA's API fails.
 */
module.exports.getNhtsaData = async (params) => {
	const make = params?.make;
	const model = params?.model;
	const year = params?.year;
	const vin = params?.vin;
	const fuels = params?.fuels;
	if (!make || !model || !year || !vin || !fuels) return null;
	const requestUrl = baseUrl + `${vin}?format=json`;

	try {
		const nhtsaResponse = await axios.get(requestUrl);
		const { Results } = await nhtsaResponse?.data;
		const { Make, Model, ModelYear, VIN, FuelTypePrimary, FuelTypeSecondary } = Results[0];

		return {
			make: Make,
			model: Model,
			year: ModelYear,
			vin: VIN,
			fuels: { primary: FuelTypePrimary, secondary: FuelTypeSecondary },
		};
	} catch (err) {
		console.error(err);
	}

	return null;
};
