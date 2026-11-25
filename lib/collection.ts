export const giftGroups = [
  {
    "cover": "ceramic-mug",
    "en": "Table & kitchen",
    "he": "מטבח ושולחן"
  },
  {
    "cover": "tote",
    "en": "Wear & carry",
    "he": "בגדים ותיקים"
  },
  {
    "cover": "metal-keyring",
    "en": "Small keepsakes",
    "he": "מזכרות קטנות"
  },
  {
    "cover": "framed-print",
    "en": "Art & stationery",
    "he": "אמנות וכלי כתיבה"
  }
] as const;

export const collection = [
  {id: 'ceramic-mug', name: 'Ceramic coffee mug', he: 'ספל קרמיקה', price: 89, group: 'Table & kitchen'},
  {id: 'enamel-mug', name: 'Enamel camping mug', he: 'ספל אמייל', price: 99, group: 'Table & kitchen'},
  {id: 'tall-mug', name: 'Tall latte mug', he: 'ספל לאטה גבוה', price: 109, group: 'Table & kitchen'},
  {id: 'mug-pair', name: 'Matching ceramic mug pair', he: 'זוג ספלים תואמים', price: 159, group: 'Table & kitchen'},
  {id: 'travel-cup', name: 'Lidded travel tumbler', he: 'כוס נסיעות עם מכסה', price: 149, group: 'Table & kitchen'},
  {id: 'water-bottle', name: 'Steel water bottle', he: 'בקבוק שתייה מנירוסטה', price: 139, group: 'Table & kitchen'},
  {id: 'tea-towel', name: 'Cotton tea towel', he: 'מגבת מטבח', price: 79, group: 'Table & kitchen'},
  {id: 'towel-pair', name: 'Pair of kitchen towels', he: 'זוג מגבות מטבח', price: 129, group: 'Table & kitchen'},
  {id: 'apron', name: 'Canvas kitchen apron', he: 'סינר מטבח', price: 129, group: 'Table & kitchen'},
  {id: 'coasters', name: 'Set of four square coasters', he: 'רביעיית תחתיות לכוסות', price: 99, group: 'Table & kitchen'},
  {id: 'placemats', name: 'Pair of rectangular placemats', he: 'זוג פלייסמטים', price: 129, group: 'Table & kitchen'},
  {id: 'serving-board', name: 'Engraved wooden serving board', he: 'קרש הגשה בחריטה', price: 199, group: 'Table & kitchen'},
  {id: 'adult-tee', name: 'Adult cotton T-shirt', he: 'חולצת טי למבוגרים', price: 129, group: 'Wear & carry'},
  {id: 'youth-tee', name: 'Kids’ cotton T-shirt', he: 'חולצת טי לילדים', price: 109, group: 'Wear & carry'},
  {id: 'crewneck', name: 'Crewneck sweatshirt', he: 'סווטשירט', price: 209, group: 'Wear & carry'},
  {id: 'hoodie', name: 'Pullover hoodie', he: 'קפוצ׳ון', price: 239, group: 'Wear & carry'},
  {id: 'cap', name: 'Embroidered baseball cap', he: 'כובע מצחייה רקום', price: 119, group: 'Wear & carry'},
  {id: 'tote', name: 'Canvas market tote', he: 'תיק קניות מבד', price: 109, group: 'Wear & carry'},
  {id: 'book-bag', name: 'Small book bag', he: 'תיק ספרים קטן', price: 89, group: 'Wear & carry'},
  {id: 'zip-pouch', name: 'Canvas zipper pouch', he: 'נרתיק בד', price: 79, group: 'Wear & carry'},
  {id: 'pencil-case', name: 'Long pencil case', he: 'קלמר', price: 79, group: 'Wear & carry'},
  {id: 'lunch-bag', name: 'Insulated lunch bag', he: 'תיק אוכל', price: 129, group: 'Wear & carry'},
  {id: 'metal-keyring', name: 'Engraved steel keyring', he: 'מחזיק מפתחות בחריטה', price: 79, group: 'Small keepsakes'},
  {id: 'acrylic-keyring', name: 'Color acrylic keyring', he: 'מחזיק מפתחות אקרילי', price: 69, group: 'Small keepsakes'},
  {id: 'pendant', name: 'Silver-tone engraved pendant necklace', he: 'שרשרת עם תליון בחריטה', price: 179, group: 'Small keepsakes'},
  {id: 'bracelet', name: 'Engraved disc bracelet', he: 'צמיד עם דיסקית בחריטה', price: 139, group: 'Small keepsakes'},
  {id: 'wallet-card', name: 'Engraved metal wallet card', he: 'כרטיס מתכת לארנק', price: 89, group: 'Small keepsakes'},
  {id: 'bag-tag', name: 'Personalized luggage tag', he: 'תג למזוודה', price: 79, group: 'Small keepsakes'},
  {id: 'ceramic-ornament', name: 'Round ceramic hanging ornament', he: 'קישוט קרמי לתלייה', price: 79, group: 'Small keepsakes'},
  {id: 'wood-ornament', name: 'Engraved wooden hanging ornament', he: 'קישוט עץ בחריטה', price: 69, group: 'Small keepsakes'},
  {id: 'framed-print', name: 'Oak-framed art print', he: 'הדפס במסגרת עץ אלון', price: 189, group: 'Art & stationery'},
  {id: 'art-print', name: 'Unframed fine art print', he: 'הדפס אמנותי', price: 89, group: 'Art & stationery'},
  {id: 'canvas', name: 'Stretched canvas print', he: 'הדפס על קנבס', price: 179, group: 'Art & stationery'},
  {id: 'desk-block', name: 'Freestanding acrylic art block', he: 'בלוק אקרילי לשולחן', price: 139, group: 'Art & stationery'},
  {id: 'journal', name: 'Hardcover journal', he: 'מחברת בכריכה קשה', price: 99, group: 'Art & stationery'},
  {id: 'sketchbook', name: 'Spiral sketchbook', he: 'מחברת סקיצות', price: 89, group: 'Art & stationery'},
  {id: 'note-cards', name: 'Set of folded note cards', he: 'מארז כרטיסי ברכה', price: 89, group: 'Art & stationery'},
  {id: 'bookmark', name: 'Metal bookmark', he: 'סימנייה ממתכת', price: 69, group: 'Art & stationery'},
  {id: 'calendar', name: 'Standing desk calendar', he: 'לוח שנה שולחני', price: 119, group: 'Art & stationery'},
  {id: 'mouse-pad', name: 'Rectangular mouse pad', he: 'משטח לעכבר', price: 79, group: 'Art & stationery'},
] as const;

export function collectionImage(id: string) {
  return collection.some(product => product.id === id) ? `/catalog/${id}.webp` : undefined;
}
