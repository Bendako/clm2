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
    <header className="h-16 bg-[#232f3e] text-white flex justify-between items-center px-6 fixed w-full z-10 ml-56">
      <h1 className="text-xl font-bold">AWS LLM Continuous Training Platform</h1>
      <div className="flex items-center gap-4">
        <span>{user?.firstName || user?.emailAddress}</span>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
} 