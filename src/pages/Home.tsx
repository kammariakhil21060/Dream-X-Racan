import { useState } from 'react';
import { BannerCarousel } from '../components/BannerCarousel';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Play, Sparkles, Heart, Pause, MoreHorizontal } from 'lucide-react';
import { useStore } from '../lib/store';
import { BrandCard, ProductCard, ReelCard, SectionHead } from '../components/ui';

export default function Home(){
  const {catalog}=useStore();
  const [filter,setFilter]=useState('For you');
  const ads=catalog.ads.filter((a:any)=>a.placement==='Landing');

  return (
  <main>
    <BannerCarousel ads={ads}/>
    
    {/* Gen Z - Pink */}
    <section className="category-strip container" style={{backgroundColor:'#FCE4EC', borderRadius:'20px', padding:'24px', marginTop:'20px'}}>
      {/* categories code */}
      <span className="eyebrow" style={{color:'#E91E63'}}>GEN Z</span>
      <h2 style={{color:'#880E4F'}}>For the Bold</h2>
    </section>

    {/* Women - Beige */}
    <section className="brand-cta container" style={{backgroundColor:'#F5F1E8', borderRadius:'20px', padding:'24px', marginTop:'20px'}}>
      <span className="eyebrow" style={{color:'#5D4037'}}>WOMEN</span>
      <h2 style={{color:'#3E2723'}}>Add your brand.</h2>
      <p>Showcase your work, tell your story</p>
    </section>

    <section className="worlds container"><div className="worlds-intro"><span className="eyebrow">TWO WORLDS. ENDLESS POSSIBILITIES.</span><h2>Your style,<br/><em>Your way</em></h2></div></section>
    <section className="section container"><SectionHead eyebrow="THE NAMES YOU'LL WANT TO KNOW" title="Small brands. Big love." subtitle="Independent labels, beautiful finds" /></section>
  </main>
  );
}
