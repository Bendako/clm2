import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/data", label: "Data Management" },
    { path: "/dashboard/models", label: "Model Registry" },
    { path: "/dashboard/training", label: "Training Pipeline" },
    { path: "/dashboard/benchmarks", label: "Benchmarks" },
    { path: "/dashboard/deployment", label: "Deployment" },
    { path: "/dashboard/monitoring", label: "Monitoring" },
    { path: "/dashboard/settings", label: "Settings" },
  ];
  
  return (
    <div className="w-56 bg-[#1a2733] text-white flex flex-col h-screen fixed">
      <div className="p-4 h-16 bg-[#232f3e] flex items-center">
        <h1 className="text-lg font-bold">LLM Platform</h1>
      </div>
      
      <nav className="flex-1 pt-8">
        {navItems.map((item) => (
          <div 
            key={item.path}
            className={`px-4 py-3 ${isActive(item.path) ? "bg-[#31465f]" : ""}`}
          >
            <Link 
              href={item.path} 
              className={isActive(item.path) ? "text-white block" : "text-[#8d9dab] block"}
            >
              {item.label}
            </Link>
          </div>
        ))}
      </nav>
    </div>
  );
} 