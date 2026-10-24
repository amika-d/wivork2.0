export const products = [
  {
    id: 'couple-bust',
    title: 'Couple portrait bust',
    label: 'A moment together',
    caption: 'Two people. One piece to keep.',
    description: 'A hand-painted portrait of two people, sculpted together on a shared oval base.',
    image: '/wivork/products/couple-bust.webp',
    alt: 'Real wivork couple portrait bust: a man in a cream shirt and a woman beside him on a teal oval base',
    detail: 'Upper-body portraits · Shared display base',
    size: '5cm',
    price: 'Rs. 3,500',
  },
  {
    id: 'signature-miniature',
    title: 'Signature miniature',
    label: 'Personally yours',
    caption: 'Your likeness, from head to toe.',
    description: 'A full-length, hand-painted figure that captures a person’s likeness, outfit, and character.',
    image: '/wivork/products/signature-miniature.webp',
    alt: 'Real wivork signature miniature of a woman in a red sari with a gold handbag on a white base',
    detail: 'Full-length figure · Hand-painted details',
    size: '18cm',
    price: 'Rs. 10,000',
  },
];

// Every piece we show, named for the person it was made for.
// `kind` says what the piece is; `bust` picks the bust prices.
export const creations = [
  { name: 'Love Birds', kind: 'Couple Portrait Bust', bust: true, image: '/wivork/products/couple-bust.webp', description: 'Two people, sculpted close together on one oval base.', alt: 'Hand-painted portrait bust of a smiling couple on a teal oval base' },
  { name: 'Priyanka’s', kind: 'Full-length Miniature', bust: false, image: '/wivork/products/signature-miniature.webp', description: 'A red sari and a gold handbag, dressed for the occasion.', alt: 'Hand-painted miniature of a woman in a red sari with a gold handbag' },
  { name: 'Mahida’s', kind: 'Portrait Bust', bust: true, image: '/work/hero-16x9/uncle-studio-v1.webp', description: 'A dark suit, a red tie and a familiar moustache.', alt: 'Hand-painted portrait bust of a man with a moustache, dark suit and red patterned tie on a gray oval base' },
  { name: 'Thihara’s', kind: 'Full-length Miniature', bust: false, image: '/work/hero-16x9/thihara-2-5-blur-landscape.webp', description: 'A white sari, a small brooch and a calm smile.', alt: 'Hand-painted miniature of a woman in a white sari with a brooch' },
  { name: 'Laveena’s', kind: 'Full-length Miniature', bust: false, image: '/work/hero-16x9/yellow-sari-studio-v2.webp', description: 'Patterned borders, picked out one stroke at a time.', alt: 'Hand-painted miniature of a woman in a yellow sari' },
  { name: 'Anuja’s', kind: 'Full-length Miniature', bust: false, image: '/work/hero-16x9/blue-sari-studio-v2.webp', description: 'Small white flowers scattered across a blue sari.', alt: 'Hand-painted miniature of a woman in a blue sari' },
  { name: 'Dasith’s', kind: 'Full-length Miniature', bust: false, image: '/work/hero-16x9/green-shirt-studio-v2.webp', description: 'Everyday clothes, with character in every detail.', alt: 'Hand-painted miniature of a man in a green shirt and jeans' },
  { name: 'Amika’s', kind: 'Full-length Miniature', bust: false, image: '/work/hero-16x9/black-jacket-studio-v2.webp', description: 'Packed for the trail, standing on rough ground.', alt: 'Hand-painted miniature in a black outfit with a tan backpack on a textured base' },
];
