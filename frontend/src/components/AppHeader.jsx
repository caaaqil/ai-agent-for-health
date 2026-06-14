import React from 'react';
import { Leaf } from 'lucide-react';

/**
 * Shared top bar used across every authenticated page.
 * `right` is an optional slot for a page-specific action.
 */
const AppHeader = ({ right }) => (
    <header className="flex justify-between items-center mb-7">
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center shadow-glow">
                <Leaf className="text-white" size={18} strokeWidth={2.4} />
            </div>
            <span className="font-bold text-sm text-ink tracking-tight">Living Sanctuary</span>
        </div>
        {right}
    </header>
);

export default AppHeader;
