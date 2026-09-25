import {createContext,useContext,useState,useEffect,useCallback,type ReactNode} from 'react';
import {api,send} from './api';
type User={id:string;name:string;email:string;role:string};
type State={user:User|null;ready:boolean;catalog:any;cart:any[];my:any;config:any;toast:(message:string)=>void;refresh:()=>Promise<void>;refreshCatalog:()=>Promise<void>;authenticate:(user:User|null)=>Promise<void>;wishlist:(id:string)=>Promise<void>;follow:(id:string)=>Promise<void>;addCart:(variant:string,quantity?:number)=>Promise<void>;updateCart:(variant:string,quantity:number)=>Promise<void>;social:(id:string,action:'like'|'save')=>Promise<void>;needLogin:()=>boolean;loginOpen:boolean;setLoginOpen:(v:boolean)=>void};
const Context=createContext<State>(null!);
export const useStore=()=>useContext(Context);
export function Store({children}:{children:ReactNode}){
 const [user,setUser]=useState<User|null>(null),[ready,setReady]=useState(false),[catalog,setCatalog]=useState<any>({products:[],brands:[],reels:[],ads:[],plans:[]}),[cart,setCart]=useState<any[]>([]),[my,setMy]=useState<any>({wishlist:[],following:[],likes:[],saved:[],notifications:[]}),[config,setConfig]=useState<any>({shipping:99,freeShippingThreshold:2999}),[loginOpen,setLoginOpen]=useState(false),[message,setMessage]=useState('');
 const toast=useCallback((m:string)=>setMessage(m),[]);
 useEffect(()=>{if(!message)return;const t=setTimeout(()=>setMessage(''),4200);return()=>clearTimeout(t);},[message]);
 const refresh=useCallback(async()=>{try{const [c,m]=await Promise.all([api('/cart'),api('/my')]);setCart(c);setMy(m);}catch{setCart([]);setMy({wishlist:[],following:[],likes:[],saved:[],notifications:[]});}},[]);
 const refreshCatalog=useCallback(async()=>setCatalog(await api('/catalog')),[]);
 useEffect(()=>{Promise.all([api('/auth/me'),api('/catalog'),api('/config')]).then(([u,c,f])=>{setUser(u);setCatalog(c);setConfig(f);if(u)void refresh();}).catch(e=>toast(e.message)).finally(()=>setReady(true));},[refresh,toast]);
 async function authenticate(u:User|null){setUser(u);setLoginOpen(false);if(u)await refresh();else{setCart([]);setMy({wishlist:[],following:[],likes:[],saved:[],notifications:[]});}}
 function needLogin(){if(!user){setLoginOpen(true);return true;}return false;}
 async function wishlist(id:string){if(needLogin())return;try{const active=!my.wishlist.includes(id);await send(`/wishlist/${id}`,{active},'PUT');await refresh();toast(active?'Saved to your wishlist':'Removed from your wishlist');}catch(e:any){toast(e.message);}}
 async function follow(id:string){if(needLogin())return;try{const active=!my.following.includes(id);await send(`/follow/${id}`,{active},'PUT');await refresh();toast(active?'You’re now following this brand':'Brand unfollowed');}catch(e:any){toast(e.message);}}
 async function updateCart(variant_id:string,quantity:number){if(needLogin())return;await send('/cart',{variant_id,quantity},'PUT');await refresh();}
 async function addCart(variant:string,quantity=1){if(needLogin())return;try{const old=cart.find(x=>x.variant_id===variant);await updateCart(variant,(old?.quantity||0)+quantity);toast('A little something added to your bag');}catch(e:any){toast(e.message);}}
 async function social(id:string,action:'like'|'save'){if(needLogin())return;try{await send(`/reels/${id}/${action}`,{active:!my[action==='like'?'likes':'saved'].includes(id)},'PUT');await refresh();await refreshCatalog();}catch(e:any){toast(e.message);}}
 return <Context.Provider value={{user,ready,catalog,cart,my,config,toast,refresh,refreshCatalog,authenticate,wishlist,follow,addCart,updateCart,social,needLogin,loginOpen,setLoginOpen}}>{children}{message&&<div className="toast" role="status"><span>✦</span>{message}<button aria-label="Dismiss notification" onClick={()=>setMessage('')}>×</button></div>}</Context.Provider>;
}
