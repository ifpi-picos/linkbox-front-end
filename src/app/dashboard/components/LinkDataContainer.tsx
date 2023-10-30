import React from 'react';
import DashboardLink from '../DashboardLink';

interface LinkDataContainerProps {
  link: DashboardLink;
}

const LinkDataContainer: React.FC<LinkDataContainerProps> = ({ link }) => {
  return <div className="flex items-center gap-[20px]">
    <div className="flex justify-center items-center w-[32px] h-[32px]">
      <img src={`https://www.google.com/s2/favicons?domain=${link.url}&sz=32`} />
    </div>

    <div className="info-container">
      <p className="text-[18px]">{link.title}</p>
      <p className="text-[12px]">{link.url}</p>
    </div>
  </div>;
};

export default LinkDataContainer;
