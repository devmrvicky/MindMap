import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create<AuthStoreState>()(
  persist<AuthStoreState>(
    (set) => ({
      user: null,
      login: (user: User | null) =>
        set(() => ({
          user: user,
        })),
      logout: () =>
        set(() => ({
          user: null,
        })),
      canUseWithoutAuth: true,
      setCanUseWithoutAuth: (canUse: boolean) =>
        set(() => {
          return {
            canUseWithoutAuth: canUse,
          };
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
