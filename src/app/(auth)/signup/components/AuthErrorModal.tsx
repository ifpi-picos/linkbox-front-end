"use client";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/Dialog";
import { useRef, useState } from "react";
import Icon from "../../../../components/Icon";

interface AuthErrorModalProps {
  error: string;
}

const useForceUpdate = () => {
  const [_, setValue] = useState(false);
  return () => setValue((value) => !value);
};

const AuthErrorModal: React.FC<AuthErrorModalProps> = ({ error }) => {
  const innerRender = useRef(false);
  const open = useRef(error !== "");
  const forceUpdate = useForceUpdate();

  if (!innerRender.current) {
    open.current = error !== "";
  }

  innerRender.current = false;

  return (
    <Dialog
      open={open.current}
      onOpenChange={
        (newValue) => {
          innerRender.current = true;
          open.current = newValue;
          forceUpdate();
        }
      }
    >
      <DialogHeader />
      <DialogContent className="sm:max-w-[425px]">
        <div className="flex flex-col gap-[20px]">
          <div className="text-center">
            <Icon name="error_outline" className="my-4 text-[3.5rem]" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {error}
            </h3>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthErrorModal;
