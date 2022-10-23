import { consentCookies } from "./cookies.js";
import { texts, modals, buttons, figures, effects } from "./variables.js";

consentCookies()

const toggleModal = () => {
    [modals.modal, effects.fade].forEach((element) => element.classList.toggle("hide"));
};
[modals.openModal, modals.closeModal, effects.fade].forEach((element) => {
    element.addEventListener("click", () => toggleModal());
});

for(const generation of buttons.generations) {
    generation.addEventListener("click", function(){insertGeneration(this)}, false);
};

buttons.easyDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
buttons.normalDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
buttons.hardDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);

buttons.pokemon.addEventListener("click", pokemonGame, false);
buttons.reset.addEventListener("click", restartGame, false);

for (const value of buttons.types) {
    value.addEventListener("click", function(){insertType(this)}, false);
};

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
        texts.message.innerHTML = "<p>Erro ao carregar! Tente novamente.</p>";
        console.error(error);
    };
};

function includePokemonFigure(img) {
    figures.pokemon.innerHTML = `<img alt="${pokemonName}" src="${img}">`;
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
        const element = buttons.generations[value-1];
        const text = element.textContent;
        element.value = "true";
        element.innerHTML = "<i class='bx bx-checkbox-checked'></i> " + text.substring(1, text.length);
    };
};

