import { UserButton } from "@clerk/nextjs";

interface HeaderProps {
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    emailAddress?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="h-16 bg-[#232f3e] shadow-md text-white flex justify-between items-center px-6 fixed w-full z-10 ml-56">
      <div className="flex items-center">
        <svg className="h-6 w-6 text-[#ff9900] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h1 className="text-xl font-bold">AWS LLM Continuous Training Platform</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-[#31465f] flex items-center justify-center text-white mr-2">
            {user?.firstName?.charAt(0) || user?.emailAddress?.charAt(0) || "U"}
          </div>
          <span className="text-gray-100">{user?.firstName || user?.emailAddress}</span>
        </div>
        <div className="ml-2 border-l border-gray-600 pl-2">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
} 