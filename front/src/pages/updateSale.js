import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
  const [newImage, setNewImage] = useState("");
  const [products, setProducts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [itemNames, setItemNames] = useState([]);
  const [salesName, setSalesName] = useState([]);
  const [colourNames, setColourName] = useState([]);
  const [codes, setCodes] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [imageChange, setImageChange] = useState(false);

  useEffect(() => {
    const fetchItemNames = async () => {
      try {
        const response = await axios.get(`https://eazy-manager.vercel.app/products`);
        const items = response.data.map((item) => item.description);
        setItemNames(items);

        const response2 = await axios.get(`https://eazy-manager.vercel.app/staff`);
        const salesName = response2.data.map((saleName) => saleName.firstname);
        setSalesName(salesName);

        const response3 = await axios.get(`https://eazy-manager.vercel.app/products`);
        const colours = response3.data.map((colour) => colour.colour);
        setColourName(colours);

        const response4 = await axios.get(`https://eazy-manager.vercel.app/products`);
        setProducts(response4.data);

        const response5 = await axios.get(`https://eazy-manager.vercel.app/products`);
        const itemCodes = response5.data.map((itemCode) => itemCode.code);
        setCodes(itemCodes);
      } catch (err) {
        console.log("Error fetching item:", err);
      }
    };
    fetchItemNames();
  }, []);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`https://eazy-manager.vercel.app/getSales/` + id)
      .then((result) => {
        setSale(result.data);
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSale((prev) => {
      const newValue =
        name === "description" || name === "saleperson" || name === "code"
          ? value.toUpperCase()
          : name === "colour"
          ? value
          : name === "quantity"
          ? parseInt(value) || 0
          : parseFloat(value) || 0;

      let updatedSale = { ...prev };

      if (name === "number") {
        updatedSale = {
          ...updatedSale,
          number: newValue,
        };
      } else if (name === "pnumber") {
        const selectedProduct = products.find(
          (product) => product.number === parseInt(value)
        );
        if (selectedProduct) {
          updatedSale = {
            ...updatedSale,
            description: selectedProduct.description,
            code: selectedProduct.code,
            colour: selectedProduct.colour,
            pnumber: selectedProduct.pnumber,
          };
        }
      }

      const total =
        name === "price" || name === "quantity"
          ? calculateTotal(
              name === "price" ? newValue : prev.price,
              name === "quantity" ? newValue : prev.quantity
            )
          : prev.total;

      const commission =
        name === "price" || name === "quantity"
          ? calculateCommission(total)
          : prev.commission;

      return {
        ...updatedSale,
        [name]: newValue,
        total: total,
        commission: commission,
      };
    });
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
    const salesData = {
      ...sale,
      image: imageChange ? newImage : sale.image,
    };
    axios
      .put(`https://eazy-manager.vercel.app/updateSales/` + id, salesData)
      .then((result) => {
        setShowAlert(true);
        console.log(result);
        setShowAnimation(true);
        setTimeout(() => {
          setShowAnimation(true);
          navigate("/");
        }, 2000);
      })
      .catch((err) => console.log(err));
  };

  const convertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setNewImage(reader.result);
      setImageChange(true);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
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

  const back = () => {
    navigate("/");
  };

  return (
    <div>
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
        <label>Select the Item:</label>
        <select
          style={{ width: "656px" }}
          name="pnumber"
          onChange={handleChange}
          value={sale.pnumber}
        >
          <option value="" disabled></option>
          <optgroup label="Item Number - Description (Code) | [Colour]">
            {products.map((product) => (
              <option
                className="select"
                key={product.number}
                value={product.number}
              >
                {`${product.number} - ${product.description} (${product.code}) | [${product.colour}]`}
              </option>
            ))}
          </optgroup>
        </select>
        <br />
        <br />
        <label>Description:</label>
        <select
          style={{ width: "600px" }}
          name="description"
          onChange={handleChange}
          value={sale.description}
        >
          <option value="" disabled>
            Select
          </option>
          {itemNames.map((itemName, index) => (
            <option key={index} value={itemName}>
              {itemName}
            </option>
          ))}
        </select>
        <br />
        <br />
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <label>Colour:</label>
            <select
              style={{ width: "200px" }}
              name="colour"
              onChange={handleChange}
              value={sale.colour}
            >
              <option value="" disabled>
              </option>
              {[...new Set(colourNames)].map((colourName, index) => (
                <option key={index} value={colourName}>
                  {colourName}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginLeft: "50px" }}>
            <label>Item Code:</label>
            <select
              style={{ width: "200px" }}
              name="code"
              onChange={handleChange}
              value={sale.code}
            >
              <option value="" disabled>
                
              </option>
              {[...new Set(codes)].map((code, index) => (
                <option key={index} value={code}>
                  {code}
                </option>
              ))}
              </select>
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
        <hr />
        <br />
        <label>Image:</label>
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
            src={sale.image}
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
        />
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
