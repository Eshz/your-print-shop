import {test} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import {collection,collectionImage} from './collection';
import {total,products} from './products';
test('every gift has a unique ID and a positive retail price',()=>{
  assert.equal(products.length,47);
  assert.equal(new Set(products.map(p=>p.id)).size,products.length);
  assert.ok(products.every(p=>Number.isInteger(p.price)&&p.price>0));
});
test('coupon applies before delivery threshold',()=>{assert.deepEqual(total([{productId:'stickers',quantity:4}],'HELLO10'),{subtotal:276,discount:28,shipping:29,total:277});});
test('free delivery and empty basket calculations',()=>{assert.equal(total([{productId:'cushion',quantity:2}],'').shipping,0);assert.equal(total([],'').subtotal,0);});

test('each new gift has its own local image and can be priced in the bag',()=>{
  for(const product of collection){
    const image=collectionImage(product.id);
    assert.ok(image&&existsSync(join(process.cwd(),'public',image)),product.id);
    const bag=total([{productId:product.id,quantity:1}],'HELLO10');
    assert.equal(bag.subtotal,product.price);
    assert.equal(bag.discount,Math.round(product.price*.1));
  }
});
