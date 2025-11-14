import BaseLayout from "@/components/layout/BaseLayout";
import { TrialBalanceTable } from "./components/table";

export default function TrialBalancePage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Trial Balance</h1>
        <TrialBalanceTable />
      </div>
    </BaseLayout>
  );
}