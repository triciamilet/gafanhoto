const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

//Items array
const items = [
    { name: "pobre", image: "../imagens/1pobre.svg" },
    { name: "fome", image: "../imagens/2fome.svg" },
    { name: "saude", image: "../imagens/3saude.svg" },
    { name: "educacao", image: "../imagens/4educacao.svg" },
    { name: "genero", image: "../imagens/5genero.svg" },
    { name: "agua", image: "../imagens/6agua.svg" },
    { name: "energia", image: "../imagens/7energia.svg" },
    { name: "trabalho", image: "../imagens/8trabalho.svg" },
    { name: "industria", image: "../imagens/9industria.svg" },
    { name: "desigualdade", image: "../imagens/10desigualdade.svg" },
    { name: "cidade", image: "../imagens/11cidade.svg" },
    { name: "consumo", image: "../imagens/12consumo.svg" },
    { name: "clima", image: "../imagens/13clima.svg" },
    { name: "mar", image: "../imagens/14mar.svg" },
    { name: "terra", image: "../imagens/15terra.svg" },
    { name: "paz", image: "../imagens/16paz.svg" },
    { name: "parceria", image: "../imagens/17parceria.svg" },
    
];

let seconds = 0,
    minutes = 0;
let movesCount = 0,
    winCount = 0;

//Tempo
const timeGenerator = () => {
    seconds += 1;
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Tempo: </span>${minutesValue}:${secondsValue}`;
};

const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Movimentos: </span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = (size = 4) => {
    let tempArray = [...items];
    let cardValues = [];
    size = (size * size) / 2;
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        //once selected
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {

        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before"><img src="../imagens/18verso.svg" class="image"/></div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
        </div>
        `;
    }

    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Cartas
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            if (!card.classList.contains("matched")) {
                card.classList.add("flipped");
                if (!firstCard) {
                    firstCard = card;
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        firstCard = false;
                        winCount += 1;
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>Parabéns, você venceu!</h2>
                            <h4>Movimentos: ${movesCount}</h4>`;
                            stopGame();
                            }
                        } else {
                            let [tempFirst, tempSecond] = [firstCard, secondCard];
                            firstCard = false;
                            secondCard = false;
                            let delay = setTimeout(() => {
                                tempFirst.classList.remove("flipped");
                                tempSecond.classList.remove("flipped");
                            }, 900);
                        }
                    }
                }
        });
    });
};

    //Start game
    startButton.addEventListener("click", () => {
        movesCount = 0;
        seconds = 0;
        minutes = 0;
        controls.classList.add("hide");
        stopButton.classList.remove("hide");
        startButton.classList.add("hide");
        interval = setInterval(timeGenerator, 1000);
        moves.innerHTML = `<span>Movimentos:</span> ${movesCount}`;
        initializer();
    });

    //Stop game
    stopButton.addEventListener("click", (stopGame = () => {
        controls.classList.remove("hide");
        stopButton.classList.add("hide");
        startButton.classList.remove("hide");
        clearInterval(interval);
        })
    );

    const initializer = () => {
        result.innerText = "";
        winCount = 0;
        let cardValues = generateRandom();
        console.log(cardValues);
        matrixGenerator(cardValues);
    };