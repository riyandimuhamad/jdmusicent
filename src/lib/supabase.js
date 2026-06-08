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

let initialMockClients = [
  { 
    id: 'revi-adam', 
    groom: 'Adam', 
    bride: 'Revi',
    short: 'R & A',
    parentsGroom: 'Kel. Bapak X & Ibu Y',
    parentsBride: 'Kel. Bapak A & Ibu B',
    themeId: 'nasional-royal-navy-gold',
    eventDateISO: '2026-06-18',
    status: 'Aktif',
    pin: '123456',
    dateStr: '18 JUNI 2026',
    akad: { date: 'Minggu, 18 Juni 2026', time: '08:00 WIB - Selesai' },
    resepsi: { date: 'Minggu, 18 Juni 2026', time: '11:00 WIB - Selesai', venue: 'Ballroom Hotel Mulia', address: 'Jl. Asia Afrika, Senayan, Jakarta Pusat' },
    assets: {
      gallery: ['https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000'],
      bgmUrl: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_8e8a605f6e.mp3'
    },
    gift: {
      bank: 'BCA',
      account: '1234567890',
      name: 'Adam Wijaya'
    }
  },
  { 
    id: 'budi-ani', 
    groom: 'Budi Santoso', 
    bride: 'Ani Wijaya',
    short: 'B & A',
    parentsGroom: 'Kel. Bapak Santoso',
    parentsBride: 'Kel. Bapak Wijaya',
    themeId: 'lokal-sunda-priangan',
    eventDateISO: '2026-08-20',
    status: 'Aktif',
    pin: '654321',
    dateStr: '20 AGUSTUS 2026',
    akad: { date: 'Minggu, 20 Agustus 2026', time: '08:00 WIB - Selesai' },
    resepsi: { date: 'Minggu, 20 Agustus 2026', time: '11:00 WIB - Selesai', venue: 'Gedung Sate', address: 'Jl. Diponegoro No.22, Bandung' },
    assets: { gallery: [], bgmUrl: '' },
    gift: { bank: '', account: '', name: '' }
  }
];

const getLocalClients = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('jd_mock_clients');
    if (saved) {
      let parsed = JSON.parse(saved);
      let needsSave = false;
      parsed = parsed.map(c => {
        if (!c.pin) {
          needsSave = true;
          return { ...c, pin: Math.floor(100000 + Math.random() * 900000).toString() };
        }
        return c;
      });
      if (needsSave) {
        localStorage.setItem('jd_mock_clients', JSON.stringify(parsed));
      }
      return parsed;
    }
  }
  return initialMockClients;
};

const saveLocalClients = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jd_mock_clients', JSON.stringify(data));
  }
};

const getLocalGuests = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('jd_mock_guests');
    if (saved) return JSON.parse(saved);
  }
  return [
    { id: 1, client_id: 'revi-adam', name: 'Budi Santoso', status: 'hadir', message: 'Selamat menempuh hidup baru!', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, client_id: 'revi-adam', name: 'Siti Aminah', status: 'hadir', message: 'Semoga menjadi keluarga sakinah mawaddah warahmah.', created_at: new Date(Date.now() - 7200000).toISOString() },
    { id: 3, client_id: 'budi-ani', name: 'Andi Pratama', status: 'tidak', message: 'Maaf belum bisa hadir, doa terbaik.', created_at: new Date(Date.now() - 86400000).toISOString() }
  ];
};

const saveLocalGuests = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jd_mock_guests', JSON.stringify(data));
  }
};

// Helper to get bookings from localStorage or fallback
const getLocalBookings = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('jd_mock_bookings');
    if (saved) return JSON.parse(saved);
  }
  return [
    {
      id: 1,
      name: 'Azzahra Putri',
      whatsapp: '081234567890',
      date: '2026-10-15',
      venue: 'Sheraton Hotel, Lt. 2 Ballroom, Bandung',
      packageId: 'full-band',
      packageName: 'Full Band Package',
      themeId: 'lokal-sunda-priangan',
      themeName: 'Sunda Priangan',
      totalPrice: 4605000,
      notes: 'Lagu wajib: Sempurna, Akad.',
      status: 'Menunggu Konfirmasi',
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ];
};

// Helper to save bookings to localStorage
const saveLocalBookings = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jd_mock_bookings', JSON.stringify(data));
  }
};

