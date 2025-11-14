import { BaseLayout } from "@/components/layout/BaseLayout";
import { VehicleAssignmentTable } from "./components/table";

export default function VehicleAssignmentPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Vehicle Assignment</h1>
        <VehicleAssignmentTable />
      </div>
    </BaseLayout>
  );
}