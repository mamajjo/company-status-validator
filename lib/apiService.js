const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const API_BASE_URL = "https://wl-api.mf.gov.pl/api/search/";

const NIP_SERVICE = "nip/";
const BA_SERVICE = "bank-account/";

const getRequestBody = (numberType, number) => {
    let path;
    let params;
    let date = new Date();
    date = date.toISOString().slice(0,10);
    if (numberType == "NIP") {
        path = API_BASE_URL + NIP_SERVICE + number.toString() + "?";
        path = path + "date=" + date;
        return path;
    } else if (numberType == "BA") { // BA for bankAccount
        path = API_BASE_URL + BA_SERVICE + number.toString() + "?";
        path = path + "date=" + date;
        return path;
    } else {
        return "error"; 
    }
}
module.exports = {
    getStatusByNIP: (nip) => {
        let params = getRequestBody("NIP", nip);
        console.log( params)
        fetch(params, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => console.log(json, json.result.subject.statusVat));
    }
}