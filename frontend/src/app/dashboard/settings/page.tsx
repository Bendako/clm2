import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";

// Define user profile interface
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
  lastLogin: string;
  avatar?: string;
  twoFactorEnabled: boolean;
}

// Define platform settings interface
interface PlatformSettings {
  defaultModelId: string;
  defaultDatasetId: string;
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  slackIntegration: boolean;
  slackWebhook?: string;
  autoScalingEnabled: boolean;
  loggingLevel: "debug" | "info" | "warn" | "error";
  maxConcurrentJobs: number;
  defaultGpuCount: number;
}

// Define API key interface
interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed?: string;
  expiresAt?: string;
  scopes: string[];
}

// Define Team Member interface
interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  joinedAt: string;
}

// Mock data
const mockUserProfile: UserProfile = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  emailAddress: "john.doe@example.com",
  role: "Administrator",
  lastLogin: "2023-10-15T14:30:00Z",
  twoFactorEnabled: true
};

const mockPlatformSettings: PlatformSettings = {
  defaultModelId: "model-123",
  defaultDatasetId: "dataset-456",
  notificationsEnabled: true,
  emailNotifications: true,
  slackIntegration: false,
  autoScalingEnabled: true,
  loggingLevel: "info",
  maxConcurrentJobs: 5,
  defaultGpuCount: 2
};

const mockApiKeys: ApiKey[] = [
  {
    id: "key-1",
    name: "Production API Key",
    key: "sk_prod_••••••••••••••••••••••••••••",
    created: "2023-09-01T10:00:00Z",
    lastUsed: "2023-10-16T08:45:23Z",
    scopes: ["read:models", "write:models", "read:data", "write:data"]
  },
  {
    id: "key-2",
    name: "Development API Key",
    key: "sk_dev_••••••••••••••••••••••••••••",
    created: "2023-09-15T14:20:00Z",
    lastUsed: "2023-10-14T16:32:10Z",
    expiresAt: "2024-09-15T14:20:00Z",
    scopes: ["read:models", "write:models", "read:data"]
  }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    joinedAt: "2023-01-15T08:00:00Z"
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "admin",
    joinedAt: "2023-01-15T09:30:00Z"
  },
  {
    id: "user-3",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "member",
    joinedAt: "2023-02-20T11:15:00Z"
  },
  {
    id: "user-4",
    name: "Taylor Reed",
    email: "taylor.reed@example.com",
    role: "viewer",
    joinedAt: "2023-05-10T13:45:00Z"
  }
];

// Utility function to format date
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric'
  };
  return new Date(dateString).toLocaleString('en-US', options);
}

// Utility function to format datetime
function formatDateTime(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleString('en-US', options);
}

