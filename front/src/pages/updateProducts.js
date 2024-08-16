import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

function UpdateProducts() {
  const [product, setProduct] = useState({
    number: "",
    description: "",
    colour: "",
    price: "",
    quantity: "",
    code: "",
    location: "",
    bnumber: "",
    summary: "",
    image: "",
  });

  const [newImage, setNewImage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [imageChange, setImageChange] = useState(false);
  const navigate = useNavigate();
  const [newQuantity, setNewQuantity] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`getProducts/` + id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => {
        setProduct(result.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      return;
    }
    const inputValueInCaps = value.toUpperCase();
    setProduct((prev) => ({ ...prev, [name]: inputValueInCaps }));
  };

  const convertToBase64 = (e) => {
    const file = e.target.files[0];

    // Check if file is larger than 10MB
    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes
    if (file.size > maxSize) {
      alert("File size exceeds 10 MB. Please select a smaller file.");
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setNewImage(reader.result);
      setImageChange(true);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
      alert("Payload is too large. Select a smaller image");
    };
  };

  const update = (e) => {
    e.preventDefault();
    const productData = {
      ...product,
      image: imageChange ? newImage : product.image,
    };
    axios
      .put(`updateProducts/` + id, productData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => {
        setShowAlert(true);
        console.log(result);
        setShowAnimation(true);
        setTimeout(() => {
          setShowAnimation(true);
          toast.success("Product updated");
          navigate("/products");
        }, 2000);
      })
      .catch((err) => {
        console.error("Update failed:", err);
        if (err.response) {
          console.error("Server responded with:", err.response.data);
        } else if (err.request) {
          console.error("No response received:", err.request);
        } else {
          console.error("Error setting up request:", err.message);
        }
        // Handle error state or display error message to the user
      });
  };

  const styles = {
    width: "160px",
    height: "150px",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "10px",
    transition: "all 0.4s ease-in",
    border: "1px inset #050101",
    boxShadow: "5px 5px 36px #a78e8e, -5px -5px 36px #e7c4c4",
  };

  const addQuantity = (e) => {
    e.preventDefault();
    setNewQuantity((prevQuantity) => prevQuantity + 1);
  };

  const removeQuantity = (e) => {
    e.preventDefault();
    setNewQuantity((prevQuantity) => (prevQuantity > 0 ? prevQuantity - 1 : 0));
  };

  const newValue = newQuantity + parseInt(product.quantity);

  const change = (e) => {
    e.preventDefault();
    setProduct((prev) => ({ ...prev, quantity: newValue.toString() }));
    setNewQuantity(0);
  };

  const cancel = (e) => {
    e.preventDefault();
    setProduct((prev) => ({ ...prev, quantity: product.quantity }));
    setNewQuantity(0);
  };

  const back = (e) => {
    e.preventDefault();
    navigate("/products");
  };

  return (
    <div id="main">
      <button onClick={back} className="backbtn">
        Back to Inventory
      </button>
      <form className="form">
        <div style={{ textAlign: "center" }}>
          <span
            style={{
              fontSize: "35px",
              color: "purple",
              fontStyle: "italic",
            }}
          >
            Easy
          </span>
          <span style={{ fontSize: "35px", color: "red", fontWeight: "bold" }}>
            Manager
          </span>
          <h3>Product Update</h3>
        </div>
        <hr />
        <br />
        Product Number:
        <input
          type="text"
          placeholder="12345"
          value={product.number}
          onChange={handleChange}
          name="number"
        />
        <br />
        Description:
        <input
          type="text"
          value={product.description}
          placeholder="Description"
          onChange={handleChange}
          name="description"
        />
        <br />
        Product Code:
        <input
          type="text"
          value={product.code}
          placeholder="XX123"
          onChange={handleChange}
          name="code"
        />
        <br />
        Colour:
        <input
          type="text"
          value={product.colour}
          placeholder="Colour"
          onChange={handleChange}
          name="colour"
        />
        <br />
        <hr />
        <br />
        <div style={{ textAlign: "center" }}>
          <h4>
            <b>Current quantity: {product.quantity}</b>
          </h4>
          <p>How many to add?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              margin: "10px 0",
            }}
          >
            <button onClick={addQuantity} className="addbtn">
              +
            </button>
            <p>{newQuantity}</p>
            <button onClick={removeQuantity} className="backbtn">
              -
            </button>
          </div>
          <p>
            <b>
              <i>New quantity will be: {newValue}</i>
            </b>
          </p>
          <button onClick={change} className="addbtn">
            Change
          </button>
          <button onClick={cancel} className="backbtn">
            Cancel
          </button>
        </div>
        <br />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
          }}
        >
          Quantity:
          <input
            type="text"
            value={product.quantity}
            placeholder="Quantity"
            onChange={handleChange}
            name="quantity"
          />
          Price per unit:
          <input
            type="text"
            value={product.price}
            placeholder="Price"
            onChange={handleChange}
            name="price"
          />
          FC Number:
          <input
            type="text"
            value={product.bnumber}
            placeholder="B/No"
            onChange={handleChange}
            name="bnumber"
          />
        </div>
        <br />
        <hr />
        <br />
        Location:
        <input
          type="text"
          value={product.location}
          placeholder="Location"
          onChange={handleChange}
          name="location"
        />
        <br />
        <br />
        Summary
        <textarea
          onChange={handleChange}
          value={product.summary}
          name="summary"
          rows="6"
          cols="76.5"
        ></textarea>
        <br />
        <br />
        <hr />
        <br />
        {/*Image:
        <hr />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            width={100}
            height={100}
            src={product.image}
            alt="Image_here"
            style={styles}
          />
        </div>
        <br />
        <input
          accept="image/*"
          type="file"
          onChange={convertToBase64}
          name="image"
        />*/}
        <br />
        <hr />
        {showAlert && (
          <div className="alert">
            <p style={{ textAlign: "center" }}>
              Success! <i className="material-icons">check</i>{" "}
            </p>
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <button className="addbtn" onClick={update}>
            Update
          </button>
          <button onClick={back} className="backbtn">
            Cancel
          </button>
        </div>
      </form>
      {showAnimation && (
        <div className="hourglassOverlay">
          <div className="hourglassBackground">
            <div className="hourglassContainer">
              <div className="hourglassCurves"></div>
              <div className="hourglassCapTop"></div>
              <div className="hourglassGlassTop"></div>
              <div className="hourglassSand"></div>
              <div className="hourglassSandStream"></div>
              <div className="hourglassCapBottom"></div>
              <div className="hourglassGlass"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdateProducts;
