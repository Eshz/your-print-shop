'use client';
/* eslint-disable @next/next/no-img-element */
import {Check,ImagePlus,Palette,Upload} from 'lucide-react';
import {Button} from './ui/button';
import {TemplatePicker} from './template-picker';
import {localize} from '@/lib/i18n';
import {collection,giftGroups,collectionImage} from '@/lib/collection';
import {money,type ProductId} from '@/lib/products';
import type {TemplateId} from '@/lib/templates';

type Props={lang:'en'|'he';showcaseEnabled:boolean;templateId:TemplateId;onTemplate:(id:TemplateId)=>void;onStart:(id?:ProductId)=>void};
function Example({asset,alt,enabled}:{asset:string;alt:string;enabled:boolean}) {
  return enabled?<img src={`/catalog/${asset}.webp`} alt={alt} loading="lazy"/>:<div className="home-image-placeholder"><Palette size={44}/><span>Your drawing here</span></div>;
}
export function HomeSections({lang,showcaseEnabled,templateId,onTemplate,onStart}:Props){
  return localize(<>
    <section className="section template-section home-section" id="templates">
      <div className="home-section-heading"><h2>What could their drawing become?</h2><p>Pick a design to try.</p></div>
      <TemplatePicker selected={templateId} onSelect={onTemplate} lang={lang} showcaseEnabled={showcaseEnabled}/>
    </section>
    <section className="section how home-section" id="how">
      <div className="home-section-heading"><h2>From drawing to gift</h2><p>Pick a look. Upload. See it first.</p></div>
      <div className="home-process">
        <article><div className="process-visual process-design"><Example asset="tea-towel" alt="Drawing printed on a tea towel" enabled={showcaseEnabled}/></div><h3>Pick a design</h3><p>Start with something they’ll love.</p></article>
        <article><div className="process-visual"><div className="process-upload"><Upload size={32}/><span>Upload their drawing</span><ImagePlus size={54} strokeWidth={1}/></div></div><h3>Upload their drawing</h3><p>A clear photo is all you need.</p></article>
        <article><div className="process-visual process-preview"><Example asset="metal-keyring" alt="Drawing engraved on a keyring" enabled={showcaseEnabled}/><span className="process-check" aria-hidden="true"><Check size={22}/></span></div><h3>Preview, then pick a gift</h3><p>Try the free demo before you choose.</p></article>
      </div>
    </section>
    <section className="section home-section home-products" id="shop">
      <div className="home-section-heading"><h2>One drawing. Plenty of possibilities.</h2><p>Choose a design first. Pick their gift next.</p></div>
      <div className="featured-formats">{collection.filter(p=>p.id==='ceramic-mug'||p.id==='tote').map(p=><article className="format-card" key={p.id}>
        <button className={`format-visual format-${p.id}`} onClick={()=>onStart(p.id)} aria-label={`Create ${p.name}`}><Example asset={p.id} alt={`Drawing-based ${p.name} concept`} enabled={showcaseEnabled}/></button>
        <div className="format-content"><div className="format-title"><h3>{lang==='he'?p.he:p.name}</h3><span>{money(p.price)}</span></div><Button onClick={()=>onStart(p.id)}>{lang==='he'?'הוספת הציור':'Add their drawing'}</Button></div>
      </article>)}</div>
      <div className="catalog-groups">{giftGroups.map(group =>
        <details className="catalog-group" key={group.en}>
          <summary><img src={collectionImage(group.cover)} width={80} height={80} loading="lazy" alt=""/><span>{lang==='he'?group.he:group.en}</span></summary>
          <div className="catalog-grid">{collection.filter(p => p.group===group.en).map(p =>
            <button type="button" key={p.id} onClick={()=>onStart(p.id)}>
              <img src={collectionImage(p.id)} width={640} height={640} loading="lazy" decoding="async" alt=""/>
              <span>{lang==='he'?p.he:p.name}</span><strong>{money(p.price)}</strong>
            </button>
          )}</div>
        </details>
      )}</div>
    </section>
    <section className="section home-section home-moments" id="gift-ideas">
      <div className="home-section-heading"><h2>For their kind of fun</h2><p>A few ways to put that drawing to good use.</p></div>
      <div className="moments-grid">{[
        {asset:'mug-pair',title:lang==='he'?'קפה בשניים':'Coffee for two',text:lang==='he'?'ציור אחד על שני ספלים.':'One drawing on a matching pair.',product:'mug-pair' as ProductId},
        {asset:'acrylic-keyring',title:lang==='he'?'מתנה קטנה':'A little thank-you',text:lang==='he'?'ציור צבעוני לצרור המפתחות.':'A colorful doodle for their keys.',product:'acrylic-keyring' as ProductId},
        {asset:'framed-print',title:lang==='he'?'אצל סבתא וסבא':'For the grandparents',text:lang==='he'?'הציור האהוב במסגרת.':'Their favorite drawing, framed.',product:'framed-print' as ProductId},
      ].map(moment=><article key={moment.title}><button className="moment-visual" onClick={()=>onStart(moment.product)} aria-label={moment.title}><Example asset={moment.asset} alt={moment.title} enabled={showcaseEnabled}/></button><h3>{moment.title}</h3><p>{moment.text}</p></article>)}</div>
    </section>
  </>,lang);
}
