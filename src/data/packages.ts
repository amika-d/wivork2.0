// Published sizes and prices; every page, popup and FAQ answer reads them from here.
type Figure = { src: string; alt: string };
type Package = { name: string; size: string; price: string; text: string; figures: Figure[]; pictured?: string };

export const groups: { id: string; eyebrow: string; title: string; note: string; packages: Package[] }[] = [
  { id: 'signature', eyebrow: 'Signature Miniatures', title: 'Full-figure, 18cm', note: 'Signature Miniatures are made for one person. Listed prices are for our standard 18cm height. Pricing may vary depending on requested custom sizes.', packages: [
    { name: 'Single Miniature', size: '18cm', price: 'Rs. 10,000', text: 'A full-length portrait of one person, made from your photos.',
      figures: [{ src: '/wivork/products/signature-cutout.webp', alt: 'A hand-painted full-length miniature of a woman in a red sari holding a gold handbag' }] },
  ] },
  { id: 'busts', eyebrow: 'Portrait Busts', title: 'Compact, 5cm', note: 'Listed prices are for our standard 5cm bust height. Pricing may vary depending on requested custom sizes.', packages: [
    { name: 'Single Portrait Bust', size: '5cm', price: 'Rs. 1,800', text: 'An upper-body portrait of one person, made from your photos.',
      figures: [{ src: '/wivork/products/sunday-best-cutout.webp', alt: 'A hand-painted portrait bust of a man in a dark suit and red tie on a grey oval base' }] },
    { name: 'Couple Portrait Bust', size: '5cm', price: 'Rs. 3,500', text: 'Two upper-body portraits, together on a shared display base.',
      figures: [{ src: '/wivork/products/couple-bust-cutout.webp', alt: 'A hand-painted portrait bust of a smiling couple on a teal oval base' }] },
  ] },
];
