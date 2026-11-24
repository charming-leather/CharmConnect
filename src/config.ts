export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'changeme123',
}

export const DEFAULT_SETTINGS = {
  whatsapp: '27821234567',
  parys: {
    address: '24 Bree Street, Parys, Free State',
    phone: '082 123 4567',
    hours: 'Mon–Fri: 09:00–17:00 · Sat: 09:00–13:00',
  },
  vaalpark: {
    address: '12 Opperman Street, Vaalpark, Sasolburg',
    phone: '082 765 4321',
    hours: 'Mon–Fri: 09:00–17:00 · Sat: 09:00–13:00',
  },
  payments:
    'We confirm stock, payment and delivery details with you personally on WhatsApp before you pay.',
}

export type Settings = typeof DEFAULT_SETTINGS
