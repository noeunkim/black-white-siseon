
export type Reference = {
    title: string;
    url: string;
};

export type Point = {
    headline: string;
    description: string;
    references?: Reference[];
};

export type Issue = {
    id: string;
    title: string;
    category: string;
    publishDate: string;
    oneLineSummary: string;
    coreSummary: string;
    proPerspective: {
        points: Point[];
    };
    conPerspective: {
        points: Point[];
    };
    neutralMeta?: string;
    imageUrl?: string;
    feedback: {
        neutralityScore: number;
        commentCount: number;
    }
};

export const issues: Issue[] = [
    {
        id: "1",
        title: "거대 AI 실험, 일시 중단해야 하는가?",
        category: "테크 / 사회",
        publishDate: "2024-05-15",
        oneLineSummary: "GPT-4보다 강력한 AI 시스템 개발을 6개월간 중단하자는 논쟁",
        coreSummary: "수많은 전문가와 테크 리더들이 GPT-4보다 강력한 AI 시스템의 학습을 6개월간 중단할 것을 촉구했습니다. 이들은 인류와 사회에 미칠 심각한 위험을 경고하지만, 반대 측은 이것이 비현실적이며 유익한 기술 발전을 저해한다고 주장합니다.",
        proPerspective: {
            points: [
                {
                    headline: "잠재적 위험 방지",
                    description: "고도로 발달한 AI는 적절히 통제되지 않을 경우 파국적인 위험을 초래할 수 있습니다. 일시 중단은 안전 프로토콜이 기술 발전 속도를 따라잡을 시간을 벌어줍니다.",
                    references: [{ title: "Future of Life Institute 서한", url: "#" }]
                },
                {
                    headline: "정보 생태계 보호",
                    description: "AI가 생성한 가짜 정보와 콘텐츠의 홍수에 사회가 적응하고, 진실과 거짓을 구분할 수 있는 도구를 개발할 시간이 필요합니다."
                }
            ]
        },
        conPerspective: {
            points: [
                {
                    headline: "과학적 진보 저해",
                    description: "AI는 의료, 에너지, 기후 문제 해결에 혁신적인 돌파구를 마련하고 있습니다. 지금 멈추는 것은 이러한 필수적인 혜택을 지연시킬 뿐입니다."
                },
                {
                    headline: "지정학적 불균형 초래",
                    description: "책임감 있는 주체들이 개발을 멈추더라도, 경쟁 국가나 악의적인 행위자들은 개발을 지속하여 전략적 우위를 점할 수 있습니다."
                }
            ]
        },
        neutralMeta: "이 논쟁의 핵심은 '안전과 통제' 대 '혁신과 속도'의 트레이드오프에 있습니다. 양측 모두 AI의 잠재력에는 동의하지만, 위험이 닥칠 시점에 대해서는 이견을 보입니다.",
        imageUrl: "https://placehold.co/600x400/111/FFF?text=AI+Dilemma",
        feedback: {
            neutralityScore: 4.8,
            commentCount: 124
        }
    },
    {
        id: "2",
        title: "재택근무 vs 사무실 복귀",
        category: "경제 / 비즈니스",
        publishDate: "2024-05-14",
        oneLineSummary: "직원의 유연성과 기업의 대면 협업 요구 간의 지속적인 충돌",
        coreSummary: "팬데믹이 완화되면서 주요 기업들은 조직 문화와 생산성 향상을 이유로 사무실 복귀(RTO)를 의무화하고 있습니다. 반면 직원들은 워라밸과 업무 효율성을 근거로 이에 반발하고 있습니다.",
        proPerspective: { // 재택근무 찬성 (Pro Remote)
            points: [
                {
                    headline: "워라밸 및 웰빙 향상",
                    description: "출퇴근 시간을 없애 스트레스를 줄이고, 개인적인 삶과 업무를 더 효율적으로 조율할 수 있게 합니다."
                },
                {
                    headline: "인재 확보 용이",
                    description: "거주지의 제약 없이 전 세계의 우수한 인재를 채용할 수 있어 기업 경쟁력을 높일 수 있습니다."
                }
            ]
        },
        conPerspective: { // 사무실 복귀 찬성 (Pro Office)
            points: [
                {
                    headline: "협업과 혁신 촉진",
                    description: "우연한 마주침과 대면 회의는 창의적인 문제 해결과 강력한 조직 문화를 구축하는 데 필수적입니다.",
                },
                {
                    headline: "주니어 멘토링 효과",
                    description: "주니어 사원들은 시니어들과 직접 상호작용하며 업무를 배우는 것이 훨씬 빠르지만, 원격 환경에서는 이것이 어렵습니다."
                }
            ]
        },
        neutralMeta: "이는 개인의 효율성(재택)과 집단의 일체감(사무실) 간의 충돌로 볼 수 있습니다. 현재는 하이브리드 모델이 절충안으로 떠오르고 있습니다.",
        imageUrl: "https://placehold.co/600x400/222/EEE?text=Office+War",
        feedback: {
            neutralityScore: 4.2,
            commentCount: 89
        }
    },
    {
        id: "3",
        title: "기본소득제(UBI) 도입 논란",
        category: "정치 / 경제",
        publishDate: "2024-05-12",
        oneLineSummary: "모든 시민에게 조건 없이 현금을 지급하는 것이 타당한가?",
        coreSummary: "자동화로 인한 일자리 위협 속에서, 자산 심사 없이 모든 시민에게 최소 생계비를 지급하는 기본소득제가 대안으로 거론됩니다. 그러나 막대한 비용과 근로 의욕 저하 우려도 큽니다.",
        proPerspective: {
            points: [
                {
                    headline: "빈곤 해소 및 생계 안정",
                    description: "복잡한 선별 과정 없이 현금을 직접 지급하는 것이 빈곤을 해결하고 시민들에게 경제적 자율성을 부여하는 가장 효율적인 방법입니다."
                },
                {
                    headline: "불안정 노동의 안전망",
                    description: "전통적인 복지 제도는 플랫폼 노동자나 프리랜서를 충분히 보호하지 못합니다. UBI는 소득 변동성에 대한 확실한 버팀목이 됩니다."
                }
            ]
        },
        conPerspective: {
            points: [
                {
                    headline: "재정적 지속 불가능성",
                    description: "모든 시민에게 의미 있는 금액을 매달 지급하려면 천문학적인 예산이 필요하며, 이는 급격한 증세로 이어질 수 있습니다."
                },
                {
                    headline: "근로 의욕 저하",
                    description: "조건 없는 소득 보장은 사람들의 구직 의욕을 꺾어 노동력 부족과 경제 침체를 유발할 수 있습니다."
                }
            ]
        },
        neutralMeta: "핵심 쟁점은 경제적 실현 가능성과 '일'에 대한 인간 심리입니다. 현재 전 세계적으로 다양한 실험이 진행 중입니다.",
        imageUrl: "https://placehold.co/600x400/000/FFF?text=UBI",
        feedback: {
            neutralityScore: 4.5,
            commentCount: 204
        }
    }
];
