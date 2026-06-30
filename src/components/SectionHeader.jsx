import React from 'react'

export default function SectionHeader({ icon, title, subtitle, tag }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon && (
          <div className="p-2 rounded-xl bg-white shadow-sm border border-gray-100 text-gray-600">
            {icon}
          </div>
        )}
        {tag && (
          <span className="text-[10px] font-bold text-violet-500 uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-violet-50">
            {tag}
          </span>
        )}
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">{title}</h2>
      {subtitle && <p className="text-gray-500 text-sm sm:text-base max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
  )
}
