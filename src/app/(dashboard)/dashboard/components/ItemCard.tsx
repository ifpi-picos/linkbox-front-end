"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import FolderDataContainer from "./FolderDataContainer";
import LinkDataContainer from "./LinkDataContainer";
import {
  checkItemID,
  getItemID,
  getItemType,
  includesItem,
  itemIsFolder,
  itemIsLink,
} from "../utils";
import {
  DashboardContext,
  DashboardDispatchContext,
} from "../contexts/DashboardContext";
import BtnsContainer from "./ItemCard/BtnsContainer";
import { openFolder } from "../utils/actions/openFolder";
import { DashboardFolder, DashboardItem, DashboardLink } from "../types";
import { isMobile } from "react-device-detect";
import { useMobileView } from "../../../../hooks/useMobileView";

interface ItemCardProps {
  item: DashboardItem;
}

let clickCount = 0;
let clickedItem: DashboardItem;
let clickTimeout: ReturnType<typeof setTimeout>;
let currentCard: HTMLDivElement | null;

const ItemCard: React.FC<ItemCardProps & any> = ({ item, overInfo }) => {
  let [backgroundColor, setBackgroundColor] = useState(item.backgroundColor);
  const [hovering, setHovering] = useState(false);
  const { mobileView } = useMobileView();
  const itemType = getItemType(item);
  const computedProps = { [`data-${itemType}-id`]: getItemID(item).toString() };
  const card = useRef<HTMLDivElement>(null);
  const { selected } = useContext(DashboardContext);
  const dispatch = useContext(DashboardDispatchContext);
  const isSelected = includesItem(selected, item);

  const openItem = async (item: DashboardItem) => {
    if (itemIsLink(item)) {
      dispatch({ type: "open_link", link: item });
    } else {
      await openFolder(getItemID(item), dispatch);
    }
  };

  const onSingleClick = async () => {
    if (isMobile) {
      await openItem(item);
    } else {
      dispatch({ type: "select", item, behavior: "exclusive" });
    }
  };

  const onDoubleClick = async () => {
    if (!isMobile && card.current) {
      await openItem(item);
    }
  };

  useEffect(() => {
    const listener = ({ target }: MouseEvent) => {
      if (target && !currentCard?.contains(target as any)) {
        clickCount = 0;
      }
    };

    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);

  useEffect(() => {
    setBackgroundColor(item.backgroundColor);
  }, [item]);

  let className =
    "flex justify-between items-center min-h-[60px] h-[60px] py-[8px] px-[20px]";

  if (isSelected || (hovering && !overInfo)) {
    backgroundColor = "#DDE3EC";
  }

  if (overInfo && checkItemID(item, overInfo.id) && !isSelected) {
    if (overInfo.closeToCenter && itemIsFolder(item)) {
      backgroundColor = "#DDE3EC";
    } else {
      switch (overInfo.positionRelativeToCenter) {
        case "below": {
          className += ` !border-b-[1px] !border-b-solid !border-b-[#2795DB]`;
          break;
        }
        case "above": {
          className += ` !border-t-[1px] !border-t-solid !border-t-[#2795DB]`;
          break;
        }
      }
    }
  }

  className += " select-none";

  const handleOnClick: React.MouseEventHandler<HTMLDivElement> = async (e) => {
    e.stopPropagation();
    const oldClickItem = clickedItem;
    clickedItem = item;

    if (oldClickItem === clickedItem) {
      clickCount++;
    } else {
      clickCount = 1;
    }

    if (clickCount === 1) {
      await onSingleClick();
      currentCard = card.current;
      clickTimeout = setTimeout(() => {
        clickCount = 0;
      }, 500);
    } else {
      await onDoubleClick();
      clearTimeout(clickTimeout);
      clickCount = 0;
    }
  };

  let btnsVariant: "select_only" | "all" | null = null;

  if (mobileView) {
    btnsVariant = "select_only";
  } else if (hovering && !overInfo) {
    btnsVariant = "all";
  }

  return (
    <div
      className={`border-t-[2px] first:border-t-[1px] first:border-t-solid first:border-t-[#BBC8DC] border-b-[1px] border-b-solid border-b-[#BBC8DC] ${className}`}
      draggable={true}
      ref={card}
      style={{ backgroundColor }}
      onMouseOver={() => setHovering(true)}
      onMouseOut={() => setHovering(false)}
      onClick={handleOnClick}
      {...computedProps}
    >
      {itemType === "folder" ? (
        <FolderDataContainer folder={item as DashboardFolder} />
      ) : (
        <LinkDataContainer link={item as DashboardLink} />
      )}
      {!btnsVariant ? null : (
        <BtnsContainer
          item={item}
          setBackgroundColor={setBackgroundColor}
          variant={btnsVariant}
        />
      )}
    </div>
  );
};

export default ItemCard;
