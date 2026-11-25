export const ADMIN_CREDENTIALS = {
  username: 'charmconnectUser',
  password: 'charmconnect196',
}

export const DEFAULT_SETTINGS = {
  whatsapp: '27734852010',
  parys: {
    address: '10 Middle Street, Parys, Free State',
    phone: '073 485 2010',
    phone2: '076 593 6911',
    hours: 'Mon – Fri: 9 am – 5 pm|Sat & Sun: 9 am – 4 pm',
  },
  vaalpark: {
    address: 'Tharina Centre, Shop 18, Vaalpark (Sasolburg)',
    phone: '073 485 2010',
    phone2: '076 593 6911',
    hours: 'Mon – Fri: 9 am – 5 pm|Saturday: 9 am – 2 pm|Sunday: Closed',
  },
  payments:
    'We confirm stock, payment and delivery details with you personally on WhatsApp before you pay.',
}

export const MAP_EMBEDS = {
  parys: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227720.95461914514!2d27.14983519453125!3d-26.8990543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e943d4ec50e29bd%3A0x40af81933bba66bf!2sCharming%20leather%20parys!5e0!3m2!1sen!2sza!4v1795602641692!5m2!1sen!2sza',
  vaalpark: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227973.05720420435!2d27.536898694531253!3d-26.773750999999976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e945feb6693e9c5%3A0x384d04f3d8fa1b11!2sCharming%20Leather!5e0!3m2!1sen!2sza!4v1795602660400!5m2!1sen!2sza',
}

export type Settings = typeof DEFAULT_SETTINGS
