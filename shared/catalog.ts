export const categories = ['All','Dresses','Ethnic Wear','Tops','Bags','Jewellery','Footwear','Beauty','Accessories'];
export const brands = [
 {id:'suta',name:'suta',tagline:'Stories woven with love',category:'Ethnic Wear',color:'#f4ede6',ink:'#765741'},
 {id:'summer',name:'SUMMER',tagline:'Made for slow Sundays',category:'Dresses',color:'#e9efdf',ink:'#566444'},
 {id:'the-label-life',name:'THE LABEL LIFE',tagline:'Considered. Effortless. You.',category:'Tops',color:'#f0e8e4',ink:'#4e3c34'},
 {id:'okhai',name:'okhai',tagline:'Handmade, with heart',category:'Ethnic Wear',color:'#f8eee1',ink:'#965330'},
 {id:'nori',name:'nori.',tagline:'A little out of the ordinary',category:'Bags',color:'#e5e8f2',ink:'#505b7a'},
 {id:'palmonas',name:'PALMONAS',tagline:'Everyday, a little golden',category:'Jewellery',color:'#f0e8dd',ink:'#705b3a'},
 {id:'house-of-soi',name:'HOUSE OF SOI',tagline:'For your everyday rituals',category:'Beauty',color:'#f5e4e3',ink:'#a15362'},
 {id:'sole-story',name:'sole story',tagline:'Go your own way',category:'Footwear',color:'#e7ebe2',ink:'#59634e'},
 {id:'not-so-basic',name:'not so basic',tagline:'Dress like yourself',category:'Tops',color:'#f5dfea',ink:'#9c3d6a'},
 {id:'maati',name:'maati',tagline:'Rooted in the earth',category:'Dresses',color:'#e9dfd2',ink:'#7a5c43'},
 {id:'aarika',name:'AARIKA',tagline:'Little things, beautifully made',category:'Accessories',color:'#ede5f1',ink:'#806689'},
 {id:'truebrowns',name:'trueBrowns',tagline:'Tradition in a new light',category:'Ethnic Wear',color:'#e9dddb',ink:'#78504c'}
];
export const imageSources: Record<string,string> = {
 hero:'photo-1539109136881-3be0616acf4b',dress:'photo-1515372039744-b8f02a3ae446',pink:'photo-1483985988355-763728e1935b',women:'photo-1483985988355-763728e1935b',linen:'photo-1534528741775-53994a69daeb',street:'photo-1483985988355-763728e1935b',bag:'photo-1584917865442-de89df76afd3',jewel:'photo-1611652022419-a9419f74343d',shoes:'photo-1543163521-1bf539c55dd2',beauty:'photo-1596462502278-27bfdc403348',ethnic:'photo-1610030469983-98e550d6193c',top:'photo-1551803091-e20673f15770',portrait:'photo-1531123897727-8f129e1688ce',look:'photo-1483985988355-763728e1935b'};
const styles = [
 ['The Sunday Linen Dress','summer','Dresses',2490,'dress','Bestseller'],
 ['Everyday Mini Shoulder Bag','nori','Bags',1890,'bag','New drop'],
 ['Golden Hour Hoop Earrings','palmonas','Jewellery',1299,'jewel','Trending'],
 ['The Everyday Cotton Co-ord','the-label-life','Tops',3290,'top','Editor’s pick'],
 ['Wildflower Handwoven Saree','suta','Ethnic Wear',4250,'ethnic','Handcrafted'],
 ['Soft Steps Slingback Heels','sole-story','Footwear',2190,'shoes','New drop'],
 ['Dewy Days Essentials','house-of-soi','Beauty',1490,'beauty','Bestseller'],
 ['The City Girl Blazer','not-so-basic','Tops',2890,'street','Trending'],
 ['Meadow Cotton Midi','maati','Dresses',2790,'dress','Conscious'],
 ['The Weekend Tote','aarika','Accessories',1590,'bag','New drop'],
 ['Blockprint Summer Kurta','okhai','Ethnic Wear',2650,'ethnic','Handcrafted'],
 ['Earthtone Wrap Set','truebrowns','Ethnic Wear',3890,'top','Editor’s pick']
] as const;
export const products = Array.from({length:36},(_,i)=>{const s=styles[i%12];return {id:`p${i+1}`,name:(i<12?'':i<24?'Classic ':'Signature ')+s[0],brand_id:s[1],category:s[2],price:s[3]+Math.floor(i/12)*200,original_price:Math.round((s[3]+Math.floor(i/12)*200)*1.25),image:`/images/${s[4]}.jpg`,badge:s[5],audience:i%3===0?'gen-z':'women',rating:4.6+(i%4)/10,description:'Thoughtfully made for the moments that make you, you. Beautiful details, an effortless silhouette, and a little everyday joy. Designed in India by an independent label.',status:'published',sizes:['Bags','Jewellery','Beauty','Accessories'].includes(s[2])?['One size']:['XS','S','M','L','XL'],colors:['Natural','Rose','Black']};});
export const reels = Array.from({length:12},(_,i)=>({id:`r${i+1}`,brand_id:products[i].brand_id,product_id:products[i].id,caption:['Your next everyday favourite ✨','One look, so many possibilities.','A little golden hour magic.','Get ready with us. Your way.'][i%4],image:products[[0,7,3,4,8,1,2,5,6,9,10,11][i]].image,video:'/videos/fashion.mp4',creator:['Ananya','Isha','Meera','Riya'][i%4],likes:128+i*79,views:2100+i*1360}));
export type Product = typeof products[number];
export type Brand = typeof brands[number];
export type Reel = typeof reels[number];
