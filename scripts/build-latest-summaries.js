import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_ROOT = path.resolve(__dirname, '../public/data');
const CLASH_DIR = path.join(DATA_ROOT, 'clash');
const FRONTIER_DIR = path.join(DATA_ROOT, 'frontier');
const CLASH_V2_DIR = path.join(DATA_ROOT, 'clash_v2');

const OUTPUT_FILE = path.join(DATA_ROOT, 'latest.json');

// 터미널에서 실행 방법: 
// node scripts/build-latest-summaries.js
// 입력

// 최신 시즌 정보 추출
async function getLatestSeasonInfo(dirPath) {
    try {
        const files = await fs.readdir(dirPath);

        let maxSeasonId = -1;
        let latestFile = null;

        // 가장 높은 시즌 번호 찾기
        for (const file of files) {
            if (!file.endsWith('.json')) continue;

            const fileName = path.basename(file, '.json');

            // 요약 파일 제외
            if (['summary', 'summaries', 'non_data', 'latest'].includes(fileName)) continue;

            const seasonNum = Number(fileName);

            // 숫자가 아니거나, 베타 시즌(10000 이상) 제외 -> 대충돌 2.0이 정식이 되면 다시 추가
            if (isNaN(seasonNum) || (seasonNum >= 10000 && dirPath === FRONTIER_DIR)) continue;

            if (seasonNum > maxSeasonId) {
                maxSeasonId = seasonNum;
                latestFile = file;
            }
        }

        // 최신 시즌이 없으면 null 반환
        if (!latestFile) return null;

        // 최신 파일 읽어서 필요한 정보만 추출
        const filePath = path.join(dirPath, latestFile);
        const rawData = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        const seasonData = processSummary(rawData.data, rawData.type);

        return {
            seasonNumber: maxSeasonId,
            name: rawData.name,
            personality: rawData.personality,
            startDate: rawData.startDate,
            endDate: rawData.endDate,
            summary: seasonData,
        };

    } catch (error) {
        return null;
    }
}


async function buildLatestSummary() {

    const [clash, frontier, clashV2] = await Promise.all([
        getLatestSeasonInfo(CLASH_DIR),
        getLatestSeasonInfo(FRONTIER_DIR),
        getLatestSeasonInfo(CLASH_V2_DIR)
    ]);

    const result = {
        clash: clash,
        frontier: frontier,
        clashV2: clashV2
    };

    await fs.writeFile(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf-8');

    console.log('✔️ public/data/latest.json');
}

// 실행
buildLatestSummary().catch(console.error);

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