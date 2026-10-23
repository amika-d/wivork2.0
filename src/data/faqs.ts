import { groups } from './packages';

const [mini, bust] = groups;

// Every answer restates the published packages and terms; keep them in step with PackagesPage and PricingSection.
export const faqs = [
  { question: 'How long does it take?', answer: 'Your finished miniature is ready within one week from order confirmation.' },
  { question: 'What photos do you need?', answer: 'Clear, high-resolution, well-lit photos. Include a direct front view with the head facing straight forward, so both eyes, both ears and both sides of the face show evenly, plus side views if you have them. Not sure your photos will work? Send them to us and we’ll help you choose.' },
  { question: 'What sizes and prices are there?', answer: `A full-length Signature Miniature is ${mini.packages[0].size} and made for one person: ${mini.packages[0].price}. A Portrait Bust is ${bust.packages[0].size}: ${bust.packages[0].price} for one person, ${bust.packages[1].price} for a couple. Custom sizes are priced on request.` },
  { question: 'How do I pay?', answer: 'A 50% non-refundable deposit starts the work. The remaining 50% is due before your piece ships.' },
  { question: 'Can I ask for changes?', answer: 'Yes. Revisions are unlimited during the digital sculpting and painting stages. Major structural changes after you approve the sculpt may cost extra.' },
  { question: 'How do I order?', answer: 'Message us on WhatsApp at 0722 227 440 with your photos and the piece you’d like. You can also email wivork@gmail.com.' },
];
