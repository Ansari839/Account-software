import { BaseLayout } from "@/components/layout/BaseLayout";
import { BankBookTable } from "./components/table";

export default function BankBookPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Bank Book</h1>
        <BankBookTable />
      </div>
    </BaseLayout>
  );
}