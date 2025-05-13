import { SignatureTable } from "@/components/signature/signature-table";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_app/signature")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto py-10 px-5">
      <h1 className="text-2xl font-bold mb-6">Signature</h1>
      <SignatureTable />
    </div>
  );
}
