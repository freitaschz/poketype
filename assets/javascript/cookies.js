function acceptButton(modal) {
    const btn = document.getElementById("cookie-accept-btn");
    btn.addEventListener("click", () => {
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 6);
        document.cookie = `cookie_consent=true;expires=${expirationDate.toUTCString()}`;
        modal.style.display = "none";
    });
}

export function consentCookies() {
    const cookieModal = document.getElementById("cookie-consent-modal");
    if (
        !document.cookie
            .split(";")
            .some((item) => item.trim().startsWith("cookie_consent=true"))
    ) {
        cookieModal.style.display = "flex";
        acceptButton(cookieModal);
    }
}
