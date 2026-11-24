import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ADMIN_CREDENTIALS, DEFAULT_SETTINGS, type Settings } from './config'
import { Accordion, Icon, Logo, PageHero, ProductCard, StockBadge } from './components'
import { addProduct, deleteProduct, duplicateProduct, getProduct, getProducts, seedProducts, updateProduct, type Product, type StockStatus } from './data/products'

type Route = { page: string; id?: string }
const categories = ['All Products', 'Bags', 'Wallets', 'Belts', 'Accessories']
const statuses: StockStatus[] = ['In Stock', 'Low Stock', 'Out of Stock', 'Sold Out']

function parseRoute(): Route {
  const path = window.location.pathname.replace(/^\/|\/$/g, '') || 'home'
  const [page, id] = path.split('/')
  return { page, id }
}

function useRoute() {
  const [route, setRoute] = useState(parseRoute)
  useEffect(() => {
    const onPop = () => setRoute(parseRoute())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  const go = (path: string) => {
    window.history.pushState({}, '', path)
    setRoute(parseRoute())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return { route, go }
}

function useProducts(includeDrafts = false) {
  const [products, setProducts] = useState(() => getProducts(includeDrafts))
  useEffect(() => {
    const refresh = () => setProducts(getProducts(includeDrafts))
    window.addEventListener('products-updated', refresh)
    return () => window.removeEventListener('products-updated', refresh)
  }, [includeDrafts])
  return products
}

function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(() => {
    const stored = localStorage.getItem('charming-leather-settings')
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS
  })
  const setSettings = (next: Settings) => {
    localStorage.setItem('charming-leather-settings', JSON.stringify(next))
    setSettingsState(next)
  }
  return [settings, setSettings] as const
}

function Header({ go }: { go: (path: string) => void }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState(false)
  const nav = (path: string) => { go(path); setOpen(false) }
  return <header className="site-header">
    <div className="container header-inner">
      <button className="logo-button" onClick={() => nav('/')}><Logo /></button>
      <nav className={open ? 'nav open' : 'nav'} aria-label="Main navigation">
        <button onClick={() => nav('/')}>Home</button>
        <div className="nav-shop"><button onClick={() => nav('/shop')}>Shop <small>⌄</small></button><div className="dropdown">{categories.map((c) => <button key={c} onClick={() => nav(`/shop?category=${encodeURIComponent(c)}`)}>{c}</button>)}</div></div>
        <button onClick={() => nav('/how-to-buy')}>How to Buy</button>
        <button onClick={() => nav('/payments-delivery')}>Payments & Delivery</button>
        <button onClick={() => nav('/about')}>About</button>
        <button onClick={() => nav('/contact')}>Contact</button>
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Search products" onClick={() => setSearch(!search)}><Icon name="search" /></button>
        <button className="icon-button menu-button" aria-label="Open menu" onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'} /></button>
      </div>
    </div>
    {search && <form className="search-bar container" onSubmit={(e) => { e.preventDefault(); const q = new FormData(e.currentTarget).get('q'); go(`/shop?search=${encodeURIComponent(String(q))}`); setSearch(false) }}><label htmlFor="site-search">What are you looking for?</label><div><input autoFocus id="site-search" name="q" placeholder="Try “wallet” or “bag”" /><button className="btn btn-small">Search</button></div></form>}
  </header>
}

function Footer({ go, settings }: { go: (path: string) => void; settings: Settings }) {
  return <footer><div className="container footer-grid">
    <div><Logo light /><p>Handmade leather goods and friendly, personal service from Parys and Vaalpark.</p></div>
    <div><h3>Quick links</h3><button onClick={() => go('/shop')}>Shop products</button><button onClick={() => go('/how-to-buy')}>How to buy</button><button onClick={() => go('/payments-delivery')}>Payments & delivery</button></div>
    <div><h3>Our branches</h3><p><b>Parys</b><br />{settings.parys.address}<br />{settings.parys.phone}</p><p><b>Vaalpark</b><br />{settings.vaalpark.address}<br />{settings.vaalpark.phone}</p></div>
    <div><h3>Let’s chat</h3><a className="footer-whatsapp" href={`https://wa.me/${settings.whatsapp}`} target="_blank">WhatsApp us</a><p className="socials"><span>f</span><span>◎</span></p></div>
  </div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Charming Leather</span><button onClick={() => go('/staff-login')}>Staff Portal</button></div></footer>
}

function Layout({ children, go, settings }: { children: React.ReactNode; go: (path: string) => void; settings: Settings }) {
  return <><Header go={go} /><main>{children}</main><a className="floating-wa" href={`https://wa.me/${settings.whatsapp}`} target="_blank" aria-label="Chat with Charming Leather on WhatsApp"><span>◉</span><b>WhatsApp</b></a><Footer go={go} settings={settings} /></>
}

function Home({ go }: { go: (path: string) => void }) {
  const products = useProducts()
  const steps = [
    ['browse', '1. Browse', 'Look through our products'],
    ['select', '2. Select', 'Pick the item, colour and size you like'],
    ['chat', '3. Click Buy', 'Tap Buy on WhatsApp. Your order message is already written'],
    ['delivery', '4. Pay and Receive', 'Payment and delivery are arranged privately with the owner'],
  ]
  return <>
    <section className="hero"><div className="container hero-grid"><div className="hero-copy"><p className="eyebrow">HANDMADE IN SOUTH AFRICA</p><h1>Leather goods with <em>lasting charm.</em></h1><p>Beautiful, practical leather pieces, made with care. Browse online, then order simply through WhatsApp.</p><button className="btn btn-large" onClick={() => go('/shop')}>Shop Now <span>→</span></button><p className="hero-note"><span>✓</span> No online payment needed</p></div><div className="hero-image"><img src={seedProducts[0].images[0]} alt="Handcrafted leather satchel" /><div className="hero-badge"><b>Made<br />with care</b><span>✦</span></div></div></div></section>
    <section className="section container"><div className="section-heading"><div><p className="eyebrow">SHOP BY CATEGORY</p><h2>Find what you’re looking for</h2></div><button className="text-link desktop-link" onClick={() => go('/shop')}>View all products →</button></div><div className="category-grid">{[
      ['Bags', seedProducts[1].images[0]], ['Wallets', seedProducts[2].images[0]], ['Belts', seedProducts[3].images[0]], ['Accessories', seedProducts[6].images[0]],
    ].map(([name, image]) => <button className="category-card" key={name} onClick={() => go(`/shop?category=${name}`)}><img src={image} alt="" /><span>{name}<b>→</b></span></button>)}</div></section>
    <section className="section tinted"><div className="container"><div className="section-heading"><div><p className="eyebrow">OUR FAVOURITES</p><h2>Featured products</h2></div><button className="text-link" onClick={() => go('/shop')}>See all →</button></div><div className="product-grid">{products.filter((p) => p.featured).map((p) => <ProductCard product={p} onOpen={(id) => go(`/product/${id}`)} key={p.id} />)}</div></div></section>
    <section className="section container"><div className="center-heading"><p className="eyebrow">SIMPLE & PERSONAL</p><h2>How to buy</h2><p>Ordering is easy. We help you personally from start to finish.</p></div><div className="steps">{steps.map(([icon, title, text], i) => <div className="step" key={title}><div className="step-icon"><Icon name={icon} /></div><h3>{title}</h3><p>{text}</p>{i < steps.length - 1 && <span className="step-arrow">→</span>}</div>)}</div><div className="center"><button className="text-link" onClick={() => go('/payments-delivery')}>Read more about payments and delivery →</button></div></section>
    <section className="section why"><div className="container why-grid"><div><p className="eyebrow">WHY CHARMING LEATHER?</p><h2>Made to be used.<br />Made to be loved.</h2></div>{[['handmade','Handmade with care','Thoughtfully crafted by skilled hands.'],['quality','Quality leather','Beautiful materials chosen to last.'],['service','Friendly service','Real people, ready to help you.']].map(([icon,title,text]) => <div className="why-item" key={title}><Icon name={icon} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>
    <section className="section container"><div className="center-heading"><p className="eyebrow">COME SAY HELLO</p><h2>Visit our branches</h2></div><div className="branch-cards"><button onClick={() => go('/contact')}><span className="branch-icon"><Icon name="location" /></span><div><p>FREE STATE</p><h3>Parys</h3><span>View branch details →</span></div></button><button onClick={() => go('/contact')}><span className="branch-icon"><Icon name="location" /></span><div><p>VAAL TRIANGLE</p><h3>Vaalpark</h3><span>View branch details →</span></div></button></div></section>
  </>
}

function Shop({ go }: { go: (path: string) => void }) {
  const all = useProducts()
  const params = new URLSearchParams(window.location.search)
  const [category, setCategory] = useState(params.get('category') || 'All Products')
  const [sort, setSort] = useState('featured')
  const [status, setStatus] = useState('All')
  const search = (params.get('search') || '').toLowerCase()
  const products = useMemo(() => all.filter((p) => (category === 'All Products' || p.category === category) && (status === 'All' || p.stock === status) && (!search || p.name.toLowerCase().includes(search))).sort((a,b) => sort === 'low' ? a.price-b.price : sort === 'high' ? b.price-a.price : Number(b.featured)-Number(a.featured)), [all, category, status, search, sort])
  return <><PageHero eyebrow="OUR COLLECTION" title="Shop leather goods" text="Find something you love, choose your options, then order through WhatsApp." /><section className="section container shop-section"><div className="chips" aria-label="Product categories">{categories.map((c) => <button className={category === c ? 'active' : ''} onClick={() => setCategory(c)} key={c}>{c}</button>)}</div><div className="shop-tools"><p><b>{products.length}</b> products</p><div><label>Availability <select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label><label>Sort by <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div></div>{products.length ? <div className="product-grid">{products.map((p) => <ProductCard product={p} onOpen={(id) => go(`/product/${id}`)} key={p.id} />)}</div> : <div className="empty"><h2>No products found</h2><p>Try another category or search.</p></div>}</section></>
}

function ProductPage({ id, go, settings }: { id?: string; go: (path: string) => void; settings: Settings }) {
  const products = useProducts()
  const product = products.find((p) => p.id === id)
  const [colour, setColour] = useState('')
  const [size, setSize] = useState('')
  const [image, setImage] = useState(0)
  if (!product) return <div className="section container empty"><h1>Product not found</h1><button className="btn" onClick={() => go('/shop')}>Back to shop</button></div>
  const unavailable = product.stock === 'Out of Stock' || product.stock === 'Sold Out'
  const message = unavailable
    ? `Hi Charming Leather, I'd like to ask about: ${product.name}, Link: ${window.location.href}`
    : `Hi Charming Leather, I'd like to order: ${product.name}, Price: R${product.price}, Colour: ${colour || '[Colour]'}, Size: ${size || '[Size]'}, Link: ${window.location.href}`
  const canBuy = unavailable || (colour && size)
  return <section className="section container product-page"><button className="back-link" onClick={() => go('/shop')}>← Back to shop</button><div className="product-detail"><div className="gallery"><div className="main-image"><img src={product.images[image]} alt={product.name} /></div><div className="thumbnails">{product.images.map((img,i) => <button className={i === image ? 'active' : ''} onClick={() => setImage(i)} key={img}><img src={img} alt={`${product.name} view ${i+1}`} /></button>)}</div></div><div className="product-info"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><p className="detail-price">R{product.price.toLocaleString('en-ZA')}</p><StockBadge status={product.stock} /><p className="description">{product.description}</p><fieldset><legend>Choose a colour</legend><div className="option-buttons">{product.colours.map((c) => <button className={colour === c ? 'active' : ''} onClick={() => setColour(c)} key={c}>{c}</button>)}</div></fieldset><fieldset><legend>Choose a size</legend><div className="option-buttons">{product.sizes.map((s) => <button className={size === s ? 'active' : ''} onClick={() => setSize(s)} key={s}>{s}</button>)}</div></fieldset>{!canBuy && <p className="helper">Please choose a colour and size first</p>}<a className={`btn btn-wa btn-large ${!canBuy ? 'disabled' : ''}`} aria-disabled={!canBuy} href={canBuy ? `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}` : undefined} target="_blank">{unavailable ? 'Ask us on WhatsApp' : 'Buy on WhatsApp'} <span>→</span></a><p className="reassurance">✓ No online payment. We confirm everything with you on WhatsApp first.</p><div className="message-preview"><b>Your WhatsApp message</b><p>{message}</p></div><Accordion items={[{ title: 'Details', content: 'Handmade from genuine leather. Natural markings make every piece unique.' },{ title: 'Care Instructions', content: 'Wipe gently with a soft, dry cloth. Keep away from excess water and direct heat.' },{ title: 'Payments & Delivery', content: <button className="text-link" onClick={() => go('/payments-delivery')}>Read full payments and delivery information →</button> }]} /></div></div><div className="related"><div className="section-heading"><h2>You may also like</h2></div><div className="product-grid">{products.filter((p) => p.category === product.category && p.id !== product.id).slice(0,4).map((p) => <ProductCard key={p.id} product={p} onOpen={(next) => go(`/product/${next}`)} />)}</div></div></section>
}

const fullSteps = [
  ['browse','Browse','Look through our products and find something you like.'],
  ['select','Select','Choose the colour and size that suits you.'],
  ['chat','Click Buy on WhatsApp','We write your order message for you. Just tap send.'],
  ['confirm','Confirm with us','We personally confirm availability and your order details.'],
  ['pay','Pay','We share the agreed payment details privately.'],
  ['delivery','Delivery or collection','Choose delivery, or collect from Parys or Vaalpark.'],
]

function HowToBuy({ go }: { go: (path: string) => void }) {
  return <><PageHero eyebrow="EASY ORDERING" title="How to buy from us" text="Six simple steps. No forms, no online checkout and no fuss." /><section className="section container"><div className="large-steps">{fullSteps.map(([icon,title,text],i) => <div className="large-step" key={title}><span className="step-number">{i+1}</span><div className="step-icon"><Icon name={icon} /></div><div><h2>{title}</h2><p>{text}</p></div></div>)}</div></section><section className="section tinted"><div className="container narrow"><div className="center-heading"><h2>Common questions</h2></div><Accordion items={[{title:'Do I pay on this website?',content:'No. We first confirm your order with you on WhatsApp, then arrange payment privately.'},{title:'Can I collect my order?',content:'Yes. You can arrange collection from our Parys or Vaalpark branch.'},{title:'Can you help me choose?',content:'Absolutely. Send us a WhatsApp message and we will gladly help with colours, sizes and availability.'}]} /><div className="center top-space"><button className="btn" onClick={() => go('/shop')}>Start shopping</button></div></div></section></>
}

function Payments({ settings }: { settings: Settings }) {
  const sections = [['pay','Payment methods','EFT, cash on collection, or another method agreed with the owner.'],['confirm','When you pay','Only after we have confirmed that your item is available.'],['delivery','Delivery options','Courier delivery usually takes 3–7 working days after dispatch.'],['quality','Delivery costs','We confirm the cost before you pay. It depends on your location and parcel size.'],['location','Collection','Collect at our Parys or Vaalpark branch by arrangement.'],['select','Returns & exchanges','Please contact us within 7 days. Items must be unused and in their original condition.']]
  return <><PageHero eyebrow="CLEAR & SIMPLE" title="Payments & delivery" text="Everything is confirmed with you personally before you pay." /><section className="section container"><div className="notice"><Icon name="chat" /><div><h2>Arranged privately with you</h2><p>All payment and delivery details are arranged privately with the owner on WhatsApp.</p></div></div><div className="info-grid">{sections.map(([icon,title,text]) => <article className="info-card" key={title}><Icon name={icon} /><h2>{title}</h2><p>{text}</p></article>)}</div><div className="narrow faq-wrap"><h2>Frequently asked questions</h2><Accordion items={[{title:'When will my order be sent?',content:'We will share the estimated dispatch date when confirming your order.'},{title:'Do you deliver anywhere in South Africa?',content:'Yes, courier delivery can be arranged to most South African addresses.'},{title:'How do I know my payment is safe?',content:'Payment details are shared privately by the owner after your stock and order details are confirmed.'}]} /></div><div className="center top-space"><a className="btn btn-wa btn-large" target="_blank" href={`https://wa.me/${settings.whatsapp}`}>Chat with us on WhatsApp</a></div></section></>
}

function Contact({ settings }: { settings: Settings }) {
  return <><PageHero eyebrow="VISIT OR CALL" title="Our branches" text="Come say hello in Parys or Vaalpark, or send us a WhatsApp message." /><section className="section container contact-grid">{([['Parys',settings.parys],['Vaalpark',settings.vaalpark]] as const).map(([name,branch]) => <article className="branch-detail" key={name}><div className="branch-copy"><p className="eyebrow">CHARMING LEATHER</p><h2>{name}</h2><p><Icon name="location" /><span><b>Address</b><br />{branch.address}</span></p><p><Icon name="phone" /><span><b>Phone</b><br />{branch.phone}</span></p><p><Icon name="clock" /><span><b>Opening hours</b><br />{branch.hours}</span></p><a className="btn btn-wa" target="_blank" href={`https://wa.me/${settings.whatsapp}`}>WhatsApp this branch</a></div><div className="map-placeholder"><Icon name="location" /><b>Google Map</b><span>Map embed can be added here</span></div></article>)}</section></>
}

function About({ go }: { go: (path: string) => void }) {
  return <><PageHero eyebrow="OUR STORY" title="Made with care. Shared with pride." text="Charming Leather brings practical, beautiful leather goods to our communities in Parys and Vaalpark." /><section className="section container about-grid"><img src={seedProducts[1].images[0]} alt="Leather bag made by Charming Leather" /><div><p className="eyebrow">PERSONAL & LOCAL</p><h2>Leather goods for everyday life</h2><p>We believe good leather becomes more beautiful as you use it. That is why we choose quality materials and useful designs that feel special without being fussy.</p><p>Our customers matter to us. When you message Charming Leather, you speak to a real person who can help you choose and arrange your order.</p><button className="btn" onClick={() => go('/shop')}>Browse our products</button></div></section></>
}

function StaffLogin({ go }: { go: (path: string) => void }) {
  const [error, setError] = useState('')
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    if (form.get('username') === ADMIN_CREDENTIALS.username && form.get('password') === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem('charming-admin', 'true'); go('/admin')
    } else setError('Those details do not match. Please check them and try again.')
  }
  return <div className="login-page"><button onClick={() => go('/')} className="logo-button"><Logo /></button><form className="login-card" onSubmit={submit}><p className="eyebrow">STAFF PORTAL</p><h1>Welcome back</h1><p>Log in to manage products and shop details.</p>{error && <div className="form-error">{error}</div>}<label>Username<input name="username" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button className="btn btn-large" type="submit">Log In</button><button className="text-link" type="button" onClick={() => go('/')}>← Back to website</button></form></div>
}

function AdminShell({ children, go }: { children: React.ReactNode; go: (path: string) => void }) {
  return <div className="admin-layout"><aside><Logo light /><nav><button onClick={() => go('/admin')}>Products</button><button onClick={() => go('/admin/settings')}>Settings</button><button onClick={() => go('/')}>View website</button></nav><button className="logout" onClick={() => { sessionStorage.removeItem('charming-admin'); go('/staff-login') }}>Log Out</button></aside><div className="admin-main">{children}</div></div>
}

function AdminDashboard({ go }: { go: (path: string) => void }) {
  const products = useProducts(true)
  const [query,setQuery] = useState('')
  const [filter,setFilter] = useState('All')
  const shown = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) && (filter === 'All' || p.stock === filter))
  return <><div className="admin-heading"><div><p className="eyebrow">STAFF PORTAL</p><h1>Products</h1><p>Manage what customers see in your shop.</p></div><button className="btn" onClick={() => go('/admin/product/new')}>+ Add Product</button></div><div className="admin-tools"><label>Search products<input placeholder="Type a product name" value={query} onChange={(e) => setQuery(e.target.value)} /></label><label>Stock status<select value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label></div><div className="admin-list">{shown.map((p) => <article className="admin-product" key={p.id}><img src={p.images[0]} alt="" /><div className="admin-product-info"><h3>{p.name}</h3><p>R{p.price.toLocaleString('en-ZA')} · {p.published ? 'Published' : 'Draft'}</p></div><label className="quick-status"><span>Stock</span><select value={p.stock} onChange={(e) => updateProduct(p.id,{stock:e.target.value as StockStatus})}>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label><div className="row-actions"><button onClick={() => go(`/admin/product/${p.id}`)}>Edit</button><button onClick={() => duplicateProduct(p.id)}>Duplicate</button><button className="danger" onClick={() => confirm(`Delete ${p.name}?`) && deleteProduct(p.id)}>Delete</button></div></article>)}</div></>
}

const emptyProduct: Product = { id:'', name:'', price:0, category:'Bags', description:'', colours:[], sizes:[], stock:'In Stock', featured:false, published:false, images:[] }

function ProductEditor({ id, go }: { id?: string; go: (path: string) => void }) {
  const existing = id && id !== 'new' ? getProduct(id) : undefined
  const [form,setForm] = useState<Product>(existing || emptyProduct)
  const [colour,setColour] = useState('')
  const [size,setSize] = useState('')
  const [error,setError] = useState('')
  const [success,setSuccess] = useState('')
  const patch = <K extends keyof Product>(key: K, value: Product[K]) => setForm((f) => ({...f,[key]:value}))
  const upload = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => { const reader = new FileReader(); reader.onload = () => setForm((f) => ({...f,images:[...f.images,String(reader.result)]})); reader.readAsDataURL(file) })
  }
  const saveForm = (published: boolean) => {
    if (!form.name.trim() || form.price <= 0 || !form.description.trim() || !form.images.length) { setError('Please add a photo, name, price and description before saving.'); return }
    const record = {...form, id: existing?.id || `${form.name.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${Date.now()}`, published}
    existing ? updateProduct(existing.id,record) : addProduct(record)
    setError(''); setSuccess(published ? 'Product published! Customers can see it now.' : 'Draft saved. It is not visible in the shop yet.')
    setTimeout(() => go('/admin'), 1000)
  }
  const addTag = (type:'colours'|'sizes',value:string,setter:(s:string)=>void) => { if(value.trim() && !form[type].includes(value.trim())) patch(type,[...form[type],value.trim()]); setter('') }
  return <><div className="admin-heading"><div><button className="back-link" onClick={() => go('/admin')}>← Products</button><h1>{existing ? 'Edit product' : 'Add a product'}</h1><p>Fill in the details below. You can save it as a draft first.</p></div></div>{error && <div className="form-error">{error}</div>}{success && <div className="form-success">{success}</div>}<div className="editor-grid"><div className="editor-form">
    <section className="form-section"><span className="form-step">1</span><h2>Add photos</h2><p>Choose clear photos. The first one is the cover photo.</p><label className="upload-box"><input type="file" accept="image/*" multiple onChange={(e) => upload(e.target.files)} /><b>Tap to take or choose photos</b><span>JPG or PNG</span></label><div className="upload-preview">{form.images.map((img,i) => <div key={`${img.slice(0,20)}${i}`}><img src={img} alt="" /><span>{i===0?'Cover':`Photo ${i+1}`}</span><button onClick={() => patch('images',form.images.filter((_,x)=>x!==i))}>×</button>{i>0&&<button className="make-cover" onClick={() => patch('images',[img,...form.images.filter((_,x)=>x!==i)])}>Make cover</button>}</div>)}</div></section>
    <section className="form-section"><span className="form-step">2</span><h2>Basic details</h2><label>Product name<input value={form.name} onChange={(e)=>patch('name',e.target.value)} placeholder="e.g. Classic Leather Bag" /></label><div className="form-row"><label>Price (Rand)<input type="number" min="0" value={form.price || ''} onChange={(e)=>patch('price',Number(e.target.value))} placeholder="0" /></label><label>Category<select value={form.category} onChange={(e)=>patch('category',e.target.value as Product['category'])}>{categories.slice(1).map((c)=><option key={c}>{c}</option>)}</select></label></div><label>Description<textarea rows={5} value={form.description} onChange={(e)=>patch('description',e.target.value)} placeholder="Describe the product in simple words" /></label></section>
    <section className="form-section"><span className="form-step">3</span><h2>Options</h2><label>Colours<div className="tag-input"><input value={colour} onChange={(e)=>setColour(e.target.value)} placeholder="e.g. Tan" onKeyDown={(e)=>{if(e.key==='Enter'){e.preventDefault();addTag('colours',colour,setColour)}}}/><button onClick={()=>addTag('colours',colour,setColour)}>Add</button></div></label><div className="tags">{form.colours.map((c)=><button key={c} onClick={()=>patch('colours',form.colours.filter(x=>x!==c))}>{c} ×</button>)}</div><label>Sizes<div className="tag-input"><input value={size} onChange={(e)=>setSize(e.target.value)} placeholder="e.g. Medium" onKeyDown={(e)=>{if(e.key==='Enter'){e.preventDefault();addTag('sizes',size,setSize)}}}/><button onClick={()=>addTag('sizes',size,setSize)}>Add</button></div></label><div className="tags">{form.sizes.map((s)=><button key={s} onClick={()=>patch('sizes',form.sizes.filter(x=>x!==s))}>{s} ×</button>)}</div></section>
    <section className="form-section"><span className="form-step">4</span><h2>Stock & display</h2><label>Stock status<select value={form.stock} onChange={(e)=>patch('stock',e.target.value as StockStatus)}>{statuses.map((s)=><option key={s}>{s}</option>)}</select></label><label className="checkbox"><input type="checkbox" checked={form.featured} onChange={(e)=>patch('featured',e.target.checked)} /> Show on home page as Featured</label></section>
    <div className="editor-actions"><button className="btn secondary" onClick={()=>saveForm(false)}>Save as Draft</button><button className="btn" onClick={()=>saveForm(true)}>Publish</button></div>
  </div><aside className="live-preview"><p className="eyebrow">LIVE PREVIEW</p><h2>How it will look</h2><ProductCard product={{...form,name:form.name||'Your product name',price:form.price||0,images:form.images.length?form.images:[seedProducts[0].images[0]]}} onOpen={()=>{}} /></aside></div></>
}

