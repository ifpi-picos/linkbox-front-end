"use client";
import React, { Dispatch, useContext, useEffect, useState } from 'react';
import Icon from '../../../../components/Icon';
import { DashboardAction, DashboardFolder } from '../types';
import { getFolderByPath } from "../services/getFolderByPath";
import { DashboardContext, DashboardDispatchContext } from '../contexts/DashboardContext';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/Breadcrumb"
import { useTranslation } from "react-i18next";
 
interface FolderBreadcrumbProps {
  folder: DashboardFolder;
}

const locationToPath = (location: string[]) => {
  return location.join("/");
}

const goToLocation = async  (location: string[], dispatch: Dispatch<DashboardAction>) => {
  const path = locationToPath(location);
  const folderWithData = await getFolderByPath(path);
  dispatch({ type: "open_folder", folder: folderWithData.item, data: folderWithData });
}

const FolderBreadcrumb: React.FC<FolderBreadcrumbProps> = ({ folder }) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<string[] | null>(null);
  const dashboard = useContext(DashboardContext);
  const dispatch = useContext(DashboardDispatchContext);

  useEffect(() => {
    let newLocation = dashboard.dataOfCurrentFolder.location;
    setLocation(newLocation);
  }, [dashboard.dataOfCurrentFolder.location]);

  return (
    <Breadcrumb className="h-[36px] flex items-center">
      {
        location && location.length > 0
          ? <BreadcrumbItem>
              <div
                onClick={async () => await goToLocation([], dispatch)}
                className="hover:cursor-pointer hover:bg-[#c2c8d1] hover:duration-[0.2s] h-[36px] px-[8px] rounded-lg flex items-center gap-2"
              >
                <Icon name="home" />
                <p>{t("page.dashboard.breadcrumb.root-node")}</p>
              </div>
            </BreadcrumbItem>
          : null
      }
      {
        location?.map((folderName, i) => {
          const thisLocation = location.slice(0, i + 1);

          const handleClick = async () => {
            await goToLocation(thisLocation, dispatch);
          }

          return (
            <BreadcrumbItem key={i}>
              <div
                onClick={handleClick}
                className="hover:cursor-pointer hover:bg-[#c2c8d1] hover:duration-[0.2s] h-[36px] px-[8px] rounded-lg flex items-center"
              >
                {folderName}
              </div>
            </BreadcrumbItem>
          );
        })
      }
    </Breadcrumb>
  );
}

export default FolderBreadcrumb;