// USER MANAGEMENT (RBAC) MOCK
const getLocalUsers = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('jd_mock_users');
    if (saved) return JSON.parse(saved);
  }
  return [
    {
      id: 1,
      username: 'admin',
      password: 'admin@jdmusicent',
      role: 'superadmin',
      name: 'Super Admin',
      created_at: new Date().toISOString()
    }
  ];
};

const saveLocalUsers = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jd_mock_users', JSON.stringify(data));
  }
};

const defaultSettings = {
  liveMusic: {
    "simple-electone": { basePrice: 2000000, discount: 0 },
    "acoustic-elegant": { basePrice: 2600000, discount: 0 },
    "full-band-harmony": { basePrice: 3700000, discount: 0 },
    "grand-band-prestige": { basePrice: 4000000, discount: 0 }
  },
  invitations: {
    "premium": { basePrice: 150000, discount: 45000 },
    "eksklusif": { basePrice: 200000, discount: 60000 },
    "luxury": { basePrice: 265000, discount: 80000 }
  }
};

const getLocalSettings = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('jd_mock_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      const filteredLiveMusic = Object.keys(defaultSettings.liveMusic).reduce((acc, key) => {
        acc[key] = parsed.liveMusic?.[key] || defaultSettings.liveMusic[key];
        return acc;
      }, {});
      
      const filteredInvitations = Object.keys(defaultSettings.invitations).reduce((acc, key) => {
        acc[key] = parsed.invitations?.[key] || defaultSettings.invitations[key];
        return acc;
      }, {});

      return {
        liveMusic: filteredLiveMusic,
        invitations: filteredInvitations
      };
    }
  }
  return defaultSettings;
};

const saveLocalSettings = (data) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jd_mock_settings', JSON.stringify(data));
  }
};

