import { BaseLayout } from "@/components/layout/BaseLayout";
import { UserRolesTable } from "./components/table";

export default function UserRolesPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">User-Roles Assignment</h1>
        <UserRolesTable />
      </div>
    </BaseLayout>
  );
}