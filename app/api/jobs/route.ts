import {NextResponse} from 'next/server';
import {artworkProvider,mockupRenderer,session,validateUpload} from '@/lib/server';
import {canPreview} from '@/lib/drawing-validation';
import {findTemplate} from '@/lib/templates';
export async function POST(req:Request){try{const {uploadId,templateId,unverifiedDemo}=await req.json();const template=findTemplate(templateId);if(!template)return NextResponse.json({error:'Choose a drawing template first.'},{status:400});const check=await validateUpload(await session(),uploadId);if(!canPreview(check,unverifiedDemo===true))return NextResponse.json({check,error:'Please check your drawing before creating a preview.'},{status:422});return NextResponse.json({job:await artworkProvider.generate(uploadId,template),mockup:mockupRenderer.render(uploadId,template.productId),check,templateId:template.id});}catch{return NextResponse.json({error:'Your drawing is unavailable. Please upload it again.'},{status:400});}}
