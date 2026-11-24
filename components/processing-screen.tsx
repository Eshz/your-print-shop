'use client';
/* eslint-disable @next/next/no-img-element */
import {useEffect,useRef,useState} from 'react';
import {Pause,Play,Volume2,VolumeX} from 'lucide-react';
import {Button} from './ui/button';

type Props={lang:'en'|'he';phase:'uploading'|'checking'|'previewing'|null;ready:boolean;videoUrl?:string;captionsUrl?:string;captionsLang?:string;showcaseEnabled?:boolean;onContinue:()=>void;onCancel:()=>void};
export function ProcessingScreen({lang,phase,ready,videoUrl,captionsUrl,captionsLang='en',showcaseEnabled=false,onContinue,onCancel}:Props){
  const he=lang==='he',video=useRef<HTMLVideoElement>(null),heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{heading.current?.focus();},[]);
  const [muted,setMuted]=useState(true),[playing,setPlaying]=useState(false),[skipped,setSkipped]=useState(false),[mediaError,setMediaError]=useState(false);
  const title=ready?(he?'ההדמיה שלכם מוכנה':'Your demo is ready'):phase==='uploading'?(he?'שומרים את הציור שלכם':'Saving your drawing'):phase==='checking'?(he?'בודקים את התמונה':'Checking your image'):(he?'מכינים את ההדמיה שלכם':'Preparing your demo');
  async function togglePlayback(){if(!video.current)return;if(playing)video.current.pause();else try{await video.current.play();}catch{setMediaError(true);}}
  function skipVideo(){video.current?.pause();setSkipped(true);}
  return <section className="processing-screen" dir={he?'rtl':'ltr'} aria-labelledby="processing-title">
    <div className="processing-main"><h2 ref={heading} tabIndex={-1} id="processing-title" role="status">{title}</h2>
      <div className={`processing-progress ${ready?'is-ready':''}`} role="progressbar" aria-label={he?'הכנת ההדמיה':'Preview processing'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={ready?100:undefined} aria-valuetext={ready?(he?'מוכן':'Ready'):title}><span/></div>
      {!skipped&&<div className="processing-media">
        {videoUrl&&!mediaError?<><video ref={video} src={videoUrl} autoPlay muted={muted} playsInline preload="metadata" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onError={()=>setMediaError(true)} aria-label={he?'סרטון הסבר על המוצר':'Product how-to video'}>{captionsUrl&&<track kind="captions" src={captionsUrl} srcLang={captionsLang} label={captionsLang==='he'?'עברית':'English'} default/>}</video>
          <div className="processing-video-controls"><button onClick={togglePlayback} aria-label={playing?(he?'השהיית הסרטון':'Pause video'):(he?'ניגון הסרטון':'Play video')}>{playing?<Pause size={18}/>:<Play size={18}/>}</button><button onClick={skipVideo}>{he?'דילוג':'Skip'}</button><button onClick={()=>setMuted(!muted)} aria-label={muted?(he?'הפעלת צליל':'Unmute video'):(he?'השתקת צליל':'Mute video')}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button></div>
        </>:<div className="processing-video-empty">{showcaseEnabled&&<img src="/api/showcase/hero" alt={he?'דוגמה למדבקות ולכרית מהציור':'Drawing-based sticker and cushion examples'}/>}<div><Play size={28} aria-hidden="true"/><h3>{mediaError?(he?'הסרטון לא זמין כרגע':'The video couldn’t load'):(he?'סרטון לקוח יתווסף בקרוב':'Customer video coming soon')}</h3>{mediaError&&<p>{he?'אפשר להמשיך בלי הסרטון.':'You can continue without the video.'}</p>}</div></div>}
      </div>}
      {ready&&<Button className="processing-continue" onClick={onContinue}>{he?'רואים את ההדמיה':'See my demo'}</Button>}
      {skipped&&!ready&&<p className="processing-wait" role="status">{he?'אפשר לדלג על הסרטון. ההכנה עדיין ממשיכה.':'Video skipped. Your preview is still being prepared.'}</p>}
    </div>
    <button className="processing-cancel" onClick={onCancel}>{ready?(he?'חזרה לציור':'Back to drawing'):(he?'ביטול התצוגה':'Cancel preview')}</button>
  </section>;
}
