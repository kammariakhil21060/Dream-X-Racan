import 'dotenv/config';
import { PGlite } from '@electric-sql/pglite';
import pg from 'pg';
import { readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
export interface DB { query<T extends pg.QueryResultRow=any>(sql:string,params?:any[]):Promise<{rows:T[]}> }
const production=process.env.NODE_ENV==='production';
if(production&&!process.env.DATABASE_URL&&!process.env.VERCEL) throw new Error('DATABASE_URL is required in production');
let embedded:PGlite|undefined;
const pool=process.env.DATABASE_URL?new pg.Pool({connectionString:process.env.DATABASE_URL}):undefined;
if(!pool){
 const dataDir=process.env.DATA_DIR||(process.env.VERCEL?'/tmp/racan':'.data/racan');
 if(!process.env.VERCEL)mkdirSync('.data',{recursive:true});
 embedded=new PGlite(dataDir);
}
// Serialize access to the embedded single connection, including complete transactions.
let queue:Promise<unknown>=Promise.resolve();
function serialized<T>(fn:()=>Promise<T>):Promise<T>{const next=queue.then(fn,fn);queue=next.catch(()=>{});return next;}
export const db:DB={query:async<T extends pg.QueryResultRow=any>(sql:string,params:any[]=[])=>pool?pool.query<T>(sql,params):serialized(()=>embedded!.query<T>(sql,params))};
export async function transaction<T>(fn:(tx:DB)=>Promise<T>):Promise<T>{
 if(embedded)return serialized(()=>embedded!.transaction(tx=>fn(tx as DB)));
 const client=await pool!.connect();try{await client.query('BEGIN');const result=await fn(client);await client.query('COMMIT');return result;}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
}
export async function migrate(){const schemaPath=process.env.VERCEL?path.resolve(process.cwd(),'server/db/schema.sql'):new URL('./schema.sql',import.meta.url);const sql=readFileSync(schemaPath,'utf8');if(embedded)await embedded.exec(sql);else await pool!.query(sql);}
export async function close(){if(pool)await pool.end();else await embedded!.close();}
