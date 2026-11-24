'use client';
import {useState} from 'react';
import {ProcessingScreen} from './processing-screen';
export function ProcessingStates({videoUrl,captionsUrl,captionsLang}:{videoUrl?:string;captionsUrl?:string;captionsLang?:string}){
  const [ready,setReady]=useState(false),[lang,setLang]=useState<'en'|'he'>('en'),[result,setResult]=useState('');
  return <><div className="processing-qa-controls"><b>DEVELOPMENT FIXTURE</b><span>No upload or generation runs here.</span><button onClick={()=>{setReady(!ready);setResult('');}}>{ready?'Show working state':'Show ready state'}</button><button onClick={()=>setLang(lang==='en'?'he':'en')}>{lang==='en'?'עברית':'English'}</button><p role="status">{result}</p></div><ProcessingScreen lang={lang} phase="previewing" ready={ready} videoUrl={videoUrl} captionsUrl={captionsUrl} captionsLang={captionsLang} showcaseEnabled onCancel={()=>setResult('QA only: preview cancelled')} onContinue={()=>setResult('QA only: open demo preview')}/></>;
}
