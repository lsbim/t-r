// scripts/build-character-summaries.js
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url';

// ─── ES 모듈에서 __dirname 흉내 내기 ───────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 터미널에서 실행 방법: 
// node scripts/build-character-summaries.js
// 입력

// 1) 공통 상수
const FRONTIER_DIR = path.resolve(__dirname, '../public/data/frontier')
const CLASH_DIR = path.resolve(__dirname, '../public/data/clash')
const OUT_DIR = path.resolve(__dirname, '../public/data/characters')

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
        { dir: CLASH_DIR, key: 'clash' }
    ];

    /** { [charName]: { seasonStats: Array<{ season: string, pickRate: number }> } } **/
    const charMap = {}

    for (let { dir, key: raidType } of SOURCE_DIRS) {
        const files = await listJsonFiles(dir);

        for (let filePath of files) {
            const seasonName = path.basename(filePath, '.json') // ex: '1', '2', '10'
            if (seasonName === "summary" || seasonName === "non_data") continue;

            const raw = JSON.parse(await fs.readFile(filePath, 'utf-8'))
            const records = raw.data // FrontierSeasonData.data 배열
            const seasonType = raw.type;

            let counts = {};

            // ① 등장 횟수 계산
            if (seasonType === "season") { // 
                counts = records
                    .flatMap(r => r.arr)
                    .reduce((acc, name) => {
                        acc[name] = (acc[name] || 0) + 1
                        return acc;
                    }, {})
            } else if (seasonType === "external") {
                counts = records
                    .reduce((acc, obj) => {
                        acc[obj.name] = obj.count
                        return acc;
                    }, {})
            }

            const total = seasonType === "season" ? records.length
                : 100 // external은 모두 100인

            // 캐릭터별 픽률 계산
            for (let [name, cnt] of Object.entries(counts)) {
                const pickRate = Math.round((cnt / total) * 1000) / 10 // 소수점 1자리
                if (!charMap[name]) {
                    charMap[name] = { frontier: [], clash: [] };
                }
                charMap[name][raidType].push({ season: seasonName, pickRate });
            }
        } // files 종료
    } // SOURCE_DIRS 종료

    // 4) 출력 디렉토리 준비
    await fs.mkdir(OUT_DIR, { recursive: true })

    // 5) 캐릭터별로 JSON 파일 쓰기
    await Promise.all(Object.entries(charMap).map(([name, summary]) =>
        fs.writeFile(
            path.join(OUT_DIR, `${name}.json`),
            JSON.stringify(summary, null, 2),
            'utf-8'
        )
    ));

    console.log('✅ character summaries built:', Object.keys(charMap).length)
}

// 실행
buildSummaries().catch(err => {
    console.error(err)
    process.exit(1)
})
