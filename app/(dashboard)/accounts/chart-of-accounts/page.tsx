import BaseLayout from "@/components/layout/BaseLayout";
import { ChartOfAccountsTable } from "./components/table";

export default function ChartOfAccountsPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Chart of Accounts</h1>
        <ChartOfAccountsTable />
      </div>
    </BaseLayout>
  );
}