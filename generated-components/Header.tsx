import React, { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
  children?: NavigationItem[];
}

interface HeaderProps {
  logo?: string;
  navigationItems: NavigationItem[];
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  logo,
  navigationItems,
  onMenuToggle,
  isMenuOpen = false,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {logo && <img src={logo} alt="Logo" className="h-8 w-auto mr-4" />}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    onClick={() => handleDropdownToggle(item.label)}
                    className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    {item.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                ) : (
                  <a
                    href={item.href}
                    className={`text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      item.isActive
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : ""
                    }`}
                  >
                    {item.label}
                  </a>
                )}

                {/* Dropdown Menu */}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors duration-200"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navigationItems.map((item) => (
              <div key={item.label}>
                <a
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="pl-6">
                    {item.children.map((child) => (
                      <a
                        key={child.label}
                        href={child.href}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
