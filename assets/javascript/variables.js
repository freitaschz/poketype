const query = (...args) => document.querySelector(...args);
const queryAll = (...args) => document.querySelectorAll(...args);
const queryClass = (...args) => document.getElementsByClassName(...args);
const queryId = (...args) => document.getElementById(...args);

export const texts = {
  score: queryId("txt-score"),
  best: queryId("txt-best"),
  trys: queryId("txt-trys"),
  pokeName: queryId("txt-pokename"),
  type: queryId("txt-type"),
  message: queryId("txt-message"),
  figureElement: queryId("figure")
};

export const modals = {
  openModal: queryId("open-help"),
  closeModal: queryId("close-help"),
  modal: queryId("modal")
};

export const buttons = {
  easyDifficulty: queryId("easy-difficulty"),
  normalDifficulty: queryId("normal-difficulty"),
  hardDifficulty: queryId("hard-difficulty"),
  pokemon: queryId("btnPokemon"),
  reset: queryId("btnReset"),
  types: queryClass("main-pokeguess-game-types-container-button"),
  generations: queryAll("[id*=gen]")
};

export const figures = {
  pokemon: queryId('figure')
};

export const effects = {
  fade: queryId('fade')
};