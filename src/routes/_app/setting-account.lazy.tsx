import { UserProfile } from "@/components/account-setting/account-profile-box";
import { useAuthStore } from "@/lib/auth/authStore";

import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/setting-account")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useAuthStore((state) => state.user);
  if (!user) return null;
  return (
    <div className="container mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-6">Setting</h1>
      <UserProfile />
    </div>
  );
}
