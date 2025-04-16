import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";
import Link from "next/link";

// Define TrainingJob type
interface TrainingJob {
  id: string;
  name: string;
  modelName: string;
  baseModel: string;
  status: "queued" | "running" | "completed" | "failed" | "stopped";
  progress: number;
  startTime: string;
  endTime?: string;
  createdBy: string;
  gpuHours: number;
  epochs: number;
  batchSize: number;
  learningRate: number;
  dataset: string;
  logs: string[];
  metrics: {
    trainingLoss: Array<number | null>;
    validationLoss: Array<number | null>;
    accuracy?: number;
  };
}

// Mock data for training jobs
const mockTrainingJobs: TrainingJob[] = [
  {
    id: "train-1",
    name: "Fine-tune GPT model on customer data",
    modelName: "GPT-Customer-Support-v1",
    baseModel: "ChatGPT-like Transformer",
    status: "running",
    progress: 62,
    startTime: "2023-10-15T08:30:00Z",
    createdBy: "Jane Smith",
    gpuHours: 18.5,
    epochs: 3,
    batchSize: 32,
    learningRate: 0.00002,
    dataset: "customer-support-dataset-v2",
    logs: [
      "2023-10-15T08:30:00Z - Starting training job",
      "2023-10-15T08:32:15Z - Loaded dataset: 2.8M examples",
      "2023-10-15T08:45:23Z - Completed epoch 1/3, loss: 1.824",
      "2023-10-15T11:12:45Z - Completed epoch 2/3, loss: 1.432",
    ],
    metrics: {
      trainingLoss: [1.824, 1.432, null],
      validationLoss: [1.912, 1.587, null],
      accuracy: 0.76
    }
  },
  {
    id: "train-2",
    name: "Train code generation assistant",
    modelName: "CodeGen-Assistant-v0.9.5",
    baseModel: "CodeGen-base",
    status: "completed",
    progress: 100,
    startTime: "2023-10-12T14:15:00Z",
    endTime: "2023-10-13T06:45:22Z",
    createdBy: "Taylor Reed",
    gpuHours: 16.5,
    epochs: 5,
    batchSize: 16,
    learningRate: 0.00005,
    dataset: "github-code-snippets-v3",
    logs: [
      "2023-10-12T14:15:00Z - Starting training job",
      "2023-10-12T14:18:32Z - Loaded dataset: 1.5M examples",
      "2023-10-12T16:05:12Z - Completed epoch 1/5, loss: 2.347",
      "2023-10-12T18:12:45Z - Completed epoch 2/5, loss: 1.987",
      "2023-10-12T20:30:10Z - Completed epoch 3/5, loss: 1.654",
      "2023-10-13T01:45:38Z - Completed epoch 4/5, loss: 1.432",
      "2023-10-13T06:15:22Z - Completed epoch 5/5, loss: 1.298",
      "2023-10-13T06:45:22Z - Training completed successfully"
    ],
    metrics: {
      trainingLoss: [2.347, 1.987, 1.654, 1.432, 1.298],
      validationLoss: [2.412, 2.056, 1.768, 1.521, 1.387],
      accuracy: 0.85
    }
  },
  {
    id: "train-3",
    name: "BART Summarizer pre-training",
    modelName: "BART-Summarizer-v2.0",
    baseModel: "BART-base",
    status: "queued",
    progress: 0,
    startTime: "2023-10-16T08:00:00Z",
    createdBy: "Morgan Chen",
    gpuHours: 0,
    epochs: 4,
    batchSize: 24,
    learningRate: 0.00003,
    dataset: "news-articles-summarization",
    logs: [],
    metrics: {
      trainingLoss: [],
      validationLoss: []
    }
  },
  {
    id: "train-4",
    name: "Instruct model with reasoning capabilities",
    modelName: "Instruct-Reasoning-v1",
    baseModel: "Instruct Tuned Transformer",
    status: "failed",
    progress: 45,
    startTime: "2023-10-10T09:30:00Z",
    endTime: "2023-10-10T18:45:33Z",
    createdBy: "Alex Johnson",
    gpuHours: 9.25,
    epochs: 3,
    batchSize: 8,
    learningRate: 0.00001,
    dataset: "multi-step-reasoning-dataset",
    logs: [
      "2023-10-10T09:30:00Z - Starting training job",
      "2023-10-10T09:32:45Z - Loaded dataset: 870K examples",
      "2023-10-10T12:15:22Z - Completed epoch 1/3, loss: 1.758",
      "2023-10-10T16:30:10Z - Memory usage warning: 95% GPU memory utilization",
      "2023-10-10T18:45:33Z - Error: CUDA out of memory. Tried to allocate 24.2 GiB"
    ],
    metrics: {
      trainingLoss: [1.758, null, null],
      validationLoss: [1.842, null, null]
    }
  }
];

