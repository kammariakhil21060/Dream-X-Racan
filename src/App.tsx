import {lazy,Suspense,useEffect,Component,type ReactNode} from 'react';
import {Routes,Route,useLocation} from 'react-router-dom';
import {Header,Footer,MobileNavigation} from './components/Layout';
import {Loading,Empty} from './components/ui';
import {AuthDialog,ResetPassword} from './pages/Auth';
import {useStore} from './lib/store';
const Home=lazy(()=>import('./pages/Home'));
const Product=lazy(()=>import('./pages/Product'));
const Reels=lazy(()=>import('./pages/Reels'));
const Creator=lazy(()=>import('./pages/Creator'));
const Dashboard=lazy(()=>import('./pages/Dashboard'));
const Info=lazy(()=>import('./pages/Info'));
import {Explore,Brands,BrandProfile,Wishlist} from './pages/Discovery';
import {Cart,Checkout,Orders,Profile} from './pages/Shopping';
class ErrorBoundary extends Component<{children:ReactNode},{error:boolean}>{state={error:false};static getDerivedStateFromError(){return {error:true};}render(){return this.state.error?<div className="error-page"><h2>A little pause.</h2><p>Something didn’t load as expected. Please refresh to try again.</p><button className="btn" onClick={()=>location.reload()}>Try again</button></div>:this.props.children;}}
export default function App(){const {ready,catalog}=useStore();const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0);const p=catalog.products.find((p:any)=>pathname===`/product/${p.id}`),b=catalog.brands.find((b:any)=>pathname===`/brand/${b.id}`);document.title=p?`${p.name} — RACAN`:b?`${b.name} — Discover on RACAN`:pathname==='/'?'RACAN — Find your kind of beautiful':`${pathname.split('/').filter(Boolean).map(w=>w.replace(/-/g,' ')).join(' · ')} — RACAN`;},[pathname,catalog]);return <ErrorBoundary><Header/>{!ready?<Loading/>:<Suspense fallback={<Loading/>}><Routes><Route path="/" element={<Home/>}/><Route path="/gen-z" element={<Explore audience="gen-z"/>}/><Route path="/women" element={<Explore audience="women"/>}/><Route path="/explore" element={<Explore/>}/><Route path="/brands" element={<Brands/>}/><Route path="/brand/:id" element={<BrandProfile/>}/><Route path="/product/:id" element={<Product/>}/><Route path="/reels" element={<Reels/>}/><Route path="/creator/:id" element={<Creator/>}/><Route path="/wishlist" element={<Wishlist/>}/><Route path="/cart" element={<Cart/>}/><Route path="/checkout" element={<Checkout/>}/><Route path="/orders" element={<Orders/>}/><Route path="/profile" element={<Profile/>}/><Route path="/reset-password" element={<ResetPassword/>}/><Route path="/seller/dashboard" element={<Dashboard/>}/><Route path="/admin" element={<Dashboard admin/>}/><Route path="/about" element={<Info page="about"/>}/><Route path="/help" element={<Info page="help"/>}/><Route path="/privacy" element={<Info page="privacy"/>}/><Route path="*" element={<Empty title="A little off the beaten path." description="This page doesn’t exist, but your next favourite might be just around the corner." to="/" label="Back to discovering"/>}/></Routes></Suspense>}{pathname!=='/reels'?<Footer/>:<MobileNavigation/>}<AuthDialog/></ErrorBoundary>;}
