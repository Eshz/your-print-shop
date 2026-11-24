'use client';
/* eslint-disable @next/next/no-img-element */
import {useEffect,useRef} from 'react';
import {AlertTriangle,CheckCircle2,ImageOff,ShieldQuestion} from 'lucide-react';
import {Button} from './ui/button';
import type {DrawingCheck} from '@/lib/drawing-validation';
export function DrawingCheckPanel({check,lang='en',busy=false,onRetry,onReplace,onDemo,focusOnMount=true,presentation='inline',image}:{check:DrawingCheck;lang?:'en'|'he';busy?:boolean;focusOnMount?:boolean;presentation?:'inline'|'screen';image?:string;onRetry:()=>void;onReplace:()=>void;onDemo:()=>void}){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{if(focusOnMount)ref.current?.focus();},[check,focusOnMount]);
 const he=lang==='he',demo=check.status==='unavailable'&&check.source==='unconfigured',accepted=check.status==='drawing';
 const Icon=accepted?CheckCircle2:check.status==='not_drawing'?ImageOff:check.status==='unavailable'?ShieldQuestion:AlertTriangle;
 let message=he?'הציור לא ברור. נסו צילום מואר של כל הדף.':'Drawing unclear. Try a bright photo of the whole page.';
 if(check.issue==='blurry')message=he?'הצילום מטושטש. נסו צילום חד יותר.':'Photo looks blurry. Try a sharper one.';
 if(check.issue==='too_dark')message=he?'הצילום חשוך. נסו לצלם ליד חלון.':'Photo looks dark. Try taking it near a window.';
 if(check.issue==='cropped')message=he?'חלק מהציור חסר. צלמו את היצירה במלואה.':'Part of the drawing is missing. Include the whole artwork.';
 if(check.status==='not_drawing')message=he?'לא זוהה ציור. נסו צילום או סריקה של המקור.':'No drawing found. Try a photo or scan of the original.';
 if(check.status==='unavailable')message=demo?(he?'הבדיקה לא מחוברת. התמונה לא אומתה.':'Recognition isn’t connected. Image is unverified.'):(he?'הבדיקה לא זמינה כרגע. נסו שוב.':'Image check unavailable. Please retry.');
 if(accepted)message=he?'הציור מוכן לתצוגה.':'Drawing ready for preview.';
 if(presentation==='screen'&&check.status==='not_drawing')return <div ref={ref} tabIndex={-1} role="alert" className="drawing-rejection">
  {image&&<img src={image} alt={he?'התמונה שהעליתם':'Your uploaded photo'}/>}
  <h2>{he?'לא מצאנו ציור בתמונה.':'We couldn’t find a drawing.'}</h2>
  <p>{he?'נסו תמונה ברורה של היצירה עצמה.':'Try a clear photo of the artwork itself.'}</p>
  <Button disabled={busy} onClick={onReplace}>{he?'מחליפים תמונה':'Replace photo'}</Button>
 </div>;
 return <div ref={ref} tabIndex={-1} role={check.status==='not_drawing'?'alert':'status'} className={`drawing-check compact-check check-${check.status}`}>
  <div className="check-message"><Icon size={16}/><p>{message}</p></div>
  <div className="check-actions">{demo?<button disabled={busy} onClick={onDemo}>{he?'המשך להדגמה לא מאומתת':'Continue with unverified demo'}</button>:!accepted&&<button disabled={busy} onClick={onRetry}>{he?'נסו שוב':'Retry'}</button>}{!accepted&&<button disabled={busy} onClick={onReplace}>{he?'מחיקה והחלפת תמונה':'Delete & replace'}</button>}</div>
  {!accepted&&<details className="micro-details"><summary>{he?'פרטים':'Details'}</summary><p>{demo?(he?'זו הדגמה של התמונה המקורית בפריסה בלבד. לא בוצע זיהוי ולא נוצרה יצירה חדשה.':'The demo only places your original image in a layout. Recognition has not run and no new artwork is generated.'):(he?'הבדיקה יכולה לטעות. נסו צילום ברור של ציור אחד, עם כל הקצוות וללא השתקפויות. הקובץ נשאר פרטי.':'Checks can be wrong. Use one clear drawing with all edges visible and no glare. Your upload stays private.')}</p></details>}
 </div>;
}
