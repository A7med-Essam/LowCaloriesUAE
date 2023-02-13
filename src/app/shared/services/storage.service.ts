import { Injectable } from '@angular/core';
declare var require: any
const SecureStorage = require("secure-web-storage");
import * as CryptoJS from 'crypto-js';
const SECRET_KEY = '6=:79.O9!1QjT&.6_AR9xMGv$,2O$bxz:yW+23I|:xhEozP)gP#Vl,CB7..((M>';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
constructor() { }
public secureStorage = new SecureStorage(localStorage, {
hash: function hash(key:any) {
    key = CryptoJS.SHA256(key);
    return key.toString();
},
// Encrypt the localstorage data
encrypt: function encrypt(data:any) {
    data = CryptoJS.AES.encrypt(data, SECRET_KEY);
    data = data.toString();
    return data;
},
// Decrypt the encrypted data
decrypt: function decrypt(data:any) {
    data = CryptoJS.AES.decrypt(data, SECRET_KEY);
    data = data.toString(CryptoJS.enc.Utf8);
    return data;
}
});
}