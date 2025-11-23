import React, { useState, useEffect } from "react";

export default function AdminProductsPage() {
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("คุณไม่มีสิทธิ์เข้าหน้านี้");
      window.location.href = "/";
    }
  }, []);

  const [products, setProducts] = useState([]);

  // Add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Edit form
  const [editItem, setEditItem] = useState(null);

  /* Load Products */
  useEffect(() => {
    const saved = localStorage.getItem("products");
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  const saveProducts = (list) => {
    localStorage.setItem("products", JSON.stringify(list));
    setProducts(list);
  };

  /* Delete */
  const deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    saveProducts(updated);
  };

  /* Add Product */
  const addProduct = () => {
    if (!newName || !newPrice || !newImage || !newDesc) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: newName,
      price: Number(newPrice),
      image_url: newImage,
      description: newDesc,
      age_group: "all",
      category: "dry",
      breed_type: ["all"],
      health: ["general"],
    };

    const updated = [...products, newItem];
    saveProducts(updated);

    setNewName("");
    setNewPrice("");
    setNewImage("");
    setNewDesc("");
    setShowAddForm(false);
  };

  /* Update Product */
  const updateProduct = () => {
    const updated = products.map((p) =>
      p.id === editItem.id ? editItem : p
    );

    saveProducts(updated);
    setEditItem(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        จัดการสินค้า (Admin)
      </h1>

      {/* BUTTON ADD */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          + เพิ่มสินค้า
        </button>
      </div>

      {/* ADD PRODUCT FORM */}
      {showAddForm && (
        <div className="border p-6 bg-gray-50 rounded-xl mb-6">
          <h2 className="text-xl font-semibold mb-4">เพิ่มสินค้าใหม่</h2>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="ชื่อสินค้า"
              className="border p-2 rounded"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <input
              type="number"
              placeholder="ราคา"
              className="border p-2 rounded"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />

            <input
              type="text"
              placeholder="ลิงก์รูปสินค้า"
              className="border p-2 rounded"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />

            <textarea
              placeholder="รายละเอียดสินค้า"
              className="border p-2 rounded h-24"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            ></textarea>
          </div>

          <button
            onClick={addProduct}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            บันทึกสินค้า
          </button>
        </div>
      )}

      {/* PRODUCT TABLE */}
      <table className="w-full border rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-center">
            <th className="border p-2">ภาพ</th>
            <th className="border p-2">ชื่อสินค้า</th>
            <th className="border p-2">ราคา</th>
            <th className="border p-2">จัดการ</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="text-center">
              <td className="border p-2">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-16 h-16 object-cover mx-auto rounded"
                />
              </td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.price} บาท</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => setEditItem(p)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT POPUP */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">แก้ไขสินค้า</h2>

            <input
              type="text"
              className="border p-2 w-full mb-3 rounded"
              value={editItem.name}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
            />

            <input
              type="number"
              className="border p-2 w-full mb-3 rounded"
              value={editItem.price}
              onChange={(e) =>
                setEditItem({ ...editItem, price: Number(e.target.value) })
              }
            />

            <input
              type="text"
              className="border p-2 w-full mb-3 rounded"
              value={editItem.image_url}
              onChange={(e) =>
                setEditItem({ ...editItem, image_url: e.target.value })
              }
            />

            <textarea
              className="border p-2 w-full mb-3 rounded h-24"
              value={editItem.description}
              onChange={(e) =>
                setEditItem({ ...editItem, description: e.target.value })
              }
            ></textarea>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditItem(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                ยกเลิก
              </button>

              <button
                onClick={updateProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
