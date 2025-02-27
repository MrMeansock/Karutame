
let round = 0;
let maxRounds = 30;
let RoundState

let characterItteration = 3;
let currentCharacterID = -1;

//name of the anime
let activeSongKey;

const TIMER_LENGTH = 3; // seconds
const NUMBER_OF_CHARACTERS = 2;

const ROUNDSTATE = {
    BEFORE_TIMER: 'BEFORE_TIMER',
    AFTER_TIMER: 'AFTER_TIMER',
    COMPLETED: 'COMPLETED',
    NULL: 'NULL'
};

window.onkeydown = function(e) {
    return !(e.keyCode == 32 && (e.target.type != 'text' && e.target.type != 'textarea'));
}

function startGame() 
{
    round = 0;
    TimerCountdown();

    document.addEventListener("keydown", function(event) {
        if (event.code === "Space" || event.type === "click") 
        {
            if(RoundState==ROUNDSTATE.BEFORE_TIMER){TimerCountdown()}
            else if(RoundState==ROUNDSTATE.AFTER_TIMER){ShowCard()}
            else if(RoundState==ROUNDSTATE.COMPLETED){StartGame()}
        }
    });
}

async function TimerCountdown() 
{
    RoundState = ROUNDSTATE.NULL;
    NewCharacter();

    swapGameContent(true);

    for (let i = 3; i > 0; i--) 
    {
        console.log(i);
        const timer = document.getElementById("gameTimer");
        if (timer) 
        {
            timer.innerText = i;
        }
        await waitForSeconds(1);
        timer.innerText = "Ready!";
    }

    RoundState = ROUNDSTATE.AFTER_TIMER;

    animeCharScale = anime({
        targets: '.animeCharacter',
        scale: [1.0, 1.1, 1.0],
        duration: 500,
        direction: 'normal',
        easing: 'easeInOutSine',
        }).play();
}

async function ShowCard()
{
    RoundState = ROUNDSTATE.NULL;

    console.log("Card up!");
    swapGameContent(false);
    round++;
    DisplayCard();
    if (round >= maxRounds) {
        RoundState = ROUNDSTATE.COMPLETED;
    } else {
        RoundState = ROUNDSTATE.BEFORE_TIMER;
    }
}

function DisplayCard()
{
    const animeNameElement = document.getElementById("animeName");
    if (animeNameElement) {
        animeNameElement.style.opacity = 0;
        animeNameElement.innerText = activeSongKey;
    }

    const cardImageElement = document.getElementById("cardImage");
    if (cardImageElement) {
        cardImageElement.style.transform = 'scale(0)';
        //cardImageElement.src = `path/to/images/${key}.jpg`;
    }


    cardAnimation = anime({
        targets: '#cardImage',
        scale: 1,
        direction: 'normal',
        duration: 2000,
        loop: false,
        easing: 'spring(1, 80, 12, 1)'
        }).play();

    const roundCounterElement = document.getElementById("roundCounter");
    if (roundCounterElement) {
        roundCounterElement.innerText = `${round}/${maxRounds}`;
    }
}

function GetNextSongInfo()
{
    let animeNum = getRandomInt(0, animeLeft.length);
    key = animeLeft[animeNum];
    let song = songs[key][getRandomInt(0, songs[key].length)];
    animeLeft.splice(animeNum, 1);
}

function waitForSeconds(seconds)
{
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function swapGameContent(EnableTimer)
{
    if (EnableTimer) {
        const cardSection = document.getElementById("cardSection");
        if (cardSection) { cardSection.style.display = "none"; }

        const timer = document.getElementById("timerContainer");
        if (timer) { timer.style.display = "flex"; }
    } else {
        const cardSection = document.getElementById("cardSection");
        if (cardSection) { cardSection.style.display = "block"; }

        const timer = document.getElementById("timerContainer");
        if (timer) { timer.style.display = "none"; }
    }
}

function NewCharacter()
{
    characterItteration++;
    if (characterItteration % 1 == 0) 
    {
        console.log("Getting new baddie");
        let newCharacterID;
        do {
            newCharacterID = Math.floor(Math.random() * NUMBER_OF_CHARACTERS);
        } while (newCharacterID === currentCharacterID);
        currentCharacterID = newCharacterID;

        const characterImageElement = document.getElementById("animeCharacter");
        if (characterImageElement) {
            characterImageElement.src = `images/characters/Character${currentCharacterID}.png`;
        } 

        const animeCharacter = document.querySelector('.animeCharacter');
        if (animeCharacter) {
            animeCharacter.style.transform = 'translateY(1000px)';
        }
        randomNumber = Math.random() * (4 - 0.2) + 0.2;
    
        animeCharacterAnimation = anime({
            targets: animeCharacter,
            translateY: 100,
            direction: 'normal',
            duration: 2000,
            loop: false,
            easing: 'spring(' + 1 * randomNumber + ', ' + 80 * randomNumber + ', ' + 12 * randomNumber + ', ' + 1 * randomNumber + ')'
            }).play();

        SetNewColorTheme(`${currentCharacterID}`);
    }
}

function SetNewColorTheme(CharacterID)
{
    let themeColor = '#808080'; // Grey color in hex
    let oldColor = document.documentElement.style.getPropertyValue('--main-character-color');
    fetch('images/characters/CharacterColors.json').then(response => response.json()).then(data => 
        {
           // stuff = JSON.parse( data );
            //console.log(stuff);
            console.log( data );
            themeColor = data.characterColors[CharacterID];
            //document.documentElement.style.setProperty('--main-character-color',  themeColor);
            lerpColor(oldColor, themeColor);
            console.log( themeColor );
        })
        .catch(error => console.error('Error loading character colors:', error));

}

async function lerpColor(oldColor, newColor, duration = 1000) {
    const oldColorRGB = hexToRgb(oldColor);
    const newColorRGB = hexToRgb(newColor);
    const steps = 60;
    const stepDuration = duration / steps;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const r = Math.round(oldColorRGB.r + t * (newColorRGB.r - oldColorRGB.r));
        const g = Math.round(oldColorRGB.g + t * (newColorRGB.g - oldColorRGB.g));
        const b = Math.round(oldColorRGB.b + t * (newColorRGB.b - oldColorRGB.b));
        const lerpedColor = `rgb(${r}, ${g}, ${b})`;

        document.documentElement.style.setProperty('--main-character-color', lerpedColor);
        await waitForSeconds(stepDuration / 1000);
    }
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}