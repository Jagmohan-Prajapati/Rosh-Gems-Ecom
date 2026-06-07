import React, { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Loader2, Sparkles, AlertTriangle, Image as ImageIcon, Save, X, Search } from 'lucide-react'
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
  isActive: boolean
}

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [search, setSearch] = useState('')

  // Form states
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number>(15000)
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('Rings')
  const [stoneType, setStoneType] = useState('Sapphire')
  const [stoneColor, setStoneColor] = useState('Cornflower Blue')
  const [caratWeight, setCaratWeight] = useState<number>(2.5)
  const [origin, setOrigin] = useState('Sri Lanka')
  const [certification, setCertification] = useState('GIA Certified')
  const [stockQty, setStockQty] = useState<number>(3)
  const [isActive, setIsActive] = useState(true)

  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const fetchProductsList = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductsList()
  }, [])

  const handleEditButton = (product: Product) => {
    setEditId(product.id)
    setIsEditing(true)
    setName(product.name)
    setDescription(product.description)
    setPrice(product.price)
    setImageUrl(product.images?.[0] || '')
    setCategory(product.category)
    setStoneType(product.stoneType)
    setStoneColor(product.stoneColor)
    setCaratWeight(product.caratWeight)
    setOrigin(product.origin)
    setCertification(product.certification)
    setStockQty(product.stockQty)
    setIsActive(product.isActive)
    setShowForm(true)
  }

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Erase this premium gemstone specimen from the public catalogue?')) return
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setSuccessMsg('Gemstone specimen deleted successfully.')
        fetchProductsList()
      } else {
        setErrorMsg('Failed to discard gemstone.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMsg('')
    setErrorMsg('')

    const payload = {
      name,
      description,
      price: Number(price),
      images: imageUrl ? [imageUrl] : [],
      category,
      stoneType,
      stoneColor,
      caratWeight: Number(caratWeight),
      origin,
      certification,
      stockQty: Number(stockQty),
      isActive,
    }

    const url = isEditing ? `/api/products/${editId}` : '/api/products'
    const method = isEditing ? 'PATCH' : 'POST'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setSuccessMsg(isEditing ? 'Gemstone upgraded in archive.' : 'New gemstone registered.')
        setShowForm(false)
        resetForm()
        fetchProductsList()
      } else {
        const err = await response.json()
        setErrorMsg(err.error || 'Failed to submit the gemstone.')
      }
    } catch (e) {
      setErrorMsg('Error interacting with server catalog.')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditId(null)
    setName('')
    setDescription('')
    setPrice(15000)
    setImageUrl('')
    setCategory('Rings')
    setStoneType('Sapphire')
    setStoneColor('Cornflower Blue')
    setCaratWeight(2.5)
    setOrigin('Sri Lanka')
    setCertification('GIA Certified')
    setStockQty(3)
    setIsActive(true)
  }

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.stoneType.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-12">
      {/* Header board */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl italic text-[#F5F5F0]">Gemstone Registry</h1>
          <p className="text-xs text-[#F5F5F0]/40 font-light mt-1">Audit loose gems, configurations, stock levels, and public pricing indices.</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="px-6 py-3 bg-[#D4AF37] hover:bg-[#B8962F] text-black text-[10px] uppercase font-bold tracking-widest rounded flex items-center gap-2 font-body"
        >
          <Plus className="w-4 h-4" /> Unseal New Specimen
        </button>
      </section>

      {successMsg && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs text-center uppercase tracking-wider rounded-md">
          ✦ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-300 text-xs text-center uppercase tracking-wider rounded-md">
          ✦ {errorMsg}
        </div>
      )}

      {/* Renders dynamic edit form */}
      {showForm && (
        <div className="bg-[#121412] p-8 border border-[#D4AF37]/20 rounded-xl relative overflow-hidden animate-fade-in text-xs">
          <div className="flex justify-between items-center border-b border-[#D4AF37]/10 pb-4 mb-8">
            <h3 className="font-headline text-2xl italic text-[#D4AF37]">{isEditing ? `Audit Specimen: ${name}` : 'Unseal Mineral Specimen'}</h3>
            <button
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
              className="p-1 text-white/40 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 rounded-full bg-transparent border-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 md:col-span-2">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Specimen Public Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Celestial Morganite Solitaire"
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none text-[#F5F5F0] transition-colors"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Specimen Narrative Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Elaborate on the crystal axis origins, color hue saturations, or mounting golds..."
                  className="w-full bg-[#050705]/50 border border-[#D4AF37]/10 focus:border-[#D4AF37] rounded-lg p-3 text-xs outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* Image url input */}
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Aesthetic Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none text-white font-mono break-all"
                />
                <span className="text-[9px] text-[#F5F5F0]/30 uppercase tracking-widest block font-bold">Secure unhandled JPG or PNG</span>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Appraised Valuation (INR ₹)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none font-bold text-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:col-span-3 pt-6 border-t border-[#D4AF37]/10">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Catalogue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#050705] border-b border-[#D4AF37]/20 text-[#F5F5F0] py-1 select-none"
                >
                  <option>Rings</option>
                  <option>Necklaces</option>
                  <option>Raw Stones</option>
                  <option>Birthstones</option>
                </select>
              </div>

              {/* Stone type */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Stone Mineral Spec</label>
                <select
                  value={stoneType}
                  onChange={(e) => setStoneType(e.target.value)}
                  className="w-full bg-[#050705] border-b border-[#D4AF37]/20 text-[#F5F5F0] py-1"
                >
                  <option>Emerald</option>
                  <option>Ruby</option>
                  <option>Sapphire</option>
                  <option>Diamond</option>
                  <option>Pearl</option>
                  <option>Citrine</option>
                </select>
              </div>

              {/* Color */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Specimen Coloration</label>
                <input
                  type="text"
                  required
                  value={stoneColor}
                  onChange={(e) => setStoneColor(e.target.value)}
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 py-1"
                />
              </div>

              {/* Carat weight */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Carat Weight (ct)</label>
                <input
                  type="number"
                  step="0.05"
                  required
                  value={caratWeight}
                  onChange={(e) => setCaratWeight(Number(e.target.value))}
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 py-1"
                />
              </div>

              {/* Origin */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Mine Source Origin</label>
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 py-1"
                />
              </div>

              {/* Certification code */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Certification standard</label>
                <input
                  type="text"
                  required
                  value={certification}
                  onChange={(e) => setCertification(e.target.value)}
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 py-1"
                />
              </div>

              {/* Stock units */}
              <div className="space-y-1">
                <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Vault Stock units</label>
                <input
                  type="number"
                  required
                  value={stockQty}
                  onChange={(e) => setStockQty(Number(e.target.value))}
                  className="w-full bg-transparent border-b border-[#D4AF37]/20 py-1 font-bold"
                />
              </div>

              {/* Active list status */}
              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="active-ch"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 bg-[#050705] text-[#D4AF37] border-[#D4AF37]/20 select-none focus:ring-[#D4AF37]"
                />
                <label htmlFor="active-ch" className="text-[9px] uppercase font-bold tracking-widest text-[#F5F5F0]/50 select-none cursor-pointer">Unseal to search</label>
              </div>
            </div>

            <div className="md:col-span-3 pt-6 border-t border-[#D4AF37]/15 flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-10 py-4 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B8962F] transition-all"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Log Specimen into Registry'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="px-8 flex items-center justify-center border border-[#D4AF37]/20 text-[#F5F5F0] text-xs font-bold uppercase tracking-widest transition-all"
              >
                Dismiss
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search drawer */}
      <section className="bg-[#121412] p-4 border border-[#D4AF37]/10 flex items-center gap-4 rounded-lg">
        <Search className="w-5 h-5 text-[#D4AF37]/45" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH MINERAL RECORD BY NAME, TYPE..."
          className="w-full bg-transparent outline-none uppercase text-xs tracking-wider"
        />
      </section>

      {/* Main inventory lists table */}
      <section className="bg-[#121412] border border-[#D4AF37]/10 rounded-xl overflow-hidden font-light text-xs">
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#D4AF37] mb-4" />
            <span className="text-[10px] uppercase tracking-widest opacity-50 block">Loading Catalogue Vaults...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#050705] text-[#F5F5F0]/40 border-b border-[#D4AF37]/10 font-bold uppercase tracking-widest text-[9px]">
                  <th className="px-6 py-4">Facet</th>
                  <th className="px-6 py-4">Title Specimen</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Mine Origin</th>
                  <th className="px-6 py-4">Inventory Level</th>
                  <th className="px-6 py-4">Assessed Value</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#D4AF37]/5 transition-colors">
                    {/* Gem facet thumbnail */}
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded bg-[#050705] border border-[#D4AF37]/10 overflow-hidden">
                        {prod.images?.[0] ? (
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#D4AF37] font-headline text-lg">✧</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm">{prod.name}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#D4AF37] mt-0.5">{prod.stoneType} • {prod.caratWeight} ct</p>
                    </td>
                    <td className="px-6 py-4 font-semibold uppercase">{prod.category}</td>
                    <td className="px-6 py-4 opacity-70 font-semibold">{prod.origin || 'Jaipur Vault'}</td>
                    <td className="px-6 py-4 font-bold">
                      {prod.stockQty > 0 ? (
                        <span className="text-[#D4AF37]">{prod.stockQty} Units</span>
                      ) : (
                        <span className="text-red-400 font-semibold">Erased out of Vault</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-white text-sm">{formatPrice(prod.price)}</td>
                    <td className="px-6 py-4 text-right space-x-3.5">
                      <button
                        onClick={() => handleEditButton(prod)}
                        className="text-[#D4AF37] hover:underline bg-transparent border-none uppercase text-[10px] font-bold tracking-widest"
                      >
                        Adjust
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="text-red-400 hover:text-red-300 hover:underline bg-transparent border-none uppercase text-[10px] font-bold tracking-widest"
                      >
                        Discard
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
export default AdminProducts
