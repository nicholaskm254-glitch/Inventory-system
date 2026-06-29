/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useEffect, useState } from "react";
import HamburgerMenu from "@/components/HamburgerMenu";
import { apiFetch } from "@/lib/api";

export default function StockPage() {
  const [stock, setStock] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // FORMS
  // -----------------------------
  const [newProduct, setNewProduct] = useState({
    name: "",
    sku: "",
    price: "",
    quantityInStock: "",
  });

  const [restockForm, setRestockForm] = useState({
    productId: "",
    quantity: "",
  });

  // -----------------------------
  // LOAD STOCK
  // -----------------------------
  const loadStock = useCallback(async () => {
    try {
      setLoading(true);

      const res = await apiFetch("/api/Products");

      if (!res.ok) {
        throw new Error("Failed to load stock");
      }

      const data = await res.json();
      setStock(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading stock:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      void loadStock();
    }, 0);
    return () => clearTimeout(t);
  }, [loadStock]);

  // -----------------------------
  // ADD NEW PRODUCT
  // -----------------------------
  const addProduct = async () => {
    try {
      const res = await apiFetch("/api/Products", {
        method: "POST",
        body: JSON.stringify({
          ...newProduct,
          name: newProduct.name.toUpperCase(),
          sku: newProduct.sku.toUpperCase(),
          price: Number(newProduct.price),
          quantityInStock: Number(
            newProduct.quantityInStock
          ),
        }),
      });

      if (!res.ok) {
        throw new Error(
          "Failed to add product"
        );
      }

      setNewProduct({
        name: "",
        sku: "",
        price: "",
        quantityInStock: "",
      });

      await loadStock();
    } catch (err) {
      console.error(
        "Error adding product:",
        err
      );
    }
  };

  // -----------------------------
  // DELETE PRODUCT
  // -----------------------------
  const deleteProduct = async (
    id: number
  ) => {
    try {
      const res = await apiFetch(
        `/api/Products/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed to delete product"
        );
      }

      await loadStock();
    } catch (err) {
      console.error(
        "Error deleting product:",
        err
      );
    }
  };

  // -----------------------------
  // RESTOCK PRODUCT
  // -----------------------------
  const addStock = async () => {
    if (
      !restockForm.productId ||
      !restockForm.quantity
    )
      return;

    try {
      const res = await apiFetch(
        `/api/Products/${restockForm.productId}/add-stock`,
        {
          method: "PUT",
          body: JSON.stringify(
            Number(restockForm.quantity)
          ),
        }
      );

      if (!res.ok) {
        throw new Error(
          "Failed to restock"
        );
      }

      setRestockForm({
        productId: "",
        quantity: "",
      });

      await loadStock();
    } catch (err) {
      console.error(
        "Error restocking:",
        err
      );
    }
  };

  // -----------------------------
  // FILTER
  // -----------------------------
  const filteredStock =
    stock.filter((item) =>
      item.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <HamburgerMenu />

        <h1 className="text-3xl font-bold mt-4 mb-6">
          Stock Management
        </h1>

        {/* ADD PRODUCT */}
        <div className="border p-4 mb-4 rounded">
          <h2 className="font-semibold mb-3">
            Add New Product
          </h2>

          <div className="grid gap-3 md:grid-cols-4">
            <input
              className="border p-2"
              placeholder="Name"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  name: e.target.value,
                })
              }
            />

            <input
              className="border p-2"
              placeholder="SKU"
              value={newProduct.sku}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  sku: e.target.value,
                })
              }
            />

            <input
              className="border p-2"
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: e.target.value,
                })
              }
            />

            <input
              className="border p-2"
              type="number"
              placeholder="Stock"
              value={
                newProduct.quantityInStock
              }
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  quantityInStock:
                    e.target.value,
                })
              }
            />
          </div>

          <button
            className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
            onClick={addProduct}
          >
            Add Product
          </button>
        </div>

        {/* RESTOCK */}
        <div className="border p-4 mb-4 rounded">
          <h2 className="font-semibold mb-3">
            Restock Product
          </h2>

          <div className="grid gap-3 md:grid-cols-3">
            <input
              className="border p-2"
              placeholder="Product ID"
              value={
                restockForm.productId
              }
              onChange={(e) =>
                setRestockForm({
                  ...restockForm,
                  productId:
                    e.target.value,
                })
              }
            />

            <input
              className="border p-2"
              type="number"
              placeholder="Quantity"
              value={
                restockForm.quantity
              }
              onChange={(e) =>
                setRestockForm({
                  ...restockForm,
                  quantity:
                    e.target.value,
                })
              }
            />

            <button
              className="bg-blue-600 text-white p-2 rounded"
              onClick={addStock}
            >
              Add Stock
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <input
          className="border p-2 mb-4 w-full"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {/* TABLE */}
        {loading ? (
          <p>Loading stock...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border p-2">
                    Product
                  </th>
                  <th className="border p-2">
                    Quantity
                  </th>
                  <th className="border p-2">
                    Price
                  </th>
                  <th className="border p-2">
                    Total Value
                  </th>
                  <th className="border p-2">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStock.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center p-4"
                    >
                      No stock found
                    </td>
                  </tr>
                ) : (
                  filteredStock.map(
                    (item) => {
                      const quantity =
                        Number(
                          item.quantityInStock
                        ) || 0;

                      const price =
                        Number(
                          item.price
                        ) || 0;

                      return (
                        <tr
                          key={item.id}
                        >
                          <td className="border p-2">
                            {item.name}
                          </td>

                          <td className="border p-2">
                            {
                              quantity
                            }
                          </td>

                          <td className="border p-2">
                            {price}
                          </td>

                          <td className="border p-2">
                            {(
                              quantity *
                              price
                            ).toFixed(
                              2
                            )}
                          </td>

                          <td className="border p-2">
                            <button
                              onClick={() =>
                                deleteProduct(
                                  item.id
                                )
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}