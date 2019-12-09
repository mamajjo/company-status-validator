const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const API_BASE_URL = "https://wl-api.mf.gov.pl/api/search/";

const NIP_SERVICE = "nip/";
const BA_SERVICE = "bank-account/";
let i =0;

const getRequestBody = (numberType, number) => {
    let path;
    let params;
    let date = new Date();
    date = date.toISOString().slice(0, 10);
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
function sleeper(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports = {
    getStatusByNIP: (nip) => {
        let params = getRequestBody("NIP", nip);
        console.log(params)
        try {
            fetch(params, {
                method: 'GET'
            })
                .then(res => res.json())
                .then(json => {
                    i++;
                    console.log(i,json);
                });
        } catch (e) {
            return "error with api"
            console.log("error", e);
        }
    }
}