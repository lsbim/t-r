import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 경로
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_ROOT = path.resolve(__dirname, '../public/data');
const CLASH_DIR = path.join(DATA_ROOT, 'clash');

const SUMMARIES_FILE = path.join(CLASH_DIR, 'summaries.json');
const CHART_DATA_FILE = path.join(CLASH_DIR, 'personality.json');

// 터미널에서 실행 방법: 
// node scripts/build-stats-summaries.js
// 입력


async function getRecent5Bosses() {
    try {
        const rawContent = await fs.readFile(SUMMARIES_FILE, 'utf-8');
        const allSummaries = JSON.parse(rawContent);

        // 시즌 번호 내림차순 정렬
        // Object.entries()
        const sortedSeasons = Object.entries(allSummaries)
            .map(([seasonNum, data]) => ({
                seasonNum: Number(seasonNum),
                data: data
            }))
            .sort((a, b) => b.seasonNum - a.seasonNum); // 내림차순 정렬

        // 성격 추적용 set
        const gatheredData = {};
        const seenPersonalities = new Set();

        // 성격별 총 5개만
        for (const item of sortedSeasons) {

            if (seenPersonalities.size >= 5) break;

            const personality = item.data.personality;

            // 데이터 추가
            if (personality && !seenPersonalities.has(personality)) {
                seenPersonalities.add(personality);

                gatheredData[item.seasonNum] = {
                    personality: personality,
                    name: item.data.name,
                    startDate: item.data.startDate,
                    endDate: item.data.endDate,
                    rules: item.data.rules || [],
                    maxLvl: item.data.maxLvl,
                    summary: item.data.summary
                };
            }
        }

        return gatheredData;

    } catch (error) {
        console.error(`Error in getRecent5Bosses: ${error}`);
        return {};
    }
}

// --- 메인 실행 함수 ---
async function buildLatestSummary() {
    console.log('Build start...');

    const pentagonData = await getRecent5Bosses();

    await fs.writeFile(
        CHART_DATA_FILE,
        JSON.stringify(pentagonData, null, 2),
        'utf-8'
    );

    console.log(`✔️ personality.json created (${Object.keys(pentagonData).length} seasons)`);
}

// 실행
buildLatestSummary().catch(console.error);
