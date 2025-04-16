import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import Link from "next/link";

// Define the Model type
interface Model {
  id: string;
  name: string;
  version: string;
  type: string;
  parameters: string;
  createdAt: string;
  updatedAt: string;
  status: "production" | "staging" | "development" | "archived";
  creator: string;
  description: string;
  framework: string;
  accuracy: number;
}

// Mock data for models
const mockModels: Model[] = [
  {
    id: "m1",
    name: "ChatGPT-like Transformer",
    version: "1.0.0",
    type: "Text Generation",
    parameters: "7B",
    createdAt: "2023-05-12",
    updatedAt: "2023-05-15",
    status: "production",
    creator: "Jane Smith",
    description: "A GPT-like model optimized for chat applications with improved context handling",
    framework: "PyTorch",
    accuracy: 0.92
  },
  {
    id: "m2",
    name: "Instruct Tuned Transformer",
    version: "2.1.0",
    type: "Text Generation",
    parameters: "13B",
    createdAt: "2023-08-05",
    updatedAt: "2023-08-20",
    status: "staging",
    creator: "Alex Johnson",
    description: "Fine-tuned for following complex instructions with improved reasoning capabilities",
    framework: "JAX",
    accuracy: 0.94
  },
  {
    id: "m3",
    name: "DistilBERT Embeddings",
    version: "1.2.3",
    type: "Embeddings",
    parameters: "66M",
    createdAt: "2023-04-30",
    updatedAt: "2023-06-15",
    status: "production",
    creator: "Sam Wilson",
    description: "Lightweight embedding model optimized for search applications",
    framework: "PyTorch",
    accuracy: 0.88
  },
  {
    id: "m4",
    name: "CodeGen Assistant",
    version: "0.9.5",
    type: "Code Generation",
    parameters: "3B",
    createdAt: "2023-09-10",
    updatedAt: "2023-09-15",
    status: "development",
    creator: "Taylor Reed",
    description: "Specialized for code generation with support for multiple programming languages",
    framework: "Hugging Face Transformers",
    accuracy: 0.85
  },
  {
    id: "m5",
    name: "BART Summarizer",
    version: "2.0.1",
    type: "Summarization",
    parameters: "400M",
    createdAt: "2023-07-22",
    updatedAt: "2023-07-30",
    status: "production",
    creator: "Morgan Chen",
    description: "Text summarization model optimized for long documents",
    framework: "PyTorch",
    accuracy: 0.90
  },
  {
    id: "m6",
    name: "Semantic Search BERT",
    version: "1.1.0",
    type: "Embeddings",
    parameters: "110M",
    createdAt: "2023-06-12",
    updatedAt: "2023-08-05",
    status: "archived",
    creator: "Jane Smith",
    description: "Deprecated embedding model for semantic search",
    framework: "TensorFlow",
    accuracy: 0.82
  }
];

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
      {/* Page Header */}
      <div className="bg-white p-6 mb-6 rounded shadow flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#232f3e]">Model Registry</h1>
          <p className="text-gray-600 mt-1">Manage and track all your machine learning models</p>
        </div>
        <Link 
          href="/dashboard/models/register"
          className="bg-[#232f3e] hover:bg-[#31465f] text-white px-4 py-2 rounded"
        >
          Register New Model
        </Link>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 mb-6 rounded shadow">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search models..."
                className="pl-10 py-2 px-4 block w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Types</option>
              <option value="Text Generation">Text Generation</option>
              <option value="Embeddings">Embeddings</option>
              <option value="Code Generation">Code Generation</option>
              <option value="Summarization">Summarization</option>
            </select>
            <select className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="production">Production</option>
              <option value="staging">Staging</option>
              <option value="development">Development</option>
              <option value="archived">Archived</option>
            </select>
            <button className="border border-gray-300 hover:bg-gray-50 rounded p-2">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Models Table */}
      <div className="bg-white p-6 rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Model
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parameters
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Accuracy
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockModels.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                      <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{model.name}</div>
                      <div className="text-sm text-gray-500">v{model.version}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.parameters}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {model.updatedAt}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    model.status === 'production' ? 'bg-green-100 text-green-800' :
                    model.status === 'staging' ? 'bg-yellow-100 text-yellow-800' :
                    model.status === 'development' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(model.accuracy * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link 
                      href={`/dashboard/models/${model.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View
                    </Link>
                    <button className="text-gray-600 hover:text-gray-900">Compare</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded shadow">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">6</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 