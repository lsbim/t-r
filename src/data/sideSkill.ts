export interface sideSkill {
    name: string;
    krName: string;
    description: string;
    backgroundColor: string;
}

// 대충돌 2.0 베타 시즌 6에서 사용된 clashV2Side11의 이미지는 clashV2Side2와 같다.
// 비슷한 사례가 더 나올 시 재활용 가능한 함수로 만들어 사용

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
        description: '일반 공격 3회 적중 시 n%의\n추가 피해 저학년 스킬, 고학년\n스킬 피해량 n% 감소',
        backgroundColor: 'rgba(220, 214, 203, 0.7)',
    },
    {
        name: 'clashV2Side7',
        krName: 'XX 걷기 좋은날',
        description: '고학년 스킬 재사용 대기시간 n초\n 감소, SP회복량 n%감소,\n디버프에 걸린 적에게 주는\n피해량 n% 증가',
        backgroundColor: 'rgba(69, 64, 64, 0.7)',
    },
    {
        name: 'clashV2Side8',
        krName: '퓨X☆XX닝 빔',
        description: '회복량 n% 증가, 보호막 효과\nn% 감소. HP 회복 효과를 9번\n받을 때마다 n%의 피해를\n입히는 투사체를 발사한다.',
        backgroundColor: 'rgba(129, 131, 147, 0.7)',
    },
    {
        name: 'clashV2Side9',
        krName: 'X굴 X굴 X굴비',
        description: '스킬 피해량 n% 증가, 일반\n공격 피해량 n% 감소. 저학년\n스킬을 사용할 때마다, 해당\n사도의 현재 고학년 스킬 재사용\n대기시간이 즉시 n% 감소한다.',
        backgroundColor: 'rgba(166, 192, 147, 0.7)',
    },
    {
        name: 'clashV2Side10',
        krName: '언X그라X드 디X',
        description: 'HP 회복 효과를 5번 받을\n때마다, 5초 동안 해당 사도의\n스킬 피해량이 n% 증가한다.\n(최대 99회 중첩) 일반 공격\n피해량이 n% 감소한다.',
        backgroundColor: 'rgba(159, 53, 97, 0.7)',
    },
    {
        name: 'clashV2Side11',
        krName: '나X방지 프로XX',
        description: '일반 공격 9회 적중 시 n%의\n추가 피해를 입히는 번개를\n발사한다. 공격 속도가 n%,\n받는 피해량이 n% 증가한다.',
        backgroundColor: 'rgba(255, 206, 86, 0.7)',
    },
]

export function getSideSkillKrName(name: string): string {
    return sideSkillList.find(s => s?.name === name)?.krName || '';
}

export function getSideSkillBGColor(name: string): string {
    return sideSkillList.find(s => s?.name === name)?.backgroundColor || 'rgba(255, 255, 255, 0.7)'
}