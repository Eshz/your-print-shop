'use client';
/* eslint-disable @next/next/no-img-element */
import {useEffect,useRef,type CSSProperties} from 'react';
import {Button} from './ui/button';
import type {ProductId} from '@/lib/products';

export type ArtworkAppearance={background:string;border:number};
export type PreviewResult={imageUrl:string;demo:boolean};
export function DrawingProductScene({imageUrl,productId='stickers',lang='en',appearance}:{imageUrl:string;productId?:ProductId;lang?:'en'|'he';appearance?:ArtworkAppearance}){
  const cushion=productId==='cushion',magnets=productId==='magnets';
  return <div className={`drawing-product-scene scene-${productId}`} style={appearance?{'--art-paper':appearance.background,'--art-border':`${appearance.border}%`} as CSSProperties:undefined} role="img" aria-label={lang==='he'?'הדמיית מוצר עם הציור המקורי שלכם':'Demo product layout using your original drawing'}>
    <div className={`drawing-product ${cushion?'drawing-cushion':magnets?'drawing-story-board':productId==='pajamas'?'drawing-garment':'drawing-sheet'}`}>
      {productId==='pajamas'?<><div className="garment-shirt"><img src={imageUrl} alt=""/></div><div className="garment-pants"><span/><span/></div></>:magnets?<div className="drawing-story-pieces">{[0,1,2,3].map(i=><div key={i}><img src={imageUrl} alt=""/></div>)}</div>:<img src={imageUrl} alt=""/>}
    </div>
  </div>;
}
export function ProductReveal({result,productId,lang='en',onChoose,onDelete,busy=false}:{result:PreviewResult;productId:ProductId;lang?:'en'|'he';onChoose:()=>void;onDelete:()=>void;busy?:boolean}){
  const title=useRef<HTMLHeadingElement>(null),he=lang==='he';
  useEffect(()=>{title.current?.focus();},[]);
  return <section className="product-reveal" dir={he?'rtl':'ltr'} aria-labelledby="product-reveal-title">
    <h2 ref={title} tabIndex={-1} id="product-reveal-title">{result.demo?(he?'ההדמיה שלכם מוכנה':'Your demo is ready'):(he?'העיצוב שלכם מוכן':'Your design is ready')}</h2>
    {result.demo&&<p className="reveal-subtitle">{he?'הציור המקורי שלכם, בהדמיית מוצר.':'Your original drawing, shown on a product.'}</p>}
    <div className="product-reveal-visual">{result.demo?<DrawingProductScene imageUrl={result.imageUrl} productId={productId} lang={lang}/>:<img src={result.imageUrl} alt={he?'הדמיית המוצר שנוצרה מהציור שלכם':'Product preview created from your uploaded drawing'}/>}</div>
    <Button className="reveal-choose" onClick={onChoose}>{he?'בוחרים את המתנה שלהם':'Choose their gift'}</Button>
    <details className="reveal-details"><summary>{he?'על התצוגה והציור שלכם':'About your preview'}</summary><p>{result.demo?(he?'זו פריסה לדוגמה עם התמונה המקורית. לא נוצרה יצירה חדשה וזו לא הדמיית ייצור.':'This demo places your original photo on a product layout. It is not generated artwork or a production proof.'):(he?'התצוגה נוצרה מהציור שהעליתם. בדקו את הפרטים לפני בחירת המוצר.':'This preview was created from your uploaded drawing. Check the details before choosing a product.')}</p><button disabled={busy} onClick={onDelete}>{he?'מחיקת הציור':'Delete drawing'}</button></details>
  </section>;
}
