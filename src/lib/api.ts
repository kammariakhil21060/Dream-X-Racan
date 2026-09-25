export async function api<T=any>(url:string,options:RequestInit={}):Promise<T>{const res=await fetch(`/api${url}`,{...options,headers:{'Content-Type':'application/json',...options.headers},credentials:'same-origin'});const data=await res.json();if(!res.ok)throw new Error(data.error||'Something went wrong');return data;}
export const send=(url:string,data:unknown={},method='POST')=>api(url,{method,body:JSON.stringify(data)});
export const money=(value:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
