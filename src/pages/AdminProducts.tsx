/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { AdminSidebar } from "../components/AdminSidebar";
import { Product } from "../types";

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [selectedProd, setSelectedProd] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [refCode, setRefCode] = useState("");
  const [category, setCategory] = useState("Collections");
  const [stoneType, setStoneType] = useState("Emerald");
  const [stoneColor, setStoneColor] = useState("");
  const [caratWeight, setCaratWeight] = useState<number | "">("");
  const [origin, setOrigin] = useState("");
  const [certification, setCertification] = useState("");
  const [stockQty, setStockQty] = useState<number>(5);
  const [price, setPrice] = useState<number>(1000);
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/products", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load inventory.");
      }

      const list = Array.isArray(data) ? data : data?.products || [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Failed to load inventory from API.", err);
      setProducts([]);
      setErrorMsg(err instanceof Error ? err.message : "Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const buildNextRefCode = () =>
    `RG-${new Date().getFullYear()}-${String(products.length + 1).padStart(3, "0")}`;

  const resetForm = () => {
    setName("");
    setRefCode(buildNextRefCode());
    setCategory("Collections");
    setStoneType("Emerald");
    setStoneColor("");
    setCaratWeight("");
    setOrigin("");
    setCertification("");
    setStockQty(5);
    setPrice(1000);
    setDescription("");
    setStory("");
    setImageUrl("");
    setIsActive(true);
    setIsFeatured(false);
    setSelectedProd(null);
    setErrorMsg("");
  };

  const handleOpenDrawer = (mode: "create" | "edit", prod: Product | null = null) => {
    setEditMode(mode);
    setDrawerOpen(true);
    setErrorMsg("");

    if (mode === "edit" && prod) {
      setSelectedProd(prod);
      setName(prod.name || "");
      setRefCode(prod.refCode || "");
      setCategory(prod.category || "Collections");
      setStoneType(prod.stoneType || "Emerald");
      setStoneColor(prod.stoneColor || "");
      setCaratWeight(prod.caratWeight ?? "");
      setOrigin(prod.origin || "");
      setCertification(prod.certification || "");
      setStockQty(prod.stockQty ?? 5);
      setPrice(prod.price || 1000);
      setDescription(prod.description || "");
      setStory(prod.story || "");
      setImageUrl(prod.images?.[0] || "");
      setIsActive(prod.isActive ?? true);
      setIsFeatured(prod.isFeatured ?? false);
    } else {
      resetForm();
    }
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSaving(false);
    resetForm();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Product name is required.");
      return;
    }

    if (!imageUrl.trim()) {
      setErrorMsg("Primary image URL is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      setErrorMsg("Price must be greater than 0.");
      return;
    }

    if (Number(stockQty) < 0) {
      setErrorMsg("Stock quantity cannot be negative.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: name.trim(),
        refCode: refCode.trim() || undefined,
        category: category.trim(),
        stoneType: stoneType.trim(),
        stoneColor: stoneColor.trim() || "Deep hue",
        caratWeight: caratWeight === "" ? undefined : Number(caratWeight),
        origin: origin.trim() || undefined,
        certification: certification.trim() || undefined,
        price: Number(price),
        description: description.trim(),
        story: story.trim() || undefined,
        images: [imageUrl.trim()],
        stockQty: Number(stockQty),
        isActive,
        isFeatured,
      };

      const url =
        editMode === "create" ? "/api/products" : `/api/products/${selectedProd?.id}`;
      const method = editMode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save product.");
      }

      await fetchInventory();
      handleCloseDrawer();
    } catch (err) {
      console.error("Failed to save product.", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Confirm deletion of this rare gem specimen?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to delete product.");
      }

      await fetchInventory();
    } catch (err) {
      console.error("Failed to delete product.", err);
      setErrorMsg(err instanceof Error ? err.message : "Failed to delete product.");
    }
  };

  const filteredList = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;

    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.stoneType?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.refCode?.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div className="flex min-h-screen bg-[#fcf9f4] text-on-surface">
      <AdminSidebar />

      <main className="ml-64 flex h-screen flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex w-full items-center justify-between border-b border-[#4A1942]/10 bg-[#fcf9f4]/85 px-12 py-6 font-sans backdrop-blur-xl">
          <div>
            <h1 className="text-3xl font-serif font-bold italic tracking-widest text-primary-container">
              Inventory
            </h1>
            <p className="mt-1 text-xs uppercase tracking-widest text-on-surface-variant">
              Curating the RoshGems Collection
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="group relative">
              <input
                className="border-b border-primary/20 bg-transparent py-2 pl-2 pr-10 font-serif text-sm italic outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-primary"
                placeholder="Search Gemstones..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-2 top-2 h-4 w-4 text-on-surface-variant" />
            </div>

            <button
              onClick={() => handleOpenDrawer("create")}
              className="flex cursor-pointer items-center gap-3 rounded-xl bg-primary-container px-8 py-3 font-sans text-white shadow-lg shadow-primary/10 transition-transform active:scale-95"
              type="button"
            >
              <Plus className="h-4 w-4" />
              <span className="text-[12px] font-semibold uppercase tracking-widest">
                Add New Product
              </span>
            </button>
          </div>
        </header>

        <div className="no-scrollbar flex-grow overflow-auto px-12 py-10">
          {errorMsg && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          )}

          <div className="rounded-xl border border-outline-variant/10 bg-white shadow-[0_10px_30px_rgba(74,25,66,0.03)]">
            <table className="w-full border-collapse text-left font-sans">
              <thead>
                <tr className="border-b border-[#f0ede9]">
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Product
                  </th>
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Category
                  </th>
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Price
                  </th>
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Stock
                  </th>
                  <th className="px-8 py-6 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-8 py-6 text-right text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0ede9]/50 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-10 text-center text-on-surface-variant">
                      Loading inventory...
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-10 text-center text-on-surface-variant">
                      No products found.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((p) => (
                    <tr
                      key={p.id}
                      className="group transition-colors hover:bg-surface-container-low"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container">
                            <img
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              alt={p.name}
                              src={p.images?.[0] || ""}
                            />
                          </div>
                          <div>
                            <div className="text-lg font-serif font-bold leading-tight text-primary-container">
                              {p.name}
                            </div>
                            <div className="mt-1 text-[10px] uppercase tracking-widest text-[#4f434b]/60">
                              Ref: {p.refCode || "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-8 py-5">
                        <span className="rounded-full bg-surface-container px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#4f434b]">
                          {p.category}
                        </span>
                      </td>

                      <td className="px-8 py-5 font-serif font-bold text-primary-container">
                        {formatPrice(p.price)}
                      </td>

                      <td className="px-8 py-5 text-on-surface-variant">
                        {p.stockQty} Units
                      </td>

                      <td className="px-8 py-5">
                        <div className="relative inline-flex cursor-pointer select-none items-center font-sans">
                          <div
                            className={`h-5 w-10 rounded-full transition-colors ${
                              p.isActive ? "bg-secondary" : "bg-outline-variant/30"
                            }`}
                          >
                            <div
                              className={`ml-1 mt-1 h-3 w-3 rounded-full bg-white transition-transform ${
                                p.isActive ? "translate-x-5" : "translate-x-0"
                              }`}
                            />
                          </div>
                          <span
                            className={`ml-3 text-[10px] font-bold uppercase tracking-widest ${
                              p.isActive ? "text-secondary" : "text-on-surface-variant/40"
                            }`}
                          >
                            {p.isActive ? "Active" : "Draft"}
                          </span>
                        </div>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => handleOpenDrawer("edit", p)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-primary/5 bg-surface-container transition-all hover:bg-primary-container hover:text-white"
                            aria-label="Edit product details"
                            type="button"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-primary/5 bg-surface-container transition-all hover:bg-red-800 hover:text-white"
                            aria-label="Delete product"
                            type="button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <footer className="mt-12 grid grid-cols-1 gap-12 border-t border-primary/5 py-10 font-sans text-xs md:grid-cols-4">
            <div>
              <div className="mb-4 text-lg font-serif italic text-primary-container">
                RoshGems Digital Atélier
              </div>
              <p className="text-[10px] uppercase leading-loose tracking-widest text-on-surface-variant/70">
                © 2026 Atélier Admin. All rights reserved.
              </p>
            </div>
            <div className="col-span-3 flex justify-end gap-12 pt-2 font-sans font-bold uppercase tracking-widest text-on-surface-variant">
              <span className="cursor-pointer hover:text-secondary">Privacy Charter</span>
              <span className="cursor-pointer hover:text-secondary">Shipping standards</span>
            </div>
          </footer>
        </div>
      </main>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#31032c]/20 backdrop-blur-sm">
          <aside className="flex h-full w-[520px] flex-col overflow-y-auto border-l border-primary/5 bg-white p-10 shadow-[0_0_80px_rgba(74,25,66,0.15)]">
            <div className="mb-8 flex items-center justify-between border-b pb-6 font-sans">
              <div>
                <h2 className="text-2xl font-serif font-semibold text-primary-container">
                  {editMode === "create" ? "Curate New Piece" : "Edit Gem Specimen"}
                </h2>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#81737b]">
                  Item Registration
                </p>
              </div>

              <button
                onClick={handleCloseDrawer}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-surface-container"
                type="button"
                aria-label="Close drawer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 space-y-8 pb-10 font-sans">
              <div className="space-y-4">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                  Primary Image URL
                </label>

                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border-b border-primary/20 bg-transparent py-3 text-xs text-primary outline-none transition-colors placeholder:text-on-surface-variant/30 focus:border-secondary"
                  placeholder="https://example.com/product-image.jpg"
                />

                <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-outline-variant/30 bg-[#fcf9f4] p-1">
                  {imageUrl ? (
                    <img
                      alt="Preview of registered specimen"
                      className="h-full w-full rounded-xl object-cover"
                      src={imageUrl}
                    />
                  ) : (
                    <div className="text-xs uppercase tracking-widest text-on-surface-variant">
                      No image selected
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="relative">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Product Designation Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border-b border-primary/20 bg-transparent py-3 font-serif text-lg italic text-[#31032c] outline-none transition-colors placeholder:text-on-surface-variant/20 focus:border-secondary"
                    placeholder="e.g. Vintage Pear Cut Diamond"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="relative text-sm">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Category Line
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full cursor-pointer border-b border-primary/20 bg-transparent py-3 text-xs outline-none transition-colors focus:border-secondary"
                    >
                      <option value="Collections">Collections</option>
                      <option value="Bespoke">Bespoke</option>
                      <option value="Heritage">Heritage</option>
                      <option value="Rings">Rings</option>
                      <option value="Necklaces">Necklaces</option>
                      <option value="Raw Stones">Raw Stones</option>
                    </select>
                  </div>

                  <div className="relative text-sm">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Gemstone Type
                    </label>
                    <select
                      value={stoneType}
                      onChange={(e) => setStoneType(e.target.value)}
                      className="w-full cursor-pointer border-b border-primary/20 bg-transparent py-3 text-xs outline-none transition-colors focus:border-secondary"
                    >
                      <option value="Emerald">Emerald</option>
                      <option value="Sapphire">Sapphire</option>
                      <option value="Ruby">Ruby</option>
                      <option value="Diamond">Diamond</option>
                      <option value="Amethyst">Amethyst</option>
                      <option value="Aquamarine">Aquamarine</option>
                      <option value="Morganite">Morganite</option>
                      <option value="Opal">Opal</option>
                      <option value="Citrine">Citrine</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="relative text-sm">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Stone Color
                    </label>
                    <input
                      type="text"
                      value={stoneColor}
                      onChange={(e) => setStoneColor(e.target.value)}
                      className="w-full border-b border-primary/20 bg-transparent py-3 text-xs text-primary outline-none transition-colors focus:border-secondary"
                      placeholder="e.g. Cornflower Blue"
                    />
                  </div>

                  <div className="relative text-sm">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Carat Weight
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={caratWeight}
                      onChange={(e) =>
                        setCaratWeight(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      className="w-full border-b border-primary/20 bg-transparent py-3 text-xs text-primary outline-none transition-colors focus:border-secondary"
                      placeholder="e.g. 2.50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="relative text-sm">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Price (INR)
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full border-b border-primary/20 bg-transparent py-3 text-xs text-primary outline-none transition-colors focus:border-secondary"
                      placeholder="5000"
                    />
                  </div>

                  <div className="relative text-sm">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Reference RefCode
                    </label>
                    <input
                      type="text"
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value)}
                      className="w-full border-b border-primary/20 bg-transparent py-3 font-mono text-xs uppercase text-primary outline-none transition-colors focus:border-secondary"
                      placeholder="e.g. RG-2026-001"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="relative text-sm">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Origin
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full border-b border-primary/20 bg-transparent py-3 text-xs text-primary outline-none transition-colors focus:border-secondary"
                      placeholder="e.g. Kashmir"
                    />
                  </div>

                  <div className="relative text-sm">
                    <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                      Certification
                    </label>
                    <input
                      type="text"
                      value={certification}
                      onChange={(e) => setCertification(e.target.value)}
                      className="w-full border-b border-primary/20 bg-transparent py-3 text-xs text-primary outline-none transition-colors focus:border-secondary"
                      placeholder="e.g. GIA Verified"
                    />
                  </div>
                </div>

                <div className="relative text-sm">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Stock Quantity
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={stockQty}
                    onChange={(e) => setStockQty(Number(e.target.value))}
                    className="w-full border-b border-primary/20 bg-transparent py-3 text-xs text-primary outline-none transition-colors focus:border-secondary"
                    placeholder="5"
                  />
                </div>

                <div className="relative">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Curation Story & Descriptions
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full resize-none border-b border-primary/20 bg-transparent py-3 font-serif text-sm italic leading-relaxed text-[#31032c] outline-none transition-colors placeholder:text-on-surface-variant/20 focus:border-secondary"
                    placeholder="Provide details about the cut, raw origins and refraction story of this piece..."
                    rows={4}
                  />
                </div>

                <div className="relative">
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Extended Story
                  </label>
                  <textarea
                    value={story}
                    onChange={(e) => setStory(e.target.value)}
                    className="w-full resize-none border-b border-primary/20 bg-transparent py-3 font-serif text-sm italic leading-relaxed text-[#31032c] outline-none transition-colors placeholder:text-on-surface-variant/20 focus:border-secondary"
                    placeholder="Optional long-form story for the product detail page..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-[12px] font-bold text-on-surface">
                      Publish Immediately
                    </p>
                    <p className="text-[10px] font-light text-on-surface-variant">
                      Make this specimen live on storefront immediately
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`flex h-6 w-12 cursor-pointer items-center rounded-full px-1 transition-colors ${
                      isActive ? "bg-secondary" : "bg-outline-variant/35"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        isActive ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-[12px] font-bold text-on-surface">
                      Featured Specimen
                    </p>
                    <p className="text-[10px] font-light text-on-surface-variant">
                      Flag as premium limited series in grids
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`flex h-6 w-12 cursor-pointer items-center rounded-full px-1 transition-colors ${
                      isFeatured ? "bg-secondary" : "bg-outline-variant/35"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        isFeatured ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {imageUrl && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Primary image ready for save.
                </div>
              )}

              {errorMsg && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-8">
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="cursor-pointer rounded-xl border border-outline-variant/30 py-4 text-center font-sans text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors hover:bg-[#fcf9f4]"
                >
                  Discard Draft
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-container py-4 text-center font-sans text-[11px] font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save to Inventory"
                  )}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;