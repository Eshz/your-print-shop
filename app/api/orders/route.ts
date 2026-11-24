import {NextResponse} from 'next/server';
export async function POST(){return NextResponse.json({status:'configuration_required',error:'Online ordering is not open yet. No payment has been taken. Your bag is saved for this visit.'},{status:503});}
