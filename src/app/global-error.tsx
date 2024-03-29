"use client";
import React from 'react';
import '../styles/reset.css';
import Layout from "./components/layout";
import { useTranslation } from 'react-i18next';

const Page: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <div className="bg-[#2795DB] flex min-h-[inherit] min-w-[100vw] justify-center items-center flex-col gap-[50px] p-[5px]">
        <header className="flex items-center gap-[20px]">
          <img
            src="/images/logo/logo.svg"
            className="w-[80px] max-[540px]:w-[60px]"
          />
          <p className="text-[48px] font-bold max-[540px]:text-[36px]">
            LinkBox
          </p>
        </header>

        <section className="flex flex-col justify-between items-center">
          <img
            src="/images/illustrations/server-error-illustration.svg"
            className="max-w-[500px] w-[90%]"
          />
        </section>

        <p className="font-bold text-[clamp(20px,8vw,40px)] text-center">
          {t("page.global-error")}
        </p>
      </div>
    </Layout>
  );
};

export default Page;
