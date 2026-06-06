import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 경로
const DATA_ROOT = path.resolve(__dirname, '../public/data');
const CLASH_DIR = path.join(DATA_ROOT, 'clash');
const FRONTIER_DIR = path.join(DATA_ROOT, 'frontier');
const CLASH_V2_DIR = path.join(DATA_ROOT, 'clash_v2');
const OUTPUT_DIR = path.join(DATA_ROOT, 'character');
const CHAR_INFO_PATH = path.resolve(__dirname, '../src/data/trickcalChar.ts');

const SKIP_NAMES = new Set(['summary', 'summaries', 'non_data', 'latest']);

// 유틸
const calcRate = (count, total) =>
    total > 0 ? Math.round((count / total) * 1000) / 10 : 0;

const getLineByIdx = idx => (idx <= 2 ? '전열' : idx <= 5 ? '중열' : '후열');

const getCharInfo = (name, charInfoMap) => charInfoMap[name]

const isAllLineChar = (name, charInfoMap) =>
    getCharInfo(name, charInfoMap)?.line === '모든열';

function sortSeasonDesc(a, b) {
    const isBetaA = a > 10000;
    const isBetaB = b > 10000;
    if (isBetaA !== isBetaB) return isBetaA ? 1 : -1;
    return b - a;
}

const normalizeCharName = name => name.startsWith('우로스(') ? '우로스' : name;


// 동점 처리 예) [100, 100, 80] -> 1, 1, 2위(공동 1위 처리)
function buildDenseRankMap(items, keyFn, valueFn) {
    const sorted = [...items].sort((a, b) => valueFn(b) - valueFn(a));
    const rankMap = new Map();

    for (let i = 0, rank = 1; i < sorted.length; i++) {
        if (i > 0 && valueFn(sorted[i]) < valueFn(sorted[i - 1])) rank = i + 1;
        rankMap.set(keyFn(sorted[i]), rank);
    }
    return rankMap;
}

// 사복 카운트
function countSkin(arr, skinArr, charName, skinCounts) {
    if (!arr || !skinArr) return;

    const idx = arr.findIndex(n => normalizeCharName(n) === charName);

    if (idx !== -1 && skinArr[idx]) {
        skinCounts.set(skinArr[idx], (skinCounts.get(skinArr[idx]) ?? 0) + 1);
    }
}

// charInfo 텍스트로 정규식을 거쳐 가져오기
async function parseCharInfo(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const charInfo = {};
    const blockRe = /"([^"]+)":\s*\{([^}]+)\}/g;

    for (const m of content.matchAll(blockRe)) {
        if (m[1].startsWith('우로스(')) continue;

        const name = m[1];
        const block = m[2];
        const lineM = block.match(/line:\s*["']([^"']+)["']/);
        const birthdateM = block.match(/birthdate:\s*["']([^"']+)["']/);
        const personalityM = block.match(/personality:\s*["']([^"']+)["']/);

        if (lineM && birthdateM) {
            charInfo[name] = {
                line: lineM[1],
                birthdate: birthdateM[1],
                personality: personalityM?.[1] ?? null,
            };
        }
    }
    return charInfo;
}

// 폴더 별 시즌 데이터 가져오기
async function loadSeasons(dirPath) {
    const files = await fs.readdir(dirPath);

    const validBases = files
        .filter(f => f.endsWith('.json'))
        .map(f => path.basename(f, '.json'))
        .filter(base => !SKIP_NAMES.has(base) && !isNaN(Number(base)));

    const seasons = await Promise.all(
        validBases.map(async base => {
            const raw = JSON.parse(
                await fs.readFile(path.join(dirPath, `${base}.json`), 'utf-8')
            );
            return { seasonNumber: Number(base), raw };
        })
    );

    return seasons.sort((a, b) => sortSeasonDesc(a.seasonNumber, b.seasonNumber));
}

// 픽 정보 external/season 타입별 계산
function computePickStats(raw, charInfoMap) {
    return raw.type === 'external'
        ? computeExternalStats(raw.data, charInfoMap)
        : computeSeasonStats(raw.data, charInfoMap, 'arr');
}
// 대충돌 2.0 전용
function computePickStatsV2(raw, charInfoMap) {
    return {
        main: computeSeasonStats(raw.data, charInfoMap, 'arr'),
        side: computeSeasonStats(raw.data, charInfoMap, 'sideArr'),
    };
}

// Set에 사도 출전 수 저장, 대충돌 2.0은 림+셰이디 합계된다.
function computeSeasonStats(data, charInfoMap, arrKey) {
    const totalCounts = new Map();
    const lineCountsMap = new Map();

    const processName = (name, idx, seen) => {
        if (seen.has(name)) return;
        seen.add(name);
        totalCounts.set(name, (totalCounts.get(name) ?? 0) + 1);
        if (isAllLineChar(name, charInfoMap)) {
            const line = getLineByIdx(idx);
            if (!lineCountsMap.has(name)) lineCountsMap.set(name, new Map());
            const lc = lineCountsMap.get(name);
            lc.set(line, (lc.get(line) ?? 0) + 1);
        }
    };

    for (const entry of data) {
        const seen = new Set();
        // arrKey = 'arr' -> entry.arr / 'sideArr' -> entry.sideArr에 접근
        entry[arrKey]?.forEach((name, idx) => {
            processName(normalizeCharName(name), idx, seen);
        });
    }

    return buildRankMap(totalCounts, data.length, lineCountsMap, charInfoMap);
}

