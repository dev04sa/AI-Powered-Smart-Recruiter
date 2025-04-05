
import React from "react";
import { Link } from "react-router-dom";
import { BriefcaseIcon, LayoutDashboardIcon, UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [activeLink, setActiveLink] = React.useState<string>(
    window.location.pathname
  );

  const links = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboardIcon className="h-4 w-4 mr-2" /> },
    { path: "/jobs", label: "Jobs", icon: <BriefcaseIcon className="h-4 w-4 mr-2" /> },
    { path: "/candidates", label: "Candidates", icon: <UsersIcon className="h-4 w-4 mr-2" /> },
  ];

  return (
    <nav className="sticky top-0 z-30 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary">
              <BriefcaseIcon className="w-4 h-4 text-white" />
            </div>
            <span className="ml-2 text-xl font-semibold">JobgleAI</span>
          </Link>
          
          <div className="hidden md:flex ml-10 space-x-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  activeLink === link.path
                    ? "bg-primary-50 text-primary"
                    : "text-gray-600 hover:text-primary hover:bg-primary-50"
                )}
                onClick={() => setActiveLink(link.path)}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">AI Recruitment Assistant</span>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-around border-t py-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "flex flex-col items-center justify-center text-xs font-medium px-3 py-1 rounded-md",
              activeLink === link.path
                ? "text-primary"
                : "text-gray-600"
            )}
            onClick={() => setActiveLink(link.path)}
          >
            {link.icon}
            <span className="mt-1">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
