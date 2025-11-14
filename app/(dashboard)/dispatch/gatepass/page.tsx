import BaseLayout from "@/components/layout/BaseLayout";
import { GatepassTable } from "./components/table";

export default function GatepassPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Gatepass</h1>
        <GatepassTable />
      </div>
    </BaseLayout>
  );
}