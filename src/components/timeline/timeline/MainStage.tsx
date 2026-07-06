import Konva from "konva";
import React, { useMemo, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { CharacterNode, isCharacterNode, isRaidNode, RaidNode, TimelineMap } from '../../../types/timeline/timelineTypes';
import { timelineEvents, timelineLayers } from "../../../utils/timeline/timelineFunction";
import CharacterCardList from './CharacterCardList';
import TimelineWoodBG from './TimelineWoodBG';
import RaidCardList from "./RaidCardList";

interface MainStageProps {
  layerRef: React.RefObject<Konva.Layer | null>;
  onPointerDown: () => void;
  timelineMap: TimelineMap;
  timelinePx: number;
  isDragging: boolean;
}

const MainStage: React.FC<MainStageProps> = ({
  layerRef,
  onPointerDown,
  timelineMap,
  timelinePx,
  isDragging,
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
        onTap={() => timelineEvents.emitDeactivateAll()}
        onClick={() => timelineEvents.emitDeactivateAll()}
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
            stageWidth={stageWidth}
            stageHeight={stageHeight}
          />

          {/* 사도 이미지 */}
          <CharacterCardList
            nodes={characterNodeList}
            isDragging={isDragging}
          />
          {/* 보스 이미지 */}
          <RaidCardList
            nodes={raidNodeList}
            isDragging={isDragging}
          />
        </Layer>

        {/* 애니메이션 전용 레이어 */}
        <Layer
          ref={(node) => {
            if (node) timelineLayers.setOverlayLayer(node);
          }}
        />

      {/* 독립 컨텐츠 */}
      <Layer>

      </Layer>

    </Stage>
    </div >
  )
}

export default React.memo(MainStage);