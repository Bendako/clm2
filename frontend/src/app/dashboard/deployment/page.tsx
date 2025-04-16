import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";

export default async function Deployment() {
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
        <h1 className="text-2xl font-bold text-[#232f3e]">Model Deployment</h1>
      </div>
      
      {/* Tabs and Deploy Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button className="px-6 py-2 bg-[#0073bb] text-white rounded font-medium">
            Active Deployments
          </button>
          <button className="px-6 py-2 bg-[#f0f2f5] text-[#232f3e] rounded font-medium">
            Deployment History
          </button>
          <button className="px-6 py-2 bg-[#f0f2f5] text-[#232f3e] rounded font-medium">
            AWS Configuration
          </button>
        </div>
        <button className="px-6 py-2 bg-[#1e8900] text-white rounded font-medium">
          + Deploy New Model
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <div className="px-4 py-2 border border-[#e1e4e8] rounded bg-white">
          <span className="text-[#232f3e]">Environment: All</span>
        </div>
        <div className="px-4 py-2 border border-[#e1e4e8] rounded bg-white">
          <span className="text-[#232f3e]">Status: All</span>
        </div>
      </div>
      
      {/* Production Environment */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#232f3e] mb-3">Production Environment</h2>
        
        {/* Production Deployment Card */}
        <div className="bg-white rounded shadow border border-[#e1e4e8] mb-6">
          {/* Card Header */}
          <div className="bg-[#f0f2f5] p-4 rounded-t flex justify-between items-center">
            <h3 className="font-semibold text-[#232f3e]">Customer Support Assistant</h3>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-[#1e8900] bg-opacity-20 text-[#1e8900] rounded-full text-sm">
                Active
              </span>
              <span className="text-[#232f3e]">▼</span>
            </div>
          </div>
          
          {/* Card Details */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-[#5b5b5b]">Model Version:</span>
                <span className="ml-2 text-[#232f3e]">company-llm-v2.3</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Deployed:</span>
                <span className="ml-2 text-[#232f3e]">Today 10:45 AM</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">AWS Region:</span>
                <span className="ml-2 text-[#232f3e]">us-west-2</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-[#5b5b5b]">Endpoint:</span>
                <span className="ml-2 text-[#232f3e]">prod-support-assistant.example.com</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Instance Type:</span>
                <span className="ml-2 text-[#232f3e]">ml.g5.2xlarge</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-2">
              <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                Update
              </button>
              <button className="px-4 py-1.5 bg-[#d13212] text-white rounded">
                Rollback
              </button>
              <button className="px-4 py-1.5 bg-[#0073bb] text-white rounded">
                Monitor
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Staging Environment */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#232f3e] mb-3">Staging Environment</h2>
        
        {/* Staging Deployment Card */}
        <div className="bg-white rounded shadow border border-[#e1e4e8] mb-6">
          {/* Card Header */}
          <div className="bg-[#f0f2f5] p-4 rounded-t flex justify-between items-center">
            <h3 className="font-semibold text-[#232f3e]">Product Knowledge Assistant</h3>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-[#0073bb] bg-opacity-20 text-[#0073bb] rounded-full text-sm">
                Testing
              </span>
              <span className="text-[#232f3e]">▼</span>
            </div>
          </div>
          
          {/* Card Details */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-[#5b5b5b]">Model Version:</span>
                <span className="ml-2 text-[#232f3e]">company-llm-v3.0-beta</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Deployed:</span>
                <span className="ml-2 text-[#232f3e]">Yesterday 16:20 PM</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">AWS Region:</span>
                <span className="ml-2 text-[#232f3e]">us-west-2</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-[#5b5b5b]">Endpoint:</span>
                <span className="ml-2 text-[#232f3e]">staging-product-assistant.example.com</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Instance Type:</span>
                <span className="ml-2 text-[#232f3e]">ml.g5.xlarge</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-2">
              <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                Update
              </button>
              <button className="px-4 py-1.5 bg-[#1e8900] text-white rounded">
                Promote
              </button>
              <button className="px-4 py-1.5 bg-[#0073bb] text-white rounded">
                Monitor
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Development Environment */}
      <div>
        <h2 className="text-lg font-bold text-[#232f3e] mb-3">Development Environment</h2>
        
        {/* Empty Dev Card */}
        <div className="bg-white rounded shadow border border-dashed border-[#e1e4e8] p-8 flex justify-center items-center">
          <button className="text-[#8d9dab] font-semibold">
            + Deploy to Development
          </button>
        </div>
      </div>
      
    </DashboardLayout>
  );
} 