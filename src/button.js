document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startButton")?.addEventListener("click", setupGame);
});

function setupGame() 
{
    console.log("Game has started!");

    const startContent = document.getElementById("startPanel");
    if (startContent) { startContent.style.display = "none";}

    const deckSelectorPanel = document.getElementById("deckSelectorPanel");
    if (deckSelectorPanel) { deckSelectorPanel.style.display = "flex";}

    startGame();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("configurePageButton")?.addEventListener("click", openConfigurePage);
});

function openConfigurePage() 
{
    console.log("Opening configure page...");
    window.location.href = "configure.html";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("volumeDiv")?.addEventListener("input", changeVolume);
});

function changeVolume(event) 
{
    const newVolume = event.target.value;
    console.log("Changing volume to:", newVolume);
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#tempDeckSelectButton").forEach(button => {
        button.addEventListener("click", deckPicked);
    });
});

function deckPicked() 
{
    console.log("Deck Picked");

    const deckSelectorPanel = document.getElementById("deckSelectorPanel");
    if (deckSelectorPanel) { deckSelectorPanel.style.display = "none";}

    const startContent = document.getElementById("startContent");
    if (startContent) { startContent.style.display = "none";}

    const gameContent = document.getElementById("gameContent");
    if (gameContent) { gameContent.style.display = "flex";}
}

/* Configure stuff --------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("returnButton")?.addEventListener("click", returnToMainPage);
});

function returnToMainPage() 
{
    console.log("Returning to main page...");
    window.location.href = "index.html";
}