'use client';
/* eslint-disable @next/next/no-img-element */
import {useEffect,useRef,useState} from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {Check,ChevronLeft,ChevronRight,Eye,ImagePlus,Maximize,Palette,ShoppingBag,Shirt,Square,X} from 'lucide-react';
import {products,money,type ProductId} from '@/lib/products';
import {DrawingProductScene,type PreviewResult,type ArtworkAppearance} from './product-reveal';
import {Button} from './ui/button';
import {localize} from '@/lib/i18n';
export type GiftSelection={productId:ProductId;variant:string;customization:ArtworkAppearance&{size:string}};
export type GiftStudioDraft={selected:ProductId[];active:ProductId;appearance:ArtworkAppearance;size:string;sizes?:Partial<Record<ProductId,string>>};
type Panel='size'|'background'|'border'|'preview'|null;
const backgrounds=[{value:'#fffef9',en:'White',he:'לבן'},{value:'#f3e6cc',en:'Cream',he:'שמנת'},{value:'#243f35',en:'Green',he:'ירוק'}];
const borders=[{value:0,en:'None',he:'ללא'},{value:3,en:'Small',he:'קטן'},{value:7,en:'Medium',he:'בינוני'},{value:12,en:'Wide',he:'רחב'}];
const garmentSizes=['Age 2–3','Age 4–5','Age 6–7','Age 8–10'];
function sizeOptions(id:ProductId) {
 if(id==='pajamas'||id==='youth-tee')return garmentSizes;
 if(id==='adult-tee'||id==='crewneck'||id==='hoodie')return ['XS','S','M','L','XL','2XL'];
 return [];
}
export function ProductStudio({result,initialProduct='ceramic-mug',lang='en',coupon='',onCoupon,onAdd,onBack,initialDraft,onDraftChange,offerKey='lm-product-offer-seen'}:{result:PreviewResult;initialProduct?:ProductId;lang?:'en'|'he';coupon?:string;onCoupon:()=>void;onAdd:(items:GiftSelection[])=>void;onBack:()=>void;initialDraft?:GiftStudioDraft|null;onDraftChange?:(draft:GiftStudioDraft)=>void;offerKey?:string}){
 const he=lang==='he',gallery=useRef<HTMLDivElement>(null),heading=useRef<HTMLHeadingElement>(null),opener=useRef<HTMLElement|null>(null),interacted=useRef(false);
 const [selected,setSelected]=useState<ProductId[]>(initialDraft?.selected||[initialProduct]),[active,setActive]=useState<ProductId>(initialDraft?.active||initialProduct),[panel,setPanel]=useState<Panel>(null),[offer,setOffer]=useState(false);
 const [appearance,setAppearance]=useState<ArtworkAppearance>(initialDraft?.appearance||{background:'#fffef9',border:3});
 const [sizes,setSizes]=useState<Partial<Record<ProductId,string>>>(initialDraft?.sizes??{pajamas:initialDraft?.size});
 const size=sizes[active]??'';
 const product=products.find(p=>p.id===active)!,subtotal=selected.reduce((sum,id)=>sum+products.find(p=>p.id===id)!.price,0),discount=coupon==='HELLO10'?Math.round(subtotal*.1):0;
 useEffect(()=>{let seen=false;try{seen=sessionStorage.getItem(offerKey)==='1';}catch{}if(seen||coupon)return;const timer=setTimeout(()=>{if(interacted.current)return;try{sessionStorage.setItem(offerKey,'1');}catch{}setOffer(true);},1400);return()=>clearTimeout(timer);},[offerKey,coupon]);
 useEffect(()=>{const rail=gallery.current,card=rail?.querySelector<HTMLElement>(`[data-product="${initialProduct}"]`);if(rail&&card){rail.scrollLeft+=card.getBoundingClientRect().left-rail.getBoundingClientRect().left-(rail.clientWidth-card.clientWidth)/2;const container=rail.closest<HTMLElement>('[role="dialog"]');if(container)container.scrollTop=0;else window.scrollTo({top:0});}heading.current?.focus({preventScroll:true});},[initialProduct]);
 useEffect(()=>{onDraftChange?.({selected,active,appearance,size:sizes.pajamas??'',sizes});},[selected,active,appearance,sizes,onDraftChange]);
 function touch(){interacted.current=true;}
 function toggle(id:ProductId){touch();setActive(id);setSelected(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);}
 function openPanel(next:Panel){touch();opener.current=document.activeElement as HTMLElement;setPanel(next);}
 function move(direction:number){gallery.current?.scrollBy({left:direction*(he?-1:1)*(gallery.current.clientWidth*.8),behavior:'smooth'});}
 function add(){onAdd(selected.map(id=>({productId:id,variant:[sizes[id]||'Classic',backgrounds.find(b=>b.value===appearance.background)!.en,`${borders.find(b=>b.value===appearance.border)!.en} border`].join(' · '),customization:{...appearance,size:sizes[id]||'Standard'}})));}
 const needsSize=selected.find(id=>sizeOptions(id).length && !sizes[id]);
 function visual(id:ProductId,small=false){return result.demo?<DrawingProductScene imageUrl={result.imageUrl} productId={id} lang={lang} appearance={appearance}/>:<div className={`studio-artwork ${small?'small':''}`} style={{background:appearance.background,padding:`${appearance.border}%`}}><img src={result.imageUrl} alt={he?'העיצוב שלכם':'Your selected artwork'}/></div>;}
 return localize(<section className="product-studio" dir={he?'rtl':'ltr'} aria-labelledby="studio-title">
  <div className="studio-top"><Button disabled={!selected.length||!!needsSize} onClick={add}><ShoppingBag size={18}/>{he?(selected.length===1?'מוסיפים מתנה אחת':`מוסיפים ${selected.length} מתנות`):`Add ${selected.length} ${selected.length===1?'gift':'gifts'}`} · {money(subtotal-discount)}</Button></div>
  <h2 ref={heading} tabIndex={-1} id="studio-title">{he?'מה נכין מהציור שלהם?':'What will you make with their drawing?'}</h2>
  <p className="studio-subtitle">{result.demo?(he?'הדמיות עם התמונה המקורית.':'Demo layouts using your original photo.'):(he?'העיצוב שבחרתם, על המתנות שלהם.':'Your chosen artwork, on their gifts.')}</p>
  {coupon&&<p className="studio-coupon"><Check size={14}/>{he?'הנחת 10% נוספה':'10% off applied'}</p>}
  <div className="studio-gallery-wrap"><button className="studio-scroll previous" onClick={()=>move(-1)} aria-label={he?'מתנות קודמות':'Previous gifts'}><ChevronLeft/></button>
   <div className="studio-gallery" ref={gallery}>{products.filter(p=>'group' in p).map(p=><article data-product={p.id} className={`studio-card ${active===p.id?'is-active':''}`} key={p.id}>
    <button className={`studio-select ${selected.includes(p.id)?'is-selected':''}`} aria-label={`${selected.includes(p.id)?(he?'הסרת':'Deselect'):(he?'בחירת':'Select')} ${he?p.he:p.name}`} aria-pressed={selected.includes(p.id)} onClick={()=>toggle(p.id)}>{selected.includes(p.id)&&<Check size={15}/>} {selected.includes(p.id)?(he?'נבחר':'Selected'):(he?'בחירה':'Select')}</button>
    <button className="studio-card-image" aria-label={`${he?'תצוגת':'Preview'} ${he?p.he:p.name}`} onClick={()=>{setActive(p.id);openPanel('preview');}}>{visual(p.id)}</button>
    <h3>{he?p.he:p.name}</h3><p>{p.detail}</p><b>{money(p.price)}</b>

   </article>)}</div><button className="studio-scroll next" onClick={()=>move(1)} aria-label={he?'מתנות נוספות':'Next gifts'}><ChevronRight/></button></div>
  {needsSize&&<p className="studio-size-hint" role="status">{he?'בחרו מידת בגד לפני ההוספה לסל.':'Choose a clothing size before adding to your bag.'}<button onClick={()=>{setActive(needsSize);openPanel('size');}}>{he?'בחירת מידה':'Choose size'}</button></p>}
  <nav className="studio-toolbar" aria-label={he?'התאמת המתנה':'Gift adjustments'}>{[
    {id:'size' as const,icon:Maximize,en:'Size',he:'גודל'}, {id:'background' as const,icon:Palette,en:'Background',he:'רקע'}, {id:'border' as const,icon:Square,en:'Border',he:'שוליים'}, {id:'preview' as const,icon:Eye,en:'Preview',he:'תצוגה'},
  ].map(tool=><button key={tool.id} onClick={()=>openPanel(tool.id)} aria-haspopup="dialog"><tool.icon size={20}/><span>{he?tool.he:tool.en}</span></button>)}<button onClick={onBack}><ImagePlus size={20}/><span>{he?'עיצוב':'Design'}</span></button></nav>
  <Dialog.Root open={panel!==null} onOpenChange={next=>{if(!next)setPanel(null);}}><Dialog.Portal><Dialog.Overlay className="studio-panel-overlay"/><Dialog.Content className={`studio-panel ${panel==='preview'?'studio-preview-panel':''}`} aria-describedby={undefined} onCloseAutoFocus={event=>{event.preventDefault();opener.current?.focus();}}>
   <div className="studio-panel-header"><Dialog.Title>{panel==='size'?(he?'גודל המתנה':'Gift size'):panel==='background'?(he?'רקע לכל המתנות':'Background for all gifts'):panel==='border'?(he?'שוליים לכל המתנות':'Border for all gifts'):(he?'התצוגה שלכם':'Your preview')}</Dialog.Title><Dialog.Close>{he?'סיום':'Done'}</Dialog.Close></div>
   {panel==='size'&&<><h3>{he?product.he:product.name}</h3>{sizeOptions(active).length>0?<div className="studio-size-options">{sizeOptions(active).map(v=><button className={size===v?'chosen':''} aria-pressed={size===v} key={v} onClick={()=>setSizes(current=>({...current,[active]:v}))}><span className="size-shirt" aria-hidden="true"><Shirt size={36}/></span>{he?v.replace('Age','גיל'):v}</button>)}</div>:<div className="studio-standard-size"><Maximize size={40}/><p>{product.detail||(he?'מידה אחת':'One size')}</p></div>}</>}
   {panel==='background'&&<div className="studio-visual-options">{backgrounds.map(option=><button className={appearance.background===option.value?'chosen':''} aria-pressed={appearance.background===option.value} key={option.value} onClick={()=>setAppearance(a=>({...a,background:option.value}))}><span className="background-example" style={{background:option.value}}><img src={result.imageUrl} alt=""/></span><span>{he?option.he:option.en}</span></button>)}</div>}
   {panel==='border'&&<div className="studio-visual-options border-options">{borders.map(option=><button className={appearance.border===option.value?'chosen':''} aria-pressed={appearance.border===option.value} key={option.value} onClick={()=>setAppearance(a=>({...a,border:option.value}))}><span className="border-example" style={{padding:`${option.value+1}%`,background:appearance.background}}><img src={result.imageUrl} alt=""/></span><span>{he?option.he:option.en}</span></button>)}</div>}
   {panel==='preview'&&<div className="studio-large-preview">{visual(active)}</div>}
  </Dialog.Content></Dialog.Portal></Dialog.Root>
  <Dialog.Root open={offer} onOpenChange={setOffer}><Dialog.Portal><Dialog.Overlay className="studio-offer-overlay"/><Dialog.Content className="studio-offer" onCloseAutoFocus={event=>{event.preventDefault();heading.current?.focus({preventScroll:true});}} aria-describedby="offer-description"><Dialog.Close className="offer-close" aria-label={he?'סגירה':'Close offer'}><X size={20}/></Dialog.Close><div className="studio-offer-visual">{visual(initialProduct)}</div><div className="studio-offer-content"><Dialog.Title>{he?'10% הנחה על המתנות שלהם':'10% off their gifts'}</Dialog.Title><p id="offer-description">{he?'קוד HELLO10. מוסיפים את ההנחה לסל בלחיצה.':'HELLO10. Add the discount to your bag in one tap.'}</p><Button onClick={()=>{onCoupon();setOffer(false);}}>{he?'מוסיפים את ההנחה':'Apply my 10% off'}</Button><Dialog.Close className="offer-later">{he?'ממשיכים לבחור':'Keep choosing'}</Dialog.Close></div></Dialog.Content></Dialog.Portal></Dialog.Root>
 </section>,lang);
}