function SettingsPage({ settings, setSettings }: { settings: Settings; setSettings: (s: Settings) => void }) {
  const [form,setForm] = useState(settings)
  const [saved,setSaved] = useState(false)
  const branch = (key:'parys'|'vaalpark',field:keyof Settings['parys'],value:string) => setForm({...form,[key]:{...form[key],[field]:value}})
  return <><div className="admin-heading"><div><p className="eyebrow">STAFF PORTAL</p><h1>Settings</h1><p>Update the contact details shown across the website.</p></div></div>{saved&&<div className="form-success">Settings saved successfully.</div>}<div className="settings-form form-section"><h2>WhatsApp</h2><label>WhatsApp number <small>Use country code, without + or spaces</small><input value={form.whatsapp} onChange={(e)=>setForm({...form,whatsapp:e.target.value})}/></label>{(['parys','vaalpark'] as const).map((key)=><div key={key}><h2>{key==='parys'?'Parys':'Vaalpark'} branch</h2><label>Address<input value={form[key].address} onChange={(e)=>branch(key,'address',e.target.value)}/></label><label>Phone number<input value={form[key].phone} onChange={(e)=>branch(key,'phone',e.target.value)}/></label><label>Opening hours<input value={form[key].hours} onChange={(e)=>branch(key,'hours',e.target.value)}/></label></div>)}<h2>Payments & delivery</h2><label>Short information text<textarea rows={5} value={form.payments} onChange={(e)=>setForm({...form,payments:e.target.value})}/></label><button className="btn" onClick={()=>{setSettings(form);setSaved(true)}}>Save Settings</button></div></>
}

export default function App() {
  const { route,go } = useRoute()
  const [settings,setSettings] = useSettings()
  const isAdmin = route.page === 'admin'
  if (route.page === 'staff-login') return <StaffLogin go={go} />
  if (isAdmin) {
    if (sessionStorage.getItem('charming-admin') !== 'true') { setTimeout(()=>go('/staff-login'),0); return null }
    let content = <AdminDashboard go={go} />
    if (route.id === 'settings') content = <SettingsPage settings={settings} setSettings={setSettings} />
    if (route.id === 'product') content = <ProductEditor id={window.location.pathname.split('/')[3]} go={go} />
    return <AdminShell go={go}>{content}</AdminShell>
  }
  let page: React.ReactNode
  switch(route.page) {
    case 'shop': page=<Shop go={go}/>; break
    case 'product': page=<ProductPage id={route.id} go={go} settings={settings}/>; break
    case 'how-to-buy': page=<HowToBuy go={go}/>; break
    case 'payments-delivery': page=<Payments settings={settings}/>; break
    case 'contact': page=<Contact settings={settings}/>; break
    case 'about': page=<About go={go}/>; break
    default: page=<Home go={go}/>
  }
  return <Layout go={go} settings={settings}>{page}</Layout>
}
