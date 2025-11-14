import { BaseLayout } from "@/components/layout/BaseLayout";
import { DeliveryStatusTable } from "./components/table";

export default function DeliveryStatusPage() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Delivery Status</h1>
        <DeliveryStatusTable />
      </div>
    </BaseLayout>
  );
}