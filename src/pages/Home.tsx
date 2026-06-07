import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { Sparkles, Shield, RefreshCw, ShoppingCart, Info, Compass } from 'lucide-react'
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
}

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/products?featured=true')
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
        }
      } catch (error) {
        console.error('Error fetching home products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  // Aesthetic category list with correct image links from HTML files
  const categories = [
    {
      name: 'Rings',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOyRYyu0M7jYqDfpAUVHWG7E5oMVcvab0MUcIue4HGDDsNYe0eTxKl3sETuKhsX9_S2y6eYuBR3p7RqFXftExDvLLYU3WcKGMOIIrBxgdEUWP7_rkaRWF1Sn7cRfTAC25Pq8MveItmnUlFt9SfDsPUrL_OURGyJHSTrx-QBwmRIsuN6_KTFawDWheU_Vdrj7t1ydCcFpRJxKLePlXJL2aod_teIQ4t3KIh654KzF7pvnanouHeFg73fkk4VwYGbFlBxMSpq0qJ67k0',
    },
    {
      name: 'Necklaces',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0VuieOMltOYfWaneYxrgCPSnWXwFQg79ci8PzZfHsTjQpxbjlrjrUfCzQ6R69zjt2rl6AYqtregqDWsrQtqjW3pkVwweTunD1DilmbJILhVwFMNU_a6qQQ8KcqJBQ9D__gLylhIMhv49e1ksgIiZxde6IVi60LhzGZk4AaLYW-3yEmPhwnqqVns2ixLYs5jxtDm6nZXF7oqLp0yaZF30ojVLoQa1dIMmE2qPSzRAvV19DhsP1idX6KRFjR34P_BsAgfrJYZpWYWFp',
    },
    {
      name: 'Raw Stones',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiO-hHAfy-mltwHg40gsr-NnGsuinuqp6InDQ0AtQqChbYRjvThBIrtcjfUGDovkQcR5yc2b100QotooZymaVMUKebYYpHM8FfLQ5CErturRoCtvlp9CucclIQavmDGu1ZiHME-VkKeUJuMfqBHB4IJKDw2cD8JW6IUmFOkEWOQ91-70XVztBsy22KVfOWPfmKbYrFl_vUPLyU_IOr_vueFocvRBkKLmscc0O2FTQaAJt6_A-X4yh_-BNib5AgA_MK4lxxkItw9rfE',
    },
    {
      name: 'Birthstones',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaMY6yOVwXFUItFrAGexmBL0E6q6lBtRkiqLzDYDK8-HOeLlFCnd-XR7shGunm2Ov0hem7UH3hnyyVmjAPHxeF9u2IsULD7ws-tZtVK9dGytMvKVkr-vRXzi08iVS2zxPWf5-H3_OsE_VoMfW3aIQQDXRceLFaS82CV8Dq-GpT8AFIohKwOGKIyhrjchVX4Sggb9-JEO-GuyzotaElblHAwctZPMS_TDhxigScDM0QDk97s4Ma6VmucLCjxCTiIv9lfypBowZapGxE',
    },
  ]

  // Mock featured fallback to maintain high fidelity in case of empty database on load
  const fallbackProducts = [
    {
      id: 'mock-1',
      name: 'Celestial Morganite Ring',
      price: 196000,
      stoneColor: 'Soft Pink',
      stoneType: 'Morganite',
      caratWeight: 3.5,
      category: 'Rings',
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBTzqmgdvWH-gQXLy0atPZW-PNwJkFmID2N1hRXN-ktE218ffy2D5LptR922Xf31cd90KPF310sXG18ODINMqxQN5_7PrTtiDd77i9CR6U8csI87-Vne4HmKCGKEcPBCWrC6B4rubk5rUpZfGmWigP3XRmBfMCEJhJKay1rRP6rVktlaq5J4p0X6ucNuuZy0EBfImfNPOkHtA2cbP9Sj7I1S-h1B8_apqU5ti-AUkYVkb_1_i6CUS8Y-mjb0EKdjihgZCPVGZdfngVy'],
    },
    {
      id: 'mock-2',
      name: 'Royal Blue Sapphire Studs',
      price: 328000,
      stoneColor: 'Cornflower Blue',
      stoneType: 'Sapphire',
      caratWeight: 4.1,
      category: 'Earrings',
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAShSsXK7KwWfeJdeUh-diQKqw14NNK7bzAHtIwQuuMAkDQwfxV0LOduFX15IWxTeNNCOu57zy78GGIVRR83oP3MPWz31Cv6HX0_Fg-H-4FzfQ18TO89f4AbGOUWXGYS9TDfLMrovI2aLzMyA85xMpGH7GDQpmF1hx9e69ojKECn8YPL64g1cPSiD_yoXd2AmkXxZAbpUGD_LKK3UfPrUfdNe-1SvPayIcNcABhRWTUsqxrhXCTL59b7vJD1-JhcOvcn8CJZjOHcE7g'],
    },
    {
      id: 'mock-3',
      name: 'Forest Aura Emerald Pendant',
      price: 464000,
      stoneColor: 'Deep Emerald Green',
      stoneType: 'Emerald',
      caratWeight: 5.2,
      category: 'Necklaces',
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBdH0-SwKKgvn7jMpAbsetBQlfYW2UbXPbG_AH9kaJzldL0mI7hAg9MeAgvkD1Wp5Xt32CDGJKQLb8hzDZewEvOo7DHWL68DZDvjPaMadeUk0Xc8ELU1YBMdra0yXzEGhll7qTEe9lIEl2mejgVvK5Opr_Mm4vzScbCoEdiZcPu4C7AhWunKznvx2t4teWAqkt-OY18Mdak9LrKF9rM1jBLEr2_7zworOKHKcdoqcZ8q41A5zoMWVIkxHuYDsDDJ4uoqmyCDxUcx4rt'],
    },
    {
      id: 'mock-4',
      name: 'Solar Flare Citrine Specimen',
      price: 96000,
      stoneColor: 'Honey Citrine',
      stoneType: 'Citrine',
      caratWeight: 6.8,
      category: 'Raw Stones',
      images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBSP0rYZ_gA-PX2dYvs-Tr5RyxmdJjIAK4_4olmxlS8an5pTCNvVJECDIR6OM1I68sP4gKMiq27BIjsSS2zbnotQRfQ550HRjBxo7fvxWDoR4tIRQ6Q0lxyVVkdsSJNL_Hh8AxsAqF0tzbZkSC9pq2UdxlGFGUaLeNmDgmHrfAQG6GnUx2UdvqhAOzQHa9-YfT0AevKYqhRmRtCr3GiiEtEFdpewMYBTDyjMpRybX2B6pzuZRn65Vr0nhTPQZalE6N85RwO-OWpBV3A'],
    },
  ]

  const displayProducts = products.length > 0 ? products : fallbackProducts

  const handleAddToCart = (e: React.MouseEvent, item: any) => {
    e.stopPropagation()
    e.preventDefault()
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] || '',
    })
  }

  return (
    <div className="relative">
      {/* Hero Section from design template */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Kashmiri Raw Emerald background"
            className="w-full h-full object-cover opacity-60 scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA-aS2ITjSoafuWSJV0iOui5t3clqQgqVSOSh_rurKdY2-EWjWcDG7nz-KmDjwqrJ0FKKTkq_9EZTwxB6xtv5E9bW3pFlbJm83tUQTITWN0HNWfYl9GrShrz61qNC7wtRLhBABwvvtXhvBZw7gk9IsDp0WD34UaYkSN2QxWLpYiQDsDbojtCZZ0YqpODiAWWwfXV5nztqaDpF1hfuiNqOvmCDIRSJ8Ln7n2LMhd2HgfoQAUBsHhrk5UTqU5ZiwMrm5iZau7RFmg3oP"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050705] via-transparent to-[#050705]/40" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl pt-20">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mb-6 font-semibold block">
            Exquisite Rare Earth Minerals
          </span>
          <h1 className="font-headline text-5xl md:text-8xl text-[#F5F5F0] font-light italic tracking-tight mb-6 leading-tight">
            The Purest Aura of <br />
            <span className="text-[#D4AF37]">Kashmiri Emeralds</span>
          </h1>
          <p className="font-body text-[#F5F5F0]/60 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto mb-12 leading-relaxed">
            Sourced from the deep veins of the Himalayan foothills, our curated gemstones carry the legacy of timeless Indian craftsmanship.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/shop"
              className="bg-[#D4AF37] text-black px-10 py-4 font-body uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#B8962F] transition-all shadow-[0_0_25px_rgba(212,175,55,0.2)] active:scale-95 rounded-sm"
            >
              Explore Catalogue
            </Link>
          </div>
        </div>

        {/* Established text banner */}
        <div className="absolute left-6 bottom-16 hidden md:flex items-center gap-2 transform rotate-270 origin-left">
          <span className="text-[9px] uppercase tracking-[0.5em] text-[#D4AF37]/50 font-light">
            ESTABLISHED IN RAJASTHAN 1984
          </span>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[#121412] border-y border-[#D4AF37]/10 py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 font-body text-xs uppercase tracking-[0.2em]">
          <div className="flex flex-col items-center text-center gap-3 group">
            <Shield className="w-6 h-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[#F5F5F0] font-medium">100% GIA Certified</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3 group">
            <RefreshCw className="w-6 h-6 text-[#D4AF37] group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[#F5F5F0] font-medium">Insured Lifetime Returns</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3 group">
            <Compass className="w-6 h-6 text-[#D4AF37] group-hover:scale-110 transition-transform duration-300" />
            <span className="text-[#F5F5F0] font-medium font-semibold">Jaipur Workshop Origin</span>
          </div>
        </div>
      </section>

      {/* Curated Categories */}
      <section className="bg-[#050705] py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col items-center mb-16 text-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-2 font-semibold">THE CHRONICLES OF LIGHT</span>
            <h2 className="font-headline text-3xl md:text-5xl text-[#F5F5F0] mb-4 italic">Jaipur Hand-selected Collections</h2>
            <div className="w-1.5 h-1.5 rotate-45 bg-[#D4AF37]" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center gap-6 cursor-pointer"
              >
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border border-[#D4AF37]/20 p-2 group-hover:border-[#D4AF37] transition-all duration-500">
                  <img
                    alt={cat.name}
                    className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    src={cat.image}
                  />
                  <div className="absolute inset-0 rounded-full bg-[#050705]/20 opacity-40 group-hover:opacity-0 transition-opacity" />
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-headline text-xl md:text-2xl text-[#F5F5F0] group-hover:text-[#D4AF37] transition-colors italic">
                    {cat.name}
                  </h3>
                  <span className="font-body text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] block opacity-60 group-hover:opacity-100 transition-opacity">
                    Explore Vault →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gems - Seasonal Edit */}
      <section className="bg-[#121412]/40 border-t border-[#D4AF37]/10 py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-2 block font-semibold">
                THE SEASONAL EDIT
              </span>
              <h2 className="font-headline text-4xl md:text-5xl text-[#F5F5F0] italic">
                Precious New Arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="font-body text-[10px] uppercase tracking-[0.2em] text-[#F5F5F0]/60 hover:text-[#D4AF37] transition-colors border-b border-[#D4AF37]/30 pb-1"
            >
              Browse Full Reserve →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Shimmer skeleton loaders matching card layouts */}
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-[#121412] h-96 border border-[#D4AF37]/10 animate-pulse rounded-lg overflow-hidden">
                  <div className="h-2/3 bg-[#050705]" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-[#050705] w-2/3" />
                    <div className="h-3 bg-[#050705] w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/shop/${product.id}`)}
                  className="group bg-[#121412] border border-[#D4AF37]/10 rounded-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] cursor-pointer"
                >
                  <div className="aspect-[4/5] overflow-hidden relative bg-[#050705]">
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=500'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121412] to-transparent opacity-40" />
                    {product.caratWeight && (
                      <span className="absolute bottom-4 left-4 text-[9px] uppercase tracking-widest text-[#D4AF37] bg-[#050705]/85 px-2.5 py-1 border border-[#D4AF37]/20 rounded-sm">
                        {product.caratWeight} Carats
                      </span>
                    )}
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-1">
                      <h3 className="font-headline text-lg md:text-xl text-[#F5F5F0] group-hover:text-[#D4AF37] transition-colors italic">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-[#F5F5F0]/40 uppercase tracking-wider">
                        {product.stoneType || 'Precious Piece'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/10">
                      <span className="font-headline text-base text-[#D4AF37] font-medium">
                        {formatPrice(product.price)}
                      </span>
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="p-2 bg-[#D4AF37]/10 hover:bg-[#D4AF37] rounded border border-[#D4AF37]/20 text-[#D4AF37] hover:text-black transition-all"
                        title="Add to Vault"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Jaipur workshop spotlight banner */}
      <section className="bg-[#050705] py-24 relative z-10 overflow-hidden">
        {/* Spot lamps glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-[#D4AF37]/5 blur-[120px] pointer-events-none rounded-full" />
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="bg-[#121412] border border-[#D4AF37]/20 rounded-xl p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 relative z-10">
            <div className="flex-1 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">SPECIAL SERVICE</span>
              <h3 className="font-headline text-3xl md:text-5xl text-[#F5F5F0] italic leading-tight">The Bespoke Workbenches</h3>
              <p className="text-sm text-[#F5F5F0]/60 font-light leading-relaxed">
                Allow our Jaipur in-house mounting artisans to transform your selected loose stones into absolute custom masterpieces in 18k white gold, yellow gold, or premium platinum settings of high structural fidelity.
              </p>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="font-body text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] hover:tracking-[0.3em] font-bold border-b border-[#D4AF37]/45 pb-1 transition-all"
                >
                  Consult an Artisan Master →
                </Link>
              </div>
            </div>
            <div className="w-full md:w-80 aspect-square overflow-hidden rounded-lg bg-[#050705] border border-[#D4AF37]/15">
              <img
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=600"
                alt="Jeweler workbench"
                className="w-full h-full object-cover opacity-75 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Home
