import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * DATABASE SERVICE (MIGRATED TO SUPABASE)
 * All operations now run directly against the Supabase PostgreSQL database.
 * We keep the name `mockDb` here temporarily so we don't have to rename imports in all 20+ files.
 */
export const mockDb = {
  getSettings: async () => {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (error || !data) {
      console.error('Error fetching settings:', error);
      return { liveMusic: {}, invitations: {} };
    }
    return {
      liveMusic: data.liveMusic || {},
      invitations: data.invitations || {}
    };
  },

  updateSettings: async (newSettings) => {
    const { error } = await supabase.from('settings').update({
      liveMusic: newSettings.liveMusic,
      invitations: newSettings.invitations
    }).eq('id', 1);
    if (error) throw error;
    return { success: true };
  },

  getClient: async (clientSlug) => {
    const { data, error } = await supabase.from('clients').select('*').eq('id', clientSlug).single();
    if (error) return null;
    return data;
  },

  getClients: async () => {
    const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  addClient: async (clientData) => {
    const pin = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit PIN
    const { data, error } = await supabase.from('clients').insert([{ ...clientData, pin }]).select().single();
    if (error) throw error;
    return data;
  },

  updateClientStatus: async (clientSlug, newStatus) => {
    const { error } = await supabase.from('clients').update({ status: newStatus }).eq('id', clientSlug);
    if (error) throw error;
    return true;
  },

  updateClientData: async (clientSlug, updatedData) => {
    const { error } = await supabase.from('clients').update(updatedData).eq('id', clientSlug);
    if (error) throw error;
    return true;
  },

  deleteClient: async (clientSlug) => {
    const { error } = await supabase.from('clients').delete().eq('id', clientSlug);
    if (error) throw error;
    return true;
  },

  getGuests: async (clientId) => {
    let query = supabase.from('guests').select('*').order('created_at', { ascending: false });
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    const { data, error } = await query;
    if (error) return [];
    return data;
  },
  
  addGuest: async (clientId, guestData) => {
    const { data, error } = await supabase.from('guests').insert([{
      client_id: clientId || 'demo',
      name: guestData.name,
      status: guestData.status,
      message: guestData.message
    }]).select().single();
    if (error) throw error;
    return data;
  },

  getStats: async (clientId) => {
    const guests = await mockDb.getGuests(clientId);
    const total = guests.length;
    const attending = guests.filter(g => g.status === 'hadir').length;
    const absent = guests.filter(g => g.status === 'tidak').length;
    return { total, attending, absent };
  },

  getDashboardStats: async () => {
    const [{ count: totalClients }, { count: pendingBookings }, { count: totalBookings }] = await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'Menunggu Konfirmasi'),
      supabase.from('bookings').select('*', { count: 'exact', head: true })
    ]);

    const { data: guests } = await supabase.from('guests').select('status');
    const totalRsvp = guests?.length || 0;
    const attendingRsvp = guests?.filter(g => g.status === 'hadir').length || 0;
    const absentRsvp = guests?.filter(g => g.status === 'tidak').length || 0;

    return {
      bookings: { total: totalBookings || 0, pending: pendingBookings || 0 },
      clients: { total: totalClients || 0 },
      rsvps: { total: totalRsvp, attending: attendingRsvp, absent: absentRsvp }
    };
  },

  getRecentActivities: async () => {
    const [{ data: bookings }, { data: guests }] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('guests').select('*').order('created_at', { ascending: false }).limit(5)
    ]);

    const bActivities = (bookings || []).map(b => ({
      id: `b_${b.id}`,
      type: 'booking',
      title: `Pesanan Baru: ${b.packageName || 'Live Band'}`,
      description: `${b.name} (${b.date})`,
      created_at: b.created_at
    }));

    const gActivities = (guests || []).map(g => ({
      id: `g_${g.id}`,
      type: 'rsvp',
      title: `RSVP ${g.status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}`,
      description: `${g.name} untuk acara ${g.client_id}`,
      created_at: g.created_at
    }));

    return [...bActivities, ...gActivities]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  },

  getBookings: async () => {
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  addBooking: async (bookingData) => {
    const { data, error } = await supabase.from('bookings').insert([bookingData]).select().single();
    if (error) throw error;
    return data;
  },

  updateBookingStatus: async (id, status) => {
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) throw error;
    return true;
  },

  deleteBooking: async (id) => {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // --- USER MANAGEMENT (RBAC) ---
  login: async (username, password) => {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();
      
    if (error || !data) {
      return { success: false, error: 'Username atau Password salah!' };
    }
    
    // Store simple session in localStorage for now (can be upgraded to JWT/Cookies later)
    if (typeof window !== 'undefined') {
      localStorage.setItem('jd_session', JSON.stringify({ username: data.username, role: data.role, name: data.name }));
    }
    return { success: true, user: data };
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jd_session');
    }
    return true;
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('jd_session');
      if (session) return JSON.parse(session);
    }
    return null;
  },

  getUsers: async () => {
    const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },

  addUser: async (userData) => {
    // Check if username exists
    const { data: existing } = await supabase.from('admins').select('id').eq('username', userData.username).single();
    if (existing) {
      return { success: false, error: 'Username sudah digunakan!' };
    }

    const { data, error } = await supabase.from('admins').insert([userData]).select().single();
    if (error) return { success: false, error: error.message };
    return { success: true, user: data };
  },

  deleteUser: async (username) => {
    const { error } = await supabase.from('admins').delete().eq('username', username);
    if (error) throw error;
    return true;
  },

  updateUserPassword: async (username, newPassword) => {
    const { error } = await supabase.from('admins').update({ password: newPassword }).eq('username', username);
    if (error) throw error;
    return true;
  },

  updateUser: async (oldUsername, updatedData) => {
    // If username changed, check if new one exists
    if (oldUsername !== updatedData.username) {
      const { data: existing } = await supabase.from('admins').select('id').eq('username', updatedData.username).single();
      if (existing) {
        return { success: false, error: 'Username baru sudah digunakan oleh admin lain!' };
      }
    }

    const payload = {
      name: updatedData.name,
      username: updatedData.username,
      role: updatedData.role
    };
    if (updatedData.password) {
      payload.password = updatedData.password;
    }

    const { error } = await supabase.from('admins').update(payload).eq('username', oldUsername);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }
};
