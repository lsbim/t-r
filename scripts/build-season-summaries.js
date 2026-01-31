// scripts/build-character-summaries.js
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url';

// ─── ES 모듈에서 __dirname 흉내 내기 ───────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 터미널에서 실행 방법: 
// node scripts/build-season-summaries.js
// 입력

// 1) 공통 상수
const FRONTIER_DIR = path.resolve(__dirname, '../public/data/frontier')
const CLASH_DIR = path.resolve(__dirname, '../public/data/clash')
const CLASH_V2_DIR = path.resolve(__dirname, '../public/data/clash_v2')

// 2) 헬퍼: 폴더 내 모든 JSON 파일 경로 반환
async function listJsonFiles(dir) {
    return (await fs.readdir(dir))
        .filter(f => f.endsWith('.json'))
        .map(f => path.join(dir, f))
}

// 3) 모든 시즌 파일 로드 → 캐릭터별 누적
async function buildSummaries() {
    const SOURCE_DIRS = [
        { dir: FRONTIER_DIR, key: 'frontier' },
        { dir: CLASH_DIR, key: 'clash' },
        { dir: CLASH_V2_DIR, key: 'clashV2' }
    ];

    const dataMap = { clash: {}, frontier: {}, clashV2: {} }

    for (let { dir, key: raidType } of SOURCE_DIRS) {
        const files = await listJsonFiles(dir);

        for (let filePath of files) {
            const seasonName = path.basename(filePath, '.json') // ex: '1', '2', '10'
            if (seasonName === "summary" || seasonName === "non_data" || seasonName === "summaries") continue;

            const raw = JSON.parse(await fs.readFile(filePath, 'utf-8'));
            const records = raw.data // FrontierSeasonData.data 배열
            const seasonType = raw.type;

            let seasonData = null;
            let stagnation = null;

            // ① 등장 횟수 계산
            if (seasonType === "season") { // 
                seasonData = processSummary(records);

                // 고착화 점수 계산
                if (Array.isArray(records) && records.length >= 2) {
                    const arrScore = calculateStagnationScore(records, 'arr');

                    if (raidType === 'clashV2') {
                        const sideScore = calculateStagnationScore(records, 'sideArr');
                        stagnation = {
                            arr: arrScore,
                            side: sideScore
                        };
                    } else {
                        stagnation = {
                            arr: arrScore
                        };
                    }
                }
            } else if (seasonType === "external") {
                seasonData = records;
            }

            if (raidType === "clash" || raidType === 'clashV2') {
                dataMap[raidType][seasonName] = { rules: raw.rules }
            } else if (raidType === "frontier") {
                dataMap[raidType][seasonName] = { power: raw.power }
            }

            const resultData = {
                personality: raw.personality,
                name: raw.name,
                startDate: raw.startDate,
                endDate: raw.endDate,
                ...dataMap[raidType][seasonName],
                maxLvl: raw.maxLvl,
                summary: seasonData,
                stagnation: stagnation
            }

            if (raidType === 'clashV2') {
                dataMap[raidType][seasonName] = {
                    ...resultData,
                    maxSideLvl: raw.maxSideLvl,
                    sideSummary: processSummary(raw.data, 'side')
                };
            } else {
                dataMap[raidType][seasonName] = resultData;
            }

        } // files 종료
    } // SOURCE_DIRS 종료


    await Promise.all(
        Object.entries(dataMap).map(async ([raid, raidData]) => {
            // outDir: public/data/clash 혹은 public/data/frontier
            const outDir =
                raid === 'clash' ? CLASH_DIR :
                    raid === 'frontier' ? FRONTIER_DIR :
                        raid === 'clashV2' ? CLASH_V2_DIR :
                            null;
            if (!outDir) return;

            // 시즌 키들을 숫자 기준으로 내림차순 정렬
            const sortedSeasons = Object.keys(raidData)
                .sort((seasonKeyA, seasonKeyB) => { // ([],[])과 (a,b)는 string / [string] 반환 차이
                    const a = Number(seasonKeyA);
                    const b = Number(seasonKeyB);
                    const isBetaA = a > 10000;
                    const isBetaB = b > 10000;

                    if (isBetaA !== isBetaB) {
                        return isBetaA ? 1 : -1;
                    }

                    // 같은 그룹끼리는 내림차순
                    return b - a;
                })

            // 내림차순으로 정렬된 키를 그대로 새 객체로
            const output = {};
            for (const season of sortedSeasons) {
                output[`season_${season}`] = raidData[season];
            }

            const jsonText = JSON.stringify(output, null, 2)
                // 출력할 때 접두사 제거하여 원래 키로 복원
                .replace(/"season_(\d+)":/g, '"$1":');

            // 위 조치를 하지 않으면 replacer 인자에 sortedSeasons 넣을 시 모든 객체의 값이 빈 객체가 되고,
            // null 입력 시 객체의 값이 정상적으로 들어가지만 키의 정렬이 초기화 됨.
            // const jsonText = JSON.stringify(output, null, 2);

            const targetPath = path.join(outDir, 'summaries.json');
            await fs.writeFile(
                targetPath,
                jsonText,
                'utf-8'
            );
            console.log(`✔️  ${raid}/summaries.json (${sortedSeasons.length} seasons)`);
        })
    );
}

