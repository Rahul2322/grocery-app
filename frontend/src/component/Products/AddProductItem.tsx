import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./addProductItem.css";
import axiosInstance from "../../utils/axios";

const AddProductItem: React.FC = () => {
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    image: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();


  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.role !== "admin") {
    navigate("/");
  }

  useEffect(() => {
    if (id) {
        setIsEditMode(true);
        const fetchProduct = async () => {
          try {
            const response = await axiosInstance.get(
              `http://localhost:5000/api/product/${id}`
            );
            setProduct(response.data.data);
            setIsLoading(false);
          } catch (error) {
            console.log("Error fetching product", error);
          }
        };
        fetchProduct();
      } else {
        setIsLoading(false); 
      }
  }, [id]); 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axiosInstance.put(
          `http://localhost:5000/api/product/${id}`,
          product
        );
      } else {
        await axiosInstance.post("http://localhost:5000/api/product", product);
      }
      navigate("/products");
    } catch (error) {
      console.log("Error submitting product", error);
    }finally{
        setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="admin-product-form-container">
     <h2>{isEditMode ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Quantity</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={product.image}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductItem;
