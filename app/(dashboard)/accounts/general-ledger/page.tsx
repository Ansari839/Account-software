import { BaseLayout } from "@/components/layout/BaseLayout";
import { GeneralLedgerTable } from "./components/table";

export default function GeneralLedgerPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">General Ledger</h1>
        <GeneralLedgerTable />
      </div>
    </BaseLayout>
  );
}