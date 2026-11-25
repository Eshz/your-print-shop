import assert from 'node:assert/strict';
import sharp from 'sharp';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:3000';
const image=await sharp({create:{width:240,height:240,channels:3,background:'#dfe8d6'}}).png().toBuffer();
const form=()=>{const f=new FormData();f.append('image',new Blob([image],{type:'image/png'}),'synthetic-test.png');return f;};
assert.equal((await fetch(base+'/api/uploads',{method:'POST',body:form()})).status,400);
const f=form();f.append('consent','true');const upload=await fetch(base+'/api/uploads',{method:'POST',body:f});assert.equal(upload.status,200);const cookie=upload.headers.get('set-cookie').split(';')[0];const {id,url}=await upload.json();
try{
 assert.equal((await fetch(base+url)).status,404);
 assert.equal((await fetch(base+'/api/validation',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({uploadId:id})})).status,400);
 const img=await fetch(base+url,{headers:{cookie}});assert.equal(img.status,200);assert.equal(img.headers.get('content-type'),'image/jpeg');assert.equal(img.headers.get('cache-control'),'private, no-store');
 const post=(endpoint,data)=>fetch(base+endpoint,{method:'POST',headers:{cookie,'Content-Type':'application/json'},body:JSON.stringify(data)});
 const validation=await (await post('/api/validation',{uploadId:id})).json();assert.equal(validation.check.source,'unconfigured','Run this test only against an unconfigured demo environment.');assert.equal(validation.check.status,'unavailable');
 assert.equal((await post('/api/jobs',{uploadId:id,templateId:'sticker-universe'})).status,422);
 assert.equal((await post('/api/jobs',{uploadId:id,templateId:'unknown',unverifiedDemo:true})).status,400);
 const preview=await post('/api/jobs',{uploadId:id,templateId:'hug-my-drawing',unverifiedDemo:true});assert.equal(preview.status,200);const result=await preview.json();assert.equal(result.job.status,'demo_ready');assert.equal(result.job.templateId,'hug-my-drawing');assert.equal(result.mockup.productId,'cushion');
 const mug=await post('/api/jobs',{uploadId:id,templateId:'sticker-universe',productId:'ceramic-mug',unverifiedDemo:true});
 assert.equal(mug.status,200);
 assert.equal((await mug.json()).mockup.productId,'ceramic-mug');
 assert.equal((await post('/api/jobs',{uploadId:id,templateId:'sticker-universe',productId:'unknown',unverifiedDemo:true})).status,400);
 assert.equal((await fetch(base+'/api/orders',{method:'POST'})).status,503);
 console.log('PASS: consent, ownership, normalized private image, unconfigured check, explicit demo gate, template validation, checkout guard');
}finally{assert.equal((await fetch(base+url,{method:'DELETE',headers:{cookie}})).status,204);assert.equal((await fetch(base+url,{headers:{cookie}})).status,404);console.log('PASS: synthetic upload deleted');}
