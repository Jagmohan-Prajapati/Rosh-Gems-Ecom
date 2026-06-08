/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import { AdminSidebar } from "../components/AdminSidebar";
import { Product } from "../types";
import { SAMPLE_PRODUCTS } from "../lib/gemData";

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState<"create" | "edit">("create");
  const [selectedProd, setSelectedProd] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [refCode, setRefCode] = useState("");
  const [category, setCategory] = useState("Collections");
  const [stoneType, setStoneType] = useState("EMERALD");
  const [price, setPrice] = useState<number>(1000);
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.products || [];
        if (list.length > 0) {
          setProducts(list);
        }
      }
    } catch (err) {
      console.error("Failed to load inventory from API.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleOpenDrawer = (mode: "create" | "edit", prod: Product | null = null) => {
    setEditMode(mode);
    setSelectedProd(prod);
    setDrawerOpen(true);

    if (mode === "edit" && prod) {
      setName(prod.name);
      setRefCode(prod.refCode || "");
      setCategory(prod.category);
      setStoneType(prod.stoneType);
      setPrice(prod.price);
      setDescription(prod.description);
      setStory(prod.story || "");
      setImgUrl(prod.images[0] || "");
      setIsActive(prod.isActive || false);
      setIsFeatured(prod.isFeatured || false);
    } else {
      setName("");
      setRefCode(`RG-2024-0${products.length + 1}`);
      setCategory("Collections");
      setStoneType("EMERALD");
      setPrice(1000);
      setDescription("");
      setStory("");
      setImgUrl(
        "https://lh3.googleusercontent.com/aida-public/AB6AXuABpV63oOEC6BG81Ofbf81e4xEZt_8jeHnQdCYNpJXvBBjWclO7xI5fx2_2yxv4D2dcpQzBAfhqpbMTWYrzMlQucJ12BiCSbQcHCdEk1ftjWTtFW9218imzoBCj4azNQoN9XbDsgLAyxzpeMem0MPCXdZyX8RgIT8wYl9SJ0ZeUwR4B8coMPG7bfSBji1L_FVwRv09aVj4gj3iBi2bELO5pNU-JRdDnk7BAhLSopmibPKU4sPImjcyFzetJUhpo0S02osuwa6HvHFJO"
      );
      setIsActive(true);
      setIsFeatured(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    const payload = {
      name,
      refCode,
      category,
      stoneType,
      stoneColor: "Deep hue",
      price: Number(price),
      description,
      story,
      images: [imgUrl],
      stockQty: 5,
      isActive,
      isFeatured,
    };

    try {
      if (editMode === "create") {
        const res = await fetch("/api/products", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          await fetchInventory();
        } else {
          const mockNew: Product = {
            id: `gem-mock-${Date.now()}`,
            ...payload,
          };
          setProducts((prev) => [mockNew, ...prev]);
        }
      } else if (editMode === "edit" && selectedProd) {
        const res = await fetch(`/api/products/${selectedProd.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          await fetchInventory();
        } else {
          setProducts((prev) =>
            prev.map((p) => (p.id === selectedProd.id ? { ...p, ...payload } : p))
          );
        }
      }
    } catch (err) {
      console.warn("CRUD operations warning, saving locally", err);
      if (editMode === "create") {
        const mockNew: Product = {
          id: `gem-mock-${Date.now()}`,
          ...payload,
        };
        setProducts((prev) => [mockNew, ...prev]);
      } else if (selectedProd) {
        setProducts((prev) =>
          prev.map((p) => (p.id === selectedProd.id ? { ...p, ...payload } : p))
        );
      }
    } finally {
      setDrawerOpen(false);
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

      if (res.ok) {
        await fetchInventory();
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const filteredList = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.stoneType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#fcf9f4] text-on-surface flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        <header className="sticky top-0 w-full z-20 flex items-center justify-between px-12 py-6 bg-[#fcf9f4]/85 backdrop-blur-xl border-b border-[#4A1942]/10 font-sans">
          <div>
            <h1 className="text-3xl font-serif italic text-primary-container tracking-widest font-bold">
              Inventory
            </h1>
            <p className="text-on-surface-variant text-xs font-sans tracking-widest uppercase mt-1">
              Curating the RoshGems Collection
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <input
                className="bg-transparent border-b border-primary/20 focus:border-primary transition-colors py-2 pl-2 pr-10 text-sm italic font-serif outline-none placeholder:text-on-surface-variant/50"
                placeholder="Search Gemstones..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-2 top-2 w-4 h-4 text-on-surface-variant" />
            </div>

            <button
              onClick={() => handleOpenDrawer("create")}
              className="bg-primary-container text-white px-8 py-3 rounded-xl flex items-center gap-3 transition-transform active:scale-95 shadow-lg shadow-primary/10 cursor-pointer font-sans"
              type="button"
            >
              <Plus className="w-4 h-4" />
              <span className="text-[12px] tracking-widest uppercase font-semibold">
                Add New Product
              </span>
            </button>
          </div>
        </header>

        <div className="flex-grow overflow-auto px-12 py-10 no-scrollbar">
          <div className="bg-white rounded-xl shadow-[0_10px_30px_rgba(74,25,66,0.03)] border border-outline-variant/10">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="border-b border-[#f0ede9]">
                  <th className="px-8 py-6 text-[11px] tracking-widest uppercase text-on-surface-variant font-bold">
                    Product
                  </th>
                  <th className="px-8 py-6 text-[11px] tracking-widest uppercase text-on-surface-variant font-bold">
                    Category
                  </th>
                  <th className="px-8 py-6 text-[11px] tracking-widest uppercase text-on-surface-variant font-bold">
                    Price
                  </th>
                  <th className="px-8 py-6 text-[11px] tracking-widest uppercase text-on-surface-variant font-bold">
                    Stock
                  </th>
                  <th className="px-8 py-6 text-[11px] tracking-widest uppercase text-on-surface-variant font-bold">
                    Status
                  </th>
                  <th className="px-8 py-6 text-[11px] tracking-widest uppercase text-on-surface-variant font-bold text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#f0ede9]/50 text-xs">
                {filteredList.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface-container flex-shrink-0 border border-outline-variant/20">
                          <img
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt={p.name}
                            src={p.images[0]}
                          />
                        </div>
                        <div>
                          <div className="font-serif text-primary-container text-lg leading-tight font-bold">
                            {p.name}
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-[#4f434b]/60 mt-1">
                            Ref: {p.refCode || "RG-MOCK-Z"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-5">
                      <span className="px-3 py-1 rounded-full bg-surface-container text-[10px] uppercase tracking-widest text-[#4f434b] font-bold">
                        {p.category}
                      </span>
                    </td>

                    <td className="px-8 py-5 font-serif text-primary-container font-bold">
                      ${p.price.toLocaleString()}
                    </td>

                    <td className="px-8 py-5 text-on-surface-variant">{p.stockQty} Units</td>

                    <td className="px-8 py-5">
                      <div className="relative inline-flex items-center cursor-pointer font-sans select-none">
                        <div
                          className={`w-10 h-5 rounded-full transition-colors ${
                            p.isActive ? "bg-secondary" : "bg-outline-variant/30"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 bg-white rounded-full transition-transform mt-1 ml-1 ${
                              p.isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                        <span
                          className={`ml-3 text-[10px] uppercase tracking-widest font-bold ${
                            p.isActive ? "text-secondary" : "text-on-surface-variant/40"
                          }`}
                        >
                          {p.isActive ? "Active" : "Draft"}
                        </span>
                      </div>
                    </td>

                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenDrawer("edit", p)}
                          className="w-8 h-8 rounded-full bg-surface-container border border-primary/5 flex items-center justify-center hover:bg-primary-container hover:text-white transition-all cursor-pointer"
                          aria-label="Edit product details"
                          type="button"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="w-8 h-8 rounded-full bg-surface-container border border-primary/5 flex items-center justify-center hover:bg-red-800 hover:text-white transition-all cursor-pointer"
                          aria-label="Delete product"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <footer className="mt-12 py-10 border-t border-primary/5 grid grid-cols-1 md:grid-cols-4 gap-12 font-sans text-xs">
            <div>
              <div className="font-serif italic text-primary-container text-lg mb-4">
                RoshGems Digital Atélier
              </div>
              <p className="text-[10px] tracking-widest uppercase text-on-surface-variant/70 leading-loose">
                © 2026 Atélier Admin. All rights reserved.
              </p>
            </div>
            <div className="col-span-3 flex justify-end gap-12 font-sans text-on-surface-variant font-bold tracking-widest uppercase pt-2">
              <span className="hover:text-secondary cursor-pointer">Privacy Charter</span>
              <span className="hover:text-secondary cursor-pointer">Shipping standards</span>
            </div>
          </footer>
        </div>
      </main>

      {drawerOpen && (
        <div className="fixed inset-0 bg-[#31032c]/20 backdrop-blur-sm z-50 flex justify-end">
          <aside className="w-[450px] bg-white shadow-[0_0_80px_rgba(74,25,66,0.15)] h-full border-l border-primary/5 flex flex-col p-10 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-6 mb-8 font-sans">
              <div>
                <h2 className="font-serif text-2xl text-primary-container font-semibold">
                  {editMode === "create" ? "Curate New Piece" : "Edit Gem Specimen"}
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#81737b] mt-1">
                  Item Registration
                </p>
              </div>

              <button
                onClick={() => setDrawerOpen(false)}
                className="w-10 h-10 rounded-full hover:bg-surface-container flex items-center justify-center transition-colors cursor-pointer"
                type="button"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 space-y-8 font-sans pb-10">
              <div className="space-y-4">
                <label className="block text-[11px] tracking-widest uppercase font-bold text-on-surface-variant">
                  Primary Imagery URL
                </label>
                <input
                  required
                  type="url"
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  className="w-full bg-transparent border-0 border-b border-primary/20 focus:ring-0 focus:border-secondary transition-colors text-xs font-sans text-on-surface py-2 outline-none"
                  placeholder="https://lh3.googleusercontent.com/..."
                />
                <div className="aspect-video w-full rounded-2xl border-2 border-dashed border-outline-variant/30 flex items-center justify-center bg-[#fcf9f4] p-1">
                  <img
                    alt="Preview of registered specimen"
                    className="w-full h-full object-cover rounded-xl"
                    src={
                      imgUrl ||
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuABpV63oOEC6BG81Ofbf81e4xEZt_8jeHnQdCYNpJXvBBjWclO7xI5fx2_2yxv4D2dcpQzBAfhqpbMTWYrzMlQucJ12BiCSbQcHCdEk1ftjWTtFW9218imzoBCj4azNQoN9XbDsgLAyxzpeMem0MPCXdZyX8RgIT8wYl9SJ0ZeUwR4B8coMPG7bfSBji1L_FVwRv09aVj4gj3iBi2bELO5pNU-JRdDnk7BAhLSopmibPKU4sPImjcyFzetJUhpo0S02osuwa6HvHFJO"
                    }
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="relative">
                  <label className="block text-[11px] tracking-widest uppercase font-bold text-on-surface-variant mb-2">
                    Product Designation Name
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-primary/20 py-3 font-serif text-lg focus:outline-none focus:border-secondary transition-colors placeholder:text-on-surface-variant/20 italic outline-none text-[#31032c]"
                    placeholder="e.g. Vintage Pear Cut Diamond"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="relative font-sans text-sm">
                    <label className="block text-[11px] tracking-widest uppercase font-bold text-on-surface-variant mb-2">
                      Category Line
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-transparent border-b border-primary/20 py-3 focus:outline-none focus:border-secondary transition-colors outline-none cursor-pointer text-xs"
                    >
                      <option value="COLLECTIONS">Collections</option>
                      <option value="BESPOKE">Bespoke</option>
                      <option value="HERITAGE">Heritage</option>
                    </select>
                  </div>

                  <div className="relative font-sans text-sm">
                    <label className="block text-[11px] tracking-widest uppercase font-bold text-on-surface-variant mb-2">
                      Gemstone Type
                    </label>
                    <select
                      value={stoneType}
                      onChange={(e) => setStoneType(e.target.value)}
                      className="w-full bg-transparent border-b border-primary/20 py-3 focus:outline-none focus:border-secondary transition-colors outline-none cursor-pointer text-xs"
                    >
                      <option value="EMERALD">Emerald</option>
                      <option value="SAPPHIRE">Sapphire</option>
                      <option value="RUBY">Ruby</option>
                      <option value="DIAMOND">Diamond</option>
                      <option value="AMETHYST">Amethyst</option>
                      <option value="AQUAMARINE">Aquamarine</option>
                      <option value="MORGANITE">Morganite</option>
                      <option value="OPAL">Opal</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="relative font-sans text-sm">
                    <label className="block text-[11px] tracking-widest uppercase font-bold text-on-surface-variant mb-2">
                      Price (USD)
                    </label>
                    <input
                      required
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-transparent border-b border-primary/20 py-3 focus:outline-none focus:border-secondary transition-colors text-xs text-primary"
                      placeholder="5000"
                    />
                  </div>

                  <div className="relative font-sans text-sm">
                    <label className="block text-[11px] tracking-widest uppercase font-bold text-on-surface-variant mb-2 font-sans text-xs">
                      Reference RefCode
                    </label>
                    <input
                      type="text"
                      value={refCode}
                      onChange={(e) => setRefCode(e.target.value)}
                      className="w-full bg-transparent border-b border-primary/20 py-3 focus:outline-none focus:border-secondary transition-colors text-xs text-primary font-mono uppercase"
                      placeholder="e.g. RG-2024-001"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-[11px] tracking-widest uppercase font-bold text-on-surface-variant mb-2">
                    Curation Story & Descriptions
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-transparent border-b border-primary/20 py-3 font-serif text-sm focus:outline-none focus:border-secondary transition-colors placeholder:text-on-surface-variant/20 resize-none italic leading-relaxed text-[#31032c] outline-none"
                    placeholder="Provide details about the cut, raw origins and refraction story of this piece..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-sans text-[12px] font-bold text-on-surface">
                      Publish Immediately
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-light">
                      Make this specimen live on storefront immediately
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsActive(!isActive)}
                    className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${
                      isActive ? "bg-secondary" : "bg-outline-variant/35"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
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
                    <p className="text-[10px] text-on-surface-variant font-light">
                      Flag as premium limited series in grids
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${
                      isFeatured ? "bg-secondary" : "bg-outline-variant/35"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                        isFeatured ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-8 grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="py-4 border border-outline-variant/30 rounded-xl font-sans text-[11px] tracking-widest uppercase font-bold text-on-surface-variant hover:bg-[#fcf9f4] transition-colors cursor-pointer text-center"
                >
                  Discard Draft
                </button>

                <button
                  type="submit"
                  className="py-4 bg-primary-container text-white rounded-xl font-sans text-[11px] tracking-widest uppercase font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform cursor-pointer text-center"
                >
                  Save to Inventory
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