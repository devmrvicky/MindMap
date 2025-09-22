// src/hooks/useAppInit.ts
import { useAuthInit } from "./useAuth";
import { useChatRoomInit } from "./useChatRoomInit";
import { useThemeInit } from "./useTheme";
import { useModelsInit } from "./useModelsInit";

export function useAppInit() {
  useAuthInit();
  useChatRoomInit();
  useThemeInit();
  useModelsInit();
}
