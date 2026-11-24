export const products = [
 {id:'stickers',name:'Kiss-cut sticker sheets',he:'דפי מדבקות',price:69,color:'yellow',tag:'The little favorite',detail:'Two A5 sheets · easy-peel matte finish',shape:'sheet'},
 {id:'magnets',name:'Magnetic story kit',he:'ערכת סיפורים מגנטית',price:129,color:'blue',tag:'A whole world of play',detail:'12 flexible pieces · storytelling board',shape:'magnets'},
 {id:'cushion',name:'Character cushion',he:'כרית דמות',price:179,color:'pink',tag:'Made for big hugs',detail:'Shaped to their drawing · 35 cm',shape:'cushion'},
 {id:'pajamas',name:'Dreamer pajamas',he:'פיג׳מות',price:189,color:'lavender',tag:'Wear their world',detail:'Soft cotton · sizes 2–10',shape:'pajamas'},
 {id:'blanket',name:'A very personal blanket',he:'שמיכה אישית',price:219,color:'peach',tag:'A little everyday comfort',detail:'Cozy fleece · 100 × 140 cm',shape:'blanket'},
 {id:'puzzle',name:'Imagination puzzle',he:'פאזל הדמיון',price:119,color:'mint',tag:'Piece their world together',detail:'48 pieces · keepsake box',shape:'puzzle'},
 {id:'cards',name:'Memory card game',he:'משחק זיכרון',price:99,color:'yellow',tag:'Play it again',detail:'24 cards · 12 matching pairs',shape:'cards'}
] as const;
export type ProductId = typeof products[number]['id'];
export const money=(n:number)=>new Intl.NumberFormat('he-IL',{style:'currency',currency:'ILS',maximumFractionDigits:0}).format(n);
export function total(items:{productId:string;quantity:number}[],coupon:string){const subtotal=items.reduce((s,i)=>s+(products.find(p=>p.id===i.productId)?.price??0)*i.quantity,0);const discount=coupon.toUpperCase()==='HELLO10'?Math.round(subtotal*.1):0;return {subtotal,discount,shipping:subtotal-discount>=249?0:29,total:subtotal-discount+(subtotal-discount>=249?0:29)};}
