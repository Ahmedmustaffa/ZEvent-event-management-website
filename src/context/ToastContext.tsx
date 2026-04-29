"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";

type ToastType = "success" | "failure" | "warning";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(
    null,
  );

  const showToast = (msg: string, type: ToastType = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="fixed right-5 bottom-5 z-100">
          <Toast>
            <div
              className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                toast.type === "success"
                  ? "bg-green-100 text-green-500"
                  : toast.type === "failure"
                    ? "bg-red-100 text-red-500"
                    : "bg-orange-100 text-orange-500"
              }`}
            >
              {toast.type === "success" && <HiCheck className="h-5 w-5" />}
              {toast.type === "failure" && <HiX className="h-5 w-5" />}
              {toast.type === "warning" && (
                <HiExclamation className="h-5 w-5" />
              )}
            </div>
            <div className="ml-3 text-sm font-normal">{toast.msg}</div>
            {/* <Toast.Toggle onDismiss={() => setToast(null)} /> */}
          </Toast>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};
