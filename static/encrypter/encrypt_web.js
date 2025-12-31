// let alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
let letter = null;
let unicodeLetter = null;

import { deutscheWoerter } from './deutscheWoerterDatenbank.js?version=1';

console.log(deutscheWoerter)

export function encrypt(text){
    let shift = parseInt(document.getElementById("shift").value)
    let encryptedLetter = null
    let encryptedText = ""
    for (let position = 0; position < text.length; position++) {
        // sliced den text und verändert den buchstaben
        letter = text.slice(position, position + 1);
        unicodeLetter = letter.charCodeAt(0);
        if (unicodeLetter >= 65 && unicodeLetter < 97) {
            encryptedLetter = String.fromCharCode(((unicodeLetter - 65 + shift) % 26) + 65);
        } else if (unicodeLetter >= 97 && unicodeLetter <= 122) {
            encryptedLetter = String.fromCharCode(((unicodeLetter - 97 + shift) % 26) + 97);
        } else {
            encryptedLetter = letter;
        }
        // zum Text geadded
        console.log(encryptedLetter)
        encryptedText += encryptedLetter;
    }
    return encryptedText;
}

export function decrypt(text, shift){
    let decryptedLetter = null
    let decryptedText = ""
    for (let position = 0; position < text.length; position++){
        letter = text.slice(position, position + 1)
        unicodeLetter = letter.charCodeAt(0);
        if (unicodeLetter >= 65 && unicodeLetter <= 90) {
            decryptedLetter = String.fromCharCode(((unicodeLetter - 65 - shift + 26) % 26) + 65);
        } 
        else if (unicodeLetter >= 97 && unicodeLetter <= 122) {
            decryptedLetter = String.fromCharCode(((unicodeLetter - 97 - shift + 26) % 26) + 97);
        } 
        else {
            decryptedLetter = letter
    }
    decryptedText += decryptedLetter
    }
    return decryptedText;
}


export function decryptStart(){
    let text = document.getElementById("decrypt").value
    let decryptedText = undefined
    // für Matching Wórd
    let longestWord = []
    let matchingWords = []
    let matchingWord = []
    // 
    let decryptedTexts = []
    for (let shift = 0; shift <= 26; shift++){
        decryptedText = decrypt(text, shift)
        // console.log(decryptedText, shift)
        decryptedTexts.push(decryptedText)
        matchingWord = deutscheWoerter.filter((word) => decryptedText.includes(word));
        if (matchingWord != undefined && matchingWord.length > 0){
            matchingWords.push(matchingWord + ", " + shift)
            console.log(matchingWords)
        }
        // else {
        //     document.getElementById('output_decrypt').textContent = `${decryptedText}`
        // }
    }
    longestWord = matchingWords.sort((a, b) => b.length - a.length)[0];
    if (matchingWords.length > 0){
        document.getElementById('output_decrypt').textContent = `Match found with shift ${longestWord[longestWord.length - 1]}: \n"${decryptedTexts[longestWord[longestWord.length - 1]]}" \n contains the word/s \n"${longestWord.replace(/,\s*\d+$/, '')}"`;
        document.getElementById('output_decrypt_all').textContent = `${decryptedTexts}`
    }
    else {
        document.getElementById('output_decrypt').textContent = `Text konnte der Datenbank nicht zugeordnet werden, das sind die decrypteten Texte: ${decryptedTexts}`
    }
}



export function encryptStart(){
    let text = document.getElementById("encrypt").value
    let encryptedText = encrypt(text)
    document.getElementById('output_encrypt').textContent = `${encryptedText}`;
}



window.decryptStart = decryptStart;
window.encryptStart = encryptStart;






// Aufgaben
// soll nur das mit den meisten vorkomnissen anzeigen hat funktionier bis ich dieses longestWOrd da eingefügt habe
// longest wort selber schreiben weil chagtp scheiße
// neue for schleife

// HABS GEFIXT IN DEM  ICH MATCHINGWORD IN DER FOR SCHLEIFE DER FUNKTION GESCHRIEBEN HABE SO HALB AUF JEDEN FALL CONSOLE.LOG IST NOCH SCHWER
// nur das letzte console.log fixen das nur das mit den meisten ausgegeb wird
// hat kurz geklappt weiß aber nicht mehr wie
// eigentlich muss shift und decrypted text immer gespeichert werden zu was das gehört

// Funktioniert
