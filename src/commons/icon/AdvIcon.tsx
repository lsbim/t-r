import React from "react";
import { adventure } from "../../data/adventures";
import ItemIcon from "./ItemIcon";

const adventureSet = new Set([...Object.keys(adventure).map(k => k)])

const AdvIcon = ({ name, text }: { name: string, text: string }) => {

    if (!name || !adventureSet.has(name)) return null;

    const advInfo = adventure[name];

    return (
        <div
            style={{ width: 110, height: 160 }}
            className="relative flex flex-col items-center border-4 border-[rgb(226,220,200)] bg-[rgb(248,253,242)] rounded-lg">
            <div
                className="mt-[5%] mb-[5%]">
                <div className="text-[12px] truncate font-bold text-[rgb(93,61,48)] max-w-[95px] min-w-0 mx-auto">
                    {name}
                </div>
            </div>
            <div className="w-[85%] relative aspect-[254/176]">
                <img src={`/images/adventure/adventure_${advInfo.advId}_back.png`} />
                {advInfo?.frontWidth && (
                    <img
                        style={{ width: `${advInfo.frontWidth}%` }}
                        className="absolute bottom-0"
                        src={`/images/adventure/adventure_${advInfo.advId}_front.png`} />
                )}
            </div>
            <div className="mt-[8%] flex gap-x-1">
                {advInfo.yieldMaterials.map(mat => (
                    <ItemIcon key={mat.name} name={mat.name} size={30} />
                ))}
            </div>
            <div className="absolute text-[rgb(93,61,48)] font-bold bottom-0 h-[20px] pt-[2px] bg-[rgb(226,220,200)] w-full flex text-[13px] items-center justify-center">
                {text}
            </div>
        </div>
    );
}

export default React.memo(AdvIcon);