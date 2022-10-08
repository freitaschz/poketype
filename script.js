//Modal - Help
const openModalButton = document.querySelector("#open-help");
const closeModalButton = document.querySelector("#close-help");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

const toggleModal = () => {
    [modal, fade].forEach((el) => el.classList.toggle("hide"));
};

[openModalButton, closeModalButton, fade].forEach((el) => {
    el.addEventListener("click", () => toggleModal());
});

//----------------------------------------------------------------------------------------

//Get Gen Buttons
for(let i = 1; i <= 8; i++) {
    const el = document.querySelector(`#gen${i}`);
    el.addEventListener("click", function(){insertGen(this)}, false);
};

//Get Difficulty Buttons
const btnEasyDifficulty = document.querySelector("#easy-difficulty");
const btnNormalDifficulty = document.querySelector("#normal-difficulty");
const btnHardDifficulty = document.querySelector("#hard-difficulty");
btnEasyDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
btnNormalDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
btnHardDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);

//Get New Game Button and Reset Button
const btnPokemon = document.querySelector("#btnPokemon");
const btnReset = document.querySelector("#btnReset");
btnPokemon.addEventListener("click", verifyDifficulty, false);
btnReset.addEventListener("click", reset, false);

//Get Type Buttons
const btnType = document.getElementsByClassName("main-pokeguess-game-types-container-button");
for (const value of btnType) {
    value.addEventListener("click", function(){insertType(this)}, false);
};

//Get Other Elements
const txtScore = document.querySelector("#txt-score");
const txtBest = document.querySelector("#txt-best");
const txtTrys = document.querySelector("#txt-trys");
const txtPokeName = document.querySelector("#txt-pokename");
const txtType = document.querySelector("#txt-type");
const txtMessage = document.querySelector("#txt-message");
const figure = document.querySelector("#figure");

//----------------------------------------------------------------------------------------

let trys, id, insertedType, pokemonName, typeLength, correctFirstType, elementInsertedType, auxElementInsertedType, fromGen, toGen, timer, counter;
let score = 0;
let best = [0, 0, 0];
let numTrueGenButtons = 8;
let pokemonTypes = [];
let difficulty = 1;
let gameStarted = false;
let gameEnded = false;
btnNormalDifficulty.disabled = true;

const pokeGen = {
    start: [
            1, //gen1
            152, //gen2
            252, //gen3
            387, //gen4
            494, //gen5
            650, //gen6
            722, //gen7
            808 //gen8
    ],
    end: [
        151, //gen1
        251, //gen2
        386, //gen3
        493, //gen4
        649, //gen5
        721, //gen6
        807, //gen7
        905 //gen8
    ]
};

//----------------------------------------------------------------------------------------

function insertGen(el) {
    const text = el.textContent;
    txtMessage.innerHTML = "<p>A nova configuração será aplicada quando iniciar um novo jogo!</p>";
    if(el.value === "true" && numTrueGenButtons > 1) {
        el.value = "false";
        el.innerHTML = "&#9744; " + text.substring(2, text.length);
        numTrueGenButtons--;
    } else if(el.value === "false") {
        el.value = "true";
        el.innerHTML = "&#9745; " + text.substring(2, text.length);
        numTrueGenButtons++;
    };
};

