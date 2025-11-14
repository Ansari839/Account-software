import { BaseLayout } from "@/components/layout/BaseLayout";
import { RolesTable } from "./components/table";

export default function RolesPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Roles Management</h1>
        <RolesTable />
      </div>
    </BaseLayout>
  );
}