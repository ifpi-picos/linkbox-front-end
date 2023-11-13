import React, { useContext } from "react";
import { DashboardContext } from "../contexts/DashboardContext";
import { checkItemID, getItemType, itemIsFolder } from "../util";
import FolderDataContainer from "./FolderDataContainer";
import LinkDataContainer from "./LinkDataContainer";
import { DragOverlay, Modifier } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import DragIndicator from "./DragIndicator";
import { DashboardFolder, DashboardItem, DashboardLink } from "../types";

const snapTopLeftToCursor: Modifier = (_ref) => {
  const { draggingNodeRect } = _ref;
  const transform = snapCenterToCursor(_ref);

  if (draggingNodeRect) {
    // -1 is needed because otherwise the cursor coordinates may get off the
    // overlay, triggering onMouseOver/onMouseOut on components underneath
    transform.x += draggingNodeRect.width / 2 - 1;
    transform.y += draggingNodeRect.height / 2 - 1;
  }

  return transform;
};

interface ItemDragOverlayProps {
  draggedItems: DashboardItem[];
  active?: DashboardItem;
}

const ItemDragOverlay: React.FC<ItemDragOverlayProps> = ({ draggedItems, active }) => {
  if (!active) {
    return null;
  }

  const typeOfActiveItem = getItemType(active);
  let className = "flex justify-between items-center min-h-[60px] h-[60px] py-[8px] px-[20px] bg-[#DDE3EC] gap-[20px]";

  const dataContainer = typeOfActiveItem === "folder"
      ? <FolderDataContainer folder={active as DashboardFolder} />
      : <LinkDataContainer link={active as DashboardLink} />

  return (
    <DragOverlay modifiers={[snapTopLeftToCursor]}>
      <div className="drag-image" style={{ display: "inline-block" }}>
        <div className={className}>
          {dataContainer}
          <DragIndicator amount={draggedItems.length} />
        </div>
      </div>
    </DragOverlay>
  );
};

export default ItemDragOverlay;
