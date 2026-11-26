'use client';
import {useState} from 'react';
import {ProductReveal} from './product-reveal';
import {ProductStudio,type GiftSelection,type GiftStudioDraft} from './product-studio';
import {money,total} from '@/lib/products';
export function ProductFlowStates(){
 const [draft,setDraft]=useState<GiftStudioDraft|null>(null);
 const [stage,setStage]=useState<'reveal'|'studio'|'bag'>('reveal'),[lang,setLang]=useState<'en'|'he'>('en'),[coupon,setCoupon]=useState(''),[items,setItems]=useState<GiftSelection[]>([]);
 const result={imageUrl:'/catalog/ceramic-mug.webp',demo:true},totals=total(items.map(i=>({productId:i.productId,quantity:1})),coupon);
 return <><div className="processing-qa-controls"><b>DEVELOPMENT FIXTURE</b><span>Catalog example. No upload, generation or order.</span><button onClick={()=>setLang(lang==='en'?'he':'en')}>{lang==='en'?'עברית':'English'}</button><button onClick={()=>setStage('reveal')}>Reveal</button><button onClick={()=>setStage('studio')}>Gift gallery</button></div>
 {stage==='reveal'?<ProductReveal result={result} productId="ceramic-mug" lang={lang} onChoose={()=>setStage('studio')} onDelete={()=>setStage('reveal')}/>:stage==='studio'?<ProductStudio result={result} initialDraft={draft} onDraftChange={setDraft} lang={lang} coupon={coupon} offerKey="lm-qa-product-offer-seen" onCoupon={()=>setCoupon('HELLO10')} onBack={()=>setStage('reveal')} onAdd={next=>{setItems(next);setStage('bag');}}/>:<section className="qa-gift-bag"><h1>QA bag</h1><p role="status">{items.length} gifts added</p>{items.map(i=><p key={i.productId}>{i.productId} · {i.variant}</p>)}<p>Subtotal: {money(totals.subtotal)}</p><p>Discount: {money(totals.discount)}</p><p>Delivery: {money(totals.shipping)}</p><b>Total: {money(totals.total)}</b><button className="button primary" onClick={()=>setStage('studio')}>Back to gifts</button></section>}
 </>;
}
