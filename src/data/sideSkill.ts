export interface sideSkill {
    name: string;
    krName: string;
    description: string;
    backgroundColor: string;
}

// 컨텐츠에서 빌려쓰는 스킬
export const sideSkillList: sideSkill[] = [
    {
        name: 'clashV2Side1',
        krName: '신입 운동 XX이?',
        description: '최대 HP가 n% 증가한다.',
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
    },
    {
        name: 'clashV2Side2',
        krName: '라X카X 모X의 것이야',
        description: '일반 공격 25회 적중 시 n%\n의 추가 피해를 입힌다.',
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
    },
    {
        name: 'clashV2Side3',
        krName: '아르X의 그래X티',
        description: '스킬로 50회 피해를 입히면\n스프레이 캔이 떨어져\na~b%의 피해를 입힌다.',
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
    },
    {
        name: 'clashV2Side4',
        krName: 'X뉴아 다시XX 킥킥',
        description: '고학년 스킬의 피해량이 n%\n증가하고,고학년 스킬의 재사용\n대기시간이 n초 감소한다.',
        backgroundColor: 'rgba(92, 106, 115, 0.7)',
    },
    {
        name: 'clashV2Side5',
        krName: '말X젤리 츄X릅',
        description: '일반 공격 3회 적중 시 n%의\n추가 피해를 입힌다.',
        backgroundColor: 'rgba(162, 190, 94, 0.7)',
    },
    {
        name: 'clashV2Side6',
        krName: '흐에X에X엥',
        description: '일반 공격 3회 적중 시 n%의\n추가 피해 저학년 스킬, 고학년\n스킬 피해량 5% 감소',
        backgroundColor: 'rgba(220, 214, 203, 0.7)',
    },
    {
        name: 'clashV2Side7',
        krName: 'XX 걷기 좋은날',
        description: '고학년 스킬 재사용 대기시간 1초\n 감소, SP회복량 12%감소,\n디버프에 걸린 적에게 주는\n피해량 10% 증가',
        backgroundColor: 'rgba(69, 64, 64, 0.7)',
    },
]

export function getSideSkillKrName(name: string): string {
    return sideSkillList.find(s => s?.name === name)?.krName || '';
}

export function getSideSkillBGColor(name: string): string {
    return sideSkillList.find(s => s?.name === name)?.backgroundColor || 'rgba(255, 255, 255, 0.7)'
}