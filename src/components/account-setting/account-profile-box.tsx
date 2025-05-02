import { useAuthStore } from "@/lib/auth/authStore";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { AccountUpdateDialog } from "./change-password-dialog";
import { useState } from "react";
import { SignatureUploadDialog } from "./upload-signature-dialog";

export function UserProfile() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSignatureDialogOpen, setIsSignatureDialogOpen] = useState(false);
  const user = useAuthStore((state) => state.user);

  const changePasswordAuthor = user?.role === 2 || user?.role === 3;
  const uploadSignatureAuthor = user?.role === 1;

  if (!user) return <div>Loading...</div>;

  // 🔁 Ubah user object agar sesuai AccountUsers
  type LocalAccountUser = {
    id: string | number;
    name: string;
    username: string;
    email: string;
    password: string;
    role: "icicyta" | "icodsa";
  };

  const userAccount: LocalAccountUser = {
    id: String(user.id),
    name: user.name,
    username: user.username,
    email: user.email,
    password: "", // dummy
    role: user.role === 2 ? "icodsa" : "icicyta",
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center">Account Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-semibold mb-2">Username</p>
            <Input value={user.name} disabled />
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Email</p>
            <Input value={user.email} disabled />
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Role</p>
            <Input value={userAccount.role} disabled />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          {changePasswordAuthor && (
            <>
              <Button onClick={() => setIsDialogOpen(true)}>
                Change Password
              </Button>
              <AccountUpdateDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode="edit"
                userAccount={userAccount}
              />
            </>
          )}

          {uploadSignatureAuthor && (
            <>
              <Button
                onClick={() => setIsSignatureDialogOpen(true)}
                variant="secondary"
              >
                Upload Signature
              </Button>
              <SignatureUploadDialog
                open={isSignatureDialogOpen}
                onOpenChange={setIsSignatureDialogOpen}
              />
            </>
          )}
        </CardFooter>
      </Card>
    </>
  );
}
