export function consentCookies() {
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
  })
};