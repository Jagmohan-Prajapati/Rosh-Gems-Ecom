import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Sparkles, Shield, ShoppingCart, Award, Truck, Loader2, Check, ArrowLeft } from 'lucide-react'
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
  certification: string
  stockQty: number
}

// Solid GIA emerald/ruby fallback to prevent blank views before DB seed
const FALLBACK_DETAIL: Product = {
  id: 'gem-1',
  name: 'Ceylon Blue Sapphire Ring',
  description: 'Sourced from the historic Ratnapura mines of Sri Lanka, this Ceylon Blue Sapphire represents the pinnacle of cornflower blue minerals. Hand-mounted by our master workbench lapidaries in 18k white gold bezel settings designed to highlight maximum light refraction. Fully documented under global GIA certifications.',
  price: 45000,
  images: [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBa3vnDJx5hGEcrOK-rpHPu1tT-VbiNYbgkXjotR9g22CFzUjo2_DW7wSLrbmmjIQF9tm_HIKvoND5j5Q952uicDTVzqsRBoiJAostwRCJY0b5i-k1wzRF4Rtu_MmPKPc_isse_403urdUdSgUsAELb5cae30wAeJ5byNnbxQDOqpPlvVsy0ItEeJ0Oe0mK1OiSUqbpDitDXl8NADY-tX3zwJbgE3gTb31uiGxrLDRM815-Ir7liKo1zeXP53pyvxkgEGHAkIWuej3T',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBJSlxkQHjBuwidBGnshTpGDoKhjTm-m-R_tKkpWFF9yKgKMBoTNtU_dNjQu6yY9mq8zgLebtYv7VPa6Z7jFbLOkYZyhgz8BgxkM3KfQZtRTp9wG2dVKEK_JeAaANXv0U1DBZyuPT03--DczY1ZVlbC2nfeIzk_eYFuXW1E6NE1tcbjWTxBQLvVhHhu4FaPLBMBDkl237EcbrrRs0DdkbBDApp7lQFtt88OX2j1Aw1cD87vW8BdorNA9US1VetttgcLu7Ywk_nwxlrp',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDtoZr87E7ECUoirVsnCmQMRM4wLKNUsw2rZOdzpfcDUUl6Lt7IdnvHNg0Tt_rkqegWbNds0jWY7EifBjMVxGhpTX0H-xYYQN34aLhFDw_0c-KXyZgUv9wzxQbRmTdX_zrMGskh1oqlx1xNPyOuKa_A01fL6DUXt_yi-xfzssfVWgtYxGtV11tBorpccHvVR8FO3LHy5vvf-2X2KhoR8UTRBqorCjZjJQzwXtYF4vGpHv6WXLI6qvh82kmZKEhnsOyU2e-1HgrSbjUn',
  ],
  category: 'Rings',
  stoneType: 'Sapphire',
  stoneColor: 'Cornflower Blue',
  caratWeight: 2.3,
  origin: 'Sri Lanka',
  certification: 'GIA #240815203',
  stockQty: 4,
}

