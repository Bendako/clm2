import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardLayout from "../../components/DashboardLayout";

// Define Model type for monitoring
interface MonitoredModel {
  id: string;
  name: string;
  status: "healthy" | "degraded" | "critical" | "unknown";
  deploymentId: string;
  endpoint: string;
  lastChecked: string;
  uptime: number;
  latency: number;
  throughput: number;
  errorRate: number;
  p90Latency: number;
  p99Latency: number;
  requestsPerMinute: number;
  alerts: Alert[];
}

// Define Alert type
interface Alert {
  id: string;
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: string;
  resolved: boolean;
}

// Mock data for monitored models
const mockMonitoredModels: MonitoredModel[] = [
  {
    id: "model-1",
    name: "GPT-Customer-Support-v1",
    status: "healthy",
    deploymentId: "deploy-123",
    endpoint: "api/v1/customer-support",
    lastChecked: "2023-10-16T10:32:15Z",
    uptime: 99.98,
    latency: 245,
    throughput: 125,
    errorRate: 0.12,
    p90Latency: 350,
    p99Latency: 520,
    requestsPerMinute: 42,
    alerts: []
  },
  {
    id: "model-2",
    name: "CodeGen-Assistant-v0.9.5",
    status: "degraded",
    deploymentId: "deploy-456",
    endpoint: "api/v1/code-gen",
    lastChecked: "2023-10-16T10:30:45Z",
    uptime: 98.5,
    latency: 568,
    throughput: 43,
    errorRate: 2.7,
    p90Latency: 890,
    p99Latency: 1250,
    requestsPerMinute: 18,
    alerts: [
      {
        id: "alert-1",
        severity: "warning",
        message: "Latency has increased by 25% in the last hour",
        timestamp: "2023-10-16T09:45:12Z",
        resolved: false
      }
    ]
  },
  {
    id: "model-3",
    name: "BART-Summarizer-v2.0",
    status: "critical",
    deploymentId: "deploy-789",
    endpoint: "api/v1/summarizer",
    lastChecked: "2023-10-16T10:28:30Z",
    uptime: 85.2,
    latency: 1250,
    throughput: 8,
    errorRate: 12.4,
    p90Latency: 1800,
    p99Latency: 2500,
    requestsPerMinute: 5,
    alerts: [
      {
        id: "alert-2",
        severity: "critical",
        message: "Error rate exceeded threshold of 10%",
        timestamp: "2023-10-16T08:15:22Z",
        resolved: false
      },
      {
        id: "alert-3",
        severity: "critical",
        message: "Service experiencing intermittent failures",
        timestamp: "2023-10-16T09:20:18Z",
        resolved: false
      }
    ]
  },
  {
    id: "model-4",
    name: "Instruct-Reasoning-v1",
    status: "healthy",
    deploymentId: "deploy-101",
    endpoint: "api/v1/reasoning",
    lastChecked: "2023-10-16T10:31:55Z",
    uptime: 99.9,
    latency: 320,
    throughput: 75,
    errorRate: 0.05,
    p90Latency: 450,
    p99Latency: 680,
    requestsPerMinute: 22,
    alerts: []
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

// Utility function to format status with color
function getStatusBadge(status: string) {
  switch (status) {
    case 'healthy':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Healthy</span>;
    case 'degraded':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Degraded</span>;
    case 'critical':
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Critical</span>;
    default:
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
  }
}

export default async function Monitoring() {
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

  // Get count of models by status
  const healthyModels = mockMonitoredModels.filter(model => model.status === "healthy").length;
  const degradedModels = mockMonitoredModels.filter(model => model.status === "degraded").length;
  const criticalModels = mockMonitoredModels.filter(model => model.status === "critical").length;
  
  // Get total alerts
  const totalAlerts = mockMonitoredModels.reduce((count, model) => count + model.alerts.filter(alert => !alert.resolved).length, 0);

  return (
    <DashboardLayout user={serializedUser}>
      {/* Page Header */}
      <div className="bg-white p-6 mb-6 rounded shadow flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#232f3e]">Monitoring</h1>
          <p className="text-gray-600 mt-1">Track and analyze model performance in production</p>
        </div>
        <div className="flex space-x-2">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Alert
          </button>
        </div>
      </div>
      
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Healthy Models</h2>
              <p className="text-2xl font-semibold">{healthyModels}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Degraded Models</h2>
              <p className="text-2xl font-semibold">{degradedModels}</p>
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
              <h2 className="text-sm font-medium text-gray-500">Critical Models</h2>
              <p className="text-2xl font-semibold">{criticalModels}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-500">Active Alerts</h2>
              <p className="text-2xl font-semibold">{totalAlerts}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Models Table */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Deployed Models</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uptime
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Latency (ms)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error Rate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Throughput
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Checked
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockMonitoredModels.map((model) => (
                <tr key={model.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{model.name}</div>
                    <div className="text-sm text-gray-500">{model.endpoint}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(model.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{model.uptime}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{model.latency} ms</div>
                    <div className="text-xs text-gray-500">P90: {model.p90Latency} ms</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm ${model.errorRate > 5 ? 'text-red-600' : model.errorRate > 1 ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {model.errorRate}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{model.throughput} req/s</div>
                    <div className="text-xs text-gray-500">{model.requestsPerMinute} req/min</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(model.lastChecked)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Configure</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Active Alerts Section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Active Alerts</h2>
        {totalAlerts > 0 ? (
          <div className="space-y-4">
            {mockMonitoredModels.flatMap(model => 
              model.alerts
                .filter(alert => !alert.resolved)
                .map(alert => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'critical' ? 'border-red-500 bg-red-50' : 
                    alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' : 
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">
                          {model.name}: {alert.message}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(alert.timestamp)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-sm text-gray-600 hover:text-gray-900">Acknowledge</button>
                        <button className="text-sm text-gray-600 hover:text-gray-900">Resolve</button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No active alerts at this time</div>
        )}
      </div>
      
      {/* Metrics Overview Section */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Metrics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Request Volume</h3>
            <div className="h-48 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-500">Request volume chart placeholder</p>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Latency Trends</h3>
            <div className="h-48 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-500">Latency trends chart placeholder</p>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Error Rates</h3>
            <div className="h-48 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-500">Error rates chart placeholder</p>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Resource Utilization</h3>
            <div className="h-48 bg-gray-100 flex items-center justify-center rounded">
              <p className="text-gray-500">Resource utilization chart placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 