function computeExternalStats(data, charInfoMap) {
    const totalCounts = new Map();
    const lineCountsMap = new Map();
    let total = 0;

    // external 데이터엔 우로스가 없음
    for (const item of data) {
        totalCounts.set(item.name, (totalCounts.get(item.name) ?? 0) + item.count);
        total += item.count;

        if (isAllLineChar(item.name, charInfoMap)) {
            if (!lineCountsMap.has(item.name)) lineCountsMap.set(item.name, new Map());
            const lc = lineCountsMap.get(item.name);
            lc.set(item.line, (lc.get(item.line) ?? 0) + item.count);
        }
    }
    return buildRankMap(totalCounts, total, lineCountsMap, charInfoMap);
}

// 전체 순위 계산
function computeOverallRankMap(totalCounts) {
    return buildDenseRankMap( // 동점처리
        [...totalCounts.entries()],
        ([name]) => name,
        ([, count]) => count,
    );
}

// 사도들 열별로 묶기
// 모든열 사도는 lineCountsMap에서 열별 카운트를 꺼내 각 열에 등록
function groupCharsByLine(totalCounts, lineCountsMap, charInfoMap) {
    const lineGroups = new Map();

    for (const [name, count] of totalCounts.entries()) {
        const charLine = getCharInfo(name, charInfoMap)?.line;
        if (!charLine) continue;

        if (charLine === '모든열') {
            for (const [line, lineCount] of (lineCountsMap.get(name) ?? new Map()).entries()) {
                if (!lineGroups.has(line)) lineGroups.set(line, []);
                lineGroups.get(line).push({ name, count: lineCount });
            }
        } else {
            if (!lineGroups.has(charLine)) lineGroups.set(charLine, []);
            lineGroups.get(charLine).push({ name, count });
        }
    }
    return lineGroups;
}

// 열별 순위 계산
// 결과: Map<charName, Array<{ line, rank, count }>>
function computeLineRankMap(lineGroups) {
    const lineRankMap = new Map();

    for (const [line, group] of lineGroups.entries()) {
        const rankInLine = buildDenseRankMap(
            group,
            ({ name }) => name,
            ({ count }) => count,
        );

        for (const { name, count } of group) {
            if (!lineRankMap.has(name)) lineRankMap.set(name, []);
            lineRankMap.get(name).push({ line, rank: rankInLine.get(name), count });
        }
    }
    return lineRankMap;
}

// 최종 결과 맵 조립
function buildRankMap(totalCounts, total, lineCountsMap, charInfoMap) {
    const overallRankMap = computeOverallRankMap(totalCounts);
    const lineGroups = groupCharsByLine(totalCounts, lineCountsMap, charInfoMap);
    const lineRankMap = computeLineRankMap(lineGroups);

    const result = new Map();
    for (const [name, count] of totalCounts.entries()) {
        result.set(name, {
            count,
            rate: calcRate(count, total),
            totalEntries: total,
            overallRank: overallRankMap.get(name),
            lineRanks: lineRankMap.get(name) ?? [],
        });
    }
    return result;
}


function extractTopEntries(charLine, allLine, stat, season, contentType) {
    const result = [];
    const base = {
        seasonNumber: season.seasonNumber,
        name: season.raw.name ?? null,
        personality: season.raw.personality ?? null,
        startDate: season.raw.startDate ?? null,
        endDate: season.raw.endDate ?? null,
        pickCount: stat.count,
        pickRate: stat.rate,
        //    대충돌 2.0에서 림/셰이디 어느쪽 1위인지 체크용
        ...(contentType !== undefined && { contentType }),
    };

    if (!allLine) {
        // 일반 사도는 isOverall 계산 필요 없음
        const isLineTop1 = stat.lineRanks.some(lr => lr.rank === 1);
        if (!isLineTop1) return result;
        result.push({ ...base, isOverall: false, line: charLine });
    } else {
        // 모든열 사도는 전체 1등 or 특정 열 1등이면
        const isOverall = stat.overallRank === 1;
        const lineTop1s = stat.lineRanks.filter(lr => lr.rank === 1);
        if (!isOverall && lineTop1s.length === 0) return result;

        if (isOverall) {
            result.push({ ...base, isOverall: true, line: null });
        }
        for (const { line, count: lineCount } of lineTop1s) {
            result.push({
                ...base,
                isOverall: false,
                line,
                linePickCount: lineCount,
                linePickRate: calcRate(lineCount, stat.totalEntries),
            });
        }
    }
    return result;
}

