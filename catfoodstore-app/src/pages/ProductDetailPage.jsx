import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* ===============================
   SAMPLE PRODUCTS (ใช้เป็น fallback)
=============================== */
const sampleProducts = [
  {
    id: 1,
    name: "Royal Canin Kitten",
    price: 450,
    age_group: "kitten",
    category: "dry",
    breed_type: ["all"],
    health: ["general"],
    description: "โภชนาการสำหรับลูกแมว 2–12 เดือน",
    image_url: "/catfood/images/kitten.jpg",
  },
  {
    id: 2,
    name: "Royal Canin Home Life Indoor",
    price: 389,
    age_group: "adult",
    category: "dry",
    breed_type: ["เปอร์เซีย", "บริติชช็อตแฮร์"],
    health: ["general"],
    description: "อาหารแมวโตเลี้ยงในบ้าน",
    image_url: "/catfood/images/indoor.jpg",
  },
  {
    id: 3,
    name: "Royal Canin Urinary Care",
    price: 520,
    age_group: "special_care",
    category: "dry",
    breed_type: ["all"],
    health: ["urinary"],
    description: "ช่วยดูแลระบบปัสสาวะ",
    image_url: "/catfood/images/Urinary-Care.jpg",
  },
  {
    id: 4,
    name: "Royal Canin Mother & Babycat Mousse",
    price: 69,
    age_group: "all",
    category: "wet",
    breed_type: ["all"],
    health: ["general"],
    description: "สูตรอ่อนโยนสำหรับลูกแมวแรกเกิด",
    image_url: "/catfood/images/mother-baby-wet.jpg",
  },
  {
    id: 5,
    name: "Royal Canin Persian Loaf",
    price: 39,
    age_group: "all",
    category: "wet",
    breed_type: ["persian"],
    health: ["general"],
    description: "สูตรเฉพาะสำหรับแมวเปอร์เซีย",
    image_url: "/catfood/images/persian-loaf.jpg",
  },
  {
    id: 6,
    name: "Royal Canin Hair & Skin Pouch",
    price: 35,
    age_group: "special_care",
    category: "wet",
    breed_type: ["all"],
    health: ["hairball"],
    description: "ช่วยลดก้อนขน ดูแลผิวหนังและขน",
    image_url: "/catfood/images/hair-wet.jpg",
  },
];

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  /* ================================================
     LOAD PRODUCT (จาก localStorage → fallback sample)
  ================================================= */
  useEffect(() => {
    const saved = localStorage.getItem("products");
    let products = sampleProducts;

    if (saved) {
      try {
        products = JSON.parse(saved);
      } catch {
        products = sampleProducts;
      }
    }

    const found = products.find((p) => p.id === Number(id));
    setProduct(found || null);
  }, [id]);

  /* ================================================
     LOAD FAVORITES + CART
  ================================================= */
  useEffect(() => {
    const savedFav = JSON.parse(localStorage.getItem("favorites")) || [];
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setFavorites(savedFav);
    setCart(savedCart);
  }, []);

  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  /* FAVORITE */
  const toggleFavorite = () => {
    let updated;
    if (favorites.includes(product.id)) {
      updated = favorites.filter((f) => f !== product.id);
    } else {
      updated = [...favorites, product.id];
    }
    setFavorites(updated);
    saveData("favorites", updated);
  };

  /* ADD TO CART */
  const addToCart = () => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cartItems.findIndex((item) => item.id === product.id);

    if (index >= 0) {
      cartItems[index].quantity = (cartItems[index].quantity || 1) + 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    setCart(cartItems);
    window.dispatchEvent(new Event("cart-updated"));

    alert("เพิ่มลงตะกร้าแล้ว!");
  };

  if (!product)
    return (
      <p className="text-center py-20 text-gray-500">ไม่พบสินค้า</p>
    );

  const isFav = favorites.includes(product.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-red-600 mb-6 font-medium"
      >
        ← กลับ
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div>
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full rounded-xl shadow-md"
          />
        </div>

        {/* INFO */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-red-600 font-bold text-2xl">{product.price} ฿</p>

          <p className="text-gray-700 leading-relaxed">
            {product.description || "ไม่มีรายละเอียดสินค้า"}
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <p><strong>ช่วงวัย:</strong> {product.age_group}</p>
            <p><strong>ประเภทอาหาร:</strong> {product.category}</p>
            <p><strong>สายพันธุ์:</strong> {product.breed_type.join(", ")}</p>
            {product.health && (
              <p><strong>สุขภาพเฉพาะทาง:</strong> {product.health.join(", ")}</p>
            )}
          </div>

          <button
            onClick={addToCart}
            className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
          >
            🛒 เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
}
