//Difficulty Buttons
const btnEasyDifficulty = document.getElementById("easy-difficulty");
const btnNormalDifficulty = document.getElementById("normal-difficulty");
btnEasyDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
btnNormalDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);

//New Game Button and Reset Button
const btnPokemon = document.getElementById("btnPokemon");
const btnReset = document.getElementById("btnReset");
btnPokemon.addEventListener("click", verifyDifficulty, false);
btnReset.addEventListener("click", reset, false);

//Type Buttons
const btnType = document.getElementsByClassName("game-section-types-container-button");
for (const value of btnType) {
    value.addEventListener("click", function(){insertType(this)}, false);
};

//----------------------------------------------------------------------------------------

//Get Element
const txtTrys = document.getElementById("txt-trys");
const txtScore = document.getElementById("txt-score");
const txtPokeName = document.getElementById("txt-pokename");
const txtType = document.getElementById("txt-type");
const txtMessage = document.getElementById("txt-message");
const figure = document.getElementById("figure");

let trys, id, insertedType, pokemonName, pokemonType1, pokemonType2, typeLength, correctFirstType, elementInsertedType, auxElementInsertedType, fromGen, toGen;
let score = 0;
let easy = false;
let gameStarted = false;
let timer = null;
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

function drawId() {
    let number
    do {
        number = Math.floor(Math.random(fromGen) * toGen+1);
    } while(number === id)
    return number;
};

function assignCounter() {
    let seconds = 4;
    let counter = setInterval(() => txtMessage.innerHTML = `<p>Um novo Pokémon será sorteado em ${seconds--} segundo(s)</p>`, 800);
    setTimeout(() => {clearInterval(counter)}, 4000);
};

function stopTimer() {
    clearTimeout(timer);
};

function assignTimer() {
    timer = setTimeout(reset, 3800);
};

function typeNameMask(type) {
    return type.textContent;
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

function pokemonNameFormatted(name) {
    const formatedName = (name.substring(0,1).toUpperCase())+name.substring(1, name.length);
    return formatedName;
};

function insertPokemonGen() {
    const from = document.getElementById("from-gen").value;
    const to = document.getElementById("to-gen").value;
    fromGen = pokeGen.start[from-1];
    toGen = pokeGen.end[to-1];
};

function insertType(element) {
    if(trys > 0) {
        elementInsertedType = element;
        insertedType = typeNameMask(element);
        txtType.innerHTML = `Tipo selecionado: ${insertedType}`;
    };
};

function insertDifficulty(difficulty) {
    if(gameStarted === false) {
        if(difficulty === "0") {//easy
            easy = true;
            btnEasyDifficulty.disabled = true;
            btnNormalDifficulty.disabled = false;
        } else if(difficulty === "1") {//normal
            easy = false;
            btnEasyDifficulty.disabled = false;
            btnNormalDifficulty.disabled = true;
        };
    } else {
        txtMessage.innerHTML = "<p>Você poderá alterar a dificuldade quando iniciar um novo jogo!<p>";
    };
};

function verifyDifficulty() {
    if(easy === true) {//easy
        pokemonTypeEasy();
    } else if(easy === false) {//normal
        pokemonType();
    };
};

function pokemonTypeEasy() {
    if(trys > 0) {
        if(insertedType === null) {
            txtType.innerHTML = "Selecione um tipo!";
        } else {
            gameStarted = true;
            if(insertedType === pokemonType1 || insertedType === pokemonType2) {
                score++;
                txtScore.innerHTML = score;
                if(pokemonType2 !== null) {
                    txtType.innerHTML = `Acertou! O Pokémon era dos tipos: ${pokemonType1} e ${pokemonType2}`;
                } else {
                    txtType.innerHTML = `Acertou! O Pokémon era do tipo: ${pokemonType1}`;
                };
                txtPokeName.innerHTML = pokemonName;
                trys = 0;
                assignCounter(assignTimer());
            } else {
                trys--;
                if(trys <= 0) {
                    txtTrys.innerHTML = trys;
                    if(pokemonType2 !== null) {
                        txtType.innerHTML = `GAME OVER! O Pokémon era dos tipos: ${pokemonType1} e ${pokemonType2}`;
                    } else {
                        txtType.innerHTML = `GAME OVER! O Pokémon era do tipo: ${pokemonType1}`;
                    };
                    txtPokeName.innerHTML = pokemonName;
                    assignCounter(assignTimer());
                } else {
                    txtTrys.innerHTML = trys;
                    txtType.innerHTML = "Errou Miseravelmente! Selecione o tipo:";
                };
            };
        };
    };
};

function pokemonType() {
    if(trys > 0) {
        if(insertedType === null) {
            txtType.innerHTML = "Selecione um tipo!";
        } else {
            gameStarted = true;
            if((insertedType === pokemonType1 || insertedType === pokemonType2) && correctFirstType === false) {
                correctFirstType = true;
                auxElementInsertedType = elementInsertedType;
                elementInsertedType.disabled = true;
                txtType.innerHTML = "Acertou o primeiro tipo! Selecione o tipo:";
            } else if((insertedType === pokemonType1 || insertedType === pokemonType2) && correctFirstType === true) {
                if(auxElementInsertedType !== undefined) {
                    auxElementInsertedType.disabled = false;
                };
                score++;
                txtScore.innerHTML = score;
                if(pokemonType2 !== null) {
                    txtType.innerHTML = `Acertou! O Pokémon era dos tipos: ${pokemonType1} e ${pokemonType2}`;
                } else {
                    txtType.innerHTML = `Acertou! O Pokémon era do tipo: ${pokemonType1}`;
                };
                txtPokeName.innerHTML = pokemonName;
                trys = 0;
                assignCounter(assignTimer());
            } else {
                trys--;
                if(trys <= 0) {
                    correctFirstType = false;
                    if(auxElementInsertedType !== undefined) {
                        auxElementInsertedType.disabled = false;
                    };
                    txtTrys.innerHTML = trys;
                    if(pokemonType2 !== null) {
                        txtType.innerHTML = `GAME OVER! O Pokémon era dos tipos: ${pokemonType1} e ${pokemonType2}`;
                    } else {
                        txtType.innerHTML = `GAME OVER! O Pokémon era do tipo: ${pokemonType1}`;
                    };
                    txtPokeName.innerHTML = pokemonName;
                    assignCounter(assignTimer());
                } else {
                    txtTrys.innerHTML = trys;
                    txtType.innerHTML = "Errou Miseravelmente! Selecione o tipo:";
                };
            };
        };
    };
};

function includePokemonFigure(img) {
    figure.innerHTML = `<img alt="${pokemonName}" src="${img}">`;
};

async function getPokemon() {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return res;
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
        pokemonType1 = compareTypes(res.data.types[0].type.name);
        pokemonType2 = compareTypes(res.data.types[1].type.name);
    } else {
        correctFirstType = true;
        pokemonType1 = compareTypes(res.data.types[0].type.name);
        pokemonType2 = null;
    };
    includePokemonFigure(img);
};

function reset() {
    trys = 3;
    if(auxElementInsertedType !== undefined) {
        auxElementInsertedType.disabled = false;
    };
    txtTrys.innerHTML = trys;
    txtScore.innerHTML = score;
    txtType.innerHTML = "Selecione o tipo:";
    txtPokeName.innerHTML = "Qual o tipo?";
    txtMessage.innerHTML = "";
    insertPokemonGen();
    id = drawId();
    assignValueToVariables();
};

reset();