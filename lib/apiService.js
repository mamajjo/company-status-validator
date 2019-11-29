const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const API_BASE_URL = "https://wl-api.mf.gov.pl/api/search/";

const NIP_SERVICE = "nip/";
const BA_SERVICE = "bank-account/";

export const getRequestBody = (numberType, number) => {
    let path;
    let pathWithParams;
    let date = new Date();
    date = date.toISOString().slice(0,10);
    if (numberType == "NIP") {
        path = API_BASE_URL + NIP_SERVICE + number.ToString();
        pathWithParams = new URLSearchParams(path);
        pathWithParams.append('date', date);
    } else if (numberType == "BA") { // BA for bankAccount
        path = API_BASE_URL + BA_SERVICE + number.ToString();
        pathWithParams = new URLSearchParams(path);
        pathWithParams.append('date', date);
    } else {
        return "error"; 
    }
}

// export const getStatusByNIP = (nip) => {
//     fetch(API_BASE_URL + NIP_SERVICE, {
//         method: 'GET',
//         body: ''
//     }){
//     }
// }