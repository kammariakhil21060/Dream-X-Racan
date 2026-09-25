import {db,migrate,transaction,close} from './db/index.ts';
import {brands,products,reels,categories} from '../shared/catalog.ts';
import {hash} from 'bcryptjs';
import {randomBytes} from 'node:crypto';
export async function seed(){
 await migrate();
 if((await db.query('SELECT id FROM users LIMIT 1')).rows.length)return;
 if(process.env.NODE_ENV==='production'&&!process.env.SEED_PASSWORD)throw new Error('Set SEED_PASSWORD for initial setup');
 const password=process.env.SEED_PASSWORD||randomBytes(18).toString('base64url');
 const digest=await hash(password,12);
 await transaction(async tx=>{
  for(const [id,name,role] of [['demo-user','Ananya Sharma','USER'],['demo-seller','Meera Kapoor','SELLER'],['demo-admin','RACAN Studio','ADMIN'],['demo-seller-2','Isha Rao','SELLER']]){
   await tx.query('INSERT INTO users(id,email,password_hash,name,role) VALUES($1,$2,$3,$4,$5)',[id,`${id.replace('demo-','')}@racan.local`,digest,name,role]);
   await tx.query('INSERT INTO profiles(user_id,bio) VALUES($1,$2)',[id,'Finding beauty in the everyday.']);
  }
  await tx.query("INSERT INTO admin_users VALUES('demo-admin')");
  for(const c of categories.filter(c=>c!=='All'))await tx.query('INSERT INTO categories(name) VALUES($1)',[c]);
  for(const [i,b] of brands.entries())await tx.query('INSERT INTO brands(id,owner_id,name,tagline,description,category,color,ink,verified,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,true,\'approved\')',[b.id,i%2?'demo-seller':'demo-seller-2',b.name,b.tagline,'An independent Indian label creating thoughtful pieces for your everyday. Discover beautiful design, considered materials, and the people behind every piece.',b.category,b.color,b.ink]);
  for(const p of products){
   await tx.query('INSERT INTO products(id,brand_id,name,description,category,price,original_price,image,badge,audience,rating,status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)',[p.id,p.brand_id,p.name,p.description,p.category,p.price,p.original_price,p.image,p.badge,p.audience,p.rating,p.status]);
   await tx.query('INSERT INTO product_images(id,product_id,url) VALUES($1,$2,$3)',[`img-${p.id}`,p.id,p.image]);
   for(const size of p.sizes)for(const color of p.colors){const id=`${p.id}-${size}-${color}`;await tx.query('INSERT INTO product_variants(id,product_id,sku,size,color) VALUES($1,$2,$1,$3,$4)',[id,p.id,size,color]);await tx.query('INSERT INTO inventory(variant_id,quantity) VALUES($1,20)',[id]);}
  }
  for(const r of reels)await tx.query('INSERT INTO reels(id,brand_id,product_id,caption,image,video,creator,likes,views) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)',[r.id,r.brand_id,r.product_id,r.caption,r.image,r.video,r.creator,r.likes,r.views]);
  for(const [id,name,price,pl,rl,features] of [['free','Free',0,25,5,['Your own brand storefront','25 product listings','5 shoppable Reels']],['premium','Premium',null,150,40,['150 product listings','40 shoppable Reels','Featured placement eligibility','Audience insights']],['pro','Pro',null,1000,200,['1,000 product listings','200 shoppable Reels','Advanced analytics','Priority support']]])await tx.query('INSERT INTO premium_plans VALUES($1,$2,$3,$4,$5,$6)',[id,name,price,pl,rl,JSON.stringify(features)]);
  await tx.query("INSERT INTO advertisements(id,title,description,image,target_url,placement,status) VALUES('ad1','Find your kind of beautiful.','Independent brands. Fresh perspectives. A style that feels like you.','/images/hero.jpg','/women','Landing Top','Active'),('ad2','A little bold. Entirely you.','Meet the next generation of style.','/images/street.jpg','/gen-z','Landing Top','Active'),('ad3','Good things come from her.','Discover the women building something beautiful.','/images/ethnic.jpg','/brands','Landing Middle','Active')");
  await tx.query("INSERT INTO settings VALUES('platform','{\"name\":\"RACAN\",\"shipping\":99,\"freeShippingThreshold\":2999}')");
 });
 console.log('Seeded RACAN: 12 brands, 36 products, 12 Reels.');
 if(!process.env.SEED_PASSWORD)console.log(`Local seed password (all *@racan.local accounts): ${password}`);
}
if(process.argv[1]?.endsWith('seed.ts')){await seed();await close();}
