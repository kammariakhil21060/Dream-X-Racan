import {randomUUID} from 'node:crypto';
import {db} from '../db/index.ts';
import {assert} from '../lib/errors.ts';
export interface StorageService {upload(owner:string,data:Buffer,mime:string):Promise<string>;get(id:string):Promise<{data:Buffer;mime:string}|undefined>;delete(id:string,owner:string):Promise<void>}
export class PostgreSQLStorageService implements StorageService {
 async upload(owner:string,data:Buffer,mime:string){const video=mime.startsWith('video/');assert(data.length<=(video?25:5)*1024*1024,400,video?'Videos must be 25 MB or smaller':'Images must be 5 MB or smaller');const valid=(mime==='image/jpeg'&&data[0]===255&&data[1]===216&&data[2]===255)||(mime==='image/png'&&data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))||(mime==='image/webp'&&data.subarray(0,4).toString()==='RIFF'&&data.subarray(8,12).toString()==='WEBP')||(mime==='video/mp4'&&data.subarray(4,8).toString()==='ftyp')||(mime==='video/webm'&&data.subarray(0,4).equals(Buffer.from([26,69,223,163])));assert(valid,400,'Upload a valid JPEG, PNG, WebP, MP4, or WebM file');const id=randomUUID();await db.query('INSERT INTO media(id,owner_id,mime,data) VALUES($1,$2,$3,$4)',[id,owner,mime,data]);return `/api/media/${id}`;}
 async get(id:string){const r=(await db.query('SELECT data,mime FROM media WHERE id=$1',[id])).rows[0];return r?{data:Buffer.from(r.data),mime:r.mime}:undefined;}
 async delete(id:string,owner:string){await db.query('DELETE FROM media WHERE id=$1 AND owner_id=$2',[id,owner]);}
}
export const storage=new PostgreSQLStorageService();
