import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
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

// Define the ModelVersion type
interface ModelVersion {
  version: string;
  createdAt: string;
  commitHash: string;
  creator: string;
  status: "production" | "staging" | "development" | "archived";
  accuracy: number;
  notes: string;
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
  }
];

// Mock model versions
const mockVersions: Record<string, ModelVersion[]> = {
  "m1": [
    {
      version: "1.0.0",
      createdAt: "2023-05-15",
      commitHash: "a1b2c3d4",
      creator: "Jane Smith",
      status: "production",
      accuracy: 0.92,
      notes: "Initial production release after successful A/B testing"
    },
    {
      version: "0.9.5",
      createdAt: "2023-05-10",
      commitHash: "e5f6g7h8",
      creator: "Jane Smith",
      status: "staging",
      accuracy: 0.89,
      notes: "Pre-release candidate with improved response coherence"
    },
    {
      version: "0.9.0",
      createdAt: "2023-05-01",
      commitHash: "i9j0k1l2",
      creator: "Jane Smith",
      status: "development",
      accuracy: 0.85,
      notes: "Initial training run with synthetic data"
    }
  ],
  "m2": [
    {
      version: "2.1.0",
      createdAt: "2023-08-20",
      commitHash: "m3n4o5p6",
      creator: "Alex Johnson",
      status: "staging",
      accuracy: 0.94,
      notes: "Added support for complex multi-step reasoning tasks"
    },
    {
      version: "2.0.0",
      createdAt: "2023-08-10",
      commitHash: "q7r8s9t0",
      creator: "Alex Johnson",
      status: "production",
      accuracy: 0.91,
      notes: "Production version with improved instruction following"
    },
    {
      version: "1.5.0",
      createdAt: "2023-07-25",
      commitHash: "u1v2w3x4",
      creator: "Alex Johnson",
      status: "archived",
      accuracy: 0.87,
      notes: "Experimental version with alternative training approach"
    }
  ]
};

export default async function ModelDetail({ params }: { params: { id: string } }) {
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

  // Find the model by ID
  const model = mockModels.find(m => m.id === params.id);
  
  // If model not found, redirect to models page
  if (!model) {
    redirect("/dashboard/models");
  }
  
  // Get model versions
  const versions = mockVersions[params.id] || [];

  return (
    <DashboardLayout user={serializedUser}>
      {/* Breadcrumbs */}
      <nav className="bg-white p-4 rounded shadow mb-6">
        <ol className="flex text-sm">
          <li className="flex items-center">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
              Dashboard
            </Link>
            <svg className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="flex items-center">
            <Link href="/dashboard/models" className="text-blue-600 hover:text-blue-800">
              Model Registry
            </Link>
            <svg className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-gray-600">{model.name}</li>
        </ol>
      </nav>
      
      {/* Model Header */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#232f3e]">{model.name}</h1>
            <p className="text-gray-600 mt-1">{model.description}</p>
          </div>
          <div className="space-x-2">
            <button className="bg-[#232f3e] hover:bg-[#31465f] text-white px-4 py-2 rounded">
              Deploy Model
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded">
              Edit Metadata
            </button>
          </div>
        </div>
        
        {/* Model Status Badge */}
        <div className="mt-4">
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
            model.status === 'production' ? 'bg-green-100 text-green-800' :
            model.status === 'staging' ? 'bg-yellow-100 text-yellow-800' :
            model.status === 'development' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Model Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Basic Info */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Basic Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Model Type</p>
              <p className="font-medium">{model.type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Parameters</p>
              <p className="font-medium">{model.parameters}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Framework</p>
              <p className="font-medium">{model.framework}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Current Version</p>
              <p className="font-medium">{model.version}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="font-medium">{model.creator}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created Date</p>
              <p className="font-medium">{model.createdAt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-medium">{model.updatedAt}</p>
            </div>
          </div>
        </div>
        
        {/* Middle Column - Performance Metrics */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Performance Metrics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium">Accuracy</p>
                <p className="text-sm font-medium">{(model.accuracy * 100).toFixed(1)}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${model.accuracy * 100}%` }}
                ></div>
              </div>
            </div>
            
            {/* Placeholder metrics */}
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium">Response Latency</p>
                <p className="text-sm font-medium">120ms</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: '80%' }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <p className="text-sm font-medium">Throughput</p>
                <p className="text-sm font-medium">850 req/s</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: '75%' }}
                ></div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">Evaluation Scores</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">ROUGE-L</p>
                  <p className="text-lg font-semibold">0.85</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">BLEU</p>
                  <p className="text-lg font-semibold">0.79</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">METEOR</p>
                  <p className="text-lg font-semibold">0.81</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">BERTScore</p>
                  <p className="text-lg font-semibold">0.88</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Usage Stats */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Usage Statistics</h2>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-xl font-bold text-blue-700">1.2M</p>
              <p className="text-sm text-blue-600">Requests in last 30 days</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Average Daily Requests</p>
                <p className="font-medium">42K</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tokens Generated</p>
                <p className="font-medium">35.8M</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Response Time</p>
                <p className="font-medium">120ms</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Error Rate</p>
                <p className="font-medium">0.06%</p>
              </div>
            </div>
            
            <div className="mt-2">
              <h3 className="text-md font-medium mb-2">Top Applications</h3>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-sm">Customer Support Bot</span>
                  <span className="text-sm font-medium">48%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Content Generator</span>
                  <span className="text-sm font-medium">32%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Internal Assistant</span>
                  <span className="text-sm font-medium">15%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm">Other</span>
                  <span className="text-sm font-medium">5%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Version History Table */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Version History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commit Hash
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creator
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
              {versions.map((version, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {version.version}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {version.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <code className="bg-gray-100 px-2 py-0.5 rounded">{version.commitHash}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {version.creator}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      version.status === 'production' ? 'bg-green-100 text-green-800' :
                      version.status === 'staging' ? 'bg-yellow-100 text-yellow-800' :
                      version.status === 'development' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {version.status.charAt(0).toUpperCase() + version.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(version.accuracy * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-900">Deploy</button>
                      <button className="text-gray-600 hover:text-gray-900">Compare</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 