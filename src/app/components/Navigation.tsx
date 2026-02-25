import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/features', label: t('nav.features') },
    { path: '/training', label: t('nav.training') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/98 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl tracking-tight">
              <span className="text-gray-900">Inhalo</span>
              <span className="text-blue-600"> 360°</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                <SelectTrigger className="w-24 border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="bm">BM</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ta">தமிழ்</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-2">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`transition-colors ${
                    isActive(item.path)
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                <Globe className="w-4 h-4 text-gray-600" />
                <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
                  <SelectTrigger className="w-32 border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bm">Bahasa Melayu</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ta">தமிழ்</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
