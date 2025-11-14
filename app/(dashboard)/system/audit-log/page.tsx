import BaseLayout from "@/components/layout/BaseLayout";
import { AuditLogTable } from "./components/table";
import { AuditLogForm } from "./components/form";

export default function AuditLogPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Audit Log</h1>
        <div className="mb-6">
          <AuditLogForm />
        </div>
        <AuditLogTable />
      </div>
    </BaseLayout>
  );
}