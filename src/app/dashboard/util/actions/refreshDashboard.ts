import { Dispatch } from "react";
import { DashboardAction, DashboardView } from "../../types";
import { getByID } from "./getByID";
import { getItemID } from "../../util";

export const refreshDashboard = async (
  dashboard: DashboardView,
  dispatch: Dispatch<DashboardAction>
) => {
  const folderID = getItemID(dashboard.currentFolder);
  const folderWithData = await getByID(folderID);

  if (folderWithData) {
    dispatch({ type: "display_folder", folder: folderWithData.item, data: folderWithData });
  }
};
