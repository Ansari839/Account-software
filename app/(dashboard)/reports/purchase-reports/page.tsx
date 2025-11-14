import BaseLayout from "@/components/layout/BaseLayout";
import { PurchaseReportsTable } from "./components/table";
import { FilterForm } from "./components/filter-form";

export default function PurchaseReportsPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Purchase Reports</h1>
        <div className="mb-6">
          <FilterForm />
        </div>
        <PurchaseReportsTable />
      </div>
    </BaseLayout>
  );
}