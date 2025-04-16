import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
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
      "2023-10-15T08:35:20Z - Preprocessing dataset",
      "2023-10-15T08:40:45Z - Compiling model",
      "2023-10-15T08:45:23Z - Completed epoch 1/3, loss: 1.824",
      "2023-10-15T09:15:32Z - Validation after epoch 1, loss: 1.912, accuracy: 0.72",
      "2023-10-15T09:16:10Z - Starting epoch 2/3",
      "2023-10-15T11:12:45Z - Completed epoch 2/3, loss: 1.432",
      "2023-10-15T11:45:18Z - Validation after epoch 2, loss: 1.587, accuracy: 0.76",
      "2023-10-15T11:46:02Z - Starting epoch 3/3",
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
      "2023-10-12T14:22:15Z - Preprocessing dataset",
      "2023-10-12T14:30:45Z - Compiling model",
      "2023-10-12T16:05:12Z - Completed epoch 1/5, loss: 2.347",
      "2023-10-12T16:45:32Z - Validation after epoch 1, loss: 2.412, accuracy: 0.68",
      "2023-10-12T16:46:10Z - Starting epoch 2/5",
      "2023-10-12T18:12:45Z - Completed epoch 2/5, loss: 1.987",
      "2023-10-12T18:45:18Z - Validation after epoch 2, loss: 2.056, accuracy: 0.72",
      "2023-10-12T18:46:02Z - Starting epoch 3/5",
      "2023-10-12T20:30:10Z - Completed epoch 3/5, loss: 1.654",
      "2023-10-12T21:00:32Z - Validation after epoch 3, loss: 1.768, accuracy: 0.78",
      "2023-10-12T21:01:10Z - Starting epoch 4/5",
      "2023-10-13T01:45:38Z - Completed epoch 4/5, loss: 1.432",
      "2023-10-13T02:15:18Z - Validation after epoch 4, loss: 1.521, accuracy: 0.82",
      "2023-10-13T02:16:02Z - Starting epoch 5/5",
      "2023-10-13T06:15:22Z - Completed epoch 5/5, loss: 1.298",
      "2023-10-13T06:40:12Z - Validation after epoch 5, loss: 1.387, accuracy: 0.85",
      "2023-10-13T06:45:22Z - Training completed successfully"
    ],
    metrics: {
      trainingLoss: [2.347, 1.987, 1.654, 1.432, 1.298],
      validationLoss: [2.412, 2.056, 1.768, 1.521, 1.387],
      accuracy: 0.85
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
      "2023-10-10T09:35:20Z - Preprocessing dataset",
      "2023-10-10T09:40:45Z - Compiling model",
      "2023-10-10T10:05:23Z - Starting epoch 1/3",
      "2023-10-10T12:15:22Z - Completed epoch 1/3, loss: 1.758",
      "2023-10-10T12:45:32Z - Validation after epoch 1, loss: 1.842, accuracy: 0.65",
      "2023-10-10T12:46:10Z - Starting epoch 2/3",
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
    year: 'numeric',
    month: 'long', 
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

export default async function TrainingJobDetail({ params }: { params: { id: string } }) {
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

  // Find the training job by ID
  const job = mockTrainingJobs.find(job => job.id === params.id);
  
  // If job not found, redirect to training page
  if (!job) {
    redirect("/dashboard/training");
  }

  // Get completed epochs
  const completedEpochs = job.metrics.trainingLoss.filter(loss => loss !== null).length;

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
            <Link href="/dashboard/training" className="text-blue-600 hover:text-blue-800">
              Training Pipeline
            </Link>
            <svg className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-gray-600">{job.name}</li>
        </ol>
      </nav>
      
      {/* Job Header */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-[#232f3e]">{job.name}</h1>
            <p className="text-gray-600 mt-1">Model: {job.modelName}</p>
          </div>
          <div className="space-x-2">
            {job.status === 'running' && (
              <>
                <button className="text-yellow-700 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded">
                  Pause
                </button>
                <button className="text-red-700 hover:text-red-900 bg-red-100 hover:bg-red-200 px-4 py-2 rounded">
                  Stop
                </button>
              </>
            )}
            {job.status === 'completed' && (
              <Link 
                href={`/dashboard/models/register?from=${job.id}`} 
                className="bg-[#232f3e] hover:bg-[#31465f] text-white px-4 py-2 rounded"
              >
                Register Model
              </Link>
            )}
            {job.status === 'failed' && (
              <Link 
                href={`/dashboard/training/create?clone=${job.id}`} 
                className="bg-[#232f3e] hover:bg-[#31465f] text-white px-4 py-2 rounded"
              >
                Retry Training
              </Link>
            )}
          </div>
        </div>
        
        {/* Job Status */}
        <div className="mt-4">
          <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full mr-3 ${
            job.status === 'running' ? 'bg-blue-100 text-blue-800' :
            job.status === 'completed' ? 'bg-green-100 text-green-800' :
            job.status === 'queued' ? 'bg-yellow-100 text-yellow-800' :
            job.status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </span>
          
          <span className="text-sm text-gray-600">
            Created by {job.createdBy} • Started {formatDate(job.startTime)}
          </span>
        </div>
        
        {/* Progress Bar (for running or partially completed jobs) */}
        {(job.status === 'running' || job.progress > 0) && (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Progress: {job.progress}%</span>
              <span className="text-sm text-gray-600">
                {job.status === 'running' ? 
                  `${calculateDuration(job.startTime)} elapsed` : 
                  `Completed in ${calculateDuration(job.startTime, job.endTime)}`
                }
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  job.status === 'completed' ? 'bg-green-600' :
                  job.status === 'failed' ? 'bg-red-600' :
                  'bg-blue-600'
                }`} 
                style={{ width: `${job.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Training Parameters */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Training Parameters</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Base Model</p>
              <p className="font-medium">{job.baseModel}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Dataset</p>
              <p className="font-medium">{job.dataset}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Epochs</p>
              <p className="font-medium">{completedEpochs} / {job.epochs}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Batch Size</p>
              <p className="font-medium">{job.batchSize}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Learning Rate</p>
              <p className="font-medium">{job.learningRate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">GPU Hours</p>
              <p className="font-medium">{job.gpuHours.toFixed(1)}</p>
            </div>
          </div>
          
          {job.status === 'completed' && (
            <div className="mt-6">
              <h3 className="text-md font-medium mb-3">Final Metrics</h3>
              <div className="space-y-2">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Final Training Loss</p>
                  <p className="text-lg font-semibold">{job.metrics.trainingLoss[job.metrics.trainingLoss.length - 1]?.toFixed(3) || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-500">Final Validation Loss</p>
                  <p className="text-lg font-semibold">{job.metrics.validationLoss[job.metrics.validationLoss.length - 1]?.toFixed(3) || 'N/A'}</p>
                </div>
                {job.metrics.accuracy && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-500">Accuracy</p>
                    <p className="text-lg font-semibold">{(job.metrics.accuracy * 100).toFixed(1)}%</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Middle Column - Training Progress */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Training Progress</h2>
          
          {/* Simple chart representation */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Loss Over Time</h3>
            <div className="h-56 bg-gray-50 rounded p-4 flex items-end space-x-2">
              {job.metrics.trainingLoss.map((loss, i) => loss !== null ? (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-10 bg-blue-500 rounded-t"
                    style={{ 
                      height: `${Math.min(100, 100 * (1 - loss / 3))}%`
                    }}
                  ></div>
                  <div className="text-xs mt-1">E{i+1}</div>
                </div>
              ) : null)}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Higher is better</span>
              <span>Epoch</span>
            </div>
          </div>
          
          {/* Epochs progress */}
          <div>
            <h3 className="text-sm font-medium mb-2">Epochs</h3>
            <div className="space-y-2">
              {Array.from({ length: job.epochs }).map((_, i) => {
                const isCompleted = i < completedEpochs;
                const isCurrent = i === completedEpochs && job.status === 'running';
                
                return (
                  <div key={i} className={`p-3 rounded ${isCompleted ? 'bg-green-50' : isCurrent ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <div className="flex justify-between">
                      <span className={`font-medium ${isCompleted ? 'text-green-700' : isCurrent ? 'text-blue-700' : 'text-gray-500'}`}>
                        Epoch {i + 1}
                      </span>
                      <span className="text-sm">
                        {isCompleted && job.metrics.trainingLoss[i] !== null && (
                          <span>Loss: {job.metrics.trainingLoss[i]?.toFixed(3)}</span>
                        )}
                        {isCurrent && (
                          <span className="text-blue-700">In Progress</span>
                        )}
                        {!isCompleted && !isCurrent && (
                          <span className="text-gray-400">Pending</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Right Column - Logs */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Training Logs</h2>
          
          <div className="bg-gray-800 text-gray-200 p-3 rounded font-mono text-xs h-[500px] overflow-auto">
            {job.logs.map((log, index) => (
              <div key={index} className="mb-1 border-b border-gray-700 pb-1">{log}</div>
            ))}
            {job.status === 'running' && (
              <div className="animate-pulse text-green-400">▌</div>
            )}
          </div>
          
          {job.status === 'failed' && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded">
              <h3 className="font-medium mb-1">Error Details</h3>
              <p className="text-sm">{job.logs[job.logs.length - 1]?.split(' - ')[1]}</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 