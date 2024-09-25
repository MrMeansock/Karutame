function startGame() 
{
    newRound();
}

function newRound()
{
    NewCharacter();
    console.log("New Round");
    swapGameContent(true);
    
}

function waitForSeconds(seconds)
{
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function swapGameContent(EnableTimer)
{
    if (EnableTimer)
    {
        const cardSection = document.getElementById("cardSection");
        if (cardSection) { cardSection.style.display = "none";}

        const timer = document.getElementById("timerContainer");
        if (timer) { timer.style.display = "flex";}
    }
}

function NewCharacter()
{
    console.log("Getting new baddie");
}