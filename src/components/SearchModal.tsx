import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { formatPrice } from '../lib/utils'

interface SearchProduct {
  id: string
  name: string
  price: number
  images: string[]
  category: string
  stoneType: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      setQuery('')
      setResults([])
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.products || [])
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [query])

  const handleProductClick = (id: string) => {
    onClose()
    navigate(`/shop/${id}`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#050705]/80 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-2xl bg-[#121412] border border-[#D4AF37]/20 rounded-xl shadow-2xl relative z-10 overflow-hidden"
          >
            <div className="p-6 border-b border-[#D4AF37]/10 flex items-center gap-4">
              <Search className="w-5 h-5 text-[#D4AF37] opacity-70" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH FOR EMERALDS, RUBIES, SAPPHIRES..."
                className="w-full bg-transparent border-none text-[#F5F5F0] placeholder:text-[#F5F5F0]/30 outline-none focus:ring-0 text-sm tracking-wider font-light uppercase"
              />
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-[#D4AF37]/10 text-on-surface-variant hover:text-[#D4AF37] transition-all rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-6">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#D4AF37]/50">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-[10px] tracking-widest uppercase">Quarrying matching gems...</span>
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <div className="space-y-4">
                  <div className="text-[10px] tracking-widest text-[#D4AF37]/60 uppercase mb-2">
                    MATCHING TREASURES ({results.length})
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {results.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center gap-4 p-3 bg-[#050705]/50 hover:bg-[#D4AF37]/5 border border-transparent hover:border-[#D4AF37]/10 rounded-lg cursor-pointer transition-all"
                      >
                        <div className="w-12 h-12 rounded bg-[#121412] border border-[#D4AF37]/10 overflow-hidden">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#D4AF37] text-xs">✧</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium hover:text-[#D4AF37] transition-colors">{product.name}</h4>
                          <span className="text-[10px] opacity-40 uppercase tracking-widest">
                            {product.stoneType} • {product.category}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-[#D4AF37]">
                          {formatPrice(product.price)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-4xl text-[#D4AF37]/20 block mb-3">✧</span>
                  <p className="text-sm text-[#F5F5F0]/60 mb-1">No matching gems discovered</p>
                  <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/40">Try searching for other gemstone categories or stone types.</p>
                </div>
              )}

              {!query && (
                <div className="text-center py-8">
                  <div className="flex justify-center items-center gap-2 mb-3 text-primary opacity-60">
                    <span className="text-xs tracking-widest uppercase">Popular searches:</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Sapphire', 'Emerald', 'Ruby', 'Rings', 'Necklaces'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1 bg-[#050705] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 text-[10px] uppercase tracking-wider transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
