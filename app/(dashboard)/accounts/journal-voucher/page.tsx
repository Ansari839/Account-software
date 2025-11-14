import { BaseLayout } from "@/components/layout/BaseLayout";
import { JournalVoucherTable } from "./components/table";

export default function JournalVoucherPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Journal Voucher</h1>
        <JournalVoucherTable />
      </div>
    </BaseLayout>
  );
}