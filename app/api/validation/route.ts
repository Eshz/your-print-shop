import {NextResponse} from 'next/server';
import {session,validateUpload} from '@/lib/server';
export async function POST(req:Request){try{const {uploadId}=await req.json();const result=await validateUpload(await session(),uploadId);return NextResponse.json({check:result},{headers:{'Cache-Control':'private, no-store'}});}catch{return NextResponse.json({error:'Your drawing is unavailable. Please upload it again.'},{status:400});}}
