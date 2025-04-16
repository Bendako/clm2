import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";

export default async function Benchmarks() {
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
        <h1 className="text-2xl font-bold text-[#232f3e]">Benchmark Management</h1>
      </div>
      
      {/* Tabs */}
      <div className="bg-white p-4 mb-6 rounded shadow">
        <div className="flex space-x-4 border-b">
          <button className="px-4 py-2 text-sm font-medium text-white bg-[#0073bb] rounded-t-lg">
            Available Benchmarks
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#232f3e] bg-[#f0f2f5] rounded-t-lg">
            Test Results
          </button>
          <button className="px-4 py-2 text-sm font-medium text-[#232f3e] bg-[#f0f2f5] rounded-t-lg">
            Create Benchmark
          </button>
        </div>
      
        {/* Search and Filter */}
        <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
          <div className="flex items-center space-x-4 flex-grow">
            <input 
              type="text" 
              placeholder="Search benchmarks..." 
              className="px-4 py-2 border border-[#e1e4e8] rounded w-full max-w-xs text-[#232f3e] placeholder-[#8d9dab]"
            />
            <select className="px-4 py-2 border border-[#e1e4e8] rounded bg-white text-[#232f3e]">
              <option>Filter by Type</option>
              <option>Standard</option>
              <option>Custom</option>
            </select>
            <select className="px-4 py-2 border border-[#e1e4e8] rounded bg-white text-[#232f3e]">
              <option>Sort by: Latest</option>
              <option>Sort by: Name</option>
              <option>Sort by: Type</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-[#1e8900] text-white font-medium rounded">
            + Create New Benchmark
          </button>
        </div>
      </div>
      
      {/* Standard Benchmarks Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#232f3e] mb-4">Standard Benchmarks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* MMLU Benchmark Card */}
          <div className="bg-white rounded shadow border border-[#e1e4e8]">
            <div className="p-4 bg-[#f0f2f5] border-b border-[#e1e4e8]">
              <h3 className="font-bold text-[#232f3e]">MMLU Benchmark</h3>
            </div>
            <div className="p-4">
              <p className="text-[#5b5b5b] mb-2">Massive Multitask Language Understanding benchmark</p>
              <p className="text-[#232f3e] mb-4">57 categories, 15,908 questions</p>
              <div className="flex space-x-4">
                <button className="px-4 py-1.5 bg-[#0073bb] text-white rounded">
                  Run Test
                </button>
                <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                  Details
                </button>
              </div>
            </div>
          </div>
          
          {/* HELM Benchmark Card */}
          <div className="bg-white rounded shadow border border-[#e1e4e8]">
            <div className="p-4 bg-[#f0f2f5] border-b border-[#e1e4e8]">
              <h3 className="font-bold text-[#232f3e]">HELM Benchmark</h3>
            </div>
            <div className="p-4">
              <p className="text-[#5b5b5b] mb-2">Holistic Evaluation of Language Models</p>
              <p className="text-[#232f3e] mb-4">42 scenarios, multiple metrics</p>
              <div className="flex space-x-4">
                <button className="px-4 py-1.5 bg-[#0073bb] text-white rounded">
                  Run Test
                </button>
                <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                  Details
                </button>
              </div>
            </div>
          </div>
          
          {/* GSM8K Benchmark Card */}
          <div className="bg-white rounded shadow border border-[#e1e4e8]">
            <div className="p-4 bg-[#f0f2f5] border-b border-[#e1e4e8]">
              <h3 className="font-bold text-[#232f3e]">GSM8K Benchmark</h3>
            </div>
            <div className="p-4">
              <p className="text-[#5b5b5b] mb-2">Grade School Math Word Problems</p>
              <p className="text-[#232f3e] mb-4">8,500 high-quality math problems</p>
              <div className="flex space-x-4">
                <button className="px-4 py-1.5 bg-[#0073bb] text-white rounded">
                  Run Test
                </button>
                <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Benchmarks Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#232f3e] mb-4">Custom Benchmarks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Service QA Card */}
          <div className="bg-white rounded shadow border border-[#e1e4e8]">
            <div className="p-4 bg-[#f0f2f5] border-b border-[#e1e4e8]">
              <h3 className="font-bold text-[#232f3e]">Customer Service QA</h3>
            </div>
            <div className="p-4">
              <p className="text-[#5b5b5b] mb-2">Company-specific customer support evaluation</p>
              <p className="text-[#232f3e] mb-4">350 questions, updated 3 days ago</p>
              <div className="flex space-x-4">
                <button className="px-4 py-1.5 bg-[#0073bb] text-white rounded">
                  Run Test
                </button>
                <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                  Edit
                </button>
              </div>
            </div>
          </div>
          
          {/* Product Knowledge Base Card */}
          <div className="bg-white rounded shadow border border-[#e1e4e8]">
            <div className="p-4 bg-[#f0f2f5] border-b border-[#e1e4e8]">
              <h3 className="font-bold text-[#232f3e]">Product Knowledge Base</h3>
            </div>
            <div className="p-4">
              <p className="text-[#5b5b5b] mb-2">Technical accuracy on company products</p>
              <p className="text-[#232f3e] mb-4">520 questions, updated 1 week ago</p>
              <div className="flex space-x-4">
                <button className="px-4 py-1.5 bg-[#0073bb] text-white rounded">
                  Run Test
                </button>
                <button className="px-4 py-1.5 bg-[#f0f2f5] text-[#232f3e] rounded">
                  Edit
                </button>
              </div>
            </div>
          </div>
          
          {/* Add New Custom Benchmark Card */}
          <div className="bg-white rounded shadow border border-dashed border-[#e1e4e8] flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-lg font-bold text-[#8d9dab]">+ Add New Custom</p>
              <p className="text-lg font-bold text-[#8d9dab]">Benchmark</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Test Results */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#232f3e] mb-4">Recent Test Results</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-[#e1e4e8] rounded shadow">
            <thead>
              <tr className="bg-[#f0f2f5]">
                <th className="py-3 px-4 text-left font-medium text-[#232f3e]">Benchmark</th>
                <th className="py-3 px-4 text-left font-medium text-[#232f3e]">Model Version</th>
                <th className="py-3 px-4 text-left font-medium text-[#232f3e]">Date</th>
                <th className="py-3 px-4 text-left font-medium text-[#232f3e]">Score</th>
                <th className="py-3 px-4 text-left font-medium text-[#232f3e]">Status</th>
                <th className="py-3 px-4 text-left font-medium text-[#232f3e]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-[#e1e4e8]">
                <td className="py-3 px-4 text-[#232f3e]">Customer Service QA</td>
                <td className="py-3 px-4 text-[#232f3e]">company-llm-v2.3</td>
                <td className="py-3 px-4 text-[#232f3e]">Today 10:15 AM</td>
                <td className="py-3 px-4 font-bold text-[#1e8900]">94.3%</td>
                <td className="py-3 px-4">
                  <span className="bg-[#1e8900] bg-opacity-20 text-[#1e8900] text-xs px-2 py-1 rounded-full">
                    Passed
                  </span>
                </td>
                <td className="py-3 px-4">
                  <a href="#" className="text-[#0073bb]">View Details</a>
                </td>
              </tr>
              <tr className="border-t border-[#e1e4e8]">
                <td className="py-3 px-4 text-[#232f3e]">MMLU Benchmark</td>
                <td className="py-3 px-4 text-[#232f3e]">company-llm-v2.3</td>
                <td className="py-3 px-4 text-[#232f3e]">Yesterday 15:42 PM</td>
                <td className="py-3 px-4 font-bold text-[#1e8900]">88.7%</td>
                <td className="py-3 px-4">
                  <span className="bg-[#1e8900] bg-opacity-20 text-[#1e8900] text-xs px-2 py-1 rounded-full">
                    Passed
                  </span>
                </td>
                <td className="py-3 px-4">
                  <a href="#" className="text-[#0073bb]">View Details</a>
                </td>
              </tr>
              <tr className="border-t border-[#e1e4e8]">
                <td className="py-3 px-4 text-[#232f3e]">GSM8K Benchmark</td>
                <td className="py-3 px-4 text-[#232f3e]">company-llm-v2.2</td>
                <td className="py-3 px-4 text-[#232f3e]">2 days ago</td>
                <td className="py-3 px-4 font-bold text-[#ff9900]">76.1%</td>
                <td className="py-3 px-4">
                  <span className="bg-[#ff9900] bg-opacity-20 text-[#ff9900] text-xs px-2 py-1 rounded-full">
                    Review
                  </span>
                </td>
                <td className="py-3 px-4">
                  <a href="#" className="text-[#0073bb]">View Details</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 