import {notFound} from 'next/navigation';
import DrawingStates from '@/components/drawing-states';
export default function DrawingCheckStates(){if(process.env.NODE_ENV!=='development')notFound();return <DrawingStates/>;}
