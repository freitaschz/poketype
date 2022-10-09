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
    const el = document.querySelector(`#gen${i}`);
    el.addEventListener("click", function(){insertGen(this)}, false);
};

const btnEasyDifficulty = document.querySelector("#easy-difficulty");
const btnNormalDifficulty = document.querySelector("#normal-difficulty");
const btnHardDifficulty = document.querySelector("#hard-difficulty");
btnEasyDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
btnNormalDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
btnHardDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
btnNormalDifficulty.disabled = true;

const btnPokemon = document.querySelector("#btnPokemon");
const btnReset = document.querySelector("#btnReset");
btnPokemon.addEventListener("click", pokemonType, false);
btnReset.addEventListener("click", reset, false);

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
const figure = document.querySelector("#figure");

const pokedexGenNumbers = {//gen 1 to 8
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

let trys, id, insertedType, pokemonName, typeLength, correctFirstType, elementInsertedType, auxElementInsertedType, fromGen, toGen, timer, counter;
let score = 0;
let bestScore = [0, 0, 0];
let numTrueGenButtons = 8;
let pokemonTypes = [];
let difficulty = 1;
let gameStarted = false;
let gameEnded = false;

function insertGen(element) {
    const text = element.textContent;
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
};

function drawPokemons() {
    let pokeDraws = [];
    for(let i = 0; i < 8; i++) {
        pokeDraws[i] = Math.floor(Math.random() * (pokedexGenNumbers.end[i] - pokedexGenNumbers.start[i]+1)+pokedexGenNumbers.start[i]);
    };
    return pokeDraws;
};

function drawPokemonId(pokemons) {
    const pokeDraws = drawPokemons();
    if(pokemons.length === 1) {
        id = pokeDraws[pokemons[0]];
    } else {
        const index = Math.floor(Math.random() * pokemons.length);
        id = pokeDraws[pokemons[index]];
    };
};

function assignPokemonGens() {
    let pokemons = [];
    for (let i=0; i<8; i++) {
        const gen = document.querySelector(`#gen${i+1}`).value;
        if(gen === "true") {
            pokemons.push(i);
        };
    };
    drawPokemonId(pokemons);
};

function typeNameMask(type) {
    return type.textContent;
};

function pokemonNameFormatted(name) {
    const formatedName = (name.substring(0,1).toUpperCase())+name.substring(1, name.length);
    return formatedName;
};

function assignCounter() {
    let seconds = 3;
    counter = setInterval(() => txtMessage.innerHTML = `<p>Um novo Pokémon será sorteado em ${seconds--} segundo(s)</p>`, 800);
    setTimeout(() => {clearInterval(counter)}, 3000);
};

function stopTimer() {
    clearTimeout(timer);
};

function assignTimer() {
    timer = setTimeout(reset, 2800);
};

function compareTypes(name) {
    let typeName;
    for(const value of btnType) {
        typeName = value.value;
        if(typeName === name) {
            typeName = document.getElementById(typeName).textContent;
            return typeName;
        };
    };
};

function insertType(element) {
    if(trys > 0) {
        elementInsertedType = element;
        insertedType = typeNameMask(element);
        txtType.innerHTML = `Tipo selecionado: ${insertedType}`;
    };
};

function insertDifficulty(value) {
    value = parseInt(value);
    if(gameStarted === false) {
        if(value === 0) {//easy
            difficulty = 0;
            btnEasyDifficulty.disabled = true;
            btnNormalDifficulty.disabled = false;
            btnHardDifficulty.disabled = false;
        } else if(value === 1) {//normal
            difficulty = 1;
            btnEasyDifficulty.disabled = false;
            btnNormalDifficulty.disabled = true;
            btnHardDifficulty.disabled = false;
        } else if(value === 2) {//hard
            difficulty = 2;
            btnEasyDifficulty.disabled = false;
            btnNormalDifficulty.disabled = false;
            btnHardDifficulty.disabled = true;
        };
        trys = 3;
        score = 0;
        txtScore.innerHTML = score;
        txtTrys.innerHTML = trys;
        compareBestScore();
    } else {
        txtMessage.innerHTML = "<p>Você poderá alterar a dificuldade quando iniciar um novo jogo!</p>";
    };
};

function assignTrys(value) {
    value = parseInt(value);
    if(value !== 2) {
        trys = 3;
    };
    txtTrys.innerHTML = trys;
};

function compareBestScore() {
    if(difficulty === 0) {
        txtBest.innerHTML = bestScore[0];
    } else if(difficulty === 1) {
        txtBest.innerHTML = bestScore[1];
    } else if(difficulty === 2) {
        txtBest.innerHTML = bestScore[2];
    };
};

function assignBestScore() {
    if(difficulty === 0 && score > bestScore[0]) {
        bestScore[0] = score;
        txtBest.innerHTML = bestScore[0];
    } else if(difficulty === 1 && score > bestScore[1]) {
        bestScore[1] = score;
        txtBest.innerHTML = bestScore[1];
    } else if(difficulty === 2 && score > bestScore[2]) {
        bestScore[2] = score;
        txtBest.innerHTML = bestScore[2];
    };
};

function printWinOrGameOver(win) {
    if(win === true) {
        if(pokemonTypes[1] !== null) {
            txtType.innerHTML = `Acertou! O Pokémon era dos tipos: ${pokemonTypes[0]} e ${pokemonTypes[1]}`;
        } else {
            txtType.innerHTML = `Acertou! O Pokémon era do tipo: ${pokemonTypes[0]}`;
        };
    } else if(win === false) {
        if(pokemonTypes[1] !== null) {
            txtType.innerHTML = `GAME OVER! O Pokémon era dos tipos: ${pokemonTypes[0]} e ${pokemonTypes[1]}`;
        } else {
            txtType.innerHTML = `GAME OVER! O Pokémon era do tipo: ${pokemonTypes[0]}`;
        };
    };
};

function pokemonType() {
    if(trys > 0  && gameEnded === false) {
        if(insertedType === null) {
            txtType.innerHTML = "Selecione um tipo!";
        } else {
            gameStarted = true;
            if(difficulty === 0) {
                if(insertedType === pokemonTypes[0] || insertedType === pokemonTypes[1]) {
                    score++;
                    txtScore.innerHTML = score;
                    printWinOrGameOver(true);
                    gameEnded = true;
                    txtPokeName.innerHTML = pokemonName;
                    trys = 0;
                    assignCounter(assignTimer());
                } else {
                    trys--;
                    if(trys <= 0) {
                        txtTrys.innerHTML = trys;
                        printWinOrGameOver(false);
                        gameEnded = true;
                        txtPokeName.innerHTML = pokemonName;
                        assignBestScore();
                        score = 0;
                        assignCounter(assignTimer());
                    } else {
                        txtTrys.innerHTML = trys;
                        txtType.innerHTML = "Errou Miseravelmente! Selecione o tipo:";
                        insertedType = null;
                    };
                };
            } else if(difficulty === 1 || difficulty === 2) {
                if((insertedType === pokemonTypes[0] || insertedType === pokemonTypes[1]) && correctFirstType === false) {
                    correctFirstType = true;
                    auxElementInsertedType = elementInsertedType;
                    elementInsertedType.disabled = true;
                    txtType.innerHTML = "Acertou o primeiro tipo! Selecione o tipo:";
                } else if((insertedType === pokemonTypes[0] || insertedType === pokemonTypes[1]) && correctFirstType === true) {
                    if(auxElementInsertedType !== undefined) {
                        auxElementInsertedType.disabled = false;
                    };
                    score++;
                    txtScore.innerHTML = score;
                    printWinOrGameOver(true);
                    gameEnded = true;
                    txtPokeName.innerHTML = pokemonName;
                    if(difficulty === 2) {
                        trys++;
                    } else {
                        trys = 0;
                    }
                    assignCounter(assignTimer());
                } else {
                    trys--;
                    if(trys <= 0) {
                        correctFirstType = false;
                        if(auxElementInsertedType !== undefined) {
                            auxElementInsertedType.disabled = false;
                        };
                        txtTrys.innerHTML = trys;
                        printWinOrGameOver(false);
                        gameEnded = true;
                        txtPokeName.innerHTML = pokemonName;
                        if(difficulty === 2) {
                            trys = 3;
                        };
                        assignBestScore();
                        score = 0;
                        assignCounter(assignTimer());
                    } else {
                        txtTrys.innerHTML = trys;
                        txtType.innerHTML = "Errou Miseravelmente! Selecione o tipo:";
                        insertedType = null;
                    };
                };
            };
        };
    };
};

function includePokemonFigure(img) {
    figure.innerHTML = `<img alt="${pokemonName}" src="${img}">`;
};

async function assignValueToVariables() {
    const res = await getPokemon();
    const img = res.sprites.other["official-artwork"].front_default;
    gameStarted = false;
    insertedType = null;
    typeLength = res.types["length"];
    pokemonName = pokemonNameFormatted(res.name);
    if(typeLength === 2) {
        correctFirstType = false;
        pokemonTypes[0] = compareTypes(res.types[0].type.name);
        pokemonTypes[1] = compareTypes(res.types[1].type.name);
    } else {
        correctFirstType = true;
        pokemonTypes[0] = compareTypes(res.types[0].type.name);
        pokemonTypes[1] = null;
    };
    assignTrys(difficulty.toString());
    includePokemonFigure(img);
};

async function getPokemon() {
    try {
        const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return res.data;
    } catch(error) {
        txtMessage.innerHTML = "<p>Erro ao carregar! Tente novamente.</p>";
        console.error(error);
    };
};

function reset() {
    clearTimeout(timer);
    clearInterval(counter);
    if(auxElementInsertedType !== undefined) {
        auxElementInsertedType.disabled = false;
    };
    txtScore.innerHTML = score;
    txtType.innerHTML = "Selecione o tipo:";
    txtPokeName.innerHTML = "Qual o tipo?";
    txtMessage.innerHTML = "";
    assignPokemonGens();
    assignValueToVariables();
};

reset();