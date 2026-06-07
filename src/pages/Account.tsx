import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User as UserIcon, Landmark, ShoppingBag, Plus, Trash2, Edit2, Loader2, KeyRound, CheckCircle, Mail, Map, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../lib/utils'

interface SavedAddress {
  id: string
  label: string
  name: string
  phone: string
  line1: string
  line2?: string | null
  city: string
  state: string
  zip: string
  country: string
}

interface UserOrder {
  id: string
  createdAt: string
  total: number
  isPaid: boolean
  status: string
  paymentMethod?: string | null
}

export const Account: React.FC = () => {
  const { user, refetch } = useAuth()
  const navigate = useNavigate()

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'addresses' | 'orders'>('profile')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMessage] = useState('')

  // Profile forms details
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profilePhone, setProfilePhone] = useState(user?.phone || '')

  // Password override details
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // State values for loading user structures
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [myOrders, setMyOrders] = useState<UserOrder[]>([])

  // States for Address edits
  const [editAddressId, setEditAddressId] = useState<string | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [addrLabel, setAddrLabel] = useState('Home')
  const [addrName, setAddrName] = useState('')
  const [addrPhone, setAddrPhone] = useState('')
  const [addrLine1, setAddrLine1] = useState('')
  const [addrLine2, setAddrLine2] = useState('')
  const [addrCity, setAddrCity] = useState('')
  const [addrState, setAddrState] = useState('')
  const [addrZip, setAddrZip] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user, navigate])

  // Hydrate user addresses and orders
  useEffect(() => {
    if (user) {
      fetchAddresses()
      fetchMyOrders()
    }
  }, [user])

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses')
      if (res.ok) {
        const d = await res.json()
        setAddresses(d.addresses || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchMyOrders = async () => {
    try {
      const res = await fetch('/api/orders/my')
      if (res.ok) {
        const d = await res.json()
        setMyOrders(d.orders || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: profileName, phone: profilePhone }),
      })

      if (res.ok) {
        setSuccessMsg('Patron profile credentials upgraded in vault.')
        await refetch()
      } else {
        const err = await res.json()
        setErrorMessage(err.error || 'Failed to update profile.')
      }
    } catch (e) {
      setErrorMessage('Communications failure with vault backend.')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        setSuccessMsg('Account key updated. Retain this code safe.')
        setCurrentPassword('')
        setNewPassword('')
      } else {
        const err = await res.json()
        setErrorMessage(err.error || 'Incorrect current password.')
      }
    } catch (e) {
      setErrorMessage('Failed to connect to the password workbench.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage('')

    const url = editAddressId ? `/api/user/addresses/${editAddressId}` : '/api/user/addresses'
    const method = editAddressId ? 'PATCH' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label: addrLabel,
          name: addrName,
          phone: addrPhone,
          line1: addrLine1,
          line2: addrLine2,
          city: addrCity,
          state: addrState,
          zip: addrZip,
          country: 'India',
        })
      })

      if (res.ok) {
        setShowAddressForm(false)
        setEditAddressId(null)
        // Reset Address form fields
        setAddrLabel('Home')
        setAddrName('')
        setAddrPhone('')
        setAddrLine1('')
        setAddrLine2('')
        setAddrCity('')
        setAddrState('')
        setAddrZip('')

        fetchAddresses()
        setSuccessMsg('Shipment coordinates updated.')
      } else {
        setErrorMessage('Failed to save shipment credentials.')
      }
    } catch (e) {
      setErrorMessage('Could not connect to address dispatcher.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditAddressButton = (addr: SavedAddress) => {
    setEditAddressId(addr.id)
    setAddrLabel(addr.label)
    setAddrName(addr.name)
    setAddrPhone(addr.phone)
    setAddrLine1(addr.line1)
    setAddrLine2(addr.line2 || '')
    setAddrCity(addr.city)
    setAddrState(addr.state)
    setAddrZip(addr.zip)
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm('Delete this shipment address permanently from the vault?')) return
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchAddresses()
        setSuccessMsg('Address unsealed and discarded.')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <header className="mb-12">
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-4 font-semibold">PATRON CONTROL BOARD</span>
        <h1 className="font-headline text-4xl md:text-6xl text-[#F5F5F0] italic font-light tracking-tight">
          Greeting, <span className="text-[#D4AF37]">{user?.name}</span>
        </h1>
        <p className="text-[10px] tracking-widest opacity-40 uppercase mt-1 font-body">Account rank: {user?.role || 'Patron'}</p>
      </header>

      {successMsg && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 text-xs text-center uppercase tracking-wider rounded-md mb-8">
          ✦ {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-950/20 border border-red-500/20 text-red-300 text-xs text-center uppercase tracking-wider rounded-md mb-8">
          ✦ {errorMsg}
        </div>
      )}

      {/* Main Tab Controller Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        {/* Navigation Sidebar Tabs */}
        <div className="bg-[#121412] border border-[#D4AF37]/15 p-6 rounded-xl space-y-2">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`w-full text-left py-3 px-4 rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-colors ${
              activeSubTab === 'profile' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-[#F5F5F0]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile Vault</span>
          </button>

          <button
            onClick={() => setActiveSubTab('addresses')}
            className={`w-full text-left py-3 px-4 rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-colors ${
              activeSubTab === 'addresses' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-[#F5F5F0]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Shipment Vault</span>
          </button>

          <button
            onClick={() => setActiveSubTab('orders')}
            className={`w-full text-left py-3 px-4 rounded-lg text-xs uppercase tracking-widest font-semibold flex items-center gap-3 transition-colors ${
              activeSubTab === 'orders' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-[#F5F5F0]/60 hover:text-[#D4AF37] hover:bg-[#D4AF37]/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Acquisition logs</span>
          </button>
        </div>

        {/* Tab Detail panel screen */}
        <div className="lg:col-span-3">
          {/* PROFILE VAULT TAB */}
          {activeSubTab === 'profile' && (
            <div className="space-y-12">
              {/* Profile upgrade */}
              <div className="bg-[#121412]/50 border border-[#D4AF37]/10 rounded-xl p-8 space-y-6">
                <h3 className="font-headline text-2xl italic text-[#D4AF37]">Profile Specifications</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Full Name</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs outline-none transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Contact Number</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+91..."
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Registered Email</span>
                    <p className="text-sm py-2 font-mono opacity-50">{user?.email}</p>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-[#D4AF37] text-black font-semibold text-xs tracking-widest uppercase hover:bg-[#B8962F] transition-all"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile Changes'}
                  </button>
                </form>
              </div>

              {/* Password overrides */}
              <div className="bg-[#121412]/50 border border-[#D4AF37]/10 rounded-xl p-8 space-y-6">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Lock className="w-5 h-5" />
                  <h3 className="font-headline text-2xl italic text-[#D4AF37]">Alter Authentication Key</h3>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Current Shield Password</label>
                      <input
                        type="password"
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">New Shield Password</label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2.5 text-xs outline-none transition-all"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-[#121412] border border-[#D4AF37] hover:bg-[#D4AF37]/10 text-[#D4AF37] font-semibold text-xs tracking-widest uppercase transition-all"
                  >
                    Modify Entry Key
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SHIPMENT VAULT ADDRESS BOOK */}
          {activeSubTab === 'addresses' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-2xl italic text-[#D4AF37]">Vault Shipment Addresses</h3>
                {!showAddressForm && (
                  <button
                    onClick={() => {
                      setEditAddressId(null)
                      setShowAddressForm(true)
                    }}
                    className="px-4 py-2 border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37]/5 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> ADD NEW ADDRESS
                  </button>
                )}
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddressSubmit} className="bg-[#121412]/60 p-6 border border-[#D4AF37]/20 rounded-xl space-y-6 animate-fade-in">
                  <h4 className="font-headline text-lg italic text-[#D4AF37]">{editAddressId ? 'Edit Shipment Address' : 'Register Shipment Address'}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Address Label</label>
                      <input
                        type="text"
                        required
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                        placeholder="e.g. Home, Office"
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Receiver Full Name</label>
                      <input
                        type="text"
                        required
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        placeholder="Julian Abbott"
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Contact Number</label>
                      <input
                        type="tel"
                        required
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value)}
                        placeholder="+91..."
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Line 1 Address</label>
                      <input
                        type="text"
                        required
                        value={addrLine1}
                        onChange={(e) => setAddrLine1(e.target.value)}
                        placeholder="Suite #408, Gold Street"
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Line 2 Address (Optional)</label>
                      <input
                        type="text"
                        value={addrLine2}
                        onChange={(e) => setAddrLine2(e.target.value)}
                        placeholder="Johari Bazaar"
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">City</label>
                      <input
                        type="text"
                        required
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">State </label>
                      <input
                        type="text"
                        required
                        value={addrState}
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Pincode</label>
                      <input
                        type="text"
                        required
                        value={addrZip}
                        onChange={(e) => setAddrZip(e.target.value)}
                        className="w-full bg-transparent border-b border-[#D4AF37]/20 focus:border-[#D4AF37] focus:ring-0 py-2 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-widest text-[#F5F5F0]/40 font-semibold block">Country</label>
                      <div className="py-2 text-xs tracking-wider border-b border-[#D4AF37]/10 text-white select-none">India</div>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 bg-[#D4AF37] text-black font-semibold text-xs tracking-widest uppercase hover:bg-[#B8962F] transition-all"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Address Coordinates'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false)
                        setEditAddressId(null)
                      }}
                      className="px-6 py-2.5 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#F5F5F0] text-xs uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Renders address list cards */}
              {!showAddressForm && addresses.length === 0 && (
                <div className="text-center py-16 bg-[#121412]/50 border border-[#D4AF37]/10 rounded-xl">
                  <span className="text-[#D4AF37]/20 text-4xl block mb-2">✧</span>
                  <p className="text-sm text-[#F5F5F0]/60">Your physical shipment vault contains zero addresses</p>
                </div>
              )}

              {/* Cards Grid */}
              {!showAddressForm && addresses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-5 bg-[#121412]/60 border border-[#D4AF37]/10 hover:border-[#D4AF37]/35 rounded-lg flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">{addr.label}</span>
                        </div>
                        <h4 className="text-sm font-semibold">{addr.name}</h4>
                        <p className="text-xs opacity-60 mt-1 font-light leading-relaxed">
                          {addr.line1}, {addr.line2 && `${addr.line2}, `}{addr.city}, {addr.state} — {addr.zip}
                        </p>
                        <p className="text-xs opacity-50 mt-1">Tel: {addr.phone}</p>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-[#D4AF37]/10 text-[10px] font-bold tracking-widest uppercase">
                        <button
                          onClick={() => handleEditAddressButton(addr)}
                          className="flex items-center gap-1.1 text-[#D4AF37] hover:underline bg-transparent border-none"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> EDIT
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 hover:underline bg-transparent border-none ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> DISCARD
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACQUISITION LOGS / ORDER HISTORY */}
          {activeSubTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="font-headline text-2xl italic text-[#D4AF37] mb-6">Historical Acquisitions Logs</h3>
              
              {myOrders.length === 0 ? (
                <div className="text-center py-20 bg-[#121412]/50 border border-[#D4AF37]/10 rounded-xl">
                  <span className="text-3xl block mb-2 text-[#D4AF37]/20">✧</span>
                  <p className="text-sm text-[#F5F5F0]/60">Your historical ledger accounts for zero transactions</p>
                  <Link to="/shop" className="text-xs text-[#D4AF37] underline underline-offset-4 mt-3 block font-semibold hover:text-[#B8962F]">Sourse Your First Gemstone</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 bg-[#121412] border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-light"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white uppercase tracking-wider">#{ord.id}</span>
                          <span className={`px-2 py-0.5 rounded-[3px] text-[8px] tracking-widest font-bold uppercase ${
                            ord.isPaid 
                              ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/25' 
                              : 'bg-red-400/10 text-red-400 border border-red-500/25'
                          }`}>
                            {ord.isPaid ? 'PAID' : 'PENDING PAYMENT'}
                          </span>
                        </div>
                        <p className="opacity-50 text-[10px]">Settled: {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>

                      <div className="pt-2 md:pt-0">
                        <span className="opacity-40 text-[9px] uppercase tracking-widest block mb-0.5">Carriage Route Status</span>
                        <span className="font-semibold text-white tracking-widest uppercase">{ord.status}</span>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="opacity-40 text-[9px] uppercase tracking-widest block mb-0.5 animate-pulse">Total Settled</span>
                        <span className="text-sm font-headline text-[#D4AF37] font-semibold">{formatPrice(ord.total)}</span>
                      </div>

                      <button
                        onClick={() => navigate(`/order-confirmation/${ord.id}`)}
                        className="px-4 py-2 border border-[#D4AF37]/20 hover:border-[#D4AF37] text-[#D4AF37] font-bold tracking-widest uppercase text-[10px] rounded transition-all ml-auto md:ml-0"
                      >
                        REVIEW CARGO
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Account
