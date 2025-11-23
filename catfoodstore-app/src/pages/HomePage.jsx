import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* SAMPLE PRODUCTS */
const sampleProducts = [
  {
    id: 1,
    name: "Royal Canin Kitten",
    price: 450,
    image_url: "/catfood/images/kitten.jpg",
    badge: "new",
  },
  {
    id: 2,
    name: "Royal Canin Home Life Indoor",
    price: 389,
    image_url: "/catfood/images/indoor.jpg",
    badge: "new",
  },
  {
    id: 3,
    name: "Royal Canin Urinary Care",
    price: 520,
    image_url: "/catfood/images/Urinary-Care.jpg",
    badge: "new",
  },
];

export default function HomePage() {
  const [toast, setToast] = useState(null);

  /* เพิ่มลงตะกร้า */
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const index = cart.findIndex((item) => item.id === product.id);

    if (index >= 0) cart[index].quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));

    setToast(`เพิ่ม ${product.name} ลงในตะกร้าแล้ว 🛒`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="w-full bg-white">

{/* HERO — ROYAL CANIN STYLE */}
<section
  className="pt-20 pb-28 px-6 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/catfood/images/canin2.jpg')" }}
>
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center backdrop-blur-[1px] bg-white/10 p-6 rounded-2xl">

    {/* LEFT — TEXT */}
    <div>
      <h1 className="text-5xl font-bold text-red-600 leading-tight drop-shadow">
        โภชนาการที่ใช่ สำหรับแมวของคุณ
      </h1>

      <p className="mt-4 text-gray-700 text-lg leading-relaxed p-3 rounded-lg">
        คัดสรรอาหาร Royal Canin คุณภาพสูง  
        เพื่อสุขภาพที่ดีที่สุดของแมวทุกช่วงวัยและทุกสายพันธุ์
      </p>

      <Link
        to="/products"
        className="
          inline-block mt-6 px-8 py-3 
          border border-red-600 text-red-600 font-semibold 
          rounded-full hover:bg-red-600 hover:text-white 
          transition-all duration-300
        "
      >
        ดูสินค้าทั้งหมด →
      </Link>
    </div>

    {/* RIGHT IMAGE (ซ่อนได้ ถ้าภาพใหญ่พอ) */}
    {/* <div className="flex justify-center">
        <img src="/catfood/images/hero-cat.png" className="w-80 md:w-96" />
    </div> */}
  </div>
</section>


      {/* SECTION: NEW ARRIVALS */}
      <Section title="สินค้าใหม่ (New Arrivals)">
        <PremiumProductGrid products={sampleProducts} addToCart={addToCart} />
      </Section>

      {/* SECTION: BEST SELLERS */}
      <Section title="สินค้าขายดี (Best Sellers)">
        <PremiumProductGrid products={sampleProducts} addToCart={addToCart} />
      </Section>

      {/* SECTION: BREED SPECIFIC */}
      <Section title="สินค้าแนะนำสำหรับสายพันธุ์">
        <BreedGrid />
      </Section>

      {/* TOAST */}
      {toast && (
        <div className="
          fixed bottom-6 left-1/2 -translate-x-1/2 
          bg-black/80 text-white px-5 py-3 rounded-xl 
          text-sm shadow-lg animate-fadeIn z-50
        ">
          {toast}
        </div>
      )}
    </div>
  );
}

/* ----------------------------------------
   SECTION WRAPPER A — ROYAL CANIN STYLE
---------------------------------------- */
function Section({ title, children }) {
  return (
    <section className="max-w-7xl mx-auto py-14 px-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ----------------------------------------
   PRODUCT CARD — PREMIUM
---------------------------------------- */
function PremiumProductCard({ product, addToCart }) {
  const badgeStyle = {
    new: "bg-blue-500",
    best: "bg-red-600",
    recommend: "bg-green-600",
  };

  return (
    <div
      className="
        bg-white border rounded-2xl overflow-hidden flex flex-col
        shadow-sm hover:shadow-2xl 
        transition-all duration-300 group
      "
    >
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {product.badge && (
          <span
            className={`
              absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full shadow 
              text-white
            ${badgeStyle[product.badge]}
          `}
          >
            {product.badge === "new" && "ใหม่"}
            {product.badge === "best" && "ขายดี"}
            {product.badge === "recommend" && "แนะนำ"}
          </span>
        )}
      </div>

      <div className="flex flex-col flex-grow p-4">
        <h3 className="font-semibold text-lg text-gray-900 min-h-[48px] leading-snug">
          {product.name}
        </h3>

        <p className="text-red-600 font-bold mb-4">{product.price} ฿</p>

        <button
          onClick={() => addToCart(product)}
          className="
            mt-auto w-full py-3 
            bg-red-600 text-white font-semibold rounded-xl 
            shadow-md hover:shadow-xl 
            transition-all duration-300 
            active:scale-95
          "
        >
          🛒 เพิ่มลงตะกร้า
        </button>
      </div>
    </div>
  );
}

/* GRID (สินค้า) */
function PremiumProductGrid({ products, addToCart }) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
      {products.map((p) => (
        <PremiumProductCard key={p.id} product={p} addToCart={addToCart} />
      ))}
    </div>
  );
}

/* BREED SECTION (ยังคงของเก่า แต่แต่งใหม่ได้ถ้าฟ้าต้องการ) */
function BreedGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <BreedCard
        title="เปอร์เซีย"
        img="/catfood/images/persian.jpg"
        to="/products?breed=เปอร์เซีย"
      />
      <BreedCard
        title="บริติชช็อตแฮร์"
        img="/catfood/images/british.jpg"
        to="/products?breed=บริติชช็อตแฮร์"
      />
      <BreedCard title="ทุกสายพันธุ์" img="/catfood/images/all.jpg" to="/products?breed=all" />
    </div>
  );
}

function BreedCard({ title, img, to }) {
  return (
    <Link
      to={to}
      className="
        bg-white p-6 text-center rounded-xl shadow-md 
        hover:shadow-xl transition transform hover:-translate-y-1
      "
    >
      <img src={img} alt={title} className="h-20 w-20 mx-auto object-contain mb-4" />
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </Link>
  );
}
