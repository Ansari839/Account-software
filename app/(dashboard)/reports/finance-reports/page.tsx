import BaseLayout from "@/components/layout/BaseLayout";
import { FinanceReportsTable } from "./components/table";
import { FilterForm } from "./components/filter-form";

export default function FinanceReportsPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Finance Reports</h1>
        <div className="mb-6">
          <FilterForm />
        </div>
        <FinanceReportsTable />
      </div>
    </BaseLayout>
  );
}