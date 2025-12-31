const TOPICS = ["Pizza", "Vulkan", "Astronaut", "Pinguin", "Dschungel", "Krankenhaus", "Hogwarts", "Tesla", "Weihnachten", "Konzert", "Pirat", "Fußball", "Hexe", "Supermarkt", "Eiscreme", "Sahara", "Geisterhaus", "Sushi", "Polizei", "Vampir", "TikTok", "Oper", "Zirkus", "Spaghetti", "Bibliothek", "Minecraft", "Dracula", "Strand", "U-Boot", "Star Wars", "Dinosaurier", "König", "Zauberer", "Berlin", "Safari", "Instagram", "Mumie", "Schule", "Alien", "Schloss", "Netflix", "Taxi", "Regenbogen", "Känguru", "Western", "Skateboard", "Magier", "Detektiv", "Weihnachten", "Kleopatra", "Pharao", "Banküberfall", "Karneval", "Dschungelcamp", "Ufo", "Ballett", "Formel 1", "Nordpol", "Hawaii", "Lagerfeuer", "Aquarium", "Rapper", "Zoo", "Hollywood", "Hexenkessel", "London", "Computer", "TikTok-Tanz", "Wikinger", "Tiefsee", "Westernstadt", "Raumstation", "Theater", "Planet", "K-Pop", "Geisterbahn", "Auto", "Ritter", "Olympiade", "WhatsApp", "Museum", "Cowboy", "Vulkaninsel", "DJ", "Bank", "Flughafen", "Höhle", "Horrorfilm", "Detektivbüro", "Freizeitpark", "Fabrik", "Schneemann", "Löwe", "Schatzinsel", "Matrose", "Tropen", "Rakete", "Monster", "Zaubertrank", "Künstler", "Fernsehen"]
let numbersplayers = undefined
let wordArr = undefined
let timesClicked = 0
document.getElementById("ingame").style.visibility = "hidden"

function findARadnWord(){
    let word = TOPICS[Math.floor(Math.random() * (TOPICS.length - 0 + 1) + 0)]
    return word
}
function generateArrayBasedOnPlayerCount(numbersplayers){
    let word = findARadnWord()
    let words = [];
    for (let i = 0; numbersplayers > i; i++){
        words.push(word)
    }
    console.log(words)
    words[Math.floor(Math.random() * (numbersplayers - 0) + 0)] = "imposter"
    for (let i = 0; numbersplayers * 2 >= i; i = i + 2){
        words.splice(i, 0 , "Click to the topic")
    }
    return words
}
function playerNumbers(){
    numbersplayers = parseInt(document.getElementById("numPlayers").value);
    wordArr = generateArrayBasedOnPlayerCount(numbersplayers);
    document.getElementById("ingame").style.visibility = "visible"
}
function main() {
    if (timesClicked < numbersplayers * 2 ){
        document.getElementById("topicsOutput").innerHTML = wordArr[timesClicked]
        console.log(wordArr[timesClicked])

    }
    else {
        document.getElementById("topicsOutput").innerHTML = "All roles assinged :^)"
    }
    timesClicked++
}