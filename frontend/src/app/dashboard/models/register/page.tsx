import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../../components/DashboardLayout";
import Link from "next/link";

export default async function RegisterModel() {
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
            <Link href="/dashboard/models" className="text-blue-600 hover:text-blue-800">
              Model Registry
            </Link>
            <svg className="h-4 w-4 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li className="text-gray-600">Register New Model</li>
        </ol>
      </nav>
      
      {/* Page Header */}
      <div className="bg-white p-6 mb-6 rounded shadow">
        <h1 className="text-2xl font-bold text-[#232f3e]">Register New Model</h1>
        <p className="text-gray-600 mt-1">Add a new model to the registry</p>
      </div>
      
      {/* Registration Form */}
      <div className="bg-white p-6 rounded shadow">
        <form className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">
                  Model Name *
                </label>
                <input
                  type="text"
                  id="modelName"
                  name="modelName"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Text Generation Transformer"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="modelVersion" className="block text-sm font-medium text-gray-700 mb-1">
                  Version *
                </label>
                <input
                  type="text"
                  id="modelVersion"
                  name="modelVersion"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 1.0.0"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="modelType" className="block text-sm font-medium text-gray-700 mb-1">
                  Model Type *
                </label>
                <select
                  id="modelType"
                  name="modelType"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a type</option>
                  <option value="Text Generation">Text Generation</option>
                  <option value="Embeddings">Embeddings</option>
                  <option value="Code Generation">Code Generation</option>
                  <option value="Summarization">Summarization</option>
                  <option value="Classification">Classification</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="framework" className="block text-sm font-medium text-gray-700 mb-1">
                  Framework *
                </label>
                <select
                  id="framework"
                  name="framework"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a framework</option>
                  <option value="PyTorch">PyTorch</option>
                  <option value="TensorFlow">TensorFlow</option>
                  <option value="JAX">JAX</option>
                  <option value="Hugging Face Transformers">Hugging Face Transformers</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="parameters" className="block text-sm font-medium text-gray-700 mb-1">
                  Parameters *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="parameters"
                    name="parameters"
                    className="w-full py-2 px-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 7"
                    required
                  />
                  <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r">
                    B
                  </span>
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a status</option>
                  <option value="development">Development</option>
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Description</h2>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Model Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide a detailed description of the model, its capabilities, and use cases..."
                required
              />
            </div>
          </div>
          
          {/* Model Data */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Model Data</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="modelRepo" className="block text-sm font-medium text-gray-700 mb-1">
                  Model Repository URL
                </label>
                <input
                  type="url"
                  id="modelRepo"
                  name="modelRepo"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., https://github.com/username/model-repo"
                />
              </div>
              
              <div>
                <label htmlFor="commitHash" className="block text-sm font-medium text-gray-700 mb-1">
                  Commit Hash
                </label>
                <input
                  type="text"
                  id="commitHash"
                  name="commitHash"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., a1b2c3d4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Files
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <span>Upload model files</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Upload model weights, configs, and other relevant files
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-[#232f3e]">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="accuracy" className="block text-sm font-medium text-gray-700 mb-1">
                  Accuracy (%)
                </label>
                <input
                  type="number"
                  id="accuracy"
                  name="accuracy"
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 92.5"
                />
              </div>
              
              <div>
                <label htmlFor="latency" className="block text-sm font-medium text-gray-700 mb-1">
                  Average Latency (ms)
                </label>
                <input
                  type="number"
                  id="latency"
                  name="latency"
                  min="0"
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 120"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="evaluationNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Evaluation Notes
                </label>
                <textarea
                  id="evaluationNotes"
                  name="evaluationNotes"
                  rows={3}
                  className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the evaluation methodology and any additional metrics..."
                />
              </div>
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Link 
              href="/dashboard/models"
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-[#232f3e] hover:bg-[#31465f] text-white rounded"
            >
              Register Model
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
} 