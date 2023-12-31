import {
  DashboardFolder,
  DashboardItem,
  DashboardItemCandidate,
  DashboardItemID,
  DashboardItemType,
  DashboardLink,
} from "../types";
import { getChildren } from "../services/getChildren";

export const getItemType = (item: DashboardItem | DashboardItemCandidate) =>
  "url" in item ? "link" : "folder";

export const itemIsFolder = (item: DashboardItem): item is DashboardFolder =>
  getItemType(item) === "folder";

export const itemIsLink = (item: DashboardItem): item is DashboardLink =>
  getItemType(item) === "link";

export const itemIsCandidate = (
  item: DashboardItem | DashboardItemCandidate
): item is DashboardItemCandidate => {
  return !("_id" in item);
};

export const includesItem = (arr: DashboardItem[], item: DashboardItem) => {
  return arr.findIndex((v) => compareItems(v, item)) !== -1;
};

export const getItemID = (item: DashboardItem) => {
  return item._id;
};

export const checkItemID = (item: DashboardItem, id: DashboardItemID) => {
  return item._id === id;
};

export const compareItems = (a: DashboardItem, b: DashboardItem) => {
  return a._id === b._id;
};

export const arraySwap = <T>(arr: T[], from: number, to: number) => {
  const temp = arr[from];
  arr[from] = arr[to];
  arr[to] = temp;
};

export const itemIsInFolder = (
  item: DashboardItem,
  currentFolder: DashboardFolder
) => {
  return includesItem(getChildren(currentFolder), item);
};