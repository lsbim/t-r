import Konva from "konva";
import React, { RefObject, useMemo, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { CharacterNode, isCharacterNode, isRaidNode, RaidNode, TimelineMap } from '../../../types/timeline/timelineTypes';
import { timelineEvents, timelineLayers, timelineStage } from "../../../utils/timeline/timelineFunction";
import CharacterCardList from './CharacterCardList';
import RaidCardList from "./RaidCardList";
import RowDivider from "./RowDivider";
import TimelineWoodBG from './TimelineWoodBG';

interface MainStageProps {
  layerRef: React.RefObject<Konva.Layer | null>;
  onPointerDown: () => void;
  timelineMap: TimelineMap;
  timelinePx: number;
  containerRef: RefObject<HTMLDivElement | null>
  stageWidth: number;
}

// 타임라인의 카드 마우스오버 시 떠오르는 높이
export const HOVER_LIFT_Y = -20;

// 타임라인 주제 나열 기준
export const TIMELINE_ROW_ORDER = ['raid', 'character'] as const;
export const ROW_HEIGHT = 140;
// +1은 컨텐츠가 3줄일 시 제거 생각할 것
const STAGE_HEIGHT = (TIMELINE_ROW_ORDER?.length + 1) * ROW_HEIGHT + -HOVER_LIFT_Y;

export function getRowY(rowName: typeof TIMELINE_ROW_ORDER[number]): number {
  // 엣지+점프 여백
  return 20 + (ROW_HEIGHT * (TIMELINE_ROW_ORDER.indexOf(rowName)));
}

const MainStage: React.FC<MainStageProps> = ({
  containerRef,
  stageWidth,
  layerRef,
  onPointerDown,
  timelineMap,
  timelinePx,
}) => {

  const characterNodeList: CharacterNode[] = useMemo(() => {
    return Object.values(timelineMap).flat()
      .filter(isCharacterNode)
      .filter(node => node.birthDate !== '2023-09-27')
      .sort((a, b) => a.birthDate.localeCompare(b.birthDate));
  }, [timelineMap])

  const raidNodeList: RaidNode[] = useMemo(() => {
    return Object.values(timelineMap).flat()
      .filter(isRaidNode)
  }, [timelineMap])

  console.log("characterNodeList: ", characterNodeList)
  console.log("raidNodeList: ", raidNodeList)

  return (
    <div
      ref={containerRef}
      className={`w-full h-[${STAGE_HEIGHT}px] bg-white dark:bg-zinc-900 rounded-sm overflow-hidden`}>
      <Stage
        ref={(node) => {
          if (node) timelineStage.set(node);
        }}
        onTap={() => timelineEvents.emitDeactivateAll()}
        onClick={() => timelineEvents.emitDeactivateAll()}
        onPointerDown={onPointerDown}
        width={stageWidth}
        height={STAGE_HEIGHT}>

        {/* offsetX에 영향받는 컨텐츠 */}
        <Layer
          perfectDrawEnabled={false}
          ref={layerRef}>
          {/* 나무팻말 배경 */}
          <TimelineWoodBG
            timelinePx={timelinePx}
            stageWidth={stageWidth}
            stageHeight={STAGE_HEIGHT}
          />

          {/* 열 구분선 */}
          <RowDivider
            timelinePx={timelinePx}
          />

          {/* 보스 이미지 */}
          <RaidCardList
            nodes={raidNodeList}
            rowY={getRowY('raid')}
          />

          {/* 사도 이미지 */}
          <CharacterCardList
            nodes={characterNodeList}
            rowY={getRowY('character')}
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