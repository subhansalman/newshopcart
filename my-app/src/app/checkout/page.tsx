"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { createOrder } from "./actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ArrowLeft,
  Lock,
  Smartphone,
  CheckCircle2,
  MapPin,
  Mail,
  Wallet,
} from "lucide-react";
import toast from "react-hot-toast";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clearCart = useCartStore((s) => s.clearCart);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"apple" | "paypal" | "card">("card");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    email: session?.user?.email || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setMounted(true);
    if (!session) {
      router.push("/auth/signin?callbackUrl=/checkout");
    }
  }, [session, router]);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Wallet className="h-10 w-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold mb-3 text-gray-900">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">Add some products before checking out.</p>
        <Link
          href="/products"
          className="rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.firstName.length < 2) newErrors.firstName = "First name is required";
    if (form.lastName.length < 2) newErrors.lastName = "Last name is required";
    if (form.address.length < 5) newErrors.address = "Address is required";
    if (form.city.length < 2) newErrors.city = "City is required";
    if (form.postalCode.length < 4) newErrors.postalCode = "Postal code is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const address = `${form.firstName} ${form.lastName}, ${form.address}, ${form.city}, ${form.postalCode}`;
      await createOrder(
        items.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          price: i.price,
        })),
        address
      );
      clearCart();
      toast.success("Order confirmed!");
      router.push("/dashboard/orders");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to place order";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = total();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="h-3 w-3" />
          WALLET CHECKOUT
        </Link>

        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-gray-900">Complete Your Order</h1>
          <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
            Review your curated selection and provide shipping details to finalize your experience at the ShopCart Atelier.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left side - Forms */}
            <div className="lg:col-span-2 space-y-10">
              {/* Shipping Information */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-black shadow-lg shadow-primary/20">
                    1
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="John"
                      className={`w-full rounded-xl border ${errors.firstName ? "border-red-400" : "border-gray-200"} bg-gray-50 px-4 py-3.5 text-sm text-gray-900 focus:border-primary outline-none transition-all placeholder:text-gray-300`}
                    />
                    {errors.firstName && <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-wide">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="Doe"
                      className={`w-full rounded-xl border ${errors.lastName ? "border-red-400" : "border-gray-200"} bg-gray-50 px-4 py-3.5 text-sm text-gray-900 focus:border-primary outline-none transition-all placeholder:text-gray-300`}
                    />
                    {errors.lastName && <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-wide">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivery Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="1242 Order Way, Creative District"
                      className={`w-full rounded-xl border ${errors.address ? "border-red-400" : "border-gray-200"} bg-gray-50 px-4 py-3.5 pl-11 text-sm text-gray-900 focus:border-primary outline-none transition-all placeholder:text-gray-300`}
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  </div>
                  {errors.address && <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-wide">{errors.address}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">City</label>
                    <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="New York"
                      className={`w-full rounded-xl border ${errors.city ? "border-red-400" : "border-gray-200"} bg-gray-50 px-4 py-3.5 text-sm text-gray-900 focus:border-primary outline-none transition-all placeholder:text-gray-300`}
                    />
                    {errors.city && <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-wide">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Postal Code</label>
                    <input type="text" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} placeholder="10001"
                      className={`w-full rounded-xl border ${errors.postalCode ? "border-red-400" : "border-gray-200"} bg-gray-50 px-4 py-3.5 text-sm text-gray-900 focus:border-primary outline-none transition-all placeholder:text-gray-300`}
                    />
                    {errors.postalCode && <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-wide">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-black shadow-lg shadow-primary/20">
                    2
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { id: "apple", label: "Apple Pay", icon: Smartphone },
                    { id: "paypal", label: "PayPal", icon: Wallet },
                    { id: "card", label: "Card", icon: CreditCard },
                  ].map((method) => {
                    const isActive = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex items-center sm:flex-col justify-start sm:justify-center gap-4 sm:gap-2 rounded-2xl border-2 p-6 transition-all ${
                          isActive
                            ? "border-primary bg-primary/5 ring-4 ring-primary/10"
                            : "border-gray-200 bg-gray-50 hover:border-primary/50"
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                           <method.icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>{method.label}</span>
                        {isActive && <CheckCircle2 className="h-4 w-4 text-primary ml-auto sm:hidden" />}
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email for Receipt</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="john@example.com"
                      className={`w-full rounded-xl border ${errors.email ? "border-red-400" : "border-gray-200"} bg-gray-50 px-4 py-3.5 pl-11 text-sm text-gray-900 focus:border-primary outline-none transition-all placeholder:text-gray-300`}
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                  </div>
                  {errors.email && <p className="text-[10px] font-bold text-red-500 mt-2 uppercase tracking-wide">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Order Summary — Dark card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-[#0F0E17] p-8 shadow-2xl">
                <h2 className="text-xl font-bold mb-8 text-white">Order Summary</h2>

                <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-800">
                        <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate mb-1">{item.title}</p>
                        <p className="text-xs text-white/50">Qty: {item.qty}</p>
                        <p className="text-sm font-bold text-primary-light">{formatCurrency(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-t border-white/10 pt-6 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Subtotal</span>
                    <span className="text-white">{formatCurrency(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Shipping</span>
                    <span className="text-green-400 text-xs font-bold">Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-white/10 pt-6 mb-8">
                  <span className="text-white/50 font-medium">Total</span>
                  <span className="text-2xl font-black text-white">{formatCurrency(cartTotal)}</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary-dark py-4 text-sm font-bold uppercase tracking-widest text-white hover:opacity-90 transition-all shadow-xl shadow-primary/30 disabled:opacity-50"
                >
                  <Lock className="h-4 w-4" />
                  {loading ? "Confirming..." : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
}
