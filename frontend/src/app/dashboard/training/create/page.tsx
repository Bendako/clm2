import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import Link from "next/link";

// Define Model type
interface Model {
  id: string;
  name: string;
  version: string;
  type: string;
  parameters: string;
}

// Define Dataset type
interface Dataset {
  id: string;
  name: string;
  description: string;
  size: string;
  examples: number;
  format: string;
  created: string;
}

// Mock data for base models
const mockModels: Model[] = [
  {
    id: "model-1",
    name: "ChatGPT-like Transformer",
    version: "1.0.0",
    type: "Text Generation",
    parameters: "7B",
  },
  {
    id: "model-2",
    name: "Instruct Tuned Transformer",
    version: "2.1.0",
    type: "Text Generation",
    parameters: "13B",
  },
  {
    id: "model-3",
    name: "CodeGen-base",
    version: "0.8.5",
    type: "Code Generation",
    parameters: "3B",
  },
  {
    id: "model-4",
    name: "BART-base",
    version: "2.0.0",
    type: "Summarization",
    parameters: "400M",
  },
  {
    id: "model-5",
    name: "BERT-base",
    version: "1.0.0",
    type: "Embeddings",
    parameters: "110M",
  }
];

// Mock data for datasets
const mockDatasets: Dataset[] = [
  {
    id: "data-1",
    name: "customer-support-dataset-v2",
    description: "Customer support conversations for fine-tuning chat assistants",
    size: "5.2 GB",
    examples: 2800000,
    format: "jsonl",
    created: "2023-09-10"
  },
  {
    id: "data-2",
    name: "github-code-snippets-v3",
    description: "Programming code snippets from open source repositories",
    size: "3.8 GB",
    examples: 1500000,
    format: "jsonl",
    created: "2023-08-15"
  },
  {
    id: "data-3",
    name: "news-articles-summarization",
    description: "News articles with human-written summaries",
    size: "2.1 GB",
    examples: 950000,
    format: "csv",
    created: "2023-07-22"
  },
  {
    id: "data-4",
    name: "multi-step-reasoning-dataset",
    description: "Problems requiring step-by-step reasoning with annotated solutions",
    size: "1.8 GB",
    examples: 870000,
    format: "jsonl",
    created: "2023-06-18"
  }
];

