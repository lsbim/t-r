import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// build-season-summaries.js 실행 후에 실행해야 함 (summaries.json를 가져다 씀)

// 아래 두 값은 src/features/raid/shared/utils/raidStatConfig.ts의 STAT_SEASON_WINDOW, RANK_CUT_RANKS와 같은 값으로 유지할 것
const SEASON_WINDOW = 10; // 최근 N시즌
const RANK_CUT_RANKS = [1, 10, 100, 300];

const LINE_ORDER = ['전열', '중열', '후열'];

// 콘텐츠별 설정
const RAIDS = [
    { name: 'clash', dir: path.resolve(__dirname, '../public/data/clash'), metrics: ['duration'] },
    { name: 'clashV2', dir: path.resolve(__dirname, '../public/data/clash_v2'), metrics: ['duration'] },
    { name: 'frontier', dir: path.resolve(__dirname, '../public/data/frontier'), metrics: ['score', 'coin'] },
];

// 공명 사도 본체명 통합 (scripts/build-character-info.js의 normalizeCharName과 같은 규칙)
const RESONANCE_BASE_NAMES = ['우로스', '비비(신성)'];
const normalizeCharName = name =>
    RESONANCE_BASE_NAMES.find(base => name !== base && name.startsWith(base)) ?? name;

const isBeta = seasonNumber => seasonNumber > 10000;

async function listSeasonNumbers(dir) {
    return (await fs.readdir(dir))
        .filter(f => /^\d+\.json$/.test(f))
        .map(f => Number(path.basename(f, '.json')))
        .sort((a, b) => (isBeta(b) - isBeta(a)) || a - b);
}

// 열별 사도 사용 횟수: summaries.json를 가져와 공명 사도를 본체명으로 합산
function buildRates(summaryItems) {
    const map = new Map();
    for (const { name, line, count } of summaryItems) {
        const baseName = normalizeCharName(name);
        const key = `${baseName}|${line}`;
        if (!map.has(key)) {
            map.set(key, { name: baseName, line, count: 0 });
        }
        map.get(key).count += count;
    }
    // 열 -> 사용 횟수 -> 이름 순 정렬
    return Array.from(map.values()).sort((a, b) =>
        LINE_ORDER.indexOf(a.line) - LINE_ORDER.indexOf(b.line)
        || b.count - a.count
        || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
    );
}

// 순위 컷별 기록 값 (기록이 없으면 null)
function buildCuts(records, metrics) {
    const byRank = new Map(records.map(record => [record.rank, record]));
    const cuts = {};
    for (const metric of metrics) {
        cuts[metric] = {};
        for (const rank of RANK_CUT_RANKS) {
            cuts[metric][rank] = byRank.get(rank)?.[metric] ?? null;
        }
    }
    return cuts;
}

// 조합별 사용 팀 수 (내림차순)
// 9인 편성만 집계하고, 슬롯 위치와 무관하게 사도 구성이 같으면 같은 조합으로 봄
function buildComboCounts(records) {
    const map = new Map();
    for (const { arr } of records) {
        if (arr.length !== 9 || arr.some(name => !name)) continue;
        const key = arr.map(normalizeCharName).sort().join('|');
        map.set(key, (map.get(key) ?? 0) + 1);
    }
    return Array.from(map.values()).sort((a, b) => b - a);
}

// 시즌 하나의 통계 만들기
function buildSeasonStats(season, raw, summary, raid) {
    const records = raw.data;
    const rank1 = records.find(record => record.rank === 1);

    return {
        season,
        name: raw.name,
        startDate: raw.startDate,
        endDate: raw.endDate,
        personality: raw.personality, // 프론티어는 없음
        maxLvl: raw.maxLvl,
        userTotalCount: records.length,
        rates: buildRates(summary),
        cuts: buildCuts(records, raid.metrics),
        comboCounts: buildComboCounts(records),
        top1Arr: (rank1?.arr ?? []).filter(Boolean).map(normalizeCharName),
    };
}

// 콘텐츠 하나 처리
async function buildRaidStats(raid) {
    const summaries = JSON.parse(await fs.readFile(path.join(raid.dir, 'summaries.json'), 'utf-8'));
    const seasonNumbers = (await listSeasonNumbers(raid.dir)).slice(-SEASON_WINDOW);

    const seasons = [];
    for (const season of seasonNumbers) {
        const raw = JSON.parse(await fs.readFile(path.join(raid.dir, `${season}.json`), 'utf-8'));

        if (raw.type !== 'season') {
            throw new Error(`${raid.name} ${season}.json: type이 'season'이 아닙니다 (type: ${raw.type})`);
        }

        const summary = summaries[season]?.summary;
        if (!Array.isArray(summary)) {
            throw new Error(`${raid.name} ${season}: summaries.json에 시즌 요약이 없습니다. build-season-summaries.js를 먼저 실행하세요.`);
        }

        seasons.push(buildSeasonStats(season, raw, summary, raid));
    }

    const jsonText = JSON.stringify({ seasons });
    await fs.writeFile(path.join(raid.dir, 'stats.json'), jsonText, 'utf-8');

    const sizeKb = (Buffer.byteLength(jsonText) / 1024).toFixed(1);
    console.log(`✔️  ${raid.name}/stats.json (${seasons.length} seasons, ${sizeKb}KB)`);
}

// 실행
async function main() {
    for (const raid of RAIDS) {
        await buildRaidStats(raid);
    }
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})