export default async function Settings() {
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
          <h1 className="text-2xl font-bold text-[#232f3e]">Settings</h1>
          <p className="text-gray-600 mt-1">Configure your MLOps platform settings and preferences</p>
        </div>
        <button className="bg-[#232f3e] hover:bg-[#31465f] text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </div>
      
      {/* Settings Navigation */}
      <div className="bg-white p-6 mb-6 rounded shadow">
        <div className="flex border-b">
          <button className="px-4 py-2 border-b-2 border-[#232f3e] font-medium text-[#232f3e]">
            General
          </button>
          <button className="px-4 py-2 text-gray-500 hover:text-[#232f3e]">
            Profile
          </button>
          <button className="px-4 py-2 text-gray-500 hover:text-[#232f3e]">
            API Keys
          </button>
          <button className="px-4 py-2 text-gray-500 hover:text-[#232f3e]">
            Team Management
          </button>
          <button className="px-4 py-2 text-gray-500 hover:text-[#232f3e]">
            Billing
          </button>
          <button className="px-4 py-2 text-gray-500 hover:text-[#232f3e]">
            Integrations
          </button>
        </div>
      </div>
      
      {/* General Settings Section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-6">General Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Defaults */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Platform Defaults</h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Default Model</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#232f3e] focus:border-[#232f3e] sm:text-sm rounded-md">
                <option value="model-123">GPT-Customer-Support-v1</option>
                <option value="model-456">CodeGen-Assistant-v0.9.5</option>
                <option value="model-789">BART-Summarizer-v2.0</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Default Dataset</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#232f3e] focus:border-[#232f3e] sm:text-sm rounded-md">
                <option value="dataset-123">customer-support-dataset-v2</option>
                <option value="dataset-456">github-code-snippets-v3</option>
                <option value="dataset-789">news-articles-summarization</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Maximum Concurrent Jobs</label>
              <input
                type="number"
                min="1"
                max="10"
                defaultValue={mockPlatformSettings.maxConcurrentJobs}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#232f3e] focus:border-[#232f3e] sm:text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Default GPU Count</label>
              <input
                type="number"
                min="1"
                max="8"
                defaultValue={mockPlatformSettings.defaultGpuCount}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#232f3e] focus:border-[#232f3e] sm:text-sm"
              />
            </div>
          </div>
          
          {/* Resource Management */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Resource Management</h3>
            
            <div className="flex items-center">
              <input
                id="auto-scaling"
                type="checkbox"
                defaultChecked={mockPlatformSettings.autoScalingEnabled}
                className="h-4 w-4 text-[#232f3e] focus:ring-[#232f3e] border-gray-300 rounded"
              />
              <label htmlFor="auto-scaling" className="ml-2 block text-sm text-gray-700">
                Enable Auto-Scaling
              </label>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Logging Level</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#232f3e] focus:border-[#232f3e] sm:text-sm rounded-md">
                <option value="debug">Debug</option>
                <option value="info" selected={mockPlatformSettings.loggingLevel === "info"}>Info</option>
                <option value="warn">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
            
            <h3 className="font-medium text-gray-700 mt-6">Notifications</h3>
            
            <div className="flex items-center">
              <input
                id="notifications"
                type="checkbox"
                defaultChecked={mockPlatformSettings.notificationsEnabled}
                className="h-4 w-4 text-[#232f3e] focus:ring-[#232f3e] border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                Enable Notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="email-notifications"
                type="checkbox"
                defaultChecked={mockPlatformSettings.emailNotifications}
                className="h-4 w-4 text-[#232f3e] focus:ring-[#232f3e] border-gray-300 rounded"
              />
              <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="slack-integration"
                type="checkbox"
                defaultChecked={mockPlatformSettings.slackIntegration}
                className="h-4 w-4 text-[#232f3e] focus:ring-[#232f3e] border-gray-300 rounded"
              />
              <label htmlFor="slack-integration" className="ml-2 block text-sm text-gray-700">
                Slack Integration
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* API Keys Section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">API Keys</h2>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create API Key
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockApiKeys.map((apiKey) => (
                <tr key={apiKey.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{apiKey.name}</div>
                    <div className="text-xs text-gray-500">{apiKey.scopes.join(", ")}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {apiKey.key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(apiKey.created)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {apiKey.lastUsed ? formatDateTime(apiKey.lastUsed) : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {apiKey.expiresAt ? formatDate(apiKey.expiresAt) : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Revoke</button>
                    <button className="text-gray-600 hover:text-gray-900">Rotate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Team Management Section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Team Management</h2>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Invite Team Member
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockTeamMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {member.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      member.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                      member.role === 'member' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(member.joinedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Profile Section */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-6">User Profile</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-32 w-32 bg-gray-200 rounded-full flex items-center justify-center text-3xl text-gray-600">
                {mockUserProfile.firstName.charAt(0)}{mockUserProfile.lastName.charAt(0)}
              </div>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded w-full">
                Change Avatar
              </button>
              <div className="text-center">
                <p className="text-sm text-gray-500">Last login: {formatDateTime(mockUserProfile.lastLogin)}</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  defaultValue={mockUserProfile.firstName}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#232f3e] focus:border-[#232f3e] sm:text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  defaultValue={mockUserProfile.lastName}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#232f3e] focus:border-[#232f3e] sm:text-sm"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                defaultValue={mockUserProfile.emailAddress}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-[#232f3e] focus:border-[#232f3e] sm:text-sm"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Security</h3>
              
              <div className="flex items-center justify-between py-4 border-t border-b">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                </div>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded">
                  Change Password
                </button>
              </div>
              
              <div className="flex items-center justify-between py-4 border-b">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">{mockUserProfile.twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <button className={`${mockUserProfile.twoFactorEnabled ? 'bg-red-100 hover:bg-red-200 text-red-800' : 'bg-green-100 hover:bg-green-200 text-green-800'} px-4 py-2 rounded`}>
                  {mockUserProfile.twoFactorEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 