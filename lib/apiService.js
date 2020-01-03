const fetch = require("node-fetch");
const {
	format,
	createLogger,
	transports
} = require("winston");
const {
	combine,
	timestamp,
	label,
	printf,
	prettyPrint
} = format;
const {
	URLSearchParams
} = require("url");

const logger = createLogger({
	level: 'info',
	format: combine(
		timestamp({
			format: 'DD-MM-YYYY HH:mm:ss'
		}),
		prettyPrint(),
	),
	transports: [
		new transports.File({
			filename: 'history.log',
			format: format.json(),
		})
	]
})
const API_BASE_URL = "https://wl-api.mf.gov.pl/api/search/";

const NIP_SERVICE = "nip/";
const BA_SERVICE = "bank-account/";

function getStatusByNIP(nip) {
	let params = getRequestBody("NIP", nip);
	return fetch(params, {
			method: "GET"
		})
		.then(res => res.json())
		.then(json => {
			if (JSON.stringify(json) == '{"code":"HTTP-503","message":"Usługa niedostępna"}') {
				return getStatusByNIP(nip);

			} else if (JSON.stringify(json).includes('"subject":null')) {
				logger.log({
					level: 'error',
					message: "Nieznany błąd przy sprawdzaniu nipu: " + nip
				})
				return {
					message: "Nieznany błąd przy sprawdzaniu nipu: " + nip
				}
			} else if (json.code == "WL-115") {
				logger.log({
					level: 'error',
					message: json.message
				});
				return {
					message: json.result.subject.message || ""
				}
			} else if (json.code == "WL-113") {
				logger.log({
					level: 'error',
					message: json.message
				});
				return {
					message: json.result.subject.message || ""
				}
			} else {
				logger.log({
					level: 'info',
					message: json.result.subject.name + " " + json.result.subject.nip + " " + json.result.subject.statusVat.toString() + " " + json.result.requestId.toString()
				})
				return {
					name: json.result.subject.name,
					nipID: json.result.subject.nip,
					baID: json.result.subject.accountNumbers[0],
					statusVat: json.result.subject.statusVat,
					message: json.result.subject.message || "",
					requestID: json.result.requestId,
					address: json.result.subject.workingAddress
				}
			}
		});
}

function getStatusByBA(ba) {
	let params = getRequestBody("BA", ba);
	return fetch(params, {
			method: "GET"
		})
		.then(res => res.json())
		.then(json => {
			if (JSON.stringify(json) == '{"code":"HTTP-503","message":"Usługa niedostępna"}') {
				return getStatusByBA(ba);
			} else if (JSON.stringify(json).includes('"subject":null')) {
				logger.log({
					level: 'error',
					message: "Nieznany błąd przy sprawdzaniu numeru konta bankowego: " + ba
				})
				return {
					message: "Nieznany błąd przy sprawdzaniu numeru konta bankowego: " + ba
				}
			} else if (json.code == "WL-109") {
				logger.log({
					level: 'error',
					message: json.message
				});
				return {
					message: json.result.subject.message || ""
				}
			} else {
				logger.log({
					level: 'info',
					message: json.result.subjects[0].name + " " + json.result.subjects[0].nip + " " + json.result.subjects[0].accountNumbers.filter(number => number == ba.toString())[0] + " " + json.result.subjects[0].statusVat.toString() + " " + json.result.requestId.toString(),
				})
				return {
					name: json.result.subjects[0].name,
					baID: json.result.subjects[0].accountNumbers.filter(number => number == ba)[0],
					nipID: json.result.subjects[0].nip,
					statusVat: json.result.subjects[0].statusVat,
					message: json.result.subjects[0].message || "",
					requestID: json.result.requestId,
					address: json.result.subjects[0].workingAddress
				}
			}
		});
}

const getRequestBody = (numberType, number) => {
	let path;
	let params;
	let date = new Date();
	date = date.toISOString().slice(0, 10);
	if (numberType == "NIP") {
		path = API_BASE_URL + NIP_SERVICE + number.toString() + "?";
		path = path + "date=" + date;
		return path;
	} else if (numberType == "BA") {
		// BA for bankAccount
		path = API_BASE_URL + BA_SERVICE + number.toString() + "?";
		path = path + "date=" + date;
		return path;
	} else {
		return "error";
	}
};

function sleeper(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
	getStatusByNIP: nip => {
		let params = getRequestBody("NIP", nip);
		console.log(params);
		return fetch(params, {
				method: "GET"
			})
			.then(res => res.json())
			.then(json => {
				if (
					JSON.stringify(json) == '{"code":"HTTP-503","message":"Usługa niedostępna"}' ||
					JSON.stringify(json).includes("null")
				) {
					return getStatusByNIP(nip);
				} else if (json.code == "WL-115") {
					logger.log({
						level: 'error',
						message: json.message
					});
					return {
						message: json.result.subject.message || ""
					}
				} else if (json.code == "WL-113") {
					logger.log({
						level: 'error',
						message: json.message
					});
					return {
						message: json.result.subject.message || ""
					}
				} else {
					logger.log({
						level: 'info',
						message: json.result.subject.name + " " + json.result.subject.nip + " " + json.result.subject.statusVat.toString() + " " + json.result.requestId.toString()
					})
					return {
						name: json.result.subject.name,
						nipID: json.result.subject.nip,
						baID: json.result.subject.accountNumbers[0],
						statusVat: json.result.subject.statusVat,
						message: json.result.subject.message || "",
						requestID: json.result.requestId,
						address: json.result.subject.workingAddress
					}
				}
			});
	},
	getStatusByBA: ba => {
		let params = getRequestBody("BA", ba);
		return fetch(params, {
			method: "GET"
		})
		.then(res => res.json())
		.then(json => {
			if (JSON.stringify(json) == '{"code":"HTTP-503","message":"Usługa niedostępna"}') {
				return getStatusByBA(ba);
			} else if (JSON.stringify(json).includes('"subject":null')) {
				logger.log({
					level: 'error',
					message: "Nieznany błąd przy sprawdzaniu numeru konta bankowego: " + ba
				})
				return {
					message: "Nieznany błąd przy sprawdzaniu numeru konta bankowego: " + ba
				}
			} else if (json.code == "WL-109") {
				logger.log({
					level: 'error',
					message: json.message
				});
				return {
					message: json.result.subject.message || ""
				}
			} else {
				logger.log({
					level: 'info',
					message: json.result.subjects[0].name + " " + json.result.subjects[0].nip + " " + json.result.subjects[0].accountNumbers.filter(number => number == ba)[0] + " " + json.result.subjects[0].statusVat.toString() + " " + json.result.requestId.toString(),
				})
				return {
					name: json.result.subjects[0].name,
					baID: json.result.subjects[0].accountNumbers.filter(number => number == ba)[0],
					nipID: json.result.subjects[0].nip,
					statusVat: json.result.subjects[0].statusVat,
					message: json.result.subjects[0].message || "",
					requestID: json.result.requestId,
					address: json.result.subjects[0].workingAddress
				}
			}
		});
	}
};