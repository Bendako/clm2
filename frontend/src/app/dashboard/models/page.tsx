import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";

export default async function ModelRegistry() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Create a serialized user object with only the needed data
  const serializedUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddresses[0]?.emailAddress || null,
  };

  return (
    <DashboardLayout user={serializedUser}>
      {/* Page Title */}
      <div className="bg-white p-4 mb-6 rounded shadow">
        <h1 className="text-2xl font-bold text-[#232f3e]">Model Registry</h1>
      </div>
      
      {/* Placeholder Content */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Model Registry Interface</h2>
        <p className="text-gray-600 mb-4">
          This page will allow you to:
        </p>
        <ul className="list-disc pl-5 text-gray-600 space-y-2">
          <li>View all registered models</li>
          <li>Compare model versions</li>
          <li>Track model lineage</li>
          <li>Manage model metadata</li>
          <li>Promote models to production</li>
        </ul>
        <div className="mt-6 p-8 border border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-400">Placeholder for model registry interface</p>
          <p className="text-gray-400 mt-2">Coming soon</p>
        </div>
      </div>
    </DashboardLayout>
  );
} 