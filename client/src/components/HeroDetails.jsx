import '../css/detail.css';

export default function Detail() {
  return (
    <section className="detail-block">
      <h1 className="detail-title">Ghost Of Yotei</h1>

      <div className="detail-meta">
        <p>2025</p>
        <p>17+</p>
        <p>4.25 ★</p>
      </div>

      <p className="detail-desc">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut mollitia
        officia eos dolores natus soluta vitae earum consectetur pariatur
        distinctio, illum laboriosam assumenda veniam ipsum magni aliquam
        numquam neque ipsam culpa asperiores. Ipsum distinctio soluta sapiente
        quos ex aut temporibus, consectetur a, est alias magnam unde accusantium
        atque maiores libero.
      </p>

      <div className="detail-cta">
        <button className="buy-btn">BUY NOW</button>
        <h2 className="price">$69.99</h2>
      </div>
    </section>
  );
}