export const mockDb = {
  getSettings: async () => {
    return new Promise(resolve => {
      setTimeout(() => resolve(getLocalSettings()), 200);
    });
  },

  updateSettings: async (newSettings) => {
    return new Promise(resolve => {
      setTimeout(() => {
        saveLocalSettings(newSettings);
        resolve({ success: true });
      }, 500);
    });
  },

  // Get specific client by slug
  getClient: async (clientSlug) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const clients = getLocalClients();
        const client = clients.find(c => c.id === clientSlug);
        resolve(client || null);
      }, 300);
    });
  },

  // Get all clients
  getClients: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getLocalClients());
      }, 300);
    });
  },

  // Add a new client
  addClient: async (clientData) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const clients = getLocalClients();
        const pin = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit PIN
        const newClient = { ...clientData, pin };
        saveLocalClients([newClient, ...clients]);
        resolve(newClient);
      }, 500);
    });
  },

  updateClientStatus: async (clientSlug, newStatus) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const clients = getLocalClients();
        const updated = clients.map(c => 
          c.id === clientSlug ? { ...c, status: newStatus } : c
        );
        saveLocalClients(updated);
        resolve(true);
      }, 300);
    });
  },

  deleteClient: async (clientSlug) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const clients = getLocalClients();
        const updated = clients.filter(c => c.id !== clientSlug);
        saveLocalClients(updated);
        resolve(true);
      }, 300);
    });
  },

  getGuests: async (clientId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const guests = getLocalGuests();
        if (!clientId) resolve([...guests]); // Fallback for old calls
        const filtered = guests.filter(g => g.client_id === clientId);
        resolve([...filtered]);
      }, 500);
    });
  },
  
  addGuest: async (clientId, guestData) => {
    return new Promise(resolve => {
      const guests = getLocalGuests();
      const newGuest = {
        id: Date.now(),
        client_id: clientId || 'demo',
        ...guestData,
        created_at: new Date().toISOString()
      };
      saveLocalGuests([newGuest, ...guests]);
      setTimeout(() => resolve(newGuest), 800);
    });
  },

  getStats: async (clientId) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const guests = getLocalGuests();
        const filtered = clientId ? guests.filter(g => g.client_id === clientId) : guests;
        const total = filtered.length;
        const attending = filtered.filter(g => g.status === 'hadir').length;
        const absent = filtered.filter(g => g.status === 'tidak').length;
        resolve({ total, attending, absent });
      }, 300);
    });
  },

  getDashboardStats: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const bookings = getLocalBookings();
        const totalBookings = bookings.length;
        const pendingBookings = bookings.filter(b => b.status === 'Menunggu Konfirmasi').length;
        
        const clients = getLocalClients();
        const totalClients = clients.length;
        
        const guests = getLocalGuests();
        const totalRsvp = guests.length;
        const attendingRsvp = guests.filter(g => g.status === 'hadir').length;
        const absentRsvp = guests.filter(g => g.status === 'tidak').length;

        resolve({
          bookings: { total: totalBookings, pending: pendingBookings },
          clients: { total: totalClients },
          rsvps: { total: totalRsvp, attending: attendingRsvp, absent: absentRsvp }
        });
      }, 300);
    });
  },

  getRecentActivities: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        const bookings = getLocalBookings().map(b => ({
          id: `b_${b.id}`,
          type: 'booking',
          title: `Pesanan Baru: ${b.packageName || 'Live Band'}`,
          description: `${b.name} (${b.date})`,
          created_at: b.created_at
        }));

        const guests = getLocalGuests().map(g => ({
          id: `g_${g.id}`,
          type: 'rsvp',
          title: `RSVP ${g.status === 'hadir' ? 'Hadir' : 'Tidak Hadir'}`,
          description: `${g.name} untuk acara ${g.client_id}`,
          created_at: g.created_at
        }));

        const allActivities = [...bookings, ...guests]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        resolve(allActivities);
      }, 300);
    });
  },

  // Get all bookings
  getBookings: async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getLocalBookings());
      }, 300);
    });
  },

  // Add new booking
  addBooking: async (bookingData) => {
    return new Promise(resolve => {
      const currentBookings = getLocalBookings();
      const newBooking = {
        id: Date.now(),
        ...bookingData,
        status: 'Menunggu Konfirmasi',
        created_at: new Date().toISOString()
      };
      saveLocalBookings([newBooking, ...currentBookings]);
      setTimeout(() => resolve(newBooking), 500);
    });
  },

  // Update booking status
  updateBookingStatus: async (id, status) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const currentBookings = getLocalBookings();
        const updated = currentBookings.map(b => 
          b.id === id ? { ...b, status } : b
        );
        saveLocalBookings(updated);
        resolve(true);
      }, 300);
    });
  },

  // Delete booking
  deleteBooking: async (id) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const currentBookings = getLocalBookings();
        const filtered = currentBookings.filter(b => b.id !== id);
        saveLocalBookings(filtered);
        resolve(true);
      }, 300);
    });
  },

  // --- USER MANAGEMENT (RBAC) MOCK ---
  
  login: async (username, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getLocalUsers();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          // Store session in localStorage for mockup
          if (typeof window !== 'undefined') {
            localStorage.setItem('jd_session', JSON.stringify({ username: user.username, role: user.role, name: user.name }));
          }
          resolve({ success: true, user });
        } else {
          resolve({ success: false, error: 'Username atau Password salah!' });
        }
      }, 500);
    });
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
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(getLocalUsers());
      }, 300);
    });
  },

  addUser: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getLocalUsers();
        if (users.find(u => u.username === userData.username)) {
          resolve({ success: false, error: 'Username sudah digunakan!' });
          return;
        }
        const newUser = {
          id: Date.now(),
          ...userData,
          created_at: new Date().toISOString()
        };
        saveLocalUsers([...users, newUser]);
        resolve({ success: true, user: newUser });
      }, 500);
    });
  },

  deleteUser: async (username) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const users = getLocalUsers();
        const filtered = users.filter(u => u.username !== username);
        saveLocalUsers(filtered);
        resolve(true);
      }, 300);
    });
  },

  updateUserPassword: async (username, newPassword) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const users = getLocalUsers();
        const updated = users.map(u => 
          u.username === username ? { ...u, password: newPassword } : u
        );
        saveLocalUsers(updated);
        resolve(true);
      }, 300);
    });
  },

  updateUser: async (oldUsername, updatedData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getLocalUsers();
        // Check if username changed and new username exists
        if (oldUsername !== updatedData.username && users.find(u => u.username === updatedData.username)) {
          resolve({ success: false, error: 'Username baru sudah digunakan oleh admin lain!' });
          return;
        }
        
        const updated = users.map(u => {
          if (u.username === oldUsername) {
            // Only update password if provided
            const newData = { ...u, name: updatedData.name, username: updatedData.username, role: updatedData.role };
            if (updatedData.password) {
              newData.password = updatedData.password;
            }
            return newData;
          }
          return u;
        });
        
        saveLocalUsers(updated);
        resolve({ success: true });
      }, 500);
    });
  }
};
