import {notFound} from 'next/navigation';
import {ProcessingStates} from '@/components/processing-states';
export default function ProcessingQa(){if(process.env.NODE_ENV!=='development')notFound();return <ProcessingStates videoUrl={process.env.PRODUCT_VIDEO_URL} captionsUrl={process.env.PRODUCT_VIDEO_CAPTIONS_URL} captionsLang={process.env.PRODUCT_VIDEO_CAPTIONS_LANG}/>;}
