import type { ReactNode } from 'react'
import type { Product, StockStatus } from './data/products'

export const icons: Record<string, string> = {
  search: '⌕', menu: '☰', close: '×', bag: '▱', wallet: '▭', belt: '〰', gift: '◇',
  browse: '⌕', select: '☝', chat: '◉', confirm: '✓', pay: 'R', delivery: '▰',
  handmade: '✦', quality: '◆', service: '♡', location: '⌖', phone: '☎', clock: '◷',
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className={`logo ${light ? 'logo-light' : ''}`} aria-label="Charming Leather">
      <span className="logo-mark">CL</span>
      <span><b>Charming</b><small>LEATHER</small></span>
    </div>
  )
}

export function Icon({ name }: { name: string }) {
  return <span className="icon" aria-hidden="true">{icons[name] || name}</span>
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
