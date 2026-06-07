import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { Filter, Grid, List, ChevronLeft, ChevronRight, ShoppingCart, Loader2 } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { formatPrice } from '../lib/utils'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stoneType: string
  stoneColor: string
  caratWeight: number
  origin: string
  stockQty: number
}

// Fallback high-fidelity gemstones to protect the live view if DB is unseeded
const FALLBACK_GEMS: Product[] = [
  {
    id: 'gem-1',
    name: 'Ceylon Blue Sapphire Ring',
    description: 'Cornflower Blue sapphire sourced from Ratnapura mines in 18k white gold setting.',
    price: 45000,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBa3vnDJx5hGEcrOK-rpHPu1tT-VbiNYbgkXjotR9g22CFzUjo2_DW7wSLrbmmjIQF9tm_HIKvoND5j5Q952uicDTVzqsRBoiJAostwRCJY0b5i-k1wzRF4Rtu_MmPKPc_isse_403urdUdSgUsAELb5cae30wAeJ5byNnbxQDOqpPlvVsy0ItEeJ0Oe0mK1OiSUqbpDitDXl8NADY-tX3zwJbgE3gTb31uiGxrLDRM815-Ir7liKo1zeXP53pyvxkgEGHAkIWuej3T'],
    category: 'Rings',
    stoneType: 'Sapphire',
    stoneColor: 'Cornflower Blue',
    caratWeight: 2.3,
    origin: 'Sri Lanka',
    stockQty: 4,
  },
  {
    id: 'gem-2',
    name: 'Regal Crimson Ruby Specimen',
    description: 'Burmese blood-red ruby cushion cut loose gemstone with stunning refractive clarity.',
    price: 84500,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD9Ezutul4FpBko66cfwIcb1Dx_KCLCYjlwlGwE52El8nZovpT5FjjbtCHtBuZns9-FPkCqU6AfYARgnBlRYRXfmCl5A3qr2o2bQGzkmaAQI5SoSZs10RFGK-AQuM7b8pCCugFbH2Xw9TDxdAP69-xvzTX-6_4iPGC_MU7QLtb6Oz32R_Gf8C9h8Ly82uXw_eKSi8wVsV9B5p9YyU80OCU6n0EkF9rOmbGMT1MAxUzYx6QDXCs1pt7qn-hienAHrgkGAo3meMI1tux1'],
    category: 'Raw Stones',
    stoneType: 'Ruby',
    stoneColor: 'Burmese Red',
    caratWeight: 2.4,
    origin: 'Burma',
    stockQty: 2,
  },
  {
    id: 'gem-3',
    name: 'Midnight Ceylon Sapphire',
    description: 'A dark sapphire loose gemstone catching deep hues under active lighting.',
    price: 92000,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBqs9h8VQbYGzD6F0AubUijYn63xjxQqpqSP370l0C1cSUPiP8BnDJhHc15UIBYmOurR8A3YXSh5p9sQlDcVNEAgs0vxCYA9wkf8Cc3SP0EeYKva1nIXQIVsb4RHfOEPFys-c7TdVYAVDlUxQUaSQTq9dOgqPYmMljBJg5zWScsWrnvlzO5Ekzv5QDu_HvYVQ2kI-yiibpwNWrueRwL6eb98ZRH0VYzk-NItGNssvHWc_92aZxSTMlM5184BZylBnctQ5yTMlPqPq__'],
    category: 'Raw Stones',
    stoneType: 'Sapphire',
    stoneColor: 'Midnight Blue',
    caratWeight: 3.1,
    origin: 'Sri Lanka',
    stockQty: 5,
  },
  {
    id: 'gem-4',
    name: 'Verdant Colombian Emerald',
    description: 'Classic step-cut emerald with lush inclusions, highly verified origin.',
    price: 67200,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuA9u_9CPEICxJKCTHEJE2mv4LKnv9rNJHE-otX8DXJI46KVgYn_rytAdoGzeIE5q4SSGxw5JH1lWCRj2QNYyAcR0aefmj44IWnXV4-cdRAXOWeDqMrLQXXypC38zqVLDg-weTbGLgA2WAph8jurIhXXoLFi5PvdJdGazx37H15ETYmx6Y0HtmcQW0i_21S2oYgFQfwHi3Uth9RkKge_uxgae05FetdmUge9s-xCDGOSm04dOHSgB-te0KsHxTbgVq9lor5RhyJU3Wtc'],
    category: 'Raw Stones',
    stoneType: 'Emerald',
    stoneColor: 'Vibrant Green',
    caratWeight: 1.8,
    origin: 'Colombia',
    stockQty: 3,
  },
  {
    id: 'gem-5',
    name: 'IF Clarity Ethereal Diamond',
    description: 'Round brilliant flawless diamond representing extreme light refraction.',
    price: 145000,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAv2HnBKDk5l_H7kGdJgnXGi-2bXV4_1-EJqN3qMGfrK3Z8ILtptEzJ2UzjHaUPP80tyl1_Sr16G--Ha1zxR2oQscFuherXbFnVsgGI4zyubNn6bD-jgpZo-XGgGLjvZ7ACLYF-_yn3R5k8-YpoOHy-z0O5M0BxfWKLRWjXxU9a2WJMdhB6jhy1DfurbtWOxH8gxDhvJFr0IIaflahXT3-qC0vOGY8iqsEnhWjO08DHiCChbbp5otDvTX9g40h-xjTiD83-EiDkEmUa'],
    category: 'Raw Stones',
    stoneType: 'Diamond',
    stoneColor: 'Flawless White',
    caratWeight: 1.2,
    origin: 'South Africa',
    stockQty: 1,
  },
  {
    id: 'gem-6',
    name: 'Lunar South Sea Pearl',
    description: 'A beautiful natural spherical white South Sea pearl with heavy satin luster.',
    price: 32500,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBDI9flz0G6o4JJw1Bri1imgAdig8J-yTszvlFv5ABjnjFZggfqBvuI-vcqJJ9-wLl8kiXKetHOGUKwZpDJa-fnsRUOWyWsooe1Wi6ctd7BJXlFtO06ctcgXoBx0dEYAy_ZafDfsaNGR_fpSBuOpOexqP6MBKtNk0W-u9tu98ebzHb4-KeWVn8sav5g9QjHHGMwcnVs7-FRC8NYVYsv0KiwW-NEgNgRl2egnu05IHc2GYMDgXKn5QcXYvvhYXcxQav8A86UcMDhz49Q'],
    category: 'Birthstones',
    stoneType: 'Pearl',
    stoneColor: 'Satin White',
    caratWeight: 0,
    origin: 'Australia',
    stockQty: 8,
  },
]

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewViewMode] = useState<'grid' | 'list'>('grid')

  // Filter states
  const [selectedStoneTypes, setSelectedStoneTypes] = useState<string[]>(
    searchParams.get('stoneType') ? searchParams.get('stoneType')!.split(',') : []
  )
  const [maxPrice, setMaxPrice] = useState<number>(
    searchParams.get('price') ? parseInt(searchParams.get('price')!) : 500000
  )
  const [inStockOnly, setInStockOnly] = useState<boolean>(
    searchParams.get('inStock') === 'true'
  )
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get('sort') || 'newest'
  )

  const currentCategory = searchParams.get('category') || ''

  // Trigger search params updates
  useEffect(() => {
    const params: any = {}
    if (currentCategory) params.category = currentCategory
    if (selectedStoneTypes.length > 0) params.stoneType = selectedStoneTypes.join(',')
    if (maxPrice < 500000) params.price = maxPrice.toString()
    if (inStockOnly) params.inStock = 'true'
    if (sortBy !== 'newest') params.sort = sortBy

    setSearchParams(params)
  }, [currentCategory, selectedStoneTypes, maxPrice, inStockOnly, sortBy])

  // Fetch products
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (currentCategory) queryParams.set('category', currentCategory)
        if (sortBy) queryParams.set('sort', sortBy)

        const response = await fetch(`/api/products?${queryParams.toString()}`)
        if (response.ok) {
          const data = await response.json()
          let fetched: Product[] = data.products || []

          // Apply local filter parameters so that loose mock filters match seamlessly
          if (fetched.length === 0) {
            fetched = FALLBACK_GEMS
          }

          // Apply category filter if active on fallback
          if (currentCategory) {
            fetched = fetched.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase())
          }

          // Apply stone type filter
          if (selectedStoneTypes.length > 0) {
            fetched = fetched.filter(p => selectedStoneTypes.includes(p.stoneType))
          }

          // Apply price slider
          fetched = fetched.filter(p => p.price <= maxPrice)

          // Apply stock toggle
          if (inStockOnly) {
            fetched = fetched.filter(p => p.stockQty > 0)
          }

          setProducts(fetched)
        }
      } catch (error) {
        console.error('Error fetching filtered products:', error)
        // Ensure graceful resilience
        setProducts(FALLBACK_GEMS)
      } finally {
        setLoading(false)
      }
    }

    fetchFilteredProducts()
  }, [searchParams, selectedStoneTypes, maxPrice, inStockOnly, sortBy, currentCategory])

  const handleStoneCheckbox = (stone: string) => {
    if (selectedStoneTypes.includes(stone)) {
      setSelectedStoneTypes(selectedStoneTypes.filter(s => s !== stone))
    } else {
      setSelectedStoneTypes([...selectedStoneTypes, stone])
    }
  }

  const handleAddToCart = (e: React.MouseEvent, item: Product) => {
    e.stopPropagation()
    e.preventDefault()
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] || '',
    })
  }

  const handleCardClick = (id: string) => {
    navigate(`/shop/${id}`)
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Search Header */}
      <header className="mb-12">
        <nav className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-light text-[#F5F5F0]/50 mb-4">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#D4AF37]">Shop Reserve</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-headline text-4xl md:text-6xl font-light tracking-tight text-[#F5F5F0] italic">
              {currentCategory ? `${currentCategory} Reserve` : 'Curated Gemstone Collection'}
            </h1>
            <p className="text-sm opacity-50 font-light mt-2 max-w-lg leading-relaxed">
              Discover Jaipur's most prestigious mineral reserve cutting cuts, GIA verified stones, and custom mounts.
            </p>
          </div>
          <div className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#D4AF37]">
            {products.length} PRECIOUS PIECES DISCOVERED
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-10 shrink-0 bg-[#121412] p-8 border border-[#D4AF37]/15 rounded-xl">
          {/* Stone Type Filter */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] mb-6">Stone Type</h3>
            <div className="space-y-4">
              {['Ruby', 'Sapphire', 'Emerald', 'Diamond', 'Pearl', 'Citrine'].map((stone) => (
                <label key={stone} className="flex items-center group cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStoneTypes.includes(stone)}
                    onChange={() => handleStoneCheckbox(stone)}
                    className="w-4 h-4 bg-[#050705] border-[#D4AF37]/20 rounded-sm text-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:ring-offset-0"
                  />
                  <span className="ml-3 text-xs uppercase tracking-widest font-light text-[#F5F5F0]/70 group-hover:text-[#D4AF37] transition-all">
                    {stone}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] mb-6">Max Pricing</h3>
            <div className="px-1 text-xs">
              <input
                type="range"
                min="10000"
                max="500000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1 bg-[#050705] border border-[#D4AF37]/10 appearance-none cursor-pointer accent-[#D4AF37]"
              />
              <div className="flex justify-between mt-3 text-[10px] text-[#F5F5F0]/50 tracking-widest">
                <span>₹10K</span>
                <span className="text-[#D4AF37] font-semibold">{formatPrice(maxPrice)}</span>
                <span>₹500K</span>
              </div>
            </div>
          </div>

          {/* Availability Toggle */}
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#D4AF37] mb-4">Availability</h3>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-xs uppercase tracking-widest font-light text-[#F5F5F0]/70 group-hover:text-on-surface transition-colors">
                In Vault Only
              </span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#050705] border border-[#D4AF37]/20 rounded-full relative peer peer-checked:bg-[#D4AF37]/20 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#F5F5F0]/60 peer-checked:after:bg-[#D4AF37] after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:after:translate-x-4"></div>
            </label>
          </div>

          {/* Reset button if active */}
          {(selectedStoneTypes.length > 0 || maxPrice < 500000 || inStockOnly || currentCategory) && (
            <button
              onClick={() => {
                setSelectedStoneTypes([])
                setMaxPrice(500000)
                setInStockOnly(false)
                setSortBy('newest')
                setSearchParams({})
              }}
              className="w-full py-3 border border-red-500/30 hover:border-red-500/60 bg-transparent text-red-400 text-[10px] uppercase tracking-[0.2em] rounded transition-all font-semibold"
            >
              Clear Active Filters
            </button>
          )}
        </aside>

        {/* Right Main Grid */}
        <div className="flex-1 w-full">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-[#D4AF37]/20 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'text-[#D4AF37] bg-[#121412]' : 'text-[#F5F5F0]/40'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'text-[#D4AF37] bg-[#121412]' : 'text-[#F5F5F0]/40'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sorting mechanism */}
            <div className="relative flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold">SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#121412] border border-[#D4AF37]/20 rounded-md focus:border-[#D4AF37] text-xs uppercase tracking-wider text-[#F5F5F0] py-2 pl-3 pr-8 focus:ring-0 cursor-pointer"
              >
                <option value="newest">NEW ARRIVALS</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </div>

          {/* Product grid / List loader statement */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 py-12">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-[#121412] h-96 border border-[#D4AF37]/10 animate-pulse rounded-lg overflow-hidden">
                  <div className="h-2/3 bg-[#050705]" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-[#050705] w-2/3" />
                    <div className="h-3 bg-[#050705] w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 bg-[#121412]/50 border border-[#D4AF37]/10 rounded-xl">
              <span className="text-5xl text-[#D4AF37]/20 block mb-4">✧</span>
              <p className="font-headline text-2xl text-[#F5F5F0] mb-2 italic">Zero Specimens Meet Criteria</p>
              <p className="text-xs text-[#F5F5F0]/50 max-w-sm mx-auto font-light leading-relaxed">
                Adjust your gemstone category selectors, stone types, or maximum price caps to access alternative vault reserves.
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-fade-in">
              {products.map((gem) => (
                <article
                  key={gem.id}
                  onClick={() => handleCardClick(gem.id)}
                  className="group bg-[#121412] border border-[#D4AF37]/10 rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37]/35 hover:shadow-[0_20px_40px_rgba(0,0,0,0.65)] hover:ring-1 hover:ring-[#D4AF37]/20 cursor-pointer"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#050705]">
                    <img
                      src={gem.images?.[0] || 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=500'}
                      alt={gem.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121412]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute top-4 right-4 text-[9px] uppercase tracking-widest text-[#D4AF37] bg-[#050705]/80 px-2 py-1 border border-[#D4AF37]/20 rounded">
                      {gem.origin || 'JAIPUR VAULT'}
                    </div>

                    {gem.caratWeight > 0 && (
                      <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-widest text-[#D4AF37] bg-[#050705]/80 px-3).5 py-1 border border-[#D4AF37]/20">
                        {gem.caratWeight}ct Weight
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-headline text-lg md:text-xl text-[#F5F5F0] group-hover:text-[#D4AF37] transition-colors italic leading-none">{gem.name}</h3>
                      <p className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-widest font-normal">{gem.stoneType} • {gem.stoneColor}</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-[#D4AF37]/15">
                      <span className="text-base text-[#D4AF37] font-semibold">{formatPrice(gem.price)}</span>
                      <button
                        onClick={(e) => handleAddToCart(e, gem)}
                        className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-black bg-[#D4AF37] hover:bg-[#B8962F] px-4 py-2 rounded-sm transition-all focus:scale-95"
                      >
                        <ShoppingCart className="w-3 h-3" /> Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* List View Mode */
            <div className="space-y-4">
              {products.map((gem) => (
                <article
                  key={gem.id}
                  onClick={() => handleCardClick(gem.id)}
                  className="group bg-[#121412] border border-[#D4AF37]/10 p-4 rounded-xl flex items-center gap-6 cursor-pointer hover:border-[#D4AF37]/30 transition-all"
                >
                  <div className="w-24 h-24 bg-[#050705] border border-[#D4AF37]/15 overflow-hidden rounded-lg relative flex-shrink-0">
                    <img
                      src={gem.images?.[0] || 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=500'}
                      alt={gem.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-headline text-xl text-[#F5F5F0] italic">{gem.name}</h3>
                    <p className="text-xs opacity-50 font-light max-w-xl line-clamp-1">{gem.description}</p>
                    <p className="text-[9px] uppercase tracking-widest text-[#D4AF37]">{gem.stoneType} • {gem.origin || 'Jaipur'}</p>
                  </div>
                  <div className="text-right space-y-3">
                    <div className="text-base text-[#D4AF37] font-semibold">{formatPrice(gem.price)}</div>
                    <button
                      onClick={(e) => handleAddToCart(e, gem)}
                      className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-black bg-[#D4AF37] px-3 py-2"
                    >
                      <ShoppingCart className="w-3 h-3" /> ADD
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Shop
