import { products } from '../data/products';
import { groups } from '../data/packages';
import '../styles/products.css';

export default function ProductShowcase() {
  return <section className="wk-product-panel wk-miniature-panel wk-real-showcase" id="services" aria-labelledby="products-title">
    <div className="wk-panel-heading"><div><span className="wk-section-label">FIND YOUR PERSONAL PIECE</span><h2 id="products-title">Small pieces.<br/>So much meaning.</h2></div><p>A full-length likeness or a little portrait. Every piece starts with your photos and ends with a personal touch.</p></div>
    <div className="wk-real-products">{[...products].reverse().map(product => {
      const group = groups[product.id === 'couple-bust' ? 1 : 0];
      return <article className="wk-real-product" key={product.id}>
      <div className="wk-real-product-image"><img src={product.image} alt={product.alt} width="1672" height="941" loading="lazy"/></div>
      <div className="wk-real-product-copy">
        <span className="wk-section-label">{group.id === 'busts' ? '5CM · UPPER-BODY PORTRAIT' : '18CM · FULL-LENGTH FIGURE'}</span>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <dl className="wk-product-prices">{group.packages.map((item, index) => <div key={item.name}><dt>{index === 0 ? 'Single' : 'Couple'}</dt><dd>{item.price}</dd></div>)}</dl>
        <div className="wk-real-product-row">
          <span className="wk-real-product-price">{group.id === 'busts' ? 'Couple piece pictured' : 'Single piece pictured'}</span>
          <a href={`https://wa.me/94722227440?text=${encodeURIComponent(`Hi wivork, I'd like to know more about the ${product.title.toLowerCase()}.`)}`} className="wk-primary" target="_blank" rel="noreferrer">Create yours ↗</a>
        </div>
      </div>
    </article>})}</div>
    <div className="wk-product-summary"><p>Custom sculpting · Resin printed · Hand-painted</p><a href="/packages">Explore all packages <span className="wk-arrow" aria-hidden="true">↗</span></a></div>
  </section>;
}
