import { ArrowRight } from 'lucide-react'

export default function OutfitCard({ outfit }) {
  return (
    <div
      id={`outfit-card-${outfit.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex-shrink-0 w-64 md:w-72 border border-cream-200"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-cream-100">
        <img
          src={outfit.image}
          alt={outfit.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Occasion badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-lavender-600 text-[11px] font-bold shadow-sm">
          {outfit.occasion}
        </span>

        {/* View Look button */}
        <button
          id={`view-look-${outfit.id}`}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 px-5 py-2 rounded-xl bg-white text-gray-900 text-sm font-semibold shadow-lg hover:bg-lavender-50 whitespace-nowrap"
        >
          View Look <ArrowRight size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 group-hover:text-lavender-700 transition-colors">
          {outfit.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{outfit.description}</p>
      </div>
    </div>
  )
}
