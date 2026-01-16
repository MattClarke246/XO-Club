
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Lock, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle,
  Tag,
  ArrowRight,
  MapPin,
  Mail,
  User,
  ShoppingBag
} from 'lucide-react';
import { CartItem } from '../types';
import { supabase } from '../lib/supabase';

interface CheckoutProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, size: string, delta: number) => void;
  onRemove: (id: string, size: string) => void;
  onClearCart: () => void;
}

const STATE_TAX_RATES: Record<string, number> = {
  'AL': 0.04, 'AK': 0.00, 'AZ': 0.056, 'AR': 0.065, 'CA': 0.0725,
  'CO': 0.029, 'CT': 0.0635, 'DE': 0.00, 'FL': 0.06, 'GA': 0.04,
  'HI': 0.04, 'ID': 0.06, 'IL': 0.0625, 'IN': 0.07, 'IA': 0.06,
  'KS': 0.065, 'KY': 0.06, 'LA': 0.0445, 'ME': 0.055, 'MD': 0.06,
  'MA': 0.0625, 'MI': 0.06, 'MN': 0.06875, 'MS': 0.07, 'MO': 0.04225,
  'MT': 0.00, 'NE': 0.055, 'NV': 0.0685, 'NH': 0.00, 'NJ': 0.06625,
  'NM': 0.05125, 'NY': 0.04, 'NC': 0.0475, 'ND': 0.05, 'OH': 0.0575,
  'OK': 0.045, 'OR': 0.00, 'PA': 0.06, 'RI': 0.07, 'SC': 0.06,
  'SD': 0.045, 'TN': 0.07, 'TX': 0.0625, 'UT': 0.061, 'VT': 0.06,
  'VA': 0.053, 'WA': 0.065, 'WV': 0.06, 'WI': 0.05, 'WY': 0.04,
  'DC': 0.06
};

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
];

const getTaxRate = (state: string): number => {
  if (!state || typeof state !== 'string') return 0.08;
  const stateCode = state.trim().toUpperCase();
  return STATE_TAX_RATES[stateCode] ?? 0.08;
};

