// utils/navigation.ts
import { router } from 'expo-router';

type NavigateParams = {
  pathname: string;
  params?: Record<string, string>;
};

export function navigateTo({ pathname, params }: NavigateParams) {
  router.push({ pathname, params });
}
