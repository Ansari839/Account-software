import BaseLayout from "@/components/layout/BaseLayout";
import { ImportExportTable } from "./components/table";
import { ImportExportForm } from "./components/form";

export default function ImportExportPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Import / Export</h1>
        <div className="mb-6">
          <ImportExportForm />
        </div>
        <ImportExportTable />
      </div>
    </BaseLayout>
  );
}