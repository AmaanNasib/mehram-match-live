import React from 'react';

export default function BlogCard({ title, desc, date, img }) {
  return (
    <div className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">
      <img src={img} alt={title} className="h-40 w-full object-cover" />

      {/* shimmer overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 animate-shimmer pointer-events-none" />

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-2">{date}</p>
        <p className="text-gray-700 text-sm line-clamp-3">{desc}</p>
      </div>
    </div>
  );
}
