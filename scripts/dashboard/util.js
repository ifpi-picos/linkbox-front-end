import Button from "./Button.js";
import Link from "./Link.js";

export const getCardType = card => card.classList.contains("link-card") ? "link" : "folder";

export const inputLinkInfo = () => {
    const url = prompt("Url: ");
    if (!url.trim()) return null;
    const name = prompt("Name: ");
    if (!name.trim()) return null;

    return { name, url }
}

export const getLinkImg = (link) => {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${link.url}&sz=32`;
    const img = document.createElement("img");
    img.src = faviconUrl;
    return img
}

export const createLinkDataContainer = (link) => {
    const dataContainer = document.createElement("div");
    dataContainer.className = "link-data-container";

    const linkImg = getLinkImg(link);
    const infoContainer = createInfoContainer(link);

    dataContainer.appendChild(linkImg);
    dataContainer.appendChild(infoContainer);
    console.log(dataContainer)
    return dataContainer;
}

export const createInfoContainer = (link) => {
    const linkInfoContainer = document.createElement("div");
    const linkName = document.createElement("p");
    const linkUrl = document.createElement("p");

    linkName.textContent = link.name;
    linkName.className = "link-name";

    linkUrl.textContent = link.url;
    linkUrl.className = "link-url";

    linkInfoContainer.appendChild(linkName);
    linkInfoContainer.appendChild(linkUrl);
    linkInfoContainer.className = "info-container";

    return linkInfoContainer;
}

export const createLinkBtnsContainer = () => {
    let buttons = ["check_box_outline_blank", "content_copy", "content_cut", "expand_more", "palette", "edit", "delete"];

    buttons = buttons.map(btnName => new Button(btnName).getElement())

    let btnsContainer = document.createElement("div");
    btnsContainer.classList.add("link-btns-container");
    btnsContainer.classList.add("btns-container");

    buttons.forEach((btn) => {
        btnsContainer.appendChild(btn)
    })

    return btnsContainer;
}

export const createLinkCard = (link) => {
    const linkCard = document.createElement("div");
    linkCard.className = "link-card";
    linkCard.appendChild(createLinkDataContainer(link));
    linkCard.appendChild(createLinkBtnsContainer(link));
    linkCard.style.backgroundColor = link.colorBackground
    return linkCard;
}

export const deletar = () => {
    const index = 2
    const main = document.querySelector("main");
    const childElement = main.childNodes[index]
    childElement.remove()
}

export const changeColor = () =>{
    const cards = document.getElementsByClassName('link-card')
    const card = Array.from(cards) 
    console.log(card)
    console.log(card[1].style.backgroundColor = 'blue')
    //card2.links.colorBackground = "green"
}

const createLink = () => {
    const linkInfo = inputLinkInfo();
    if (!linkInfo) return null;

    return new Link(linkInfo.name, linkInfo.url);
}

export const addLinkToUI = () => {
    const main = document.querySelector("main");
    const newLink = createLink();

    if (newLink) {
        main.appendChild(createLinkCard(newLink));
    }
}