//Difficulty Buttons
const btnNormalDifficulty = document.getElementById("normal-difficulty");
const btnHardDifficulty = document.getElementById("hard-difficulty");
btnNormalDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);
btnHardDifficulty.addEventListener("click", function(){insertDifficulty(this.value)}, false);

//New Game Button and Reset Button
const btnPokemon = document.getElementById("btnPokemon");
const btnReset = document.getElementById("btnReset");
btnPokemon.addEventListener("click", verifyDifficulty, false);
btnReset.addEventListener("click", reset, false);

//Type Buttons
const btnType = document.getElementsByClassName("main-section-types-container-button");
for (const value of btnType) {
    value.addEventListener("click", function(){insertType(this)}, false);
};

//----------------------------------------------------------------------------------------

//Get Element
const txtTrys = document.getElementById("txt-trys");
const txtScore = document.getElementById("txt-score");
const txtPokeName = document.getElementById("txt-pokename");
const txtType = document.getElementById("txt-type");
const figure = document.getElementById("figure");

let trys, id, insertedType, pokemonName, pokemonType1, pokemonType2, typeLength, correctFirstType, elementInsertedType, auxElementInsertedType, fromGen, toGen;
let score = 0;
let hard = false;
btnNormalDifficulty.disabled = true;

const pokeGen = {
    from: [
            1, //gen1
            151, //gen2
            251, //gen3
            386, //gen4
            493, //gen5
            649, //gen6
            721, //gen7
            809 //gen8
    ],
    to: [
        151, //gen1
        251, //gen2
        386, //gen3
        493, //gen4
        649, //gen5
        721, //gen6
        809, //gen7
        905 //gen8
    ]
};

function drawId() {
    const number = Math.floor(Math.random(fromGen) * toGen+1);
    return number;
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
    fromGen = pokeGen.from[from-1];
    toGen = pokeGen.to[to-1];
};

function insertType(element) {
    if(trys > 0) {
        elementInsertedType = element;
        insertedType = typeNameMask(element);
        txtType.innerHTML = `Tipo selecionado: ${insertedType}`;
    };
};

function insertDifficulty(difficulty) {
    if(trys === 3) {
        if(difficulty === "normal") {
            hard = false;
            btnNormalDifficulty.disabled = true;
            btnHardDifficulty.disabled = false;
        } else if(difficulty === "hard") {
            hard = true;
            btnNormalDifficulty.disabled = false;
            btnHardDifficulty.disabled = true;
        };
    } else {
        alert("Você poderá alterar a dificuldade quando iniciar um novo jogo!");
    };
};

function verifyDifficulty() {
    if(hard === false) {//normal
        pokemonType();
    } else if(hard === true) {//hard
        pokemonTypeHard();
    };
};

function pokemonType() {
    if(trys > 0) {
        if(insertedType === null) {
            txtType.innerHTML = "Selecione um tipo!";
        } else {
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
                } else {
                    txtTrys.innerHTML = trys;
                    txtType.innerHTML = "Errou Miseravelmente! Selecione o tipo:";
                };
            };
        };
    };
};

function pokemonTypeHard() {
    if(trys > 0) {
        if(insertedType === null) {
            txtType.innerHTML = "Selecione um tipo!";
        } else {
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
    insertPokemonGen();
    id = drawId();
    assignValueToVariables();
};

reset();