import { products } from '../data/products';
import '../styles/products.css';

export default function ProductShowcase() {
  return <section className="wk-product-panel wk-miniature-panel wk-real-showcase" id="services" aria-labelledby="products-title">
    <div className="wk-panel-heading"><h2 id="products-title">Two ways to keep<br/>a little of your world.</h2><p>Full-length figures and shared portrait busts.<br/>Personal pieces, made from your photographs.</p></div>
    <div className="wk-real-products">{[...products].reverse().map(product => <article className="wk-real-product" key={product.id}>
      <div className="wk-real-product-image"><img src={product.image} alt={product.alt} width="1672" height="941" loading="lazy"/></div>
      <div className="wk-real-product-copy">
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className="wk-real-product-row">
          <span className="wk-real-product-price">From {product.price} · {product.size}</span>
          <a href={`https://wa.me/94722227440?text=${encodeURIComponent(`Hi wivork, I'd like to know more about the ${product.title.toLowerCase()}.`)}`} className="wk-primary" target="_blank" rel="noreferrer">Create yours ↗</a>
        </div>
      </div>
    </article>)}</div>
    <p className="wk-product-note">Actual wivork pieces · Photos refined for presentation</p>
  </section>;
}
