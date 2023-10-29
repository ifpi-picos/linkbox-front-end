"use client";
import React, { useContext, useRef, useState } from 'react';
import { DashboardContext, DashboardDispatchContext } from '../contexts/DashboardContext';
import ItemCard from './ItemCard';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragMoveEvent,
  ClientRect,
  DragEndEvent,
  Active,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import DashboardItem from '../DashboardItem';
import { itemIsFolder } from '../util';
import ItemDragOverlay from './ItemDragOverlay';
import DashboardFolder from '../DashboardFolder';

const getClientVerticalPositionRelativeToElementCenter = (
  clientY: number,
  rect: ClientRect,
  centerMaxOffset: number
) => {
  const { top, height } = rect;
  const center = top + height / 2;
  const positionRelativeToCenter = clientY >= center ? "below" : "above";

  if (centerMaxOffset > 0 && centerMaxOffset < 1) {
    centerMaxOffset = Math.round(centerMaxOffset * height);
  }

  const isPositionCloseToCenter = clientY >= center - centerMaxOffset && clientY <= center + centerMaxOffset;

  return { positionRelativeToCenter, isPositionCloseToCenter };
}

const getCursorPositionInfo = (event: DragMoveEvent, items: DashboardItem[]) => {
  const { over, active } = event;
  const itemOver = items.find(item => item.id === over?.id);

  if (!active.rect.current.translated || !over || !itemOver) {
    return;
  }

  const cursorPositionOnActivation = (event.activatorEvent as any).clientY;
  const cursorPosition = cursorPositionOnActivation + event.delta.y;

  const { isPositionCloseToCenter, positionRelativeToCenter } =
    getClientVerticalPositionRelativeToElementCenter(cursorPosition, over.rect, 0.2);

  return { isPositionCloseToCenter, positionRelativeToCenter };
}

type OverInfo = NonNullable<ReturnType<typeof getCursorPositionInfo>> & { id: number }

interface CardsContainerProps { items: DashboardItem[] };

const CardsContainer: React.FC<CardsContainerProps> = ({ items }) => {
  const cardsContainer = useRef(null);
  const dashboard = useContext(DashboardContext);
  const dispatch = useContext(DashboardDispatchContext);
  const { selected, currentFolder } = dashboard;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const childrenOfCurrentFolder = currentFolder.getChildren();
  const hasItems = items.length > 0;
  const [overInfo, setOverInfo] = useState<OverInfo | null>(null);
  const [activeID, setActiveID] = useState<number | null>(null);
  const manySelected = selected.length > 1;
  const active = childrenOfCurrentFolder.find(child => child.id === activeID);

  const moveToFolder = (folder: DashboardFolder) => {
    if (manySelected) {
      const itemIDs = selected.map(item => item.id);
      dispatch({ type: "move_many", itemIDs, folderID: folder.id });
      dispatch({ type: "reset_selection" });
    } else if (activeID) {
      dispatch({ type: "move", itemID: activeID, folderID: folder.id });
    }
  }

  const reposition = (active: Active, newIndex: number) => {
    const strategy = overInfo!.positionRelativeToCenter === "above" ? "before" : "after";

    if (manySelected) {
      const indexes = selected
        .map(item => {
          return childrenOfCurrentFolder.findIndex(child => child.id === item.id);
        })
        .filter(index => index !== -1)
        .toSorted();

      dispatch({ type: "reposition_many", indexes, newIndex, strategy });
    } else {
      const currentIndex = items.findIndex(item => item.id === active.id);
      dispatch({ type: "reposition", currentIndex, newIndex, strategy });
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const overIsSelected = selected.find(item => item.id === over?.id) !== undefined;

    if (over !== null && active.id !== over.id && !overIsSelected) {
      const newIndex = items.findIndex(item => item.id === over.id);
      const overItem = items[newIndex];

      if (itemIsFolder(overItem) && overInfo!.isPositionCloseToCenter) {
        moveToFolder(overItem);
      } else {
        reposition(active, newIndex);
      }
    }

    setOverInfo(null);
  }

  const handleDragStart = ({ active }: DragStartEvent) => {
    const activeIsSelected = selected.find(item => item.id === active.id) !== undefined;

    if (!activeIsSelected) {
      dispatch({ type: "select", itemID: (active.id as number), behavior: "exclusive" });
    }

    setActiveID(active.id as number);
  }

  const handleDragMove = (e: DragMoveEvent) => {
    const id = e.over?.id;
    const cursorPositionInfo = getCursorPositionInfo(e, items);

    if (!id || !cursorPositionInfo) {
      return;
    }

    const hasChanged =
      overInfo?.positionRelativeToCenter !== cursorPositionInfo.positionRelativeToCenter ||
      overInfo?.isPositionCloseToCenter !== cursorPositionInfo.isPositionCloseToCenter ||
      overInfo?.id !== id

    if (hasChanged) {
      setOverInfo({ ...cursorPositionInfo, id: id as number });
    }
  }

  const handleOnClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== cardsContainer.current) {
      return;
    }

    e.stopPropagation();
    dispatch({ type: "reset_selection" });
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div
          className={`cards-container${hasItems ? "" : " hidden"}`}
          onClick={handleOnClick}
          ref={cardsContainer}
        >
          {
            items.map(
              (item, i) => (
                <SortableItem key={i} id={item.id}>
                  <ItemCard item={item} key={i} overInfo={overInfo} />
                </SortableItem>
              )
            )
          }
        </div>
      </SortableContext>
      <ItemDragOverlay
        draggedItems={manySelected ? selected : (active ? [active] : [])}
        active={active!}
      />
    </DndContext>
  );
}


export default CardsContainer;