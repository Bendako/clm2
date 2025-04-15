import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";

export default async function Dashboard() {
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
        <h1 className="text-2xl font-bold text-[#232f3e]">Dashboard Overview</h1>
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Active Models */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Active Models</h3>
          <div className="flex items-end mt-2">
            <span className="text-3xl font-bold text-[#232f3e]">5</span>
            <span className="ml-2 text-sm text-gray-500">in production</span>
          </div>
        </div>
        
        {/* Pending Training Jobs */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Pending Training Jobs</h3>
          <div className="flex items-end mt-2">
            <span className="text-3xl font-bold text-[#ff9900]">2</span>
            <span className="ml-2 text-sm text-gray-500">scheduled</span>
          </div>
        </div>
        
        {/* Latest Benchmark */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">Latest Benchmark</h3>
          <div className="flex items-end mt-2">
            <span className="text-3xl font-bold text-[#1e8900]">94%</span>
            <span className="ml-2 text-sm text-gray-500">accuracy</span>
          </div>
        </div>
        
        {/* System Status */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm text-gray-500">System Status</h3>
          <div className="flex items-end mt-2">
            <span className="text-3xl font-bold text-[#1e8900]">Healthy</span>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Model Performance Chart */}
        <div className="bg-white p-4 rounded shadow lg:w-3/4">
          <h2 className="text-lg font-bold text-[#232f3e] mb-4">Model Performance Trends</h2>
          <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-400">
            <p>Performance Chart (Placeholder)</p>
            <p>Chart would display model accuracy over time</p>
          </div>
          <div className="flex justify-center mt-4 space-x-8">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#ff9900] mr-2"></div>
              <span>Standard Benchmark</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#1e8900] mr-2"></div>
              <span>Custom Benchmark</span>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white p-4 rounded shadow lg:w-1/4">
          <h2 className="text-lg font-bold text-[#232f3e] mb-2">Recent Activity</h2>
          <div className="border-t pt-2">
            <div className="py-3">
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-[#1e8900] mt-2 mr-3"></div>
                <div>
                  <p className="font-medium">Model v2.3 Deployed</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="py-3 border-t">
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-[#ff9900] mt-2 mr-3"></div>
                <div>
                  <p className="font-medium">Training Job Started</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
            <div className="py-3 border-t">
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-[#1e8900] mt-2 mr-3"></div>
                <div>
                  <p className="font-medium">Benchmark Completed</p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-4 rounded shadow mt-6">
        <h2 className="text-lg font-bold text-[#232f3e] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-[#ff9900] text-white px-6 py-2 rounded font-medium">
            Start New Training
          </button>
          <button className="bg-[#0073bb] text-white px-6 py-2 rounded font-medium">
            Run Benchmark Tests
          </button>
          <button className="bg-[#1e8900] text-white px-6 py-2 rounded font-medium">
            Deploy Latest Model
          </button>
          <button className="bg-[#232f3e] text-white px-6 py-2 rounded font-medium">
            View All Models
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 