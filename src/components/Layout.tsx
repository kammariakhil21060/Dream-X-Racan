import { useEffect, useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, UserRound, ArrowUpRight, House, Compass, Clapperboard, Menu, X } from 'lucide-react';
import { useStore } from '../lib/store';
import { Modal } from './ui';

export function Header(){
  const navigate = useNavigate();
  const { cart, user, setLoginOpen } = useStore() as any;
  const [search, setSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const count = cart.reduce((s:number,i:any)=>s+i.quantity,0);
  return (
    <>
      <div className="announcement">
        <span>Good style. Great discoveries. All you.</span>
        <Link to="/brands">Meet your next favourite brand <ArrowUpRight size={12}/></Link>
      </div>
      <header className="header">
        <Link to="/" className="wordmark" style={{display:'flex',alignItems:'center'}}>
          <img src="/racan-logo.png" alt="RACAN" style={{height:'32px', width:'auto', display:'block'}} />
        </Link>
        <nav className={menu?'desktop-nav open':'desktop-nav'}>
          <NavLink to="/" end onClick={()=>setMenu(false)}>Discover</NavLink>
          <NavLink to="/gen-z" onClick={()=>setMenu(false)}>Gen Z</NavLink>
          <NavLink to="/women" onClick={()=>setMenu(false)}>Women</NavLink>
          <NavLink to="/reels" onClick={()=>setMenu(false)}>Reels</NavLink>
          <NavLink to="/brands" onClick={()=>setMenu(false)}>Brands</NavLink>
        </nav>
        <div className="header-actions">
          <button className="search-trigger" onClick={()=>setSearch(true)}><Search size={19}/><span>Find your next favourite</span></button>
          <Link className="icon-btn" to="/wishlist"><Heart size={20}/></Link>
          <Link className="icon-btn bag-icon" to="/cart"><ShoppingBag size={20}/>{count>0&&<i>{count}</i>}</Link>
          <button className="icon-btn" onClick={()=>user?navigate('/profile'):setLoginOpen(true)}>{user?<span className="avatar">{user.name[0]}</span>:<UserRound size={20}/>}</button>
          <button className="icon-btn menu-btn" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
        </div>
      </header>
      {search&&<SearchDialog onClose={()=>setSearch(false)}/>}
    </>
  );
}

export function SearchDialog({onClose}:{onClose:()=>void}){
  const [q,setQ]=useState('');
  const navigate=useNavigate();
  const {catalog}=useStore() as any;
  return (
    <Modal title="Search" onClose={onClose}>
      <div className="search-dialog">
        <div className="search-input-wrap"><Search size={18}/><input autoFocus placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)}/><button onClick={onClose}><X size={18}/></button></div>
        <div className="search-results">
          {(catalog||[]).filter((p:any)=>p.name?.toLowerCase().includes(q.toLowerCase())).slice(0,6).map((p:any)=><button key={p.id} onClick={()=>{navigate(`/product/${p.id}`); onClose();}}>{p.name}</button>)}
        </div>
      </div>
    </Modal>
  );
}

export function Footer(){
  return (
    <footer>
      <div className="footer-top container">
        <div className="footer-brand">
          <Link to="/" className="wordmark" style={{display:'flex',alignItems:'center', marginBottom:'12px'}}>
            <img src="/racan-logo.png" alt="RACAN" style={{height:'40px', width:'auto', display:'block'}} />
          </Link>
          <p>A little discovery. A lot of you.</p>
        </div>
      </div>
      <div className="footer-bottom container"><span>© {new Date().getFullYear()} RACAN</span></div>
    </footer>
  );
}

export function MobileNavigation(){
  return (
    <nav className="mobile-nav">
      {[
        ['/','Home',House],
        ['/gen-z','Explore',Compass],
        ['/reels','Reels',Clapperboard],
        ['/wishlist','Wishlist',Heart],
        ['/profile','Profile',UserRound]
      ].map(([to,label,Icon]:any)=><NavLink key={to as string} to={to as string} className="mobile-nav-link"><Icon size={20}/><span>{label as string}</span></NavLink>)}
    </nav>
  );
}
