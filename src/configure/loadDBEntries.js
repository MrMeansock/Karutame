var deckInter = 1;

function deckClicked(deckElement) {
    var deck = deckElement.target;
    while (!deck.classList.contains("listedDeck")) {
        deck = deck.parentElement;
    }
    selectDeck(deck);
}

function selectDeck(deck) {
    console.log(deck)
    selectedHeader.innerText = deck.innerText;
    deckInter = 1;
    apiRequest(`decks/${deck.id}`, "GET").then((result) => {
        result.forEach(createCardSong);
    });
}

function createCardSong(cardSong) {
    var newSong = document.createElement('tr');
    newSong.classList.add('song');
    newSong.innerHTML = `<td>${deckInter++}</td>
                        <td>${cardSong.song.name}</td>
                        <td>${cardSong.card.name}</td>
                        `;
    songList.append(newSong);
}

function loadDecks() {
    apiRequest("decks", "GET").then((result) => {
        result.forEach(createDeck);
        selectDeck(deckList.children[0]);
    });
};

function createDeck(deck) {
    var newDeck = document.createElement('div');
    newDeck.classList.add("listedDeck");
    newDeck.id = deck.uuid;
    var imgLink = "../images/Decks/TempDeckImg.png";
    if (deck.img != null && deck.img != "") {
        imgLink = deck.img
    }
    newDeck.innerHTML = `
                <div class="deckImage">
                    <img src="${imgLink}" alt="">
                </div>
                <div class="deckDetails">
                    <span>${deck.name}</span>
                </div>`;

    newDeck.onclick = deckClicked;
    deckList.append(newDeck);
}


window.onload = (event) => {
    const deckList = document.getElementById("deckList");
    const selectedHeader = document.getElementById("selectedHeader");
    loadDecks();
};