function assignPokemonGenerations() {
    settings.generations = [];
    for (let i=0; i<8; i++) {
        const wasTheGenSelected = buttons.generations[i].value;
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
    texts.message.innerHTML = "<p>A nova configuração será aplicada quando iniciar um novo jogo!</p>";
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
    texts.trys.innerHTML = trys;
};

function assignCounterToRestartGame() {
    let seconds = 3;
    counter = setInterval(() => texts.message.innerHTML = `<p>Um novo Pokémon será sorteado em ${seconds--} segundo(s)</p>`, 800);
    setTimeout(() => {clearInterval(counter)}, 3000);
};

function assignTimerToRestartGame() {
    timer = setTimeout(restartGame, 2800);
};

function stopTimer() {
    clearTimeout(timer);
};

function comparePokemonTypes(pokemonIdTypeName) {
    for(const value of buttons.types) {
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
        texts.type.innerHTML = `Tipo selecionado: ${insertedPokemonType}`;
    };
};

function disablingDifficultyElement(difficulty) {
    if(difficulty === 0) {//easy
        buttons.easyDifficulty.disabled = true;
        buttons.normalDifficulty.disabled = false;
        buttons.hardDifficulty.disabled = false;
    } else if(difficulty === 1) {//normal
        buttons.easyDifficulty.disabled = false;
        buttons.normalDifficulty.disabled = true;
        buttons.hardDifficulty.disabled = false;
    } else if(difficulty === 2) {//hard
        buttons.easyDifficulty.disabled = false;
        buttons.normalDifficulty.disabled = false;
        buttons.hardDifficulty.disabled = true;
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
        texts.score.innerHTML = score;
        texts.trys.innerHTML = trys;
        localStorage.setItem("settings", JSON.stringify(settings));
        updateBestScore();
    } else {
        texts.message.innerHTML = "<p>Você poderá alterar a dificuldade quando iniciar um novo jogo!</p>";
    };
};

function updateBestScore() {
    if(settings.difficulty === 0) {
        texts.best.innerHTML = bestScore[0];
    } else if(settings.difficulty === 1) {
        texts.best.innerHTML = bestScore[1];
    } else if(settings.difficulty === 2) {
        texts.best.innerHTML = bestScore[2];
    };
};

function assignBestScore() {
    if(settings.difficulty === 0 && score > bestScore[0]) {
        bestScore[0] = score;
        texts.best.innerHTML = bestScore[0];
    } else if(settings.difficulty === 1 && score > bestScore[1]) {
        bestScore[1] = score;
        texts.best.innerHTML = bestScore[1];
    } else if(settings.difficulty === 2 && score > bestScore[2]) {
        bestScore[2] = score;
        texts.best.innerHTML = bestScore[2];
    };
    localStorage.setItem("bestScore", JSON.stringify(bestScore));
};

function printWinOrGameOverMessage(win) {
    if(win === true) {
        if(pokemonIdTypes[1] !== null) {
            texts.type.innerHTML = `Acertou! O Pokémon era dos tipos: ${pokemonIdTypes[0]} e ${pokemonIdTypes[1]}`;
        } else {
            texts.type.innerHTML = `Acertou! O Pokémon era do tipo: ${pokemonIdTypes[0]}`;
        };
    } else if(win === false) {
        if(pokemonIdTypes[1] !== null) {
            texts.type.innerHTML = `GAME OVER! O Pokémon era dos tipos: ${pokemonIdTypes[0]} e ${pokemonIdTypes[1]}`;
        } else {
            texts.type.innerHTML = `GAME OVER! O Pokémon era do tipo: ${pokemonIdTypes[0]}`;
        };
    };
};

function pokemonGame() {
    if(gameEnded === false) {
        if(insertedPokemonType === null) {
            texts.type.innerHTML = "Selecione um tipo!";
        } else {
            gameStarted = true;
            if(settings.difficulty === 0) {
                if(insertedPokemonType === pokemonIdTypes[0] || insertedPokemonType === pokemonIdTypes[1]) {
                    score++;
                    texts.score.innerHTML = score;
                    printWinOrGameOverMessage(true);
                    gameEnded = true;
                    texts.pokeName.innerHTML = pokemonName;
                    assignCounterToRestartGame(assignTimerToRestartGame());
                } else {
                    trys--;
                    if(trys <= 0) {
                        texts.trys.innerHTML = trys;
                        printWinOrGameOverMessage(false);
                        gameEnded = true;
                        texts.pokeName.innerHTML = pokemonName;
                        assignBestScore();
                        score = 0;
                        assignCounterToRestartGame(assignTimerToRestartGame());
                    } else {
                        texts.trys.innerHTML = trys;
                        texts.type.innerHTML = "Errou Miseravelmente! Selecione o tipo:";
                        insertedPokemonType = null;
                    };
                };
            } else if(settings.difficulty === 1 || settings.difficulty === 2) {
                if((insertedPokemonType === pokemonIdTypes[0] || insertedPokemonType === pokemonIdTypes[1]) && correctPokemonFirstType === false) {
                    correctPokemonFirstType = true;
                    insertedPokemonTypeAuxElement = insertedPokemonTypeElement;
                    insertedPokemonTypeElement.disabled = true;
                    texts.type.innerHTML = "Acertou o primeiro tipo! Selecione o tipo:";
                } else if((insertedPokemonType === pokemonIdTypes[0] || insertedPokemonType === pokemonIdTypes[1]) && correctPokemonFirstType === true) {
                    if(insertedPokemonTypeAuxElement !== undefined) {
                        insertedPokemonTypeAuxElement.disabled = false;
                    };
                    score++;
                    texts.score.innerHTML = score;
                    printWinOrGameOverMessage(true);
                    gameEnded = true;
                    texts.pokeName.innerHTML = pokemonName;
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
                        texts.trys.innerHTML = trys;
                        printWinOrGameOverMessage(false);
                        gameEnded = true;
                        texts.pokeName.innerHTML = pokemonName;
                        if(settings.difficulty === 2) {
                            trys = 3;
                        };
                        assignBestScore();
                        score = 0;
                        assignCounterToRestartGame(assignTimerToRestartGame());
                    } else {
                        texts.trys.innerHTML = trys;
                        texts.type.innerHTML = "Errou Miseravelmente! Selecione o tipo:";
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
    texts.best.innerHTML = bestScore[settings.difficulty];
    texts.trys.innerHTML = trys;
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
    texts.score.innerHTML = score;
    texts.type.innerHTML = "Selecione o tipo:";
    texts.pokeName.innerHTML = "Qual o tipo?";
    texts.message.innerHTML = "";
    assignPokemonGenerations();
    drawPokemonId();
    assignValueToVariables();
};

requestLocalStorage();
restartGame();