let audioCtx, element, sourceNode, gainNode;
let gain = 1;

function setupAudio() {
    // 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // 2 - this creates an <audio> element
    element = document.querySelector("#mainAudio");


    // 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);
    gainNode = audioCtx.createGain();
    gainNode.gain.value = gain;
    sourceNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);
}

function setVolume(value) {
    value = Number(value);
    gain = value;
    if(gainNode)
        gainNode.gain.value = value;
}

function audioLoaded()
{
    if(audioCtx)
        return true;
    else
        return false;
}