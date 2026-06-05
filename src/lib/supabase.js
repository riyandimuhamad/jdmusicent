import { createClient } from '@supabase/supabase-js';

// Fallback to mock values if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * MOCK DATABASE SERVICE
 * This service simulates database operations before real tables are set up.
 * In a real scenario, you would use supabase.from('table_name').select('*')
 */

// In-memory mock data
let mockGuests = [
  { id: 1, name: 'Budi Santoso', status: 'hadir', message: 'Selamat menempuh hidup baru!', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 2, name: 'Siti Aminah', status: 'hadir', message: 'Semoga menjadi keluarga sakinah mawaddah warahmah.', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 3, name: 'Andi Pratama', status: 'tidak', message: 'Maaf belum bisa hadir, doa terbaik untuk kalian berdua.', created_at: new Date(Date.now() - 86400000).toISOString() }
];

export const mockDb = {
  getGuests: async () => {
    return new Promise(resolve => setTimeout(() => resolve([...mockGuests]), 500));
  },
  
  addGuest: async (guestData) => {
    return new Promise(resolve => {
      const newGuest = {
        id: Date.now(),
        ...guestData,
        created_at: new Date().toISOString()
      };
      mockGuests = [newGuest, ...mockGuests];
      setTimeout(() => resolve(newGuest), 800);
    });
  },

  getStats: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const total = mockGuests.length;
        const attending = mockGuests.filter(g => g.status === 'hadir').length;
        const absent = mockGuests.filter(g => g.status === 'tidak').length;
        resolve({ total, attending, absent });
      }, 300);
    });
  }
};
