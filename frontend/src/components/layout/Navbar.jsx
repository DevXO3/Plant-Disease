import React from 'react';
import { Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-lg">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                <Link to="/" className="flex items-center space-x-2">
                    <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-500">
                        <Leaf size={20} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">Botanic<span className="text-emerald-500">AI</span></span>
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">Home</Link>
                    <a href="https://github.com/Soumo9831/Plant-Disease" target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-300 transition-colors hover:text-white">GitHub</a>
                </div>
            </div>
        </nav>
    );
}
