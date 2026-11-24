import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseVisionResult,createDrawingValidator,canPreview} from './drawing-validation';
test('rejects a confident non-drawing, preserves ambiguity',()=>{assert.equal(parseVisionResult({kind:'not_drawing',confidence:.98}).status,'not_drawing');assert.equal(parseVisionResult({kind:'not_drawing',confidence:.7}).status,'uncertain');assert.equal(parseVisionResult({kind:'drawing',confidence:.95}).status,'drawing');});
test('quality issues request a better photo',()=>{assert.equal(parseVisionResult({kind:'drawing',confidence:.99,issue:'blurry'}).status,'uncertain');});
test('malformed responses never approve an upload',()=>{for(const raw of [null,{}, {kind:'drawing',confidence:1.2},{kind:'drawing',confidence:NaN}])assert.throws(()=>parseVisionResult(raw));});
test('unconfigured recognition is honest; only explicit demo can continue',async()=>{const check=await createDrawingValidator({}).check(Buffer.from('test'));assert.equal(check.source,'unconfigured');assert.equal(canPreview(check,false),false);assert.equal(canPreview(check,true),true);assert.equal(canPreview(parseVisionResult({kind:'not_drawing',confidence:1}),true),false);});
test('provider outage fails closed, even with demo override',async()=>{const check=await createDrawingValidator({url:'https://validator.example',key:'test'},async()=>{throw Error('offline');}).check(Buffer.from('test'));assert.equal(check.source,'provider_error');assert.equal(canPreview(check,true),false);});
