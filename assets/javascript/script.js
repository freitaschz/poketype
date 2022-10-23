window.cookieconsent.initialise({
    "palette": {
        "popup": {
            "background": "#fff",
            "text": "#202124"
        },
        "button": {
            "background": "#E74C3C",
            "text": "#fff"
        }
    },
    "content": {
        "message": "Este site usa cookies para garantir que você obtenha a melhor experiência de navegação. Desativar os cookies do site pode prejudicar a funcionalidade de alguns recursos.",
        "dismiss": "Concordar e fechar",
        "link": "Ler mais",
        "href": "https://cookie-consent.app.forthe.top/why-websites-use-cookies/"
    }
});

const openModalButton = document.querySelector("#open-help");
const closeModalButton = document.querySelector("#close-help");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");
const toggleModal = () => {
    [modal, fade].forEach((element) => element.classList.toggle("hide"));
};
[openModalButton, closeModalButton, fade].forEach((element) => {
    element.addEventListener("click", () => toggleModal());
});

for(let i = 1; i <= 8; i++) {
    const element = document.querySelector(`#gen${i}`);
    element.addEventListener("click", function(){insertGeneration(this)}, false);
};

const btnEasyDifficulty = document.querySelector("#easy-difficulty");
const btnNormalDifficulty = document.querySelector("#normal-difficulty");
const btnHardDifficulty = document.querySelector("#hard-difficulty");
btnEasyDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
btnNormalDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
btnHardDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);

const btnPokemon = document.querySelector("#btnPokemon");
const btnReset = document.querySelector("#btnReset");
btnPokemon.addEventListener("click", pokemonGame, false);
btnReset.addEventListener("click", restartGame, false);

const btnType = document.getElementsByClassName("main-pokeguess-game-types-container-button");
for (const value of btnType) {
    value.addEventListener("click", function(){insertType(this)}, false);
};

const txtScore = document.querySelector("#txt-score");
const txtBest = document.querySelector("#txt-best");
const txtTrys = document.querySelector("#txt-trys");
const txtPokeName = document.querySelector("#txt-pokename");
const txtType = document.querySelector("#txt-type");
const txtMessage = document.querySelector("#txt-message");
const figureElement = document.querySelector("#figure");

const pokedexGenerationNumbers = {//gen 1 to 8
    start: [
            1,
            152,
            252,
            387,
            494,
            650,
            722,
            808
    ],
    end: [
        151,
        251,
        386,
        493,
        649,
        721,
        807,
        905
    ]
};

let trys, pokemonId, insertedPokemonType, pokemonName, correctPokemonFirstType, insertedPokemonTypeElement, insertedPokemonTypeAuxElement, timer, counter, bestScore, settings;
let numTrueGenButtons;
let score = 0;
let pokemonGenModified = false;
let pokemonIdTypes = [];
let gameStarted = false;
let gameEnded = false;

async function getPokemon() {
    try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        return res.data;
    } catch(error) {
        txtMessage.innerHTML = "<p>Erro ao carregar! Tente novamente.</p>";
        console.error(error);
    };
};

function includePokemonFigure(img) {
    figureElement.innerHTML = `<img alt="${pokemonName}" src="${img}">`;
};

function typeNameMask(type) {
    return type.textContent;
};

function pokemonNameFormatted(name) {
    const formatedName = (name.substring(0,1).toUpperCase())+name.substring(1, name.length);
    return formatedName;
};

function drawPokemonsOfAllGenerations() {
    let pokemons = [];
    for(let i = 0; i < 8; i++) {
        pokemons[i] = Math.floor(Math.random() * (pokedexGenerationNumbers.end[i] - pokedexGenerationNumbers.start[i] + 1) + pokedexGenerationNumbers.start[i]);
    };
    return pokemons;
};

function drawPokemonId() {
    const pokeDraws = drawPokemonsOfAllGenerations();
    if((settings.generations).length === 1) {
        pokemonId = pokeDraws[(settings.generations[0])-1];
    } else {
        const index = Math.floor(Math.random() * (settings.generations).length);
        pokemonId = pokeDraws[settings.generations[index]-1];
    };
    pokemonGenModified = false;
};

function applyValuesOfGenerationElements() {
    for (const value of settings.generations) {
        const element = document.querySelector(`#gen${value}`);
        const text = element.textContent;
        element.value = "true";
        element.innerHTML = "<i class='bx bx-checkbox-checked'></i> " + text.substring(1, text.length);
    };
};

function assignPokemonGenerations() {
    settings.generations = [];
    for (let i=0; i<8; i++) {
        const wasTheGenSelected = document.querySelector(`#gen${i+1}`).value;
        if(wasTheGenSelected === "true") {
            settings.generations.push(i+1);
        } else {
            const index = settings.generations.indexOf(i+1);
            if(index > -1) {
                settings.generations.splice(index, 1);
            };
        };
    };
    localStorage.setItem("settings", JSON.stringify(settings));
};

