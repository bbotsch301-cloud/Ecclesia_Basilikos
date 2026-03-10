import { useAuth } from "./useAuth";

export function useCtaHref() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? "/dashboard" : "/signup";
}
