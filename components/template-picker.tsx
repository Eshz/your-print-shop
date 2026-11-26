'use client';
/* eslint-disable @next/next/no-img-element */
import {Palette} from 'lucide-react';
import {templates, type TemplateId} from '@/lib/templates';

type Props = {
  selected: TemplateId;
  onSelect: (id: TemplateId) => void;
  lang?: 'en' | 'he';
  showcaseEnabled?: boolean;
  compact?: boolean;
};

export function TemplatePicker({selected, onSelect, lang='en', showcaseEnabled=false, compact=false}: Props) {
  const hebrew = lang === 'he';
  return <div className={compact ? 'template-grid compact-templates' : 'design-tile-grid'}
    role="group" aria-label={hebrew ? 'עיצובים מציורי ילדים' : 'Designs made from children’s drawings'}>
    {templates.map(template => {
      const name = hebrew ? template.he : template.name;
      if (compact) return <button key={template.id} type="button"
        className={`template-card ${selected === template.id ? 'selected' : ''}`}
        aria-pressed={selected === template.id} onClick={() => onSelect(template.id)}>
        <span>{name}</span>
      </button>;

      return <button key={template.id} className="design-tile" type="button"
        aria-label={hebrew ? `יצירת ${name}` : `Create ${name}`} onClick={() => onSelect(template.id)}>
        {showcaseEnabled
          ? <img src={`/catalog/${template.sample}.webp`} width={640} height={640} loading="lazy" alt=""/>
          : <span className="design-tile-placeholder"><Palette aria-hidden="true"/></span>}
        <span className="design-tile-footer">
          <strong>{name}</strong>
          <span className="design-tile-action">{hebrew ? 'ליצירה' : 'Create'}</span>
        </span>
      </button>;
    })}
  </div>;
}
