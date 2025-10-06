import { materials } from "../../data/materials";

const formatValue = (v?: number) => {
    if (v == null) return "";
    if (v >= 10_000_000_000) return `${Math.floor(v / 1_000_000_000)}B`;
    if (v >= 10_000_000) return `${Math.floor(v / 1_000_000)}M`;
    if (v >= 10_000) return `${Math.floor(v / 1_000)}K`;
    return `${v}`;
};

const matSet = new Set([...materials.map(mat => mat.name)])

const ItemIcon = ({ name, size, value }: { name: string, size?: number, value?: number }) => {

    if (!matSet.has(name) && name !== 'gold') {
        return null;
    }

    const itemInfo = materials.find(mat => mat.name === name);
    const bgUrl = `/images/slot/slot_${itemInfo ? `grade_${itemInfo.grade}.png` : "gold.png"}`;

    return (
        <div
            className="relative rounded-md overflow-hidden bg-center bg-no-repeat bg-contain flex items-center justify-center"
            style={{
                width: size || 60,
                height: size || 60,
                backgroundImage: `url('${bgUrl}')`
            }}
        >

            <img
                className="w-[55%] h-[55%] aspect-square object-contain pb-1"
                src={`/images/item/${itemInfo ? `${itemInfo?.name}.png` : 'gold.png'}`} />

            <div
                style={{
                    textShadow: '0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255), 0px 0px 1.2px rgb(255, 255, 255)'
                }}
                className="absolute font-bold bottom-[2px] select-none text-[14px]">
                {formatValue(value)}
            </div>
        </div >
    );
}

export default ItemIcon;