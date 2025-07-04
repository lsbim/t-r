
const PersonalityIcon = ({ personality }: { personality: string }) => {
    return (
        <div
            className={`
                    w-6 h-6 bg-${personality} drop-shadow-md clip-pentagon rotate-[-12deg] 
                    [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)] `}
        />
    );
}

export default PersonalityIcon;