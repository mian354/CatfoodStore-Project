import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);

  /* ⭐ โหลดสินค้าจาก API จริง */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}`);

        setProduct({
          ...res.data,
          health: res.data.special_care || [], // ⭐ ใช้ special_care → health
        });
      } catch (err) {
        console.error("API ERROR:", err);
        setProduct(null);
      }
    };

    fetchProduct();
  }, [id]);

  /* LOAD FAVORITES & CART */
  useEffect(() => {
    const savedFav = JSON.parse(localStorage.getItem("favorites")) || [];
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setFavorites(savedFav);
    setCart(savedCart);
  }, []);

  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
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
    return <p className="text-center py-20 text-gray-500">ไม่พบสินค้า</p>;

  const isFav = favorites.includes(product.id);

  return (
  <div className="max-w-5xl mx-auto px-6 py-10">

  {/* ⭐ ปุ่มกลับไปหน้าก่อนหน้า */}
  <button
    onClick={() => navigate(-1)}
    className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg 
               border border-gray-300 bg-white shadow-sm
               text-gray-700 hover:bg-gray-50 hover:border-gray-400 
               transition text-sm font-medium"
  >
    <span className="text-lg">←</span>
    กลับไปหน้าก่อนหน้า
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

          {/* ชื่อ + น้ำหนัก */}
          <h1 className="text-2xl md:text-[28px] font-semibold tracking-tight text-gray-900">
            {product.name}{" "}
            <span className="font-bold">{product.weight}</span>
          </h1>

          {/* ราคา */}
          <p className="text-red-600 font-bold text-2xl">{product.price} ฿</p>

          {/* รายละเอียด */}
          <p className="text-gray-700 leading-relaxed">
            {product.description || "ไม่มีรายละเอียดสินค้า"}
          </p>

          {/* รายละเอียดอื่น */}
          <div className="mt-4 space-y-2 text-sm">
            <p><strong>ปริมาณ:</strong> {product.weight}</p>
            <p><strong>ช่วงวัย:</strong> {product.age_group}</p>
            <p><strong>ประเภทอาหาร:</strong> {product.category}</p>
            <p><strong>สายพันธุ์:</strong> {product.breed_type.join(", ")}</p>

            {product.health?.length > 0 && (
              <p><strong>สุขภาพเฉพาะทาง:</strong> {product.health.join(", ")}</p>
            )}
          </div>

          {/* ADD TO CART */}
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
