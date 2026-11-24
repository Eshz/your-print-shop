import {notFound} from 'next/navigation';
import {ProductFlowStates} from '@/components/product-flow-states';
export default function ProductFlowQa(){if(process.env.NODE_ENV!=='development')notFound();return <ProductFlowStates/>;}