const RECS = [
  {
    id: 'gem-2',
    name: 'Royal Ruby Pendant',
    price: 52000,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBcgBEWfA9vGI5IKLTfTEoL8ptcFaPfBMzNJVwV-hRluIISFcXMwWB7ysNPTODp7sUY5YT7uJ41abmkADDA095VJ9OnL8KEPrwT68yjinunzs-A8OmRWhNexroGpwW1VoI6h88ng7_qCBIu8kWrKrxsitgilg8jdSMRMixcX9f1xCSEZezfIFPdSelwbiw3aiBLwE8TaaXeWSWVk1Kb10ZdlENnpMih5AM6Pza7_4XjD-dEXxooFRo8K9zdwz0I0oGdLoZA9K2AJKau'],
  },
  {
    id: 'gem-4',
    name: 'Zambian Emerald Solitaire',
    price: 38500,
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuD3Qrqa_6oKCW3mUCBDc11DRMIn_CoNJZySa0pfuvheCnsF-Atv97Ps83353IilIl685a8ZBGrs3-w56b8X41luZhtVbM0frlCXqyKyyQ-oEif_x7prfAw4Ze7ERqDOhOS9nWa1AL2EqVzY33lKX6QdB2e9k8Hu7WLdC_fK402kmOP-9VI5IoydfRzmb3qKDJ1mVQ_J_MWW8c-jLda3Jn7mf3jzMh0vofYU2qhSNQkN7-skH0m7m0yaTAFRjB17yqA6bizvWUAo47LZ'],
  },
]

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [ringSize, setRingSize] = useState('Size 8')
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'carriage'>('desc')
  const [addedNotice, setAddedNotice] = useState(false)

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data.product || null)
        } else {
          // fallback gracefully
          if (id?.startsWith('gem-') || id === 'fallback') {
            setProduct(FALLBACK_DETAIL)
          } else {
            setProduct(null)
          }
        }
      } catch (error) {
        console.error('Error fetching details:', error)
        setProduct(FALLBACK_DETAIL)
      } finally {
        setLoading(false)
        setActiveImageIdx(0)
      }
    }
    fetchProductDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050705] flex flex-col items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin mb-4" />
        <span className="text-[10px] tracking-widest text-[#D4AF37] uppercase">Verifying mineral attributes...</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050705] flex flex-col items-center justify-center pt-20 text-center px-4">
        <h3 className="font-headline text-3xl italic text-[#D4AF37] mb-2">Treasure Lost</h3>
        <p className="text-sm opacity-55 max-w-sm mb-6">This specific product identifier could not be validated in the Jaipur archives or database index.</p>
        <Link to="/shop" className="px-6 py-3 bg-[#D4AF37] text-black text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Catalogue
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
    })
    setAddedNotice(true)
    setTimeout(() => setAddedNotice(false), 2500)
  }

  const handleInstantBuy = () => {
    // Add to cart first, then translate immediately to checkout route
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
    })
    navigate('/checkout')
  }

  const productImages = product.images && product.images.length > 0 ? product.images : [FALLBACK_DETAIL.images[0]]

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2.5 mb-10 text-[10px] uppercase tracking-[0.2em] font-light text-[#F5F5F0]/50">
        <Link to="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#D4AF37] transition-colors">Shop</Link>
        <span>/</span>
        <span className="text-[#D4AF37] truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main product view grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24">
        {/* Left column: Image Gallery with thumbnails */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] bg-[#121412] border border-[#D4AF37]/20 rounded-xl overflow-hidden relative shadow-2xl flex items-center justify-center">
            <img
              src={productImages[activeImageIdx]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute top-6 right-6 text-[10px] bg-[#050705]/90 border border-[#D4AF37]/20 text-[#D4AF37] px-3.5 py-1.5 uppercase tracking-widest font-semibold">
              Certified Original
            </span>
          </div>

          {/* Thumbnails below */}
          {productImages.length > 1 && (
            <div className="grid grid-cols-3 gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-square bg-[#121412] rounded-lg overflow-hidden border border-[#D4AF37]/20 p-1 transition-all ${
                    activeImageIdx === idx ? 'ring-1 ring-[#D4AF37] border-transparent' : 'hover:border-[#D4AF37]/50'
                  }`}
                >
                  <img src={img} alt="Product Spec" className="w-full h-full object-cover rounded-md" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column: purchase panel */}
        <div className="lg:col-span-5 space-y-8">
          <header className="space-y-3">
            <div className="flex items-center gap-2 text-[#D4AF37] opacity-80">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
                {product.certification || 'GIA Certified Natural Masterpiece'}
              </span>
            </div>
            <h1 className="font-headline text-4xl md:text-5xl italic text-[#F5F5F0] leading-tight font-light">
              {product.name}
            </h1>
            <div className="flex items-baseline pt-2">
              <span className="text-3xl font-headline text-[#D4AF37] font-semibold">
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-[#F5F5F0]/40 uppercase tracking-widest ml-4 font-body">INCL. LOGISTICS TRANSIT INSURANCE</span>
            </div>
          </header>

          {/* Core mineral specs grid */}
          <div className="grid grid-cols-2 gap-px bg-[#D4AF37]/20 border border-[#D4AF37]/20 rounded-lg overflow-hidden text-xs">
            <div className="bg-[#121412] p-4 space-y-1">
              <span className="opacity-40 uppercase tracking-widest block text-[9px]">Carat Weight</span>
              <p className="font-medium text-[#F5F5F0]">{product.caratWeight ? `${product.caratWeight} ct` : 'Natural Piece'}</p>
            </div>
            <div className="bg-[#121412] p-4 space-y-1">
              <span className="opacity-40 uppercase tracking-widest block text-[9px]">Origin</span>
              <p className="font-medium text-[#F5F5F0]">{product.origin || 'Jaipur reserve'}</p>
            </div>
            <div className="bg-[#121412] p-4 space-y-1">
              <span className="opacity-40 uppercase tracking-widest block text-[9px]">Stone Type</span>
              <p className="font-medium text-[#F5F5F0]">{product.stoneType || 'Emerald'}</p>
            </div>
            <div className="bg-[#121412] p-4 space-y-1">
              <span className="opacity-40 uppercase tracking-widest block text-[9px]">Stone Color</span>
              <p className="font-medium text-[#F5F5F0]">{product.stoneColor || 'Natural Hue'}</p>
            </div>
          </div>

          {/* Purchasing actions options */}
          <div className="space-y-6 pt-4 border-t border-[#D4AF37]/10">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Option Selector for Ring Size */}
              {product.category === 'Rings' && (
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest opacity-60 font-semibold block text-[#F5F5F0]">Ring Size (Indian/US)</label>
                  <select
                    value={ringSize}
                    onChange={(e) => setRingSize(e.target.value)}
                    className="w-full bg-[#121412] border border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 text-xs py-3.5 px-3 uppercase tracking-wider rounded-md text-[#F5F5F0] cursor-pointer"
                  >
                    <option>Size 6</option>
                    <option>Size 7</option>
                    <option>Size 8</option>
                    <option>Size 9</option>
                    <option>Size 10</option>
                  </select>
                </div>
              )}

              {/* Quantity setting */}
              <div className="w-32 space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-60 font-semibold block text-[#F5F5F0]">Quarry Quantity</label>
                <div className="flex items-center justify-between bg-[#121412] border border-[#D4AF37]/20 rounded-md py-3 px-4 text-xs font-semibold text-[#F5F5F0]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="hover:text-[#D4AF37] disabled:opacity-30 bg-transparent border-none text-sm text-[#F5F5F0]"
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="hover:text-[#D4AF37] bg-transparent border-none text-sm text-[#F5F5F0]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3.5 pt-4 relative">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#121412] border border-[#D4AF37] hover:bg-[#D4AF37]/5 text-[#D4AF37] font-body text-xs uppercase tracking-[0.2em] font-bold shadow-lg shadow-black/40 transition-all rounded"
              >
                Add to Store Vault
              </button>
              <button
                onClick={handleInstantBuy}
                className="w-full py-4 bg-[#D4AF37] hover:bg-[#B8962F] text-black font-body text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-[0_4px_25px_rgba(212,175,55,0.25)] rounded"
              >
                Instant Carriage Checkout
              </button>

              {/* Toast notifier feedback */}
              {addedNotice && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#121412] border border-[#D4AF37] px-6 py-3 flex items-center gap-2 rounded text-xs text-[#D4AF37] uppercase tracking-widest shadow-2xl z-20">
                  <Check className="w-4 h-4" /> Added to your cart vault
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs segment: Specs and carriage */}
      <section className="mb-24 scale-95 md:scale-100">
        <div className="flex border-b border-[#D4AF37]/20 space-x-12 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-4 uppercase tracking-[0.2em] text-[10px] font-bold border-b-2 transition-all ${
              activeTab === 'desc' ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-[#F5F5F0]/40 border-transparent hover:text-[#F5F5F0]'
            }`}
          >
            Aesthetic Narrative
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 uppercase tracking-[0.2em] text-[10px] font-bold border-b-2 transition-all ${
              activeTab === 'specs' ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-[#F5F5F0]/40 border-transparent hover:text-[#F5F5F0]'
            }`}
          >
            Laboratory Attributes
          </button>
          <button
            onClick={() => setActiveTab('carriage')}
            className={`pb-4 uppercase tracking-[0.2em] text-[10px] font-bold border-b-2 transition-all ${
              activeTab === 'carriage' ? 'text-[#D4AF37] border-[#D4AF37]' : 'text-[#F5F5F0]/40 border-transparent hover:text-[#F5F5F0]'
            }`}
          >
            Logistics & Guard
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-light leading-relaxed text-xs md:text-sm text-[#F5F5F0]/70">
          <div className="lg:col-span-8">
            {activeTab === 'desc' && (
              <div className="space-y-4">
                <p className="text-base font-headline italic text-[#F5F5F0] leading-relaxed">
                  "Each gemstone represents a pristine sculpture framed by nature over millennia."
                </p>
                <p>{product.description}</p>
                <p>Mounted inside secure, custom-cast premium bezels prepared at our local atelier desks to safeguard the stone's edges under lifetime carriage.</p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="bg-[#121412] border border-[#D4AF37]/15 rounded-lg p-6 space-y-4">
                <div className="flex justify-between py-2.5 border-b border-[#D4AF37]/10">
                  <span className="opacity-55">Laboratory Cert code</span>
                  <span className="font-semibold text-[#D4AF37]">{product.certification || 'GIA-2408152'}</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#D4AF37]/10">
                  <span className="opacity-55">Refractive Class Index</span>
                  <span className="font-semibold text-white">1.762 - 1.770 (Sapphire)</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-[#D4AF37]/10">
                  <span className="opacity-55">Trace elements analyzed</span>
                  <span className="font-semibold text-white">Fe, Ti markers verified</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="opacity-55">workbench Heat treatment status</span>
                  <span className="font-semibold text-white">No active heat recorded / certified natural</span>
                </div>
              </div>
            )}

            {activeTab === 'carriage' && (
              <div className="space-y-4">
                <p>All loose specimens and configured rings leave the Jaipur vault within heavy steel safety seals, carried exclusively by certified security logistics providers.</p>
                <p className="text-[#D4AF37] font-semibold">Complementary Insured Shipping across India on orders over ₹4,000.</p>
                <p className="text-xs opacity-60">Carriage tracking metrics will transmit to your designated e-mail immediately on vault clearance.</p>
              </div>
            )}
          </div>

          {/* Secure credentials */}
          <div className="lg:col-span-4 bg-[#121412] p-6 border border-[#D4AF37]/10 rounded-lg space-y-4 flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h5 className="font-semibold uppercase text-[10px] tracking-widest text-[#D4AF37]">Insured by Tata AIG</h5>
                <p className="text-[10px] opacity-50">Comprehensive gemstone carriage protection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#D4AF37]" />
              <div>
                <h5 className="font-semibold uppercase text-[10px] tracking-widest text-[#D4AF37]">Complimentary Carriage</h5>
                <p className="text-[10px] opacity-50">Free shipping above ₹4,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Sell Recommendations */}
      <section className="pt-12 border-t border-[#D4AF37]/20">
        <h3 className="font-headline text-2xl italic text-[#D4AF37] text-center mb-12"> Patrons Also Explored</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {RECS.map((rec) => (
            <div
              key={rec.id}
              onClick={() => navigate(`/shop/${rec.id}`)}
              className="group bg-[#121412] border border-[#D4AF37]/10 p-6 rounded-lg text-center cursor-pointer hover:border-[#D4AF37]/35 transition-all"
            >
              <div className="w-full aspect-[4/5] bg-[#050705] border border-[#D4AF37]/10 rounded overflow-hidden mb-4">
                <img src={rec.images[0]} alt={rec.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h4 className="font-headline text-lg italic text-[#F5F5F0] group-hover:text-[#D4AF37] transition-colors">{rec.name}</h4>
              <p className="text-xs text-[#D4AF37] font-semibold mt-1">{formatPrice(rec.price)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
export default ProductDetail
