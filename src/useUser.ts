import { useEffect } from "react";
import Router, { useRouter } from "next/router";
import useSWR from "swr";
import { User } from "@/src/types";

export default function useUser({
  redirectTo = ""
} = {}) {
  const { data: user, error, isLoading: isFetching } = useSWR<User>("/api/user");
  const router = useRouter();
  let isLoading = isFetching || !router.isReady;

  useEffect(() => {
    if (isLoading) { return };

    const isForbiddenRequest = error?.response.status === 403;
    const isUnknownError = error && error.response.status !== 403;

    const shouldRedirect = !isLoading && (isForbiddenRequest || isUnknownError) && redirectTo;

    if (
      shouldRedirect
      ) {
        router.push(redirectTo);
    }
  }, [user, router, isLoading, error, redirectTo]);

  return { user, error, isLoading };
}
