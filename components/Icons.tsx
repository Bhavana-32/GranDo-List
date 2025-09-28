import React from 'react';

// Fix: Explicitly type iconProps to ensure compatibility with SVG attributes.
const iconProps: React.SVGProps<SVGSVGElement> = {
  className: "w-6 h-6",
  strokeWidth: "1.5",
  stroke: "currentColor",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const TextIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 7v-1a2 2 0 0 1 2 -2h2" />
    <path d="M4 17v1a2 2 0 0 0 2 2h2" />
    <path d="M16 4h2a2 2 0 0 1 2 2v1" />
    <path d="M16 20h2a2 2 0 0 0 2 -2v-1" />
    <path d="M9 12h6" />
    <path d="M12 9v6" />
  </svg>
);

export const MicIcon = () => (
  <svg {...iconProps} viewBox="0 0 24 24">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z" />
    <path d="M5 10a7 7 0 0 0 14 0" />
    <path d="M8 21l8 0" />
    <path d="M12 17l0 4" />
  </svg>
);

export const UploadIcon = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
        <polyline points="7 9 12 4 17 9" />
        <line x1="12" y1="4" x2="12" y2="16" />
    </svg>
);

export const DragHandleIcon = () => (
    <svg className="w-5 h-5 text-gray-400 cursor-grab" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="1"></circle>
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="12" cy="19" r="1"></circle>
    </svg>
);

export const QuoteIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 9.983-9.609l.02-1.974c-5.883-.041-9.923 3.423-9.923 9.474v9.5h-4.094v-21h-4v21h8.094z"/>
  </svg>
);

export const TrashIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="4" y1="7" x2="20" y2="7" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
  </svg>
);

export const SendIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <line x1="10" y1="14" x2="21" y2="3" />
    <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
  </svg>
);