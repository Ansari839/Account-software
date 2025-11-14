import { BaseLayout } from "@/components/layout/BaseLayout";
import { CashBookTable } from "./components/table";

export default function CashBookPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Cash Book</h1>
        <CashBookTable />
      </div>
    </BaseLayout>
  );
}