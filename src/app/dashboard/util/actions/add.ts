import fetchJsonPayload from "../../../../Services/fetchJsonPayload";
import { DashboardItemCandidate, DashboardItemID } from "../../types";

export const add = async (folderID: DashboardItemID, item: DashboardItemCandidate) => {
  const { data: { item: addedItem } } = await fetchJsonPayload("post", `/items/default/${folderID}`, item);
  return addedItem;
};
