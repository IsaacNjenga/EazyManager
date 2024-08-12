import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { UserContext } from "../App";
import Select from "react-select";
import Navbar from "../source/navbar";

function AddSale() {
  const { user } = useContext(UserContext);
  const [sale, setSale] = useState({
    number: "",
    description: "",
    price: 0,
    quantity: 0,
    total: 0,
    datesold: new Date(),
    saleperson: "",
    commission: 0,
    pnumber: "",
    code: "",
    colour: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [image, setImage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [products, setProducts] = useState([]);
  const [isImageAvailable, setIsImageAvalailable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const productsArray = Array.isArray(response.data.products)
          ? response.data.products
          : [];
        setProducts(productsArray);
      } catch (error) {
        console.log("Error fetching item:", error);
      }
    };

    fetchItems();
  }, []);

  const handleProductSelection = (selectedOption) => {
    const selectedProduct = products.find(
      (product) => product.number === selectedOption.value
    );

    if (selectedProduct) {
      setSale((prev) => ({
        ...prev,
        description: selectedProduct.description,
        colour: selectedProduct.colour,
        code: selectedProduct.code,
        pnumber: selectedProduct.number,
      }));

      // Set the image if available
      if (selectedProduct.image) {
        setIsImageAvalailable(true);
        setImage(selectedProduct.image);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const newValue =
      name === "description" || name === "saleperson" || name === "code"
        ? value.toUpperCase()
        : name === "colour"
        ? value
        : name === "quantity"
        ? parseInt(value) || 0
        : parseFloat(value) || 0;

    setSale((prev) => ({
      ...prev,
      saleperson: user.name.toUpperCase(),
      [name]: newValue,
      total:
        name === "price" || name === "quantity"
          ? calculateTotal(
              name === "price" ? newValue : prev.price,
              name === "quantity" ? newValue : prev.quantity
            )
          : prev.total,
      commission:
        name === "price" || name === "quantity"
          ? calculateCommission(
              name === "price"
                ? newValue * prev.quantity
                : prev.price * newValue
            )
          : prev.commission,
    }));
  };

  const calculateTotal = (price, quantity) => {
    return price * quantity;
  };

  const calculateCommission = (total) => {
    if (total >= 10000) {
      return 0.01 * total;
    }
    return 0;
  };

  const handleDateChange = (date) => {
    setSale((prev) => ({
      ...prev,
      datesold: date,
    }));
  };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    const saleData = {
      ...sale,
      image: image,
    };

    axios
      .post("addSale", saleData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => {
        setShowAlert(true);
        setShowAnimation(true);
        setLoading(false);
        toast.success("Sale entered");
        setTimeout(() => {
          navigate(user.role !== "admin" ? "/login" : "/sales");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setMessage(err.response?.data?.error || "An error occurred");
        toast.error("Failed to add sale");
      });
  };

  const convertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      console.log(reader.result);
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
      setMessage("An Error occurred. Please try again");
    };
  };

  const back = () => {
    navigate("/sales");
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
  };

  const productOptions = Array.isArray(products)
    ? products.map((product) => ({
        value: product.number,
        label: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={product.image}
              alt="no_Image"
              style={{ width: 75, height: 75, marginRight: 10 }}
            />
            <span>{`${product.number} — ${product.description} (${product.code}) | [${product.colour}] - (${product.location})`}</span>
          </div>
        ),
      }))
    : [];

  if (loading) {
    return (
      <div>
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

  return (
    <>
      <Navbar />
      <div id="main">
        <button className="backbtn" onClick={back}>
          Back to Sales
        </button>
        <form className="form">
          <div style={{ textAlign: "center" }}>
            <span
              style={{ fontSize: "35px", color: "purple", fontStyle: "italic" }}
            >
              Easy
            </span>
            <span
              style={{ fontSize: "35px", color: "red", fontWeight: "bold" }}
            >
              Manager
            </span>
            <h3>Sales entry</h3>
          </div>
          <hr />
          <br />
          <label>Receipt Number:</label>
          <input
            type="text"
            value={sale.number}
            onChange={handleChange}
            name="number"
          />
          <br />
          <br />
          <label>Select The Product:</label>
          <label>
            Product No. — Description (Code) | [Colour] - (Location)
          </label>
          <Select
            styles={customStyles}
            options={productOptions}
            onChange={handleProductSelection}
            value={productOptions.find(
              (option) => option.value === sale.pnumber
            )}
          />
          <br />
          <br />
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={sale.description}
            readOnly
          />
          <br />
          <br />
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <label>Colour:</label>
              <input type="text" name="colour" value={sale.colour} readOnly />
            </div>
            <div style={{ marginLeft: "50px" }}>
              <label>Code:</label>
              <input type="text" name="code" value={sale.code} readOnly />
            </div>
          </div>
          <br />

          <br />
          <br />
          <hr />
          <br />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
            }}
          >
            <label>Price:</label>
            <input
              type="number"
              placeholder="Price"
              onChange={handleChange}
              name="price"
            />
            <label>Quantity:</label>
            <input
              type="number"
              placeholder="Quantity"
              onChange={handleChange}
              name="quantity"
            />
            <label>Total:</label>
            <input
              type="text"
              placeholder="Total"
              value={sale.total}
              readOnly
            />
            <label>Commission:</label>
            <input
              type="text"
              placeholder="Commission"
              value={sale.commission.toLocaleString()}
              readOnly
            />
          </div>
          <br />
          <hr />
          <br />
          <label>Date of Sale:</label>
          <DatePicker
            selected={sale.datesold}
            onChange={handleDateChange}
            dateFormat="EEEE, dd-MM-yyyy"
          />
          <br />
          <br />
          <label>Salesperson: {user.name.toUpperCase()}</label>

          <br />

          {!isImageAvailable && (
            <div>
              <hr />
              <br />
              <label>Image:</label>
              <input accept="image/*" type="file" onChange={convertToBase64} />
            </div>
          )}
          <br />
          <br />
          {showAlert && (
            <div className="alert">
              <p style={{ textAlign: "center" }}>
                Success! <i className="material-icons">check</i>
              </p>
            </div>
          )}
          <hr />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button className="addbtn" onClick={submit}>
              Add Sale
            </button>
            <button className="backbtn" onClick={back}>
              Cancel
            </button>
            {message && <div>{message}</div>}
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
    </>
  );
}

export default AddSale;