const Checkout: React.FC<CheckoutProps> = ({ 
  cart, 
  onUpdateQuantity, 
  onRemove, 
  onClearCart
}) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'info' | 'shipping' | 'payment' | 'success'>('info');
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('express');

  // Form State - Controlled inputs bound to required fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState(''); // Maps to streetAddress
  const [city, setCity] = useState('');
  const [zip, setZip] = useState(''); // Maps to zipCode
  const [stateRegion, setStateRegion] = useState(''); // Visual only

  const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const promoDiscount = promoApplied ? subtotal * 0.15 : 0;
  const shippingFee = shippingMethod === 'standard' ? (subtotal > 150 ? 0 : 10) : 0;
  const taxRate = getTaxRate(stateRegion);
  const taxableAmount = Math.max(0, subtotal - promoDiscount);
  const tax = taxableAmount * taxRate;
  const total = subtotal - promoDiscount + shippingFee + tax;

  const handleProcessOrder = async () => {
    if (!email || !firstName || !lastName || !address || !city || !zip) {
      alert('Please ensure all required fields are filled (Name, Email, Address, City, Zip).');
      setStep('info');
      return;
    }

    setIsProcessing(true);
    
    try {
      const productDetails = (cart || []).map(item => ({
        id: item.id || '',
        name: item.name || '',
        category: item.category || '',
        size: item.selectedSize || '',
        quantity: item.quantity || 0,
        price: item.price || 0,
        image: item.image || ''
      }));

      const formatNumeric = (value: number, decimals: number = 2): number => {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
          return 0;
        }
        return Number(value.toFixed(decimals));
      };

      const formatTaxRate = (value: number): number => {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
          return 0;
        }
        return Number(value.toFixed(4));
      };

      const orderData = {
        first_name: (firstName || '').trim(),
        last_name: (lastName || '').trim(),
        email: (email || '').trim().toLowerCase(),
        street_address: (address || '').trim(),
        city: (city || '').trim(),
        zip_code: (zip || '').trim(),
        state_region: (stateRegion || '').trim() || null,
        product_details: Array.isArray(productDetails) && productDetails.length > 0 ? productDetails : [],
        subtotal: formatNumeric(subtotal, 2),
        promo_discount: formatNumeric(promoDiscount, 2),
        shipping_fee: formatNumeric(shippingFee, 2),
        tax_rate: formatTaxRate(taxRate),
        tax: formatNumeric(tax, 2),
        total_amount: formatNumeric(total, 2),
        shipping_method: (shippingMethod === 'standard' || shippingMethod === 'express') ? shippingMethod : 'express',
        promo_applied: Boolean(promoApplied),
        status: 'pending'
      };

      if (!orderData.email || !orderData.first_name || !orderData.last_name || !orderData.street_address || !orderData.city || !orderData.zip_code) {
        alert('Please fill in all required fields.');
        setIsProcessing(false);
        return;
      }

      if (!Array.isArray(orderData.product_details) || orderData.product_details.length === 0) {
        alert('Cart is empty. Cannot place order.');
        setIsProcessing(false);
        return;
      }

      console.log('📤 Submitting Order to Supabase:', orderData);
      console.log('Supabase client status:', supabase ? '✅ Initialized' : '❌ Not initialized');

      if (!supabase) {
        console.error('❌ Supabase client is null - cannot save order');
        alert('Database connection error. Please refresh the page and try again.');
        setIsProcessing(false);
        return;
      }

      let orderSaved = false;
      
      try {
        console.log('🔄 Attempting to insert order via RPC function...');
        const { data, error } = await supabase.rpc('insert_order', {
          // Required parameters (in order)
          p_first_name: orderData.first_name,
          p_last_name: orderData.last_name,
          p_email: orderData.email,
          p_street_address: orderData.street_address,
          p_city: orderData.city,
          p_zip_code: orderData.zip_code,
          p_product_details: orderData.product_details,
          p_subtotal: orderData.subtotal,
          p_tax: orderData.tax,
          p_total_amount: orderData.total_amount,
          // Optional parameters (can be omitted, will use defaults)
          p_state_region: orderData.state_region,
          p_promo_discount: orderData.promo_discount,
          p_shipping_fee: orderData.shipping_fee,
          p_tax_rate: orderData.tax_rate,
          p_shipping_method: orderData.shipping_method,
          p_promo_applied: orderData.promo_applied,
        });

        if (error) {
          console.error('❌ Supabase RPC ERROR:', error);
          console.error('Error Code:', error.code);
          console.error('Error Message:', error.message);
          console.error('Error Details:', error.details);
          console.error('Error Hint:', error.hint);
          
          const errorMessage = error.message || '';
          
          if (errorMessage.includes('function insert_order') || errorMessage.includes('does not exist')) {
            alert('❌ Database function not found. Please ensure the insert_order function is created in Supabase.\n\nGo to Supabase Dashboard → SQL Editor → Run the RPC SQL.');
            setIsProcessing(false);
            return;
          } else if (errorMessage.includes('violates') || errorMessage.includes('constraint')) {
            alert(`❌ Data validation error: ${errorMessage}\n\nCheck console for details.`);
            setIsProcessing(false);
            return;
          } else {
            alert(`❌ Database error: ${errorMessage}\n\nCheck console for details and try again.`);
            setIsProcessing(false);
            return;
          }
        }

        if (data && Array.isArray(data) && data.length > 0) {
          console.log('✅ Order successfully created in Supabase via RPC!');
          console.log('✅ Order ID:', data[0].id);
          console.log('✅ Created At:', data[0].created_at);
          orderSaved = true;
        } else if (data) {
          // RPC returns a different structure, check if it has id
          console.log('✅ Order successfully created in Supabase via RPC!');
          console.log('✅ Response:', data);
          orderSaved = true;
        } else {
          console.warn('⚠️ RPC succeeded but no data returned');
          console.warn('Response:', { data, error });
          orderSaved = true;
        }
      } catch (dbError: any) {
        console.error('❌ Exception during database insert:', dbError);
        console.error('Exception type:', typeof dbError);
        console.error('Exception message:', dbError?.message);
        console.error('Exception stack:', dbError?.stack);
        alert(`❌ Failed to save order: ${dbError?.message || 'Unknown error'}\n\nCheck console for details.`);
        setIsProcessing(false);
        return;
      }

      if (!orderSaved) {
        console.error('❌ Order was not saved to database');
        alert('❌ Order could not be saved to database. Please try again.');
        setIsProcessing(false);
        return;
      }

      console.log('✅ Order processed successfully - proceeding to success page');
      setIsProcessing(false);
      setStep('success');
      onClearCart();
      window.scrollTo(0, 0);
        
    } catch (error: any) {
      console.error('❌ Order submission failed with exception:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      setIsProcessing(false);
      alert('❌ Order submission failed. Please check your connection and try again.');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-20 container mx-auto px-6 text-center">
        <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-10 animate-pulse">
           <ShoppingBag size={48} className="text-gray-700" />
        </div>
        <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">Your bag is empty</h2>
        <p className="text-gray-500 mb-12 max-w-md mx-auto font-bold tracking-[0.2em] uppercase text-xs leading-relaxed">
          The elite streetwear archive awaits. You can't checkout an empty dream.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-4 bg-white text-black px-16 py-6 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 hover:text-white transition-all shadow-2xl hover:shadow-blue-500/30"
        >
          Return to Curation <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-20 container mx-auto px-6 text-center">
        <div className="max-w-2xl mx-auto glass p-12 md:p-20 rounded-[3rem] border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-1000">
          <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-10 border border-blue-500/30">
            <CheckCircle2 size={48} className="text-blue-500" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">ORDER SECURED</h2>
          <p className="text-gray-400 mb-4 font-black tracking-[0.3em] uppercase text-[10px]">TRANSACTION ID: #XO-{Math.floor(Math.random() * 90000) + 10000}</p>
          <p className="text-gray-500 mb-12 font-bold tracking-[0.1em] uppercase text-xs leading-relaxed max-w-sm mx-auto">
            Your elite pieces are being prepared for dispatch.
          </p>
          <div className="flex flex-col gap-4">
            <Link to="/" className="inline-block bg-white text-black px-12 py-6 rounded-2xl font-black text-xs tracking-[0.3em] uppercase hover:bg-blue-500 hover:text-white transition-all shadow-xl">
              BACK TO THE CLUB
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 container mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
        {/* Left Side: Checkout Flow */}
        <div className="flex-1 max-w-4xl">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              </Link>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Checkout</h1>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-4 mb-16 px-2">
            {[
              { id: 'info', label: 'Details' },
              { id: 'shipping', label: 'Shipping' },
              { id: 'payment', label: 'Payment' }
            ].map((s, idx) => (
              <React.Fragment key={s.id}>
                <div className={`flex items-center gap-3 transition-opacity ${step === s.id ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 ${step === s.id ? 'bg-white text-black border-white' : 'border-gray-600'}`}>
                    {idx + 1}
                  </div>
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase hidden sm:inline">{s.label}</span>
                </div>
                {idx < 2 && <div className="h-[2px] flex-1 bg-white/5 mx-2" />}
              </React.Fragment>
            ))}
          </div>

          <div className="min-h-[400px]">
            {step === 'info' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-left-8 duration-700">
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <Mail size={16} className="text-blue-500" />
                    <h3 className="text-xs font-black tracking-[0.3em] text-white uppercase">Contact Information</h3>
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="EMAIL ADDRESS" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-sm font-black uppercase tracking-widest placeholder:text-gray-700" 
                  />
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <User size={16} className="text-blue-500" />
                    <h3 className="text-xs font-black tracking-[0.3em] text-white uppercase">Delivery Name</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      placeholder="FIRST NAME" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-sm font-black uppercase tracking-widest placeholder:text-gray-700" 
                    />
                    <input 
                      placeholder="LAST NAME" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-sm font-black uppercase tracking-widest placeholder:text-gray-700" 
                    />
                  </div>
                </section>

                <section>
                   <div className="flex items-center gap-3 mb-8">
                    <MapPin size={16} className="text-blue-500" />
                    <h3 className="text-xs font-black tracking-[0.3em] text-white uppercase">Address Details</h3>
                  </div>
                  <input 
                    placeholder="STREET ADDRESS" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-blue-500 focus:bg-white/10 outline-none transition-all text-sm font-black uppercase tracking-widest placeholder:text-gray-700" 
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <input 
                      placeholder="CITY" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-blue-500 outline-none transition-all text-sm font-black uppercase tracking-widest placeholder:text-gray-700" 
                    />
                    <select
                      value={stateRegion}
                      onChange={(e) => setStateRegion(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-blue-500 outline-none transition-all text-sm font-black uppercase tracking-widest text-white appearance-none cursor-pointer"
                      style={{ color: stateRegion ? '#fff' : '#666' }}
                    >
                      <option value="" className="bg-black text-gray-700">STATE</option>
                      {US_STATES.map((state) => (
                        <option key={state.code} value={state.code} className="bg-black text-white">
                          {state.code} - {state.name}
                        </option>
                      ))}
                    </select>
                    <input 
                      placeholder="ZIP CODE" 
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:border-blue-500 outline-none transition-all text-sm font-black uppercase tracking-widest placeholder:text-gray-700" 
                    />
                  </div>
                </section>

                <button 
                  onClick={() => setStep('shipping')}
                  className="group flex items-center justify-center gap-4 w-full bg-white text-black py-6 rounded-[1.5rem] font-black text-xs tracking-[0.4em] uppercase hover:bg-blue-500 hover:text-white transition-all shadow-2xl"
                >
                  NEXT: SHIPPING METHOD <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {step === 'shipping' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <Truck size={16} className="text-blue-500" />
                    <h3 className="text-xs font-black tracking-[0.3em] text-white uppercase">Shipping Method</h3>
                  </div>
                  <div className="space-y-4">
                    <button 
                      onClick={() => setShippingMethod('express')}
                      className={`w-full flex items-center justify-between p-8 rounded-[2rem] border transition-all text-left ${shippingMethod === 'express' ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'express' ? 'border-blue-500' : 'border-gray-600'}`}>
                          {shippingMethod === 'express' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                        </div>
                        <div>
                          <p className="text-[11px] font-black tracking-widest uppercase mb-1">Elite Express</p>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Delivered in 2-3 Business Days</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em]">FREE</span>
                    </button>
                    <button 
                      onClick={() => setShippingMethod('standard')}
                      className={`w-full flex items-center justify-between p-8 rounded-[2rem] border transition-all text-left ${shippingMethod === 'standard' ? 'border-blue-500 bg-blue-500/5' : 'border-white/5 hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'standard' ? 'border-blue-500' : 'border-gray-600'}`}>
                          {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                        </div>
                        <div>
                          <p className="text-[11px] font-black tracking-widest uppercase mb-1">Standard Shipping</p>
                          <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Delivered in 5-7 Business Days</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-black text-white/90 uppercase tracking-[0.2em]">{subtotal > 150 ? 'FREE' : '$10.00'}</span>
                    </button>
                  </div>
                </section>
                <div className="flex flex-col md:flex-row gap-4">
                  <button onClick={() => setStep('payment')} className="flex-1 bg-white text-black py-6 rounded-[1.5rem] font-black text-xs tracking-[0.4em] uppercase hover:bg-blue-500 hover:text-white transition-all shadow-2xl">NEXT: PAYMENT</button>
                  <button onClick={() => setStep('info')} className="px-10 py-6 border border-white/10 rounded-[1.5rem] font-black text-[10px] tracking-[0.3em] uppercase hover:bg-white/5 transition-all">Go Back</button>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
                <section>
                  <div className="flex items-center gap-3 mb-8">
                    <CreditCard size={16} className="text-blue-500" />
                    <h3 className="text-xs font-black tracking-[0.3em] text-white uppercase">Secure Payment</h3>
                  </div>
                  <div className="glass p-10 rounded-[2.5rem] border-white/10 space-y-8">
                    <div className="flex justify-between items-center pb-6 border-b border-white/5">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-6 bg-white/10 rounded-md flex items-center justify-center text-[8px] font-black">VISA</div>
                         <div className="w-10 h-6 bg-white/10 rounded-md flex items-center justify-center text-[8px] font-black">M/C</div>
                         <div className="w-10 h-6 bg-white/10 rounded-md flex items-center justify-center text-[8px] font-black">AMEX</div>
                      </div>
                      <Lock size={16} className="text-gray-600" />
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <p className="text-[9px] font-black text-gray-500 tracking-[0.2em] uppercase px-2">Card Number</p>
                        <input placeholder="0000 0000 0000 0000" className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 focus:border-blue-500 outline-none transition-all text-sm font-black tracking-[0.2em]" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-gray-500 tracking-[0.2em] uppercase px-2">Expiry Date</p>
                          <input placeholder="MM / YY" className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 focus:border-blue-500 outline-none transition-all text-sm font-black tracking-[0.2em]" />
                        </div>
                        <div className="space-y-3">
                          <p className="text-[9px] font-black text-gray-500 tracking-[0.2em] uppercase px-2">CVC Code</p>
                          <input placeholder="***" className="w-full bg-black border border-white/10 rounded-2xl px-8 py-5 focus:border-blue-500 outline-none transition-all text-sm font-black tracking-[0.2em]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
                <div className="flex flex-col gap-6">
                  <button 
                    onClick={handleProcessOrder}
                    disabled={isProcessing}
                    className="group relative flex items-center justify-center gap-4 w-full bg-white text-black py-8 rounded-[2rem] font-black text-sm tracking-[0.5em] uppercase hover:bg-blue-500 hover:text-white transition-all shadow-[0_20px_60px_rgba(0,0,0,0.5)] disabled:opacity-50"
                  >
                    {isProcessing ? (<><div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />Processing...</>) : (<><Lock size={18} />PLACE ORDER - ${total.toFixed(2)}</>)}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-[400px] xl:w-[450px]">
          <div className="glass p-12 rounded-[3rem] border-white/10 sticky top-32 shadow-2xl backdrop-blur-xl">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-10">Order Summary</h2>
            <div className="space-y-8 mb-10 max-h-[35vh] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex gap-6 group">
                  <div className="w-20 h-28 bg-neutral-900 rounded-2xl overflow-hidden flex-shrink-0 border border-white/5">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center py-1">
                    <h4 className="text-[11px] font-black uppercase mb-1 tracking-tight truncate max-w-[180px]">{item.name}</h4>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-3">SIZE: {item.selectedSize} × {item.quantity}</p>
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-black">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-5 border-t border-white/5 pt-10">
              <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toFixed(2)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-[11px] font-bold text-green-500 uppercase tracking-widest">
                  <span>Promo Discount</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}
              {shippingFee > 0 && (
                <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-white">${shippingFee.toFixed(2)}</span>
                </div>
              )}
              {stateRegion && tax > 0 && (
                <div className="flex justify-between text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  <span>Tax ({stateRegion} - {(taxRate * 100).toFixed(2)}%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
              )}
              {!stateRegion && (
                <div className="flex justify-between text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                  <span>Select State for Tax</span>
                  <span>$0.00</span>
                </div>
              )}
              <div className="flex justify-between items-end pt-8 border-t border-white/10">
                <div className="space-y-1">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 block">Total Due</span>
                   <span className="text-4xl font-black text-white tracking-tighter">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