// 1위한 시즌 수집
function getTopSeasons(charName, seasonStats, charInfoMap) {
    const charLine = getCharInfo(charName, charInfoMap)?.line ?? null;
    const allLine = charLine === '모든열';
    const result = [];

    for (const season of seasonStats) {
        // 'sidePickStats'가 있으면 대충돌 2.0
        const isV2 = 'sidePickStats' in season;

        // main 통계 처리(대충돌, 프론티어, 셰이디의차원)
        const mainStat = season.pickStats?.get(charName);
        if (mainStat) {
            result.push(
                // 대충돌 2.0 = contentType: main, 대충돌/프론티어는 contentType 없음
                ...extractTopEntries(charLine, allLine, mainStat, season, isV2 ? 'main' : undefined)
            );
        }

        // 림의 이면세계 처리
        if (isV2 && season.sidePickStats) {
            const sideStat = season.sidePickStats.get(charName);
            if (sideStat) {
                result.push(
                    ...extractTopEntries(charLine, allLine, sideStat, season, 'side')
                );
            }
        }
    }
    return result;
}

// 최근 n개 시즌 성적
function getRecentStats(charName, seasonStats, n) {
    return seasonStats.slice(0, n).map(s => {
        const stat = s.pickStats.get(charName);
        return {
            seasonNumber: s.seasonNumber,
            name: s.raw.name ?? null,
            personality: s.raw.personality ?? null,
            startDate: s.raw.startDate ?? null,
            endDate: s.raw.endDate ?? null,
            pickCount: stat?.count ?? 0,
            pickRate: stat?.rate ?? 0,
            overallRank: stat?.overallRank ?? null,
            lineRanks: stat?.lineRanks ?? [],
            totalEntries: stat?.totalEntries ?? 0,
        };
    });
}

// 최근 사복 top3
function getRecentSkinTop3(charName, clashStats, frontierStats, clashV2Stats) {
    const skinCounts = new Map();

    // 각 컨텐츠별 최신 시즌 1개씩만 참조
    for (const stats of [clashStats, frontierStats, clashV2Stats]) {
        const latest = stats[0];
        if (!latest || latest.raw.type !== 'season') continue;

        for (const entry of latest.raw.data) {
            countSkin(entry.arr, entry.skinArr, charName, skinCounts);
            countSkin(entry.sideArr, entry.sideSkinArr, charName, skinCounts);
        }
    }

    return [...skinCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([skinName, count]) => ({ skinName, count }));
}

// 메인 함수
async function buildCharacterStats() {
    const charInfoMap = await parseCharInfo(CHAR_INFO_PATH);
    const allCharNames = Object.keys(charInfoMap);
    console.log(`✔️ charInfo 파싱: ${allCharNames.length}명`);

    const [clashSeasons, frontierSeasons, clashV2Seasons] = await Promise.all([
        loadSeasons(CLASH_DIR),
        loadSeasons(FRONTIER_DIR),
        loadSeasons(CLASH_V2_DIR),
    ]);
    console.log(
        `✔️ 시즌 로드 clash: ${clashSeasons.length}, ` +
        `frontier: ${frontierSeasons.length}, clashV2: ${clashV2Seasons.length}`
    );

    const precompute = seasons =>
        seasons.map(s => ({ ...s, pickStats: computePickStats(s.raw, charInfoMap) }));

    const precomputeV2 = seasons =>
        seasons.map(s => {
            const { main, side } = computePickStatsV2(s.raw, charInfoMap);
            return { ...s, pickStats: main, sidePickStats: side };
        });

    const clashStats = precompute(clashSeasons);
    const frontierStats = precompute(frontierSeasons);
    const clashV2Stats = precomputeV2(clashV2Seasons);
    console.log('✔️ 픽 통계 계산 완료');

    const needRecentSeasonNumber = 5; // 가져올 컨텐츠별 시즌 갯수

    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    await Promise.all(allCharNames.map(async charName => {
        const meta = charInfoMap[charName];
        const output = {
            birthdate: meta.birthdate,
            line: meta.line,
            personality: meta.personality,
            topSeasons: {
                clash: getTopSeasons(charName, clashStats, charInfoMap),
                frontier: getTopSeasons(charName, frontierStats, charInfoMap),
                clashV2: getTopSeasons(charName, clashV2Stats, charInfoMap),
            },
            recentStats: {
                clash: getRecentStats(charName, clashStats, needRecentSeasonNumber),
                frontier: getRecentStats(charName, frontierStats, needRecentSeasonNumber),
                clashV2: getRecentStats(charName, clashV2Stats, needRecentSeasonNumber),
            },
            recentSkins: getRecentSkinTop3(charName, clashStats, frontierStats, clashV2Stats),
        };

        await fs.writeFile(
            path.join(OUTPUT_DIR, `${charName}.json`),
            JSON.stringify(output, null, 2),
            'utf-8'
        );
    }));

    console.log(`✔️ public/data/character/ → ${allCharNames.length}개 파일`);
}

buildCharacterStats().catch(err => {
    console.error(err);
    process.exit(1);
});