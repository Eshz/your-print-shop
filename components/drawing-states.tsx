'use client';
import {useState} from 'react';
import {DrawingCheckPanel} from './drawing-check';
import type {DrawingCheck} from '@/lib/drawing-validation';
const examples:{label:string;check:DrawingCheck}[]=[
 {label:'Non-drawing detected',check:{status:'not_drawing',source:'vision',confidence:.98,issue:'no_drawing',checkedAt:''}},
 {label:'Ambiguous artwork',check:{status:'uncertain',source:'vision',confidence:.55,checkedAt:''}},
 {label:'Blurred drawing',check:{status:'uncertain',source:'vision',confidence:.95,issue:'blurry',checkedAt:''}},
 {label:'Check unavailable',check:{status:'unavailable',source:'provider_error',checkedAt:''}},
 {label:'Provider not configured',check:{status:'unavailable',source:'unconfigured',checkedAt:''}},
 {label:'Drawing accepted',check:{status:'drawing',source:'vision',confidence:.96,checkedAt:''}}
];
export default function DrawingStates(){const [lang,setLang]=useState<'en'|'he'>('en');const [message,setMessage]=useState('');return <main className="section" dir={lang==='he'?'rtl':'ltr'}><p className="eyebrow">DEVELOPMENT QA · EXPLICIT STATE FIXTURES</p><h1 style={{fontSize:'3rem'}}>Drawing check states</h1><p className="template-intro">These are labelled UI fixtures, not real classifications of an uploaded image. No images are sent to a recognition service here.</p><button className="button outline" onClick={()=>setLang(lang==='en'?'he':'en')}>{lang==='en'?'עברית':'English'}</button><p role="status" style={{margin:'20px 0'}}>{message}</p><div className="qa-states">{examples.map(e=><section key={e.label} className="state-demo"><h2>{e.label}</h2><DrawingCheckPanel check={e.check} lang={lang} focusOnMount={false} presentation={e.check.status==='not_drawing'?'screen':'inline'} onRetry={()=>setMessage('QA only: retry clicked')} onReplace={()=>setMessage('QA only: replace clicked')} onDemo={()=>setMessage('QA only: explicit unverified demo clicked')}/></section>)}</div></main>;}
