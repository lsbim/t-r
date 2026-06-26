import React, { useMemo, useState } from 'react'
import { Layer, Stage } from 'react-konva';
import Konva from "konva";
import { CharacterNode, isCharacterNode, isRaidNode, RaidNode, TimelineMap } from '../../../types/timeline/timelineTypes';
import CharacterNodes from './CharacterNodes';
import RaidNodes from './RaidNodes';
import TimelineWoodBG from './TimelineWoodBG';

interface MainStageProps {
  layerRef: React.RefObject<Konva.Layer | null>;
  onPointerDown: () => void;
  timelineMap: TimelineMap;
  timelinePx: number;
}

const MainStage: React.FC<MainStageProps> = ({
  layerRef,
  onPointerDown,
  timelineMap,
  timelinePx,
}) => {
  const [stageWidth, setStageWidth] = useState(window.innerWidth);

  const characterNodeList: CharacterNode[] = useMemo(() => {
    return Object.values(timelineMap).flat()
      .filter(isCharacterNode)
      .filter(node => node.birthDate !== '2023-09-27')
  }, [timelineMap])

  const raidNodeList: RaidNode[] = useMemo(() => {
    return Object.values(timelineMap).flat()
      .filter(isRaidNode)
  }, [timelineMap])

  const stageHeight = 500

  console.log("characterNodeList: ", characterNodeList)
  console.log("raidNodeList: ", raidNodeList)

  return (
    <div className={`w-full h-[${stageHeight}px] bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md overflow-hidden`}>
      <Stage
        onPointerDown={onPointerDown}
        width={stageWidth}
        height={600}>

        {/* offsetX에 영향받는 컨텐츠 */}
        <Layer
          perfectDrawEnabled={false}
          ref={layerRef}>
          {/* 나무팻말 배경 */}
          <TimelineWoodBG
            timelinePx={timelinePx}
            stageHeight={stageHeight}
          />

          {/* 사도 이미지 */}
          <CharacterNodes
            nodes={characterNodeList}
          />
          {/* 보스 이미지 */}
          <RaidNodes
            nodes={raidNodeList}
          />
        </Layer>

        {/* 독립 컨텐츠 */}
        <Layer>

        </Layer>

      </Stage>
    </div>
  )
}

export default React.memo(MainStage);