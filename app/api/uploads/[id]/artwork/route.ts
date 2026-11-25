import {readArtwork,session} from '@/lib/server';

export async function GET(_: Request,{params}:{params:Promise<{id:string}>}){
  try{
    const {id}=await params;
    const image=await readArtwork(await session(),id);
    return new Response(new Uint8Array(image),{headers:{
      'Content-Type':'image/png',
      'Cache-Control':'private, no-store',
      'X-Content-Type-Options':'nosniff',
    }});
  }catch{return new Response('Not found',{status:404});}
}
