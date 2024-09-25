const blackCloverOps = ["URwMxNidO-8", "1YRBgrcaHdw", "6edby9ExKOE", "LnATgmx7tGo"]

let songs = {};
let keys = [];

let key;
let round = 0;
let maxRounds;
let animeLeft = [];
let mainAudio;
let mainButton, answer, dropbox, songCount, roundCount;
let volumeLabel;
let mainButtonState = "start";
window.onload = _ => {
    mainButton = document.querySelector("#play");
    answer = document.querySelector("#answer");
    songCount = document.querySelector("#songCount");
    roundCount = document.querySelector("#roundCount");
    mainAudio = document.querySelector("#mainAudio");
    /*mainButton.onclick = e =>{}*/
    
    document.addEventListener("keydown", function(event) {
        if (event.code === "Space") 
        {
            if(mainButtonState=="off"){StartNextRound()}
            else if(mainButtonState=="on"){RevealRound()}
            else if(mainButtonState=="start"){StartGame()}
        }
    });

    /*document.querySelector("#fileUpload").onchange = onDrop;*/

    volumeLabel = document.querySelector("#volumeLabel");
    document.querySelector("#volumeSlider").oninput = e => {
        setVolume(e.target.value);
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    }
    //setupAudio();
}

function StartGame()
{
    if(keys.length > 0)
        {
            //Set up begining stuff
            maxRounds = keys.length;
            animeLeft = [];
            for(let i = 0; i < keys.length; i++)
            {
                animeLeft.push(keys[i]);
            }
            round = 1;

            if(!audioLoaded())
                setupAudio();

            roundCount.innerHTML = "Round: " + round;
            mainButtonState = "null";
            answer.innerHTML = "Starting...";
            mainButton.innerHTML = "5";
            setTimeout(()=>mainButton.innerHTML = "4", 1000);
            setTimeout(()=>mainButton.innerHTML = "3", 2000);
            setTimeout(()=>mainButton.innerHTML = "2", 3000);
            setTimeout(()=>mainButton.innerHTML = "1", 4000);
            setTimeout(nextSong, 5000);
        }
}

function StartNextRound()
{
    round++;
    roundCount.innerHTML = "Round: " + round;
    mainButtonState = "null";
    answer.innerHTML = "Starting...";
    mainButton.innerHTML = "5";
    setTimeout(()=>mainButton.innerHTML = "4", 1000);
    setTimeout(()=>mainButton.innerHTML = "3", 2000);
    setTimeout(()=>mainButton.innerHTML = "2", 3000);
    setTimeout(()=>mainButton.innerHTML = "1", 4000);
    setTimeout(nextSong, 5000);
}

function RevealRound()
{
    mainAudio.pause();
    mainButton.innerHTML = "Play Next";
    mainButtonState = "off";
    answer.innerHTML = key;
    if(round >= maxRounds)
    {
        mainButton.innerHTML = "Play again?";
        roundCount.innerHTML = "Game Over!";
        mainButtonState = "start";
    }
}


function nextSong()
{
    let animeNum = getRandomInt(0, animeLeft.length);
    key = animeLeft[animeNum];
    let song = songs[key][getRandomInt(0, songs[key].length)];
    animeLeft.splice(animeNum, 1);

    mainAudio.src = song.file;
    mainAudio.play();
    mainButton.innerHTML = "Reveal";
    mainButtonState = "on";
    answer.innerHTML = "???";
}
  
  function onDrop(e)
  {
    let file = e.target.files[0];
    if(file){
      let reader = new FileReader();
      reader.onload = dataLoaded;
      reader.readAsText(file);
      //reader.readAsArrayBuffer(file);
    }
  }

  function dataLoaded(e)
  {
    //let s = e.target.result;
    //let view = new Uint8Array(s);
    let cs = e.target.result;
    cs = cs.replace(/\r?\n|\r/g, '');
    cs = cs.replace(/[^\w\ \-{},.+\][:;_/\\"]/gi, '')
    //for (var x = 0; x < view.length; x++){
    //    //console.log(view[x]);
    //    //console.log(parseInt(s[x], 16).toString(10));
    //    cs += String.fromCharCode(view[x]);
    //}
    console.log(cs);
    let data = JSON.parse(cs);
    //Clear old values
    keys = data.keys;
    songs = data.songs;
    songCount.innerHTML = "Anime Loaded: " + keys.length;
}

function getIdFromURL(url)
{
    let id=0;
    if(url.indexOf("&") == -1)
    {
        id = url.substring(url.indexOf("v=") + 2);
    }
    else
    {
        id = url.substring(url.indexOf("v=") + 2, url.indexOf("&"));
    }
    return id;
}