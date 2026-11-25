import type { ReactNode } from 'react'
import type { Product, StockStatus } from './data/products'
import type { ComponentType } from 'react'
import {
  Search, X, Menu, LayoutGrid, MousePointerClick, Handshake, Truck,
  ShieldCheck, Wallet, MapPin, Phone, Clock, Hand, BadgeCheck,
  HeartHandshake, Receipt, RefreshCw, Sparkles,
} from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

type IconComp = ComponentType<{ size?: number; strokeWidth?: number }>
const WhatsApp: IconComp = ({ size }) => <FaWhatsapp size={size} />

const icons: Record<string, IconComp> = {
  search: Search,
  close: X,
  menu: Menu,
  browse: LayoutGrid,
  select: MousePointerClick,
  chat: WhatsApp,
  handshake: Handshake,
  delivery: Truck,
  confirm: ShieldCheck,
  pay: Wallet,
  location: MapPin,
  phone: Phone,
  clock: Clock,
  handmade: Hand,
  quality: BadgeCheck,
  service: HeartHandshake,
  cost: Receipt,
  returns: RefreshCw,
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={light ? 'logo logo-light' : 'logo'}>
      <img src="/images/charmlogo.png" alt="Charming Leather" className="logo-img" />
    </span>
  )
}

export function Icon({ name }: { name: string }) {
  const Cmp = icons[name] ?? Sparkles
  return (
    <span className="icon" aria-hidden="true">
      <Cmp size={26} strokeWidth={2.2} />
    </span>
  )
}

export function StockBadge({ status }: { status: StockStatus }) {
  return <span className={`stock stock-${status.toLowerCase().replaceAll(' ', '-')}`}>{status}</span>
}

export function ProductCard({ product, onOpen }: { product: Product; onOpen: (id: string) => void }) {
  return (
    <article className="product-card" onClick={() => onOpen(product.id)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onOpen(product.id)}>
      <div className="product-image-wrap">
        <img src={product.images[0]} alt={product.name} className="product-image" />
        <StockBadge status={product.stock} />
      </div>
      <div className="product-card-body">
        <p className="eyebrow">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="price">R{product.price.toLocaleString('en-ZA')}</p>
      </div>
    </article>
  )
}

export function PageHero({ eyebrow, title, text }: { eyebrow?: string; title: string; text: string }) {
  return <section className="page-hero"><div className="container">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p>{text}</p></div></section>
}

export function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  return <div className="accordion">{items.map((item) => <details key={item.title}><summary>{item.title}<span>+</span></summary><div>{item.content}</div></details>)}</div>
}
