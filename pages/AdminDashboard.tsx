import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  LogOut, 
  Package, 
  Search, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle,
  Eye
} from 'lucide-react';

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  product_details: any[];
  subtotal: number;
  promo_discount?: number;
  shipping_fee?: number;
  tax: number;
  total_amount: number;
  status: string;
  created_at: string;
  street_address?: string;
  city?: string;
  state_region?: string;
  zip_code?: string;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-500' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'text-blue-500' },
  { value: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-500' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle2, color: 'text-green-500' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-500' },
];

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching orders:', error);
        alert('Error loading orders: ' + error.message);
      } else {
        setOrders(data || []);
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      setUpdating(orderId);
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order:', error);
        alert('Error updating order: ' + error.message);
      } else {
        // Refresh orders
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert('Error updating order');
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const filteredOrders = orders.filter(order => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        order.email.toLowerCase().includes(search) ||
        order.first_name.toLowerCase().includes(search) ||
        order.last_name.toLowerCase().includes(search) ||
        order.id.toString().includes(search) ||
        `XO-${String(order.id).padStart(5, '0')}`.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    if (statusOption) {
      const Icon = statusOption.icon;
      return <Icon size={16} className={statusOption.color} />;
    }
    return <Package size={16} />;
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#050505] sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase">
                XO CLUB<span className="text-blue-500">.</span> Admin
              </h1>
              <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-1">
                Order Management Dashboard
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl transition-all text-sm font-black tracking-[0.2em] uppercase"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <p className="text-[10px] text-gray-500 font-black tracking-[0.3em] uppercase mb-2">Total Orders</p>
            <p className="text-4xl font-black tracking-tighter">{totalOrders}</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
            <p className="text-[10px] text-yellow-500 font-black tracking-[0.3em] uppercase mb-2">Pending</p>
            <p className="text-4xl font-black tracking-tighter text-yellow-500">{pendingOrders}</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
            <p className="text-[10px] text-blue-500 font-black tracking-[0.3em] uppercase mb-2">Processing</p>
            <p className="text-4xl font-black tracking-tighter text-blue-500">{processingOrders}</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6">
            <p className="text-[10px] text-green-500 font-black tracking-[0.3em] uppercase mb-2">Total Revenue</p>
            <p className="text-4xl font-black tracking-tighter text-green-500">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              placeholder="Search orders by email, name, or order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 focus:border-blue-500 outline-none text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 focus:border-blue-500 outline-none text-sm font-bold uppercase tracking-wider"
          >
            <option value="all">All Status</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <Package size={48} className="text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-xs">No orders found</p>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="text-left p-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Order #</th>
                    <th className="text-left p-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Customer</th>
                    <th className="text-left p-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Products</th>
                    <th className="text-left p-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Total</th>
                    <th className="text-left p-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Status</th>
                    <th className="text-left p-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Date</th>
                    <th className="text-left p-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="font-black text-sm">XO-{String(order.id).padStart(5, '0')}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-sm">{order.first_name} {order.last_name}</p>
                        <p className="text-[11px] text-gray-500 mt-1">{order.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold">{order.product_details?.length || 0} item(s)</p>
                      </td>
                      <td className="p-4">
                        <p className="font-black text-sm">${order.total_amount.toFixed(2)}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {STATUS_OPTIONS.find(s => s.value === order.status)?.label || order.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <div className="relative">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={updating === order.id}
                              className="appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2 pr-8 text-xs font-bold uppercase tracking-wider focus:border-blue-500 outline-none cursor-pointer disabled:opacity-50"
                            >
                              {STATUS_OPTIONS.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                              ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase tracking-tighter">
                Order XO-{String(selectedOrder.id).padStart(5, '0')}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Customer Information</h3>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  <p className="font-bold">{selectedOrder.first_name} {selectedOrder.last_name}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                </div>
              </div>
              {selectedOrder.street_address && (
                <div>
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Shipping Address</h3>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-sm">{selectedOrder.street_address}</p>
                    <p className="text-sm">{selectedOrder.city}{selectedOrder.state_region ? `, ${selectedOrder.state_region}` : ''} {selectedOrder.zip_code}</p>
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Order Items</h3>
                <div className="bg-white/5 rounded-xl p-4 space-y-3">
                  {selectedOrder.product_details?.map((product: any, index: number) => (
                    <div key={index} className="flex justify-between items-center pb-3 border-b border-white/5 last:border-0">
                      <div>
                        <p className="font-bold text-sm uppercase">{product.name || 'Product'}</p>
                        <p className="text-xs text-gray-500 mt-1">Size: {product.size || 'N/A'} × Qty: {product.quantity || 1}</p>
                      </div>
                      <p className="font-black">${((product.price || 0) * (product.quantity || 1)).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Order Summary</h3>
                <div className="bg-white/5 rounded-xl p-4 space-y-2">
                  {selectedOrder.subtotal !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-bold">${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.promo_discount && selectedOrder.promo_discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="font-bold text-red-500">-${selectedOrder.promo_discount.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.shipping_fee !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-bold">{selectedOrder.shipping_fee === 0 ? 'FREE' : `$${selectedOrder.shipping_fee.toFixed(2)}`}</span>
                    </div>
                  )}
                  {selectedOrder.tax !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="font-bold">${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg pt-2 border-t border-white/10">
                    <span className="font-black uppercase">Total</span>
                    <span className="font-black">${selectedOrder.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">Status</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrder.id, e.target.value);
                    setSelectedOrder({ ...selectedOrder, status: e.target.value });
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wider focus:border-blue-500 outline-none"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
