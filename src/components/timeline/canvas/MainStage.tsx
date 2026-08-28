import Konva from "konva";
import React, { RefObject, useEffect, useMemo, useState } from 'react';
import { Layer, Stage } from 'react-konva';
import { MiniLoading } from "../../../commons/component/Loading";
import { containerDarkBG } from "../../../styles/container";
import { CharacterNode, isCharacterNode, isRaidNode, RaidNode, TimelineMap } from '../../../types/timeline/timelineTypes';
import { races } from "../../../types/trickcalTypes";
import { translateRaces } from "../../../utils/function";
import { timelineEvents, timelineLayers, timelineStage } from "../../../utils/timeline/timelineFunction";
import CharacterCardList from './CharacterCardList';
import RaidCardList from "./RaidCardList";
import RowDivider from "./RowDivider";
import TimelineStageBg from "./TimelineStageBg";
import { preloadImages } from "../../../utils/imageCache";

interface MainStageProps {
  layerRef: React.RefObject<Konva.Layer | null>;
  onPointerDown: () => void;
  timelineMap: TimelineMap;
  timelinePx: number;
  containerRef: RefObject<HTMLDivElement | null>
  stageWidth: number;
  isPositionReady: boolean;
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
  isPositionReady,
}) => {

  const [imagesReady, setImagesReady] = useState(false);

  const characterNodeList: CharacterNode[] = useMemo(() => {
    return Object.values(timelineMap).flat()
      .filter(isCharacterNode)
      .filter(node => node.birthDate !== '2023-09-27')
      .sort((a, b) => a.birthDate.localeCompare(b.birthDate));
  }, [timelineMap])

  const raidNodeList: RaidNode[] = useMemo(() => {
    return Object.values(timelineMap).flat()
      .filter(isRaidNode)
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [timelineMap])

  const imageUrls = useMemo<string[]>(() => {
    const urls = new Set<string>();

    // 배경
    urls.add("/images/background/character_bg.webp");

    // 열
    ["all", "back", "front", "middle",].forEach((line) => {
      urls.add(`/images/line/${line}.webp`);
    });

    // 역할
    ["dps", "magic", "physical", "supporter", "tanker",].forEach((role) => {
      urls.add(`/images/role/${role}.webp`);
    });

    // 종족
    races.forEach((race) => {
      urls.add(`/images/race/${translateRaces(race)}.webp`);
    });

    // 사도
    characterNodeList.forEach((node) => {
      urls.add(`/images/character/${node.name}.webp`);
      urls.add(`/images/profile/${node.name}.webp`);
      urls.add(`/images/personality/${node.personality}.webp`);
    });

    // 보스
    raidNodeList.forEach((node) => {
      urls.add(node.personality
        ? `/images/boss/${node.name}(${node.personality}).webp`
        : `/images/boss/${node.name}.webp`
      );

      urls.add(node.personality
        ? `/images/personality/보스_${node.personality}.webp`
        : `/images/personality/보스_무성격.webp`
      );
    });

    return [...urls].sort();
  }, [characterNodeList, raidNodeList]);

  useEffect(() => {
    let cancelled = false;

    if (characterNodeList.length === 0 && raidNodeList.length === 0) return;
    if (!imageUrls) return;

    preloadImages(imageUrls)
      .then(() => {
        if (!cancelled) setImagesReady(true);
      })

    return () => {
      cancelled = true;
    };
  }, [imageUrls, characterNodeList.length, raidNodeList.length,]);

  const isFullyReady = isPositionReady && imagesReady;

  console.log("characterNodeList: ", characterNodeList)
  console.log("raidNodeList: ", raidNodeList)

  return (
    <div
      onDragStart={(e) => e.preventDefault()}
      ref={containerRef}
      style={{ height: STAGE_HEIGHT }}
      className={`w-full ${containerDarkBG} rounded-sm overflow-hidden touch-none cursor-pointer relative`}>

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
          <TimelineStageBg
            timelinePx={timelinePx}
            stageWidth={stageWidth}
            stageHeight={STAGE_HEIGHT}
          />

          {/* 열 구분선 */}
          <RowDivider
            timelinePx={timelinePx}
          />

          {isFullyReady && (
            <>
              <RaidCardList nodes={raidNodeList} rowY={getRowY('raid')} />
              <CharacterCardList nodes={characterNodeList} rowY={getRowY('character')} />
            </>
          )}

        </Layer>

        {/* 애니메이션 전용 레이어 */}
        <Layer
          ref={(node) => {
            if (node) timelineLayers.setOverlayLayer(node);
          }}
        />

      </Stage>

      {!isFullyReady && (
        <MiniLoading />
      )}
    </div>
  )
}

export default React.memo(MainStage);