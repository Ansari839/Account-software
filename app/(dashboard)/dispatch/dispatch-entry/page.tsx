import BaseLayout from "@/components/layout/BaseLayout";
import { DispatchEntryTable } from "./components/table";

export default function DispatchEntryPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Dispatch Entry</h1>
        <DispatchEntryTable />
      </div>
    </BaseLayout>
  );
}