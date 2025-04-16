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
      {/* Page Header */}
      <div className="bg-white p-6 mb-6 rounded shadow">
        <h1 className="text-2xl font-bold text-[#232f3e]">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Track and manage your ML resources</p>
      </div>
      
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Active Models */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Models</h3>
              <div className="flex items-end mt-1">
                <span className="text-2xl font-bold text-[#232f3e]">5</span>
                <span className="ml-2 text-sm text-gray-500">in production</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pending Training Jobs */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Pending Training Jobs</h3>
              <div className="flex items-end mt-1">
                <span className="text-2xl font-bold text-[#ff9900]">2</span>
                <span className="ml-2 text-sm text-gray-500">scheduled</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Latest Benchmark */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Latest Benchmark</h3>
              <div className="flex items-end mt-1">
                <span className="text-2xl font-bold text-green-600">94%</span>
                <span className="ml-2 text-sm text-gray-500">accuracy</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* System Status */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">System Status</h3>
              <div className="flex items-end mt-1">
                <span className="text-2xl font-bold text-green-600">Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Model Performance Chart */}
        <div className="bg-white p-6 rounded shadow lg:w-3/4">
          <h2 className="text-lg font-semibold text-[#232f3e] mb-4">Model Performance Trends</h2>
          <div className="h-64 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="mt-2">Performance Chart (Placeholder)</p>
              <p className="text-sm">Chart would display model accuracy over time</p>
            </div>
          </div>
          <div className="flex justify-center mt-4 space-x-8">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-[#ff9900] rounded mr-2"></div>
              <span className="text-gray-700">Standard Benchmark</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
              <span className="text-gray-700">Custom Benchmark</span>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded shadow lg:w-1/4">
          <h2 className="text-lg font-semibold text-[#232f3e] mb-4">Recent Activity</h2>
          <div className="space-y-1">
            <div className="py-3 border-t">
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">Model v2.3 Deployed</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="py-3 border-t">
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-[#ff9900] mt-2 mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">Training Job Started</p>
                  <p className="text-sm text-gray-500">5 hours ago</p>
                </div>
              </div>
            </div>
            <div className="py-3 border-t">
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">Benchmark Completed</p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </div>
            </div>
            <div className="py-3 border-t">
              <div className="flex">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                <div>
                  <p className="font-medium text-gray-800">Data Updated</p>
                  <p className="text-sm text-gray-500">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded shadow mt-6">
        <h2 className="text-lg font-semibold text-[#232f3e] mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button className="bg-[#ff9900] hover:bg-[#e68a00] text-white px-6 py-2 rounded font-medium transition-colors">
            Start New Training
          </button>
          <button className="bg-[#0073bb] hover:bg-[#005b94] text-white px-6 py-2 rounded font-medium transition-colors">
            Run Benchmark Tests
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium transition-colors">
            Deploy Latest Model
          </button>
          <button className="bg-[#232f3e] hover:bg-[#31465f] text-white px-6 py-2 rounded font-medium transition-colors">
            View All Models
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
} 