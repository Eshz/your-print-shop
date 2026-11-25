import {NextResponse} from 'next/server';
import {artworkProvider,mockupRenderer,saveArtwork,session,storage,validateUpload} from '@/lib/server';
import {generateArtwork,generationEnabled} from '@/lib/generated-artwork';
import {canPreview} from '@/lib/drawing-validation';
import {collection} from '@/lib/collection';
import {findTemplate} from '@/lib/templates';
export const maxDuration=300;
const activeGenerations=new Set<string>();

export async function POST(req:Request){
  try{
    const {uploadId,templateId,productId,unverifiedDemo,generate,providerConsent}=await req.json();
    const template=findTemplate(templateId);
    if(!template)return NextResponse.json({error:'Choose a drawing template first.'},{status:400});
    const giftId=productId??template.productId;
    if(giftId!==template.productId && !collection.some(p=>p.id===giftId))
      return NextResponse.json({error:'Choose an available gift.'},{status:400});
    if(generate===true && (!generationEnabled() || providerConsent!==true)){
      return NextResponse.json({error:'AI artwork requires an enabled provider and your permission.'},{status:403});
    }
    const owner=await session();
    const check=await validateUpload(owner,uploadId);
    if(generate===true ? check.status!=='drawing' : !canPreview(check,unverifiedDemo===true)){
      return NextResponse.json({check,error:'Please check your drawing before creating a preview.'},{status:422});
    }
    const job=await artworkProvider.generate(uploadId,template);
    const mockup=mockupRenderer.render(uploadId,giftId);
    if(generate===true){
      const key=owner+'/'+uploadId;
      if(activeGenerations.has(key))return NextResponse.json({error:'Artwork is already being prepared.'},{status:409});
      activeGenerations.add(key);
      try{
        const drawing=await storage.get(owner,uploadId);
        const artwork=await generateArtwork(drawing,template,req.signal,giftId);
        await saveArtwork(owner,uploadId,artwork,req.signal);
        return NextResponse.json({
          job:{...job,status:'ready',provider:'openai'},
          mockup:{...mockup,demo:false,imageUrl:`/api/uploads/${uploadId}/artwork`,originalUrl:mockup.imageUrl},
          check,templateId:template.id,
        });
      }catch{
        return NextResponse.json({error:'AI artwork could not be prepared. Try again or use the original-drawing demo.'},{status:502});
      }finally{activeGenerations.delete(key);}
    }
    return NextResponse.json({job,mockup,check,templateId:template.id});
  }catch{return NextResponse.json({error:'Your drawing is unavailable. Please upload it again.'},{status:400});}
}
