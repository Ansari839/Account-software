import BaseLayout from "@/components/layout/BaseLayout";
import { BackupRestoreTable } from "./components/table";
import { BackupRestoreForm } from "./components/form";

export default function BackupRestorePage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Backup & Restore</h1>
        <div className="mb-6">
          <BackupRestoreForm />
        </div>
        <BackupRestoreTable />
      </div>
    </BaseLayout>
  );
}