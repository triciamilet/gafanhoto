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
    { name: "coelho", image: "../imagens/coelho.png" },
    { name: "elefante", image: "../imagens/elefante.png" },
    { name: "polvo", image: "../imagens/polvo.png" },
    { name: "crocodilo", image: "../imagens/crocodilo.png" },
    { name: "camaleao", image: "../imagens/camaleao.png" },
    { name: "ra", image: "../imagens/ra.png" },
    { name: "caranguejo", image: "../imagens/caranguejo.png" },
    { name: "flamingo", image: "../imagens/flamingo.png" },
    { name: "peixe-palhaco", image: "../imagens/peixe-palhaco.png" },
    { name: "tigre", image: "../imagens/tigre.png" },
    { name: "morsa", image: "../imagens/morsa.png" },
    { name: "panda", image: "../imagens/panda.png" },
    
];

//Initial Time
let seconds = 0,
    minutes = 0;
//Initial moves and win count
let movesCount = 0,
    winCount = 0;

//For timer
const timeGenerator = () => {
    seconds += 1;
    //minutes logic
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }
    //format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Tempo:</span>${minutesValue}:${secondsValue}`;
};

//For calculating moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Movimentos:</span>${movesCount}`;
};

//Pick random objects from the items array
const generateRandom = (size = 4) => {
    //temporary array
    let tempArray = [...items];
    //initializes cardValues array
    let cardValues = [];
    //size should be double (4*4 matrix)/2 since pairs of objects would exist
    size = (size * size) / 2;
    //Random object selection
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
    //simple shuffle
    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
        /*
        Create Cards
        before => front side (botar carta de costas)
        after => back side (imagens da ODS)
        data-card-values is a custom attribute which stores
        the names of the cards to match later
        */
        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <imagens src="${cardValues[i].image}" class="image"/></div>
        </div>
        `;
    }

    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            //If selected card is not matched yet then only rn (i.e already matched card when clicked would be ignored)
            if (!card.classList.contains("matched")) {
                //flip the clicked card
                card.classList.add("flipped");
                //se for a primeira carta
                if (!firstCard) {
                    //current card vai ser tornar a primeira carta
                    firstCard = card;
                    //cards value pipipopo
                    firstCardValue = card.getAttribute("data-card-value");
                } else {
                    //amentar +1 na qntd de moves
                    movesCounter();
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue) {
                        //se for a msm carta, match
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        //recomeçar
                        firstCard = false;
                        //winCount incrementa
                        winCount += 1;
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>Parabéns, você venceu!</h2>
                            <h4>Movimentos: ${movesCount}</h4>`;
                            stopGame();
                            }
                        } else {
                            //flip back
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
        //botao visibilidade
        controls.classList.add("hide");
        stopButton.classList.remove("hide");
        startButton.classList.add("hide");
        //começa
        interval = setInterval(timeGenerator, 1000);
        //conta moves
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

    //Initialize values and func calls
    const initializer = () => {
        result.innerText = "";
        winCount = 0;
        let cardValues = generateRandom();
        console.log(cardValues);
        matrixGenerator(cardValues);
    };