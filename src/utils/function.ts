import { charInfo } from "../data/trickcalChar";



export function findPersonalityByName(name: string) {
    return charInfo[name]?.personality;
}

export function findHexByName(name: string) {
    const personality = findPersonalityByName(name);

    if (!personality) return;

    switch (personality) {
        case "순수":
            return '#66c17c';
        case "냉정":
            return '#83b9eb';
        case "광기":
            return '#eb839a';
        case "활발":
            return '#ebdb83';
        case "우울":
            return '#c683ec';
    }
}