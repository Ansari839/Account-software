import { BaseLayout } from "@/components/layout/BaseLayout";
import { ProfitLossTable } from "./components/table";

export default function ProfitLossPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Profit & Loss Statement</h1>
        <ProfitLossTable />
      </div>
    </BaseLayout>
  );
}