function insertGeneration(element) {
    const text = element.textContent;
    pokemonGenModified = true;
    txtMessage.innerHTML = "<p>A nova configuração será aplicada quando iniciar um novo jogo!</p>";
    if(element.value === "true" && numTrueGenButtons > 1) {
        element.value = "false";
        element.innerHTML = "<i class='bx bx-checkbox'></i> " + text.substring(1, text.length);
        numTrueGenButtons--;
    } else if(element.value === "false") {
        element.value = "true";
        element.innerHTML = "<i class='bx bx-checkbox-checked'></i> " + text.substring(1, text.length);
        numTrueGenButtons++;
    };
    assignPokemonGenerations();
};

function assignGameTrys() {
    if(settings.difficulty !== 2) {
        trys = 3;
    };
    txtTrys.innerHTML = trys;
};

function assignCounterToRestartGame() {
    let seconds = 3;
    counter = setInterval(() => txtMessage.innerHTML = `<p>Um novo Pokémon será sorteado em ${seconds--} segundo(s)</p>`, 800);
    setTimeout(() => {clearInterval(counter)}, 3000);
};

function assignTimerToRestartGame() {
    timer = setTimeout(restartGame, 2800);
};

function stopTimer() {
    clearTimeout(timer);
};

function comparePokemonTypes(pokemonIdTypeName) {
    for(const value of btnType) {
        let typeName = value.value;
        if(typeName === pokemonIdTypeName) {
            typeName = document.querySelector(`#${typeName}`).textContent;
            return typeName;
        };
    };
};

function insertType(element) {
    if(trys > 0) {
        insertedPokemonTypeElement = element;
        insertedPokemonType = typeNameMask(element);
        txtType.innerHTML = `Tipo selecionado: ${insertedPokemonType}`;
    };
};

function disablingDifficultyElement(difficulty) {
    if(difficulty === 0) {//easy
        btnEasyDifficulty.disabled = true;
        btnNormalDifficulty.disabled = false;
        btnHardDifficulty.disabled = false;
    } else if(difficulty === 1) {//normal
        btnEasyDifficulty.disabled = false;
        btnNormalDifficulty.disabled = true;
        btnHardDifficulty.disabled = false;
    } else if(difficulty === 2) {//hard
        btnEasyDifficulty.disabled = false;
        btnNormalDifficulty.disabled = false;
        btnHardDifficulty.disabled = true;
    };
};

function assignDifficulty(difficulty) {
    if(difficulty === 0) {//easy
        settings.difficulty = 0;
    } else if(difficulty === 1) {//normal
        settings.difficulty = 1;
    } else if(difficulty === 2) {//hard
        settings.difficulty = 2;
    };
};

function insertDifficulty(difficulty) {
    difficulty = parseInt(difficulty);
    if(gameStarted === false) {
        assignDifficulty(difficulty);
        disablingDifficultyElement(difficulty);
        trys = 3;
        score = 0;
        txtScore.innerHTML = score;
        txtTrys.innerHTML = trys;
        localStorage.setItem("settings", JSON.stringify(settings));
        updateBestScore();
    } else {
        txtMessage.innerHTML = "<p>Você poderá alterar a dificuldade quando iniciar um novo jogo!</p>";
    };
};

function updateBestScore() {
    if(settings.difficulty === 0) {
        txtBest.innerHTML = bestScore[0];
    } else if(settings.difficulty === 1) {
        txtBest.innerHTML = bestScore[1];
    } else if(settings.difficulty === 2) {
        txtBest.innerHTML = bestScore[2];
    };
};

function assignBestScore() {
    if(settings.difficulty === 0 && score > bestScore[0]) {
        bestScore[0] = score;
        txtBest.innerHTML = bestScore[0];
    } else if(settings.difficulty === 1 && score > bestScore[1]) {
        bestScore[1] = score;
        txtBest.innerHTML = bestScore[1];
    } else if(settings.difficulty === 2 && score > bestScore[2]) {
        bestScore[2] = score;
        txtBest.innerHTML = bestScore[2];
    };
    localStorage.setItem("bestScore", JSON.stringify(bestScore));
};

function printWinOrGameOverMessage(win) {
    if(win === true) {
        if(pokemonIdTypes[1] !== null) {
            txtType.innerHTML = `Acertou! O Pokémon era dos tipos: ${pokemonIdTypes[0]} e ${pokemonIdTypes[1]}`;
        } else {
            txtType.innerHTML = `Acertou! O Pokémon era do tipo: ${pokemonIdTypes[0]}`;
        };
    } else if(win === false) {
        if(pokemonIdTypes[1] !== null) {
            txtType.innerHTML = `GAME OVER! O Pokémon era dos tipos: ${pokemonIdTypes[0]} e ${pokemonIdTypes[1]}`;
        } else {
            txtType.innerHTML = `GAME OVER! O Pokémon era do tipo: ${pokemonIdTypes[0]}`;
        };
    };
};

