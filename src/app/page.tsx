// app/protected/page.tsx
import { cookies } from "next/headers";
import LandingPage from "@/components/pages/home/LandingPage";
import { LandingDialog } from "@/components/LandingDialog";

export default async function ProtectedPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;

  return (
    <>
      <LandingDialog token={token} />
      <LandingPage />
    </>
  );
}
