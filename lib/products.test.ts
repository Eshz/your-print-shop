import {test} from 'node:test';
import assert from 'node:assert/strict';
import {total,products} from './products';
test('prices are configured for all seven products',()=>{assert.equal(products.length,7);assert.equal(new Set(products.map(p=>p.id)).size,7);});
test('coupon applies before delivery threshold',()=>{assert.deepEqual(total([{productId:'stickers',quantity:4}],'HELLO10'),{subtotal:276,discount:28,shipping:29,total:277});});
test('free delivery and empty basket calculations',()=>{assert.equal(total([{productId:'cushion',quantity:2}],'').shipping,0);assert.equal(total([],'').subtotal,0);});