// 실행
buildSummaries().catch(err => {
    console.error(err)
    process.exit(1)
})

function processSummary(data, type) {
    // 인덱스 → 줄 위치 매핑
    const getLine = idx => {
        if (idx <= 2) return '전열';
        if (idx <= 5) return '중열';
        return '후열';
    };

    // key: `${name}|${line}`, value: { name, line, count }
    const map = new Map();
    if (type === 'side') {
        data.forEach(item => {
            item.sideArr.forEach((name, idx) => {
                const line = getLine(idx);
                const key = `${name}|${line}`;

                if (!map.has(key)) {
                    map.set(key, { name, line, count: 0 });
                }
                map.get(key).count++;
            });
        });
    } else {
        data.forEach(item => {
            item.arr.forEach((name, idx) => {
                const line = getLine(idx);
                const key = `${name}|${line}`;

                if (!map.has(key)) {
                    map.set(key, { name, line, count: 0 });
                }
                map.get(key).count++;
            });
        });
    }

    // Map 의 value 들을 배열로 만들어서 반환
    // console.log(Array.from(map.values()));
    return Array.from(map.values());
}

// 지니계수/자카드유사도 => 부정확
// 고착화 점수 평가(HHI) - 조합단위
function calculateStagnationScore(records, key) {
    let totalEntries = 0;
    const deckCounts = {}; // Key: 조합, Value: 횟수

    // 데이터 순회하며 조합단위로 카운팅
    records.forEach(user => {
        const rawDeck = user[key];
        if (Array.isArray(rawDeck) && rawDeck.length > 0) {

            // 우로스 성격 통합
            const cleanedDeck = rawDeck.map(name =>
                name.startsWith('우로스(') ? '우로스' : name
            );

            // 조합 key (가나다 순 정렬 -> 문자열 변환)
            // 조합이 같아도 순서가 달라서 다른 조합이 되지 않도록
            cleanedDeck.sort();
            const deckId = JSON.stringify(cleanedDeck);

            // 카운팅
            deckCounts[deckId] = (deckCounts[deckId] || 0) + 1;
            totalEntries++;
        }
    });

    if (totalEntries === 0) return 0;

    // HHI (허핀달 지수) 계산
    // 공식: 각 조합의 점유율(%)을 제곱해서 모두 더함
    // 예) A조합 50%, B조합 50% -> 2500 + 2500 = 5000점
    // 예) 100개 조합이 1%씩 -> 100 * 1 = 100점

    let hhiSum = 0;

    // 조합 순회
    for (const deckId in deckCounts) {
        const count = deckCounts[deckId];
        const share = (count / totalEntries) * 100; // 점유율

        // 점유율을 제곱하여 합산
        hhiSum += Math.pow(share, 2);
    }


    // 표준인 10000점 만점에서 100으로 나누어 반환
    return Number((hhiSum / 100).toFixed(1));
}