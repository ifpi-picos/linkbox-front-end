import React from 'react';
import Icon from '../../components/Icon';
import { DashboardFolder } from '../types';

interface FolderDataContainer {
  folder: DashboardFolder;
}

const FolderDataContainer: React.FC<FolderDataContainer> = ({ folder }) => {
  return <div className="flex items-center gap-[20px]">
    <div className="flex justify-center items-center w-[32px] h-[32px]">
      <Icon name="folder" />
    </div>
    <p className="text-[18px]">{folder.name}</p>
  </div>;
};

export default FolderDataContainer;
