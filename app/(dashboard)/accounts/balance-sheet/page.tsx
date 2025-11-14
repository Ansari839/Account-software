import { BaseLayout } from "@/components/layout/BaseLayout";
import { BalanceSheetTable } from "./components/table";

export default function BalanceSheetPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Balance Sheet</h1>
        <BalanceSheetTable />
      </div>
    </BaseLayout>
  );
}