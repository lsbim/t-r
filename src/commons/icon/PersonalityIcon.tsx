
const PersonalityIcon = ({ personality, size }: { personality: string, size?: number }) => {
    return (
        <div
            style={{ width: size || 24, height: size || 24 }}
            className={`
                    ${personality === '공명' ? 'resonance-pers' : `bg-${personality}`} drop-shadow-md clip-pentagon rotate-[-12deg] 
                    [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)] `}
        />
    );
}

export default PersonalityIcon;