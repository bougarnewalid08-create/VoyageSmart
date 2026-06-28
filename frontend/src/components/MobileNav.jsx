import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const MobileNav = ({ user, onLogout, currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { path: '/hotels', label: 'Hotels' },
    { path: '/stays', label: 'Stays' },
    { path: '/flights', label: 'Flights' },
    { path: '/plans', label: 'Plans' },
    { path: '/favorites', label: 'Favorites' },
  ];

  if (user) {
    links.push({ path: '/my-reservations', label: 'My Bookings' });
  }

  return (
    <div className="md:hidden flex items-center">
      <button onClick={() => setIsOpen(true)} className="p-2 text-slate-600">
        <Menu size={24} />
      </button>

      {createPortal(
        <div className="md:hidden">
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100]"
                  onClick={() => setIsOpen(false)}
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 bottom-0 w-64 bg-white z-[110] shadow-2xl flex flex-col py-6"
                >
                  <div className="px-6 flex justify-between items-center mb-8">
                    <span className="text-xl font-bold text-indigo-600">Menu</span>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 bg-slate-50 rounded-full hover:text-indigo-600 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 px-4 mb-auto">
                    {links.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                          currentPath === link.path 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="px-6 mt-8 border-t border-slate-100 pt-8">
                    {user ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.role}</p>
                          </div>
                        </div>
                        {user.role === 'Admin' && (
                          <Link to="/dashboard" onClick={() => setIsOpen(false)} className="w-full py-3 bg-slate-50 text-indigo-600 rounded-xl text-center font-bold text-sm">
                            Open Dashboard
                          </Link>
                        )}
                        <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl text-center font-bold text-sm hover:bg-rose-100 transition-colors">
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-3 border border-slate-200 text-slate-600 rounded-xl text-center font-bold text-sm">
                          Log In
                        </Link>
                        <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-center font-bold text-sm shadow-lg shadow-indigo-100">
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MobileNav;
