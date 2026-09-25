import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import {rateLimit} from 'express-rate-limit';
import path from 'node:path';
import {ZodError} from 'zod';
import {seed} from './seed.ts';
import {db} from './db/index.ts';
import {auth,identify,role} from './modules/auth.ts';
import {catalog} from './modules/catalog.ts';
import {social} from './modules/social.ts';
import {commerce} from './modules/commerce.ts';
import {management} from './modules/management.ts';
import {storage} from './modules/storage.ts';
import {HttpError} from './lib/errors.ts';
import {publicPage} from './lib/seo.ts';
if(process.env.VERCEL){
  if(process.env.DATABASE_URL) await (await import('./db/index')).migrate();
  else {
    // Vercel demo fallback: each warm function instance gets a small ephemeral
    // PostgreSQL database so the public sample catalog and Reels remain usable
    // before a hosted DATABASE_URL is configured.
    process.env.SEED_PASSWORD=process.env.SEED_PASSWORD||'racan-vercel-demo-password';
    await seed();
  }
} else {
  await seed();
}
export const app=express();
app.disable('x-powered-by');app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],imgSrc:["'self'",'data:'],mediaSrc:["'self'",'https:'],styleSrc:["'self'","'unsafe-inline'"],scriptSrc:["'self'"],connectSrc:["'self'"],fontSrc:["'self'"],upgradeInsecureRequests:process.env.NODE_ENV==='production'?[]:null}}}));
app.use(cookieParser());
app.use('/api',rateLimit({windowMs:60000,limit:300,standardHeaders:'draft-7',legacyHeaders:false}));
app.use('/api',(req,res,next)=>{if(!['GET','HEAD','OPTIONS'].includes(req.method)){const origin=req.get('origin');const allowed=process.env.NODE_ENV==='production'?[process.env.APP_ORIGIN]:['http://localhost:3000','http://127.0.0.1:3000','http://localhost:3001','http://127.0.0.1:3001'];if(origin&&!allowed.includes(origin))return res.status(403).json({error:'Request origin is not permitted'});if(!req.is('application/json'))return res.status(415).json({error:'JSON requests are required'});}next();});
app.use('/api',identify);
app.use('/api/upload',role('SELLER','ADMIN'),express.json({limit:'36mb'}));
app.use(express.json({limit:'1mb'}));
app.get('/api/health',async(_req,res)=>{await db.query('SELECT 1');res.json({status:'ok',mode:process.env.NODE_ENV==='production'?'production':'development'});});
app.get('/api/config',async(_req,res)=>res.json({development:process.env.NODE_ENV!=='production',paymentMode:process.env.PAYMENT_PROVIDER||'development',...(await db.query("SELECT value FROM settings WHERE key='platform'")).rows[0].value}));
app.get('/api/media/:id',async(req,res)=>{const file=await storage.get(req.params.id);if(!file)return res.status(404).end();res.set('Cache-Control','public,max-age=86400').set('Accept-Ranges','bytes').type(file.mime);const range=req.get('range');if(range){const match=/^bytes=(\d+)-(\d*)$/.exec(range);if(!match)return res.status(416).set('Content-Range',`bytes */${file.data.length}`).end();const start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),file.data.length-1):file.data.length-1;if(start>end||start>=file.data.length)return res.status(416).set('Content-Range',`bytes */${file.data.length}`).end();res.status(206).set('Content-Range',`bytes ${start}-${end}/${file.data.length}`).send(file.data.subarray(start,end+1));}else res.send(file.data);});
app.use('/api/auth',auth);app.use('/api',catalog);app.use('/api',management);app.use('/api',social);app.use('/api',commerce);
app.use('/api',(_req,res)=>res.status(404).json({error:'Endpoint not found'}));
app.get('/sitemap.xml',async(_req,res)=>{const origin=(process.env.APP_ORIGIN||'http://localhost:3000').replace(/\/$/,'');const urls=['/','/gen-z','/women','/brands',...(await db.query("SELECT id FROM products WHERE status='published' AND deleted_at IS NULL")).rows.map(p=>`/product/${p.id}`),...(await db.query("SELECT id FROM brands WHERE status='approved' AND deleted_at IS NULL")).rows.map(b=>`/brand/${b.id}`)];res.type('xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u=>`<url><loc>${origin}${u}</loc></url>`).join('')}</urlset>`);});
app.use(express.static(path.resolve('dist')));
app.get('/product/:id',publicPage);app.get('/brand/:id',publicPage);
app.get('/{*path}',(_req,res)=>res.sendFile(path.resolve('dist/index.html')));
app.use((err:any,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{if(err instanceof ZodError)return res.status(400).json({error:err.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')});if(err instanceof HttpError)return res.status(err.status).json({error:err.message});if(err.code==='23505')return res.status(409).json({error:'This record already exists'});if(err.code==='23503')return res.status(400).json({error:'The referenced item does not exist'});console.error(err);res.status(err.status===413?413:500).json({error:err.status===413?'Upload is too large':'Something went wrong. Please try again.'});});
if(!process.env.VERCEL) app.listen(Number(process.env.PORT||3001),'127.0.0.1',()=>console.log(`RACAN API ready at http://127.0.0.1:${process.env.PORT||3001}`));
export default app;
