import { useState } from 'react'

export default function Drawer({ id, number, label, sublabel, badge, isOpen, onToggle, children }) {
  return (
    <div>
      <div
        className={`drawer-tab px-4 py-3 flex items-center justify-between select-none ${isOpen ? 'is-open' : ''}`}
        onClick={() => onToggle(id)}
      >
        <div className="flex items-center gap-3">
          <span className="handle" />
          <span className="text-green-700 text-xs w-6">{String(number).padStart(2, '0')}</span>
          <span className="label-strip">{label}</span>
          {sublabel && <span className="text-green-700 text-xs hidden sm:inline">{sublabel}</span>}
        </div>
        <div className="flex items-center gap-3">
          {badge}
          <span
            className="text-green-600 text-lg transition-transform duration-300"
            style={{ display: 'inline-block', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
          >›</span>
        </div>
      </div>
      <div className={`drawer-body ${isOpen ? 'is-open' : ''}`}>
        <div className="px-4 py-5 border-b border-green-900">
          {children}
        </div>
      </div>
    </div>
  )
}
