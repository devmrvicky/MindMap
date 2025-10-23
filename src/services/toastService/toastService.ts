import toast, { ToasterProps } from "react-hot-toast";

// interface ToastConfig {
//   duration: number;
//   position:ToastPosition;
//   style: React.CSSProperties;
//   className: string;
//   icon: string;
//   iconTheme: {
//     primary: string;
//     secondary: string;
//   };
//   ariaProps: {
//     role: "status" | "alert";
//     "aria-live": "assertive" | "polite" | "off";
//   };
//   removeDelay: number;
//   toasterId: string;
// }

export default class ToastService {
  successToast(message: string, toastConfig?: ToasterProps) {
    toast.success(message ? message : "Success", { ...toastConfig });
  }

  errorToast(message: string, toastConfig?: ToasterProps) {
    toast.error(message ? message : "Error", { ...toastConfig });
  }

  warnToast(message: string, toastConfig?: ToasterProps) {
    const style = {
      backgroundColor: "#ffe58b",
      color: "#000000",
      border: "1px solid #ffc107",
      borderRadius: "4px",
    };
    toast(message ? message : "warn", { ...toastConfig, style });
  }
}

export const toastService = new ToastService();
export const errorToast = toastService.errorToast;
export const successToast = toastService.successToast;
export const warnToast = toastService.warnToast;
