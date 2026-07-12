import { CharAttackType, charInfo, CharRole } from "../data/trickcalChar";
import { AllLine, CharacterIconInfo, Race } from "../types/trickcalTypes";



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

export function translateFacility(name: string) {

    switch (name) {
        case "lab":
            return '생산 랩';
        case "hall":
            return '연회장';
        case "adv":
            return '모험회';
        case "hq":
            return '교단 본부';
    }
}

export function translateRaid(name: string) {

    switch (name) {
        case "clash":
            return '차원 대충돌';
        case "clashV2":
            return '차원 대충돌 2.0';
        case "frontier":
            return '엘리아스 프론티어';
    }
}

export function getDaysSince(dateString: string) {
    // 한국 시간대로 날짜만 추출
    const koreaToday = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const todayMidnight = new Date(koreaToday.getFullYear(), koreaToday.getMonth(), koreaToday.getDate());

    // - 토큰으로 연월일 나누기
    const [year, month, day] = dateString.split('-').map(Number);
    const targetMidnight = new Date(year, month - 1, day);

    // 일 수 차이 계산
    const diffTime = todayMidnight.getTime() - targetMidnight.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
}

export function translateRaces(race: Race) {
    switch (race) {
        case '마녀':
            return 'witch';
        case '수인':
            return 'werebeast';
        case '엘프':
            return 'elf';
        case '요정':
            return 'sprite';
        case '용족':
            return 'dragon';
        case '유령':
            return 'phantom';
        case '정령':
            return 'elemental';
        case '미스틱':
            return 'mystic';
    }
}

export function translateLine(line: AllLine) {
    switch (line) {
        case '전열':
            return 'front';
        case '중열':
            return 'middle';
        case '후열':
            return 'back';
        case '모든열':
            return 'all';
    }
}


export function translateRole(role: CharRole) {
    switch (role) {
        case '딜러':
            return 'dps';
        case '서포터':
            return 'supporter';
        case '탱커':
            return 'tanker';
    }
}

export function translateAttackType(type: CharAttackType) {
    switch (type) {
        case '마법':
            return 'magic';
        case '물리':
            return 'physical';
    }
}

export function preload(src: string): Promise<void> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
    });
}




const CHAR_ICON_CONFIGS: {
    folder: string;
    getValue: (c: typeof charInfo[string]) => string
    translate: (v: string) => string;
}[] = [
        { folder: "personality", getValue: (c) => c.personality, translate: (v) => v },
        { folder: "role", getValue: (c) => c.role, translate: (v) => translateRole(v as CharRole) },
        { folder: "role", getValue: (c) => c.attackType, translate: (v) => translateAttackType(v as CharAttackType) }, // role과 폴더 공유
        { folder: "line", getValue: (c) => c.line, translate: (v) => translateLine(v as AllLine) },
        { folder: "race", getValue: (c) => c.race, translate: (v) => translateRaces(v as Race) },
    ];

export function getCharacterIcons(charName: string): CharacterIconInfo[] {
    const character = charInfo[charName];
    
    return CHAR_ICON_CONFIGS.map(({ folder, getValue, translate }) => {
        const value = getValue(character);
        return {
            tooltip: value,
            src: `/images/${folder}/${translate(value)}.webp`,
        };
    });
}