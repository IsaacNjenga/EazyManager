import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import Select from "react-select";

function UpdateSale() {
  const [sale, setSale] = useState({
    number: "",
    description: "",
    price: 0,
    quantity: 0,
    total: 0,
    datesold: new Date(),
    saleperson: "",
    commission: 0,
    image: "",
    pnumber: "",
    code: "",
    colour: "",
  });

  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [salesName, setSalesName] = useState([]);
  const [isImageAvailable, setIsImageAvalailable] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const fetchItemNames = async () => {
      try {
        const response = await axios.get(`products`);
        setProducts(response.data);

        const response2 = await axios.get(`staff`);
        const salesName = response2.data.map((saleName) => saleName.firstname);
        setSalesName(salesName);
      } catch (err) {
        console.log("Error fetching item:", err);
      }
    };
    fetchItemNames();
  }, []);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`getSales/` + id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => {
        setSale(result.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

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
    if (date.getTime() !== sale.datesold.getTime()) {
      setSale((prev) => ({
        ...prev,
        datesold: date,
      }));
      console.log(date);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const saleData = {
      ...sale,
      image: image,
    };
    axios
      .put(`updateSales/` + id, saleData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => {
        setShowAlert(true);
        console.log(result);
        setShowAnimation(true);
        setTimeout(() => {
          setShowAnimation(true);
          toast.success("Sale updated");
          navigate("/sales");
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  const convertToBase64 = (e) => {
    const file = e.target.files[0];
    const maxSizeInBytes = 1048576; // 1MB
    if (file.size > maxSizeInBytes) {
      setMessage("File size exceeds the maximum limit (1MB)");
      return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
      setMessage("An Error occurred. Please try again");
    };
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

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
  };

  const productOptions = products.map((product) => ({
    value: product.number,
    label: (
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src={product.image}
          alt="no_Image"
          style={{ width: 75, height: 75, marginRight: 10 }}
        />
        <span>{`${product.number} — ${product.description} (${product.code}) | [${product.colour}]`}</span>
      </div>
    ),
  }));

  const back = () => {
    navigate("/sales");
  };

  return (
    <div id="main">
      <button className="backbtn" onClick={back}>
        Back to Sales
      </button>
      <form className="form" onSubmit={submit}>
        <div style={{ textAlign: "center" }}>
          <span
            style={{ fontSize: "35px", color: "purple", fontStyle: "italic" }}
          >
            Easy
          </span>
          <span style={{ fontSize: "35px", color: "red", fontWeight: "bold" }}>
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
        <label>Product No. — Description (Code) | [Colour]</label>
        <Select
          styles={customStyles}
          options={productOptions}
          onChange={handleProductSelection}
          value={productOptions.find((option) => option.value === sale.pnumber)}
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
            value={sale.price}
          />
          <label>Quantity:</label>
          <input
            type="number"
            placeholder="Quantity"
            onChange={handleChange}
            name="quantity"
            value={sale.quantity}
          />
          <label>Total:</label>
          <input type="text" placeholder="Total" value={sale.total} readOnly />
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
        <label>Salesperson:</label>
        <select
          name="saleperson"
          onChange={handleChange}
          value={sale.saleperson}
        >
          <option value="" disabled>
            Select
          </option>
          {salesName.map((saleName) => (
            <option key={saleName} value={saleName}>
              {saleName}
            </option>
          ))}
        </select>
        <br />
        <br />
        {!isImageAvailable && (
          <div>
            <hr />
            <br />
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
                src={sale.image}
                alt="Image_here"
                style={styles}
              />
            </div>
            ;<label>Image:</label>
            <input accept="image/*" type="file" onChange={convertToBase64} />
          </div>
        )}
        <br />
        <br />
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
          <button className="addbtn">Update</button>
          <button onClick={back} className="backbtn">
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
  );
}

export default UpdateSale;
