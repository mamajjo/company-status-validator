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
	try {
		fetch(params, {
				method: "GET"
			})
			.then(res => res.json())
			.then(json => {
				if (JSON.stringify(json) == '{"code":"HTTP-503","message":"Usługa niedostępna"}') {
					getStatusByNIP(nip);
				} else if (JSON.stringify(json).includes('"subject":null')) {
					console.log("Nieznany błąd przy sprawdzaniu nipu: ", nip);
					logger.log({
						level: 'error',
						message: "Nieznany błąd przy sprawdzaniu nipu: " + nip
					})
				} else {
					console.log(json.result.subject.name, json.result.subject.nip);
					console.log(
						"\x1b[32m%s\x1b[0m",
						json.result.subject.statusVat.toString()
					);
					logger.log({
						level: 'info',
						message: json.result.subject.name + " " + json.result.subject.nip + " " + json.result.subject.statusVat.toString()
					})
				}
			});
	} catch (e) {
		console.log("error", e);
		return "error with api";
	}
}

function getStatusByBA(ba) {
	let params = getRequestBody("BA", ba);
	try {
		fetch(params, {
				method: "GET"
			})
			.then(res => res.json())
			.then(json => {
				if (JSON.stringify(json) == '{"code":"HTTP-503","message":"Usługa niedostępna"}' || JSON.stringify(json).includes('subject":null')) {
					getStatusByBA(ba);
				} else if (json.code == "WL-109") {
					console.log("\x1b[31m%s\x1b[0m", json.message);
					logger.log({
						level: 'error',
						message: json.message
					})
				} else {
					console.log(json.result.subjects[0].name, json.result.subjects[0].nip, json.result.subjects[0].accountNumbers[0]);
					console.log("\x1b[32m%s\x1b[0m", json.result.subjects[0].statusVat.toString());
					logger.log({
						level: 'info',
						message: json.result.subjects[0].name + " " + json.result.subjects[0].nip + " " + json.result.subjects[0].accountNumbers[0] + " " + json.result.subjects[0].statusVat.toString(),
					})
				}
			});
	} catch (e) {
		console.log("error", e);
		return "error with api";
	}
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
		try {
			fetch(params, {
					method: "GET"
				})
				.then(res => res.json())
				.then(json => {
					if (
						JSON.stringify(json) == '{"code":"HTTP-503","message":"Usługa niedostępna"}' ||
						JSON.stringify(json).includes("null")
					) {
						getStatusByNIP(nip);
					} else if (JSON.stringify(json).includes("WL-115")) {
						console.log("\x1b[31m%s\x1b[0m", "Nieprawidłowy NIP: ", nip);
						logger.log({
							level: 'error',
							message: 'Nieprawidłowy nip' + nip,
						})
					} else if (json.code == "WL-113") {
						console.log("\x1b[31m%s\x1b[0m", json.message);
						logger.log({
							level: 'error',
							message: json.message
						})
					} else {
						console.log(json.result.subject.name, json.result.subject.nip);
						console.log("\x1b[32m%s\x1b[0m", json.result.subject.statusVat.toString());
						logger.log({
							level: 'info',
							message: json.result.subject.name + " " + json.result.subject.nip + " " + json.result.subject.statusVat.toString()
						})
					}
				});
		} catch (e) {
			console.log("error", e);
			return "error with api";
		}
	},
	getStatusByBA: ba => {
		let params = getRequestBody("BA", ba);
		try {
			fetch(params, {
					method: "GET"
				})
				.then(res => res.json())
				.then(json => {
					if (
						JSON.stringify(json) ==
						'{"code":"HTTP-503","message":"Usługa niedostępna"}' ||
						JSON.stringify(json).includes("null")
					) {
						getStatusByBA(ba);
					} else if (json.code == "WL-109") {
						console.log("\x1b[31m%s\x1b[0m", json.message);
						logger.log({
							level: 'error',
							message: json.message
						})
					} else if (json.code == "WL-111") {
						logger.log({
							level: 'error',
							message: json.message
						})
						console.log("\x1b[31m%s\x1b[0m", json.message);
					} else {
						console.log(json);
						console.log(json.result.subjects[0].name, json.result.subjects[0].nip, json.result.subjects[0].accountNumbers[0]);
						console.log("\x1b[32m%s\x1b[0m", json.result.subjects[0].statusVat.toString());
						logger.log({
							level: 'info',
							message: json.result.subjects[0].name + " " + json.result.subjects[0].nip + " " + json.result.subjects[0].accountNumbers[0] + " " + json.result.subjects[0].statusVat.toString(),
						})
					}
				});
		} catch (e) {
			console.log("error", e);
			return "error with api";
		}
	}
};