export default async function CreateTrainingJob({ searchParams }: { searchParams: { clone?: string } }) {
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
          <li className="text-gray-600">Create Training Job</li>
        </ol>
      </nav>
      
      {/* Page Header */}
      <div className="bg-white p-6 mb-6 rounded shadow">
        <h1 className="text-2xl font-bold text-[#232f3e]">Create Training Job</h1>
        <p className="text-gray-600 mt-1">Configure and launch a new model training job</p>
      </div>
      
      {/* Job Creation Form */}
      <div className="bg-white p-6 rounded shadow">
        <form className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Job Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="jobName" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Name *
                </label>
                <input
                  type="text"
                  id="jobName"
                  name="jobName"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Fine-tune Transformer for Customer Support"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">
                  Output Model Name *
                </label>
                <input
                  type="text"
                  id="modelName"
                  name="modelName"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., GPT-Customer-Support-v1"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={2}
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of this training job"
                />
              </div>
            </div>
          </div>
          
          {/* Model Selection */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Base Model</h2>
            <p className="text-sm text-gray-600 mb-4">Select the base model to fine-tune or train from scratch</p>
            
            <div className="grid grid-cols-1 gap-3">
              {mockModels.map((model) => (
                <label
                  key={model.id}
                  className="relative flex p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name="baseModel" 
                      value={model.id} 
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-4">
                      <span className="block text-md font-medium text-gray-900">{model.name}</span>
                      <span className="block text-sm text-gray-500">v{model.version} • {model.type} • {model.parameters}</span>
                    </div>
                  </div>
                </label>
              ))}
              
              <label
                className="relative flex p-4 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="baseModel" 
                    value="custom" 
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="ml-4">
                    <span className="block text-md font-medium text-gray-900">Custom Model or Train From Scratch</span>
                    <span className="block text-sm text-gray-500">Upload or specify custom model weights</span>
                  </div>
                </div>
              </label>
            </div>
          </div>
          
          {/* Dataset Selection */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Training Dataset</h2>
            
            <div className="mt-4 mb-4">
              <input
                type="text"
                placeholder="Search datasets..."
                className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dataset
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Examples
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Format
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockDatasets.map((dataset) => (
                    <tr key={dataset.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input 
                          type="radio" 
                          name="dataset" 
                          value={dataset.id}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{dataset.name}</div>
                        <div className="text-sm text-gray-500">{dataset.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(dataset.examples / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dataset.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dataset.format}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <input 
                  type="radio" 
                  id="uploadDataset" 
                  name="dataset" 
                  value="upload"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-2"
                />
                <label htmlFor="uploadDataset" className="font-medium text-gray-900">
                  Upload New Dataset
                </label>
              </div>
              
              <div className="mt-3 ml-6">
                <div className="flex justify-center p-6 border-2 border-dashed border-gray-300 rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload dataset files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Support for jsonl, csv, txt, or zip archives
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Training Configuration */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Training Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="epochs" className="block text-sm font-medium text-gray-700 mb-1">
                  Epochs *
                </label>
                <input
                  type="number"
                  id="epochs"
                  name="epochs"
                  min="1"
                  max="100"
                  defaultValue="3"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Number of complete passes through the dataset</p>
              </div>
              
              <div>
                <label htmlFor="batchSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Size *
                </label>
                <select
                  id="batchSize"
                  name="batchSize"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="8">8</option>
                  <option value="16">16</option>
                  <option value="32" selected>32</option>
                  <option value="64">64</option>
                  <option value="128">128</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">Number of samples processed together</p>
              </div>
              
              <div>
                <label htmlFor="learningRate" className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Rate *
                </label>
                <input
                  type="number"
                  id="learningRate"
                  name="learningRate"
                  min="0.000001"
                  max="0.1"
                  step="0.00001"
                  defaultValue="0.00002"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Step size for gradient updates</p>
              </div>
              
              <div>
                <label htmlFor="optimizer" className="block text-sm font-medium text-gray-700 mb-1">
                  Optimizer
                </label>
                <select
                  id="optimizer"
                  name="optimizer"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="adam" selected>Adam</option>
                  <option value="sgd">SGD</option>
                  <option value="adamw">AdamW</option>
                  <option value="rmsprop">RMSprop</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="validationSplit" className="block text-sm font-medium text-gray-700 mb-1">
                  Validation Split (%)
                </label>
                <input
                  type="number"
                  id="validationSplit"
                  name="validationSplit"
                  min="0"
                  max="50"
                  defaultValue="10"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Percentage of data used for validation</p>
              </div>
              
              <div>
                <label htmlFor="warmupSteps" className="block text-sm font-medium text-gray-700 mb-1">
                  Warmup Steps
                </label>
                <input
                  type="number"
                  id="warmupSteps"
                  name="warmupSteps"
                  min="0"
                  defaultValue="100"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">Advanced Options</h3>
              <div className="bg-gray-50 p-4 rounded space-y-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="mixedPrecision" 
                    name="mixedPrecision" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label htmlFor="mixedPrecision" className="ml-2 block text-sm text-gray-900">
                    Use mixed precision training (faster, less memory)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="saveCheckpoints" 
                    name="saveCheckpoints" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label htmlFor="saveCheckpoints" className="ml-2 block text-sm text-gray-900">
                    Save intermediate checkpoints
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="earlyStop" 
                    name="earlyStop" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <label htmlFor="earlyStop" className="ml-2 block text-sm text-gray-900">
                    Enable early stopping
                  </label>
                </div>
                
                <div>
                  <label htmlFor="customArgs" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Training Arguments (JSON)
                  </label>
                  <textarea
                    id="customArgs"
                    name="customArgs"
                    rows={3}
                    className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder='{"gradient_accumulation_steps": 4, "weight_decay": 0.01}'
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Resource Allocation */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Hardware Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gpuType" className="block text-sm font-medium text-gray-700 mb-1">
                  GPU Type
                </label>
                <select
                  id="gpuType"
                  name="gpuType"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="a100">NVIDIA A100 (40GB)</option>
                  <option value="v100">NVIDIA V100 (16GB)</option>
                  <option value="t4">NVIDIA T4 (16GB)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="gpuCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of GPUs
                </label>
                <select
                  id="gpuCount"
                  name="gpuCount"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low (cheaper, may queue longer)</option>
                  <option value="normal" selected>Normal</option>
                  <option value="high">High (more expensive, starts faster)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule
                </label>
                <select
                  id="schedule"
                  name="schedule"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="now" selected>Start immediately</option>
                  <option value="later">Schedule for later</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded">
              <h3 className="text-md font-medium text-blue-800 mb-2">Estimated Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-blue-600">Estimated Duration</p>
                  <p className="text-lg font-semibold text-blue-800">8-12 hours</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Estimated GPU Hours</p>
                  <p className="text-lg font-semibold text-blue-800">8-12 GPU hours</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600">Estimated Cost</p>
                  <p className="text-lg font-semibold text-blue-800">$24-$36</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Link 
              href="/dashboard/training"
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-[#232f3e] hover:bg-[#31465f] text-white rounded"
            >
              Start Training
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
} 