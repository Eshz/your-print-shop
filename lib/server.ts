import 'server-only';
import {cookies} from 'next/headers';
import {randomUUID} from 'node:crypto';
import {mkdir,writeFile,readFile,unlink,rename} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type {templates} from './templates';
type DrawingTemplate=typeof templates[number];
const root=process.env.PRIVATE_STORAGE_PATH||path.join(process.cwd(),'.private');
export async function session(){const c=await cookies();let id=c.get('lm_session')?.value;if(!id||!/^[a-f0-9-]{36}$/.test(id)){id=randomUUID();c.set('lm_session',id,{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',maxAge:86400});}return id;}
export interface PrivateStorage {put(owner:string,id:string,data:Buffer):Promise<void>;get(owner:string,id:string):Promise<Buffer>;delete(owner:string,id:string):Promise<void>}
const safe=(s:string)=>{if(!/^[a-f0-9-]{36}$/.test(s))throw Error('Invalid identifier');return s;};
export const storage:PrivateStorage={async put(owner,id,data){const dir=path.join(root,safe(owner));await mkdir(dir,{recursive:true,mode:0o700});await writeFile(path.join(dir,safe(id)),data,{mode:0o600});},async get(owner,id){return readFile(path.join(root,safe(owner),safe(id)));},async delete(owner,id){await unlink(path.join(root,safe(owner),safe(id)));try{await unlink(path.join(root,safe(owner),safe(id)+'.check.json'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;}}};
export async function normalizeImage(bytes:Buffer){return sharp(bytes,{limitInputPixels:25_000_000}).rotate().resize(1800,1800,{fit:'inside',withoutEnlargement:true}).jpeg({quality:90}).toBuffer();}
export type GenerationJob={id:string;uploadId:string;status:'queued'|'processing'|'demo_ready'|'ready'|'failed';provider:string;createdAt:string;templateId:string};
export interface ArtworkProvider {generate(uploadId:string,template:DrawingTemplate):Promise<GenerationJob>}
// Replace with a durable queue/provider adapter before enabling real generation.
export const artworkProvider:ArtworkProvider={async generate(uploadId,template){return {id:randomUUID(),uploadId,templateId:template.id,status:'demo_ready',provider:'original-drawing-demo',createdAt:new Date().toISOString()};}};
export interface MockupRenderer {render(uploadId:string,productId:string):{imageUrl:string;productId:string;demo:boolean}}
export const mockupRenderer:MockupRenderer={render:(id,productId)=>({imageUrl:`/api/uploads/${id}`,productId,demo:true})};

const artworkPath=(owner:string,id:string)=>path.join(root,safe(owner),safe(id)+'.artwork.png');
async function removeIfPresent(file:string){
  try{await unlink(file);}catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;}
}
export async function deleteDrawing(owner:string,id:string){
  await storage.delete(owner,id);
  await removeIfPresent(artworkPath(owner,id));
}
export async function readArtwork(owner:string,id:string){
  await storage.get(owner,id);
  return readFile(artworkPath(owner,id));
}
export async function saveArtwork(owner:string,id:string,image:Buffer,signal:AbortSignal){
  const target=artworkPath(owner,id);
  const temporary=target+'.'+randomUUID();
  try{
    await writeFile(temporary,image,{mode:0o600});
    signal.throwIfAborted();
    await storage.get(owner,id);
    await rename(temporary,target);
    try{await storage.get(owner,id);}catch(error){await removeIfPresent(target);throw error;}
  }finally{await removeIfPresent(temporary);}
}

// Cache only actual vision decisions for immutable uploads; outages/unconfigured results stay retryable.
export async function validateUpload(owner:string,id:string){
 const {createDrawingValidator}=await import('./drawing-validation');
 const {createHash}=await import('node:crypto');
 const config={url:process.env.DRAWING_VALIDATION_URL,key:process.env.DRAWING_VALIDATION_KEY};
 const configId=createHash('sha256').update(config.url||'unconfigured').digest('hex');
 const recordPath=path.join(root,safe(owner),safe(id)+'.check.json');
 const image=await storage.get(owner,id);
 if(config.url&&config.key){try{const record=JSON.parse(await readFile(recordPath,'utf8'));if(record.configId===configId&&record.check.source==='vision'&&Date.now()-Date.parse(record.check.checkedAt)<3600000)return record.check as import('./drawing-validation').DrawingCheck;}catch{/* Cache misses and expired checks are re-evaluated. */}}
 const check=await createDrawingValidator(config).check(image);
 if(check.source==='vision')await writeFile(recordPath,JSON.stringify({configId,check}),{mode:0o600});
 return check;
}