function pokemonGame() {
    if(gameEnded === false) {
        if(insertedPokemonType === null) {
            txtType.innerHTML = "Selecione um tipo!";
        } else {
            gameStarted = true;
            if(settings.difficulty === 0) {
                if(insertedPokemonType === pokemonIdTypes[0] || insertedPokemonType === pokemonIdTypes[1]) {
                    score++;
                    txtScore.innerHTML = score;
                    printWinOrGameOverMessage(true);
                    gameEnded = true;
                    txtPokeName.innerHTML = pokemonName;
                    assignCounterToRestartGame(assignTimerToRestartGame());
                } else {
                    trys--;
                    if(trys <= 0) {
                        txtTrys.innerHTML = trys;
                        printWinOrGameOverMessage(false);
                        gameEnded = true;
                        txtPokeName.innerHTML = pokemonName;
                        assignBestScore();
                        score = 0;
                        assignCounterToRestartGame(assignTimerToRestartGame());
                    } else {
                        txtTrys.innerHTML = trys;
                        txtType.innerHTML = "Errou Miseravelmente! Selecione o tipo:";
                        insertedPokemonType = null;
                    };
                };
            } else if(settings.difficulty === 1 || settings.difficulty === 2) {
                if((insertedPokemonType === pokemonIdTypes[0] || insertedPokemonType === pokemonIdTypes[1]) && correctPokemonFirstType === false) {
                    correctPokemonFirstType = true;
                    insertedPokemonTypeAuxElement = insertedPokemonTypeElement;
                    insertedPokemonTypeElement.disabled = true;
                    txtType.innerHTML = "Acertou o primeiro tipo! Selecione o tipo:";
                } else if((insertedPokemonType === pokemonIdTypes[0] || insertedPokemonType === pokemonIdTypes[1]) && correctPokemonFirstType === true) {
                    if(insertedPokemonTypeAuxElement !== undefined) {
                        insertedPokemonTypeAuxElement.disabled = false;
                    };
                    score++;
                    txtScore.innerHTML = score;
                    printWinOrGameOverMessage(true);
                    gameEnded = true;
                    txtPokeName.innerHTML = pokemonName;
                    if(settings.difficulty === 2 && trys < 10) {
                        trys++;
                    };
                    assignCounterToRestartGame(assignTimerToRestartGame());
                } else {
                    trys--;
                    if(trys <= 0) {
                        correctPokemonFirstType = false;
                        if(insertedPokemonTypeAuxElement !== undefined) {
                            insertedPokemonTypeAuxElement.disabled = false;
                        };
                        txtTrys.innerHTML = trys;
                        printWinOrGameOverMessage(false);
                        gameEnded = true;
                        txtPokeName.innerHTML = pokemonName;
                        if(settings.difficulty === 2) {
                            trys = 3;
                        };
                        assignBestScore();
                        score = 0;
                        assignCounterToRestartGame(assignTimerToRestartGame());
                    } else {
                        txtTrys.innerHTML = trys;
                        txtType.innerHTML = "Errou Miseravelmente! Selecione o tipo:";
                        insertedPokemonType = null;
                    };
                };
            };
        };
    };
};

async function assignValueToVariables() {
    const res = await getPokemon();
    const pokemonImage = res.sprites.other["official-artwork"].front_default;
    const pokemonTypeLength = res.types["length"];
    gameStarted = false;
    gameEnded = false;
    insertedPokemonType = null;
    pokemonName = pokemonNameFormatted(res.name);
    if(pokemonTypeLength === 2) {
        correctPokemonFirstType = false;
        pokemonIdTypes[0] = comparePokemonTypes(res.types[0].type.name);
        pokemonIdTypes[1] = comparePokemonTypes(res.types[1].type.name);
    } else {
        correctPokemonFirstType = true;
        pokemonIdTypes[0] = comparePokemonTypes(res.types[0].type.name);
        pokemonIdTypes[1] = null;
    };
    assignGameTrys();
    includePokemonFigure(pokemonImage);
};

function requestLocalStorage() {
    if(localStorage.getItem("settings") && localStorage.getItem("bestScore")) {
        settings = JSON.parse(localStorage.getItem("settings"));
        bestScore = JSON.parse(localStorage.getItem("bestScore"));
    } else {
        settings = {
            difficulty: 1,
            generations: [1, 2, 3, 4, 5, 6, 7, 8]
        };
        bestScore = [0, 0, 0];
        localStorage.setItem("settings", JSON.stringify(settings));
        localStorage.setItem("bestScore", JSON.stringify(bestScore));
    };
    applyLocalStorage();
};

function applyLocalStorage() {
    disablingDifficultyElement(settings.difficulty);
    applyValuesOfGenerationElements();
    numTrueGenButtons = settings.generations.length;
    trys = 3;
    txtBest.innerHTML = bestScore[settings.difficulty];
    txtTrys.innerHTML = trys;
};

function restartGame() {
    clearTimeout(timer);
    clearInterval(counter);
    if(insertedPokemonTypeAuxElement !== undefined) {
        insertedPokemonTypeAuxElement.disabled = false;
    };
    if(pokemonGenModified == true) {
        score = 0;
    };
    txtScore.innerHTML = score;
    txtType.innerHTML = "Selecione o tipo:";
    txtPokeName.innerHTML = "Qual o tipo?";
    txtMessage.innerHTML = "";
    assignPokemonGenerations();
    drawPokemonId();
    assignValueToVariables();
};

requestLocalStorage();
restartGame();