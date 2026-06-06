import { createClient } from '@supabase/supabase-js';

// Fallback to mock values if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * MOCK DATABASE SERVICE
 * Simulates a relational database structure for a SaaS platform.
 * Includes 'clients' table and 'guests' table with client_id relationships.
 */

let mockClients = [
  { 
    id: 'revi-adam', 
    groom: 'Adam', 
    bride: 'Revi',
    short: 'R & A',
    parentsGroom: 'Kel. Bapak X & Ibu Y',
    parentsBride: 'Kel. Bapak A & Ibu B',
    themeId: 'nasional-royal-navy-gold',
    dateStr: '18 JUNI 2026',
    akad: { date: 'Minggu, 18 Juni 2026', time: '08:00 WIB - Selesai' },
    resepsi: { date: 'Minggu, 18 Juni 2026', time: '11:00 WIB - Selesai', venue: 'Ballroom Hotel Mulia', address: 'Jl. Asia Afrika, Senayan, Jakarta Pusat' }
  },
  { 
    id: 'budi-ani', 
    groom: 'Budi Santoso', 
    bride: 'Ani Wijaya',
    short: 'B & A',
    parentsGroom: 'Kel. Bapak Santoso',
    parentsBride: 'Kel. Bapak Wijaya',
    themeId: 'lokal-sunda-priangan',
    dateStr: '20 AGUSTUS 2026',
    akad: { date: 'Minggu, 20 Agustus 2026', time: '08:00 WIB - Selesai' },
    resepsi: { date: 'Minggu, 20 Agustus 2026', time: '11:00 WIB - Selesai', venue: 'Gedung Sate', address: 'Jl. Diponegoro No.22, Bandung' }
  }
];

// In-memory mock data with client_id
let mockGuests = [
  { id: 1, client_id: 'revi-adam', name: 'Budi Santoso', status: 'hadir', message: 'Selamat menempuh hidup baru!', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, client_id: 'revi-adam', name: 'Siti Aminah', status: 'hadir', message: 'Semoga menjadi keluarga sakinah mawaddah warahmah.', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, client_id: 'budi-ani', name: 'Andi Pratama', status: 'tidak', message: 'Maaf belum bisa hadir, doa terbaik.', created_at: new Date(Date.now() - 86400000).toISOString() }
];

export const mockDb = {
  // Get specific client by slug
  getClient: async (clientSlug) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const client = mockClients.find(c => c.id === clientSlug);
        resolve(client || null);
      }, 300);
    });
  },

  // Get all clients
  getClients: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([...mockClients]);
      }, 300);
    });
  },

  // Add a new client
  addClient: async (clientData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newClient = { ...clientData };
        mockClients = [newClient, ...mockClients];
        resolve(newClient);
      }, 500);
    });
  },

  // Get guests filtered by client_id
  getGuests: async (clientId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!clientId) resolve([...mockGuests]); // Fallback for old calls
        const filtered = mockGuests.filter(g => g.client_id === clientId);
        resolve([...filtered]);
      }, 500);
    });
  },
  
  // Add guest tied to a client
  addGuest: async (clientId, guestData) => {
    return new Promise(resolve => {
      const newGuest = {
        id: Date.now(),
        client_id: clientId || 'demo',
        ...guestData,
        created_at: new Date().toISOString()
      };
      mockGuests = [newGuest, ...mockGuests];
      setTimeout(() => resolve(newGuest), 800);
    });
  },

  getStats: async (clientId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const filtered = clientId ? mockGuests.filter(g => g.client_id === clientId) : mockGuests;
        const total = filtered.length;
        const attending = filtered.filter(g => g.status === 'hadir').length;
        const absent = filtered.filter(g => g.status === 'tidak').length;
        resolve({ total, attending, absent });
      }, 300);
    });
  }
};
