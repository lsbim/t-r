export interface sideSkill {
    name: string;
    krName: string;
    description: string;
}

// 컨텐츠에서 빌려쓰는 스킬
export const sideSkillList: sideSkill[] = [
    {
        name: 'clashV2Side1',
        krName: '신입 운동 XX이?',
        description: '최대 HP가 n% 증가한다.',
    },
    {
        name: 'clashV2Side2',
        krName: '라X카X 모X의 것이야',
        description: '일반 공격 25회 적중 시 n%\n의 추가 피해를 입힌다.',
    },
    {
        name: 'clashV2Side2',
        krName: '아르X의 그래X티',
        description: '스킬로 50회 피해를 입히면\n스프레이 캔이 떨어져\na~b%의 피해를 입힌다.',
    },
]