// Utility function to format date
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString('en-US', options);
}

// Utility function to calculate duration
function calculateDuration(startTime: string, endTime?: string): string {
  const start = new Date(startTime);
  const end = endTime ? new Date(endTime) : new Date();
  const durationMs = end.getTime() - start.getTime();
  
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

export default async function TrainingPipeline() {
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
          <h1 className="text-2xl font-bold text-[#232f3e]">Training Pipeline</h1>
          <p className="text-gray-600 mt-1">Create and monitor model training jobs</p>
        </div>
        <Link 
          href="/dashboard/training/create" 
          className="bg-[#232f3e] hover:bg-[#31465f] text-white px-4 py-2 rounded"
        >
          Create Training Job
        </Link>
      </div>
      
      {/* Training Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Active Jobs</h2>
              <p className="text-2xl font-semibold">1</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Completed Jobs</h2>
              <p className="text-2xl font-semibold">2</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-red-100 p-3">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Failed Jobs</h2>
              <p className="text-2xl font-semibold">1</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">GPU Hours</h2>
              <p className="text-2xl font-semibold">44.25</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Active Job */}
      {mockTrainingJobs.filter(job => job.status === "running").length > 0 && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Active Training Job</h2>
          
          {mockTrainingJobs.filter(job => job.status === "running").map(job => (
            <div key={job.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{job.name}</h3>
                  <p className="text-gray-600">Model: {job.modelName}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-yellow-700 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-3 py-1 rounded text-sm">
                    Pause
                  </button>
                  <button className="text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded text-sm">
                    Stop
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Progress: {job.progress}%</span>
                  <span className="text-sm text-gray-600">
                    Started: {formatDate(job.startTime)} ({calculateDuration(job.startTime)} elapsed)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="text-xs font-medium text-gray-500 uppercase">Epochs</h4>
                  <p className="text-lg font-semibold">{job.metrics.trainingLoss.filter(l => l !== null).length} / {job.epochs}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="text-xs font-medium text-gray-500 uppercase">Current Loss</h4>
                  <p className="text-lg font-semibold">
                    {job.metrics.trainingLoss[job.metrics.trainingLoss.filter(l => l !== null).length - 1]?.toFixed(3) || 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <h4 className="text-xs font-medium text-gray-500 uppercase">GPU Usage</h4>
                  <p className="text-lg font-semibold">{job.gpuHours.toFixed(1)} hours</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Recent Logs</h4>
                <div className="bg-gray-800 text-gray-200 p-3 rounded font-mono text-xs overflow-auto max-h-32">
                  {job.logs.slice(-3).map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 text-right">
                <Link href={`/dashboard/training/${job.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Training Jobs Table */}
      <div className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#232f3e]">All Training Jobs</h2>
          
          <div className="flex gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 py-1 px-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select className="border border-gray-300 rounded py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Statuses</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="queued">Queued</option>
              <option value="failed">Failed</option>
              <option value="stopped">Stopped</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Creator
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTrainingJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{job.modelName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'queued' ? 'bg-yellow-100 text-yellow-800' :
                      job.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(job.startTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {calculateDuration(job.startTime, job.endTime)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.createdBy}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link href={`/dashboard/training/${job.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View
                      </Link>
                      {job.status === 'completed' && (
                        <Link href={`/dashboard/models/register?from=${job.id}`} className="text-green-600 hover:text-green-900">
                          Register
                        </Link>
                      )}
                      {job.status === 'failed' && (
                        <Link href={`/dashboard/training/create?clone=${job.id}`} className="text-orange-600 hover:text-orange-900">
                          Retry
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
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
                Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">4</span> results
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
      </div>
    </DashboardLayout>
  );
} 