function drawPokemons() {
    let pokeDraws = [];
    for(let i = 0; i < 8; i++) {
        pokeDraws[i] = Math.floor(Math.random() * (pokeGen.end[i] - pokeGen.start[i]+1)+pokeGen.start[i]);
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

function verifyDifficulty() {
    if(difficulty === 0) {//easy
        pokemonTypeEasy();
    } else if(difficulty >= 1 && difficulty <= 2) {//normal, hard
        pokemonType();
    };
};

function insertDifficulty(value) {
    if(gameStarted === false) {
        if(value === "0") {//easy
            difficulty = 0;
            btnEasyDifficulty.disabled = true;
            btnNormalDifficulty.disabled = false;
            btnHardDifficulty.disabled = false;
            trys = 3;
        } else if(value === "1") {//normal
            difficulty = 1;
            btnEasyDifficulty.disabled = false;
            btnNormalDifficulty.disabled = true;
            btnHardDifficulty.disabled = false;
            trys = 3;
        } else if(value === "2") {//hard
            difficulty = 2;
            btnEasyDifficulty.disabled = false;
            btnNormalDifficulty.disabled = false;
            btnHardDifficulty.disabled = true;
            trys = 3;
        };
        score = 0;
        txtScore.innerHTML = score;
        txtTrys.innerHTML = trys;
        compareBestScore();
    } else {
        txtMessage.innerHTML = "<p>Você poderá alterar a dificuldade quando iniciar um novo jogo!</p>";
    };
};

function assignTrys(value) {
    if(value === "0") {//easy
        trys = 3;
    } else if(value === "1") {//normal
        trys = 3;
    };
    txtTrys.innerHTML = trys;
};

function compareBestScore() {
    if(difficulty === 0) {
        txtBest.innerHTML = best[0];
    } else if(difficulty === 1) {
        txtBest.innerHTML = best[1];
    } else if(difficulty === 2) {
        txtBest.innerHTML = best[2];
    };
};

function assignBestScore() {
    if(difficulty === 0 && score > best[0]) {
        best[0] = score;
        txtBest.innerHTML = best[0];
    } else if(difficulty === 1 && score > best[1]) {
        best[1] = score;
        txtBest.innerHTML = best[1];
    } else if(difficulty === 2 && score > best[2]) {
        best[2] = score;
        txtBest.innerHTML = best[2];
    };
};

function pokemonTypeEasy() {
    if(trys > 0  || gameEnded === false) {
        if(insertedType === null) {
            txtType.innerHTML = "Selecione um tipo!";
        } else {
            gameStarted = true;
            if(insertedType === pokemonTypes[0] || insertedType === pokemonTypes[1]) {
                score++;
                txtScore.innerHTML = score;
                if(pokemonTypes[1] !== null) {
                    txtType.innerHTML = `Acertou! O Pokémon era dos tipos: ${pokemonTypes[0]} e ${pokemonTypes[1]}`;
                } else {
                    txtType.innerHTML = `Acertou! O Pokémon era do tipo: ${pokemonTypes[0]}`;
                };
                gameEnded = true;
                txtPokeName.innerHTML = pokemonName;
                trys = 0;
                assignCounter(assignTimer());
            } else {
                trys--;
                if(trys <= 0) {
                    txtTrys.innerHTML = trys;
                    if(pokemonTypes[1] !== null) {
                        txtType.innerHTML = `GAME OVER! O Pokémon era dos tipos: ${pokemonTypes[0]} e ${pokemonTypes[1]}`;
                    } else {
                        txtType.innerHTML = `GAME OVER! O Pokémon era do tipo: ${pokemonTypes[0]}`;
                    };
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
        };
    };
};

function pokemonType() {
    if(trys > 0 || gameEnded === false) {
        if(insertedType === null) {
            txtType.innerHTML = "Selecione um tipo!";
        } else {
            gameStarted = true;
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
                if(pokemonTypes[1] !== null) {
                    txtType.innerHTML = `Acertou! O Pokémon era dos tipos: ${pokemonTypes[0]} e ${pokemonTypes[1]}`;
                } else {
                    txtType.innerHTML = `Acertou! O Pokémon era do tipo: ${pokemonTypes[0]}`;
                };
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
                    if(pokemonTypes[1] !== null) {
                        txtType.innerHTML = `GAME OVER! O Pokémon era dos tipos: ${pokemonTypes[0]} e ${pokemonTypes[1]}`;
                    } else {
                        txtType.innerHTML = `GAME OVER! O Pokémon era do tipo: ${pokemonTypes[0]}`;
                    };
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

function includePokemonFigure(img) {
    figure.innerHTML = `<img alt="${pokemonName}" src="${img}">`;
};

async function assignValueToVariables() {
    const res = await getPokemon();
    const img = res.data.sprites.other["official-artwork"].front_default;
    gameStarted = false;
    insertedType = null;
    typeLength = res.data.types["length"];
    pokemonName = pokemonNameFormatted(res.data.name);
    if(typeLength === 2) {
        correctFirstType = false;
        pokemonTypes[0] = compareTypes(res.data.types[0].type.name);
        pokemonTypes[1] = compareTypes(res.data.types[1].type.name);
    } else {
        correctFirstType = true;
        pokemonTypes[0] = compareTypes(res.data.types[0].type.name);
        pokemonTypes[1] = null;
    };
    assignTrys(difficulty.toString());
    includePokemonFigure(img);
};

async function getPokemon() {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return res;
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