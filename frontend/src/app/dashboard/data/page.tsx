import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";

export default async function DataManagement() {
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
        <h1 className="text-2xl font-bold text-[#232f3e]">Data Management</h1>
      </div>
      
      {/* Tabs and Upload Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button className="px-6 py-2 bg-[#0073bb] text-white rounded font-medium">
            Active Datasets
          </button>
          <button className="px-6 py-2 bg-[#f0f2f5] text-[#232f3e] rounded font-medium">
            Data History
          </button>
          <button className="px-6 py-2 bg-[#f0f2f5] text-[#232f3e] rounded font-medium">
            Data Pipeline
          </button>
        </div>
        <button className="px-6 py-2 bg-[#1e8900] text-white rounded font-medium">
          + Upload New Dataset
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        <div className="px-4 py-2 border border-[#e1e4e8] rounded bg-white">
          <span className="text-[#232f3e]">Type: All</span>
        </div>
        <div className="px-4 py-2 border border-[#e1e4e8] rounded bg-white">
          <span className="text-[#232f3e]">Status: All</span>
        </div>
        <div className="px-4 py-2 border border-[#e1e4e8] rounded bg-white">
          <span className="text-[#232f3e]">Date: Last 30 days</span>
        </div>
      </div>
      
      {/* Training Datasets Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#232f3e] mb-3">Training Datasets</h2>
        
        {/* Customer Support Dataset Card */}
        <div className="bg-white rounded shadow border border-[#e1e4e8] mb-6">
          {/* Card Header */}
          <div className="bg-[#f0f2f5] p-4 rounded-t flex justify-between items-center">
            <h3 className="font-semibold text-[#232f3e]">Customer Support Conversations</h3>
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
                <span className="text-[#5b5b5b]">Version:</span>
                <span className="ml-2 text-[#232f3e]">v2.3</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Last Updated:</span>
                <span className="ml-2 text-[#232f3e]">Today 09:15 AM</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Size:</span>
                <span className="ml-2 text-[#232f3e]">2.4 GB</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-[#5b5b5b]">Records:</span>
                <span className="ml-2 text-[#232f3e]">1.2M entries</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Format:</span>
                <span className="ml-2 text-[#232f3e]">JSONL</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Storage:</span>
                <span className="ml-2 text-[#232f3e]">S3 (us-west-2)</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-2 mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#5b5b5b]">Preprocessing: 100% complete</span>
                <span className="text-[#1e8900]">✓ Verified</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#1e8900] h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-3">
              <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                Preview
              </button>
              <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                Edit
              </button>
              <button className="px-4 py-1.5 bg-[#0073bb] text-white rounded">
                Use for Training
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Description Dataset Card */}
        <div className="bg-white rounded shadow border border-[#e1e4e8] mb-6">
          {/* Card Header */}
          <div className="bg-[#f0f2f5] p-4 rounded-t flex justify-between items-center">
            <h3 className="font-semibold text-[#232f3e]">Product Descriptions & FAQ</h3>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-[#0073bb] bg-opacity-20 text-[#0073bb] rounded-full text-sm">
                Processing
              </span>
              <span className="text-[#232f3e]">▼</span>
            </div>
          </div>
          
          {/* Card Details */}
          <div className="p-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-[#5b5b5b]">Version:</span>
                <span className="ml-2 text-[#232f3e]">v1.5</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Last Updated:</span>
                <span className="ml-2 text-[#232f3e]">Yesterday 14:30 PM</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Size:</span>
                <span className="ml-2 text-[#232f3e]">850 MB</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-[#5b5b5b]">Records:</span>
                <span className="ml-2 text-[#232f3e]">450K entries</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Format:</span>
                <span className="ml-2 text-[#232f3e]">JSONL</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Storage:</span>
                <span className="ml-2 text-[#232f3e]">S3 (us-west-2)</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-2 mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#5b5b5b]">Preprocessing: 72% complete</span>
                <span className="text-[#0073bb]">In progress</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#0073bb] h-2 rounded-full" style={{ width: "72%" }}></div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-3">
              <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                Preview
              </button>
              <button className="px-4 py-1.5 bg-[#d13212] text-white rounded">
                Cancel Processing
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Evaluation Datasets Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#232f3e] mb-3">Evaluation Datasets</h2>
        
        {/* Evaluation Dataset Card */}
        <div className="bg-white rounded shadow border border-[#e1e4e8] mb-6">
          {/* Card Header */}
          <div className="bg-[#f0f2f5] p-4 rounded-t flex justify-between items-center">
            <h3 className="font-semibold text-[#232f3e]">Support Quality Benchmarks</h3>
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
                <span className="text-[#5b5b5b]">Version:</span>
                <span className="ml-2 text-[#232f3e]">v1.1</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Last Updated:</span>
                <span className="ml-2 text-[#232f3e]">3 days ago</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Size:</span>
                <span className="ml-2 text-[#232f3e]">125 MB</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <span className="text-[#5b5b5b]">Records:</span>
                <span className="ml-2 text-[#232f3e]">5K entries</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Format:</span>
                <span className="ml-2 text-[#232f3e]">JSONL</span>
              </div>
              <div>
                <span className="text-[#5b5b5b]">Labels:</span>
                <span className="ml-2 text-[#232f3e]">Human Verified</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-3">
              <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                Preview
              </button>
              <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                Edit
              </button>
              <button className="px-4 py-1.5 bg-[#0073bb] text-white rounded">
                Use for Evaluation
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Raw Data Section */}
      <div>
        <h2 className="text-lg font-bold text-[#232f3e] mb-3">Raw Data Sources</h2>
        
        {/* Add New Raw Data Source */}
        <div className="bg-white rounded shadow border border-dashed border-[#e1e4e8] p-8 flex justify-center items-center">
          <button className="text-[#8d9dab] font-semibold">
            + Connect New Data Source
          </button>
        </div>
      </div>
      
    </DashboardLayout>
  );
} 