import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import { UserContext } from "../App";
import Select from "react-select";
import Navbar from "../source/navbar";
//import Barcode from "../components/barcode";

function AddSale() {
  const { user } = useContext(UserContext);
  const [sale, setSale] = useState({
    number: "",
    description: "",
    price: 0,
    quantity: 0,
    total: 0,
    datesold: new Date(),
    saleperson: user.role === "admin" ? "" : user.name.toUpperCase(),
    commission: 0,
    pnumber: "",
    code: "",
    colour: "",
  });

  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState(null);
  const [image, setImage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [products, setProducts] = useState([]);
  const [isImageAvailable, setIsImageAvailable] = useState(false);
  const [sales, setSales] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [salesName, setSalesName] = useState([]);
  const [enterCustomerInfo, setEnterCustomerInfo] = useState(false);
  const [customerInfo, setCustomerInfo] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setFetching(true);
    const fetchItems = async () => {
      try {
        const response = await axios.get(`products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setProducts(
          Array.isArray(response.data.products) ? response.data.products : []
        );
        setFetching(false);
      } catch (error) {
        console.log("Error fetching items:", error);
        setFetching(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    setFetching(true);
    const fetchStaff = async () => {
      try {
        const response = await axios.get("staff", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const salesName = response.data.map((saleName) => saleName.firstname);
        setSalesName(salesName);
        setFetching(false);
      } catch (error) {
        console.log("Error fetching items:", error);
        setFetching(false);
      }
    };
    fetchStaff();
  }, []);

  const handleProductSelection = (selectedOption) => {
    const selectedProduct = products.find(
      (product) => product.number === selectedOption.value
    );

    if (selectedProduct) {
      setSaleItems((prev) => [
        ...prev,
        {
          quantity: "",
          price: "",
          description: selectedProduct.description,
          colour: selectedProduct.colour,
          code: selectedProduct.code,
          pnumber: selectedProduct.number,
          image: isImageAvailable ? image : selectedProduct.image,
          total: "",
          commission: "",
          saleperson: "",
        },
      ]);

      if (selectedProduct.image) {
        setIsImageAvailable(true);
        setImage(selectedProduct.image);
      }
    }
  };

  const handleRowChange = (index, event) => {
    const { name, value } = event.target;
    const items = [...saleItems];
    items[index][name] = value;

    // Recalculate total and commission based on quantity and price changes
    if (name === "quantity" || name === "price") {
      const price = parseFloat(items[index].price || 0);
      const quantity = parseInt(items[index].quantity || 0);
      items[index].total = calculateTotal(price, quantity);
      items[index].commission = calculateCommission(items[index].total);
    }

    setSaleItems(items);
  };

  const calculateTotal = (price, quantity) => price * quantity;

  const calculateCommission = (total) => (total >= 10000 ? 0.01 * total : 0);

  /* const addNewRow = (e) => {
    e.preventDefault();
    setSaleItems([
      ...saleItems,
      {
        quantity: "",
        price: "",
        description: "",
        code: "",
        total: "",
        commission: "",
      },
    ]);
  };*/

  const removeCurrentRow = (index, e) => {
    e.preventDefault();
    setSaleItems(saleItems.filter((_, i) => i !== index));
  };

  const handleEnterSale = (e) => {
    e.preventDefault();

    setSales([...sales, saleItems]);
    setSaleItems([]);
  };

  const handleDateChange = (date) => {
    setSale((prev) => ({
      ...prev,
      datesold: date,
    }));
  };

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  const handleCustomerFormSubmit = (e) => {
    e.preventDefault();
    console.log(customerInfo);
    toast.success("Customer Info saved!");
    setEnterCustomerInfo(false);
  };

  const closeCustomerInfoFormModal = () => {
    setEnterCustomerInfo(null);
  };

  const openCustomerFormModal = (e) => {
    e.preventDefault();
    setEnterCustomerInfo(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    handleReceipt();
    try {
      // Loop through each sale item and send them individually
      for (let saleGroup of sales) {
        for (let saleItem of saleGroup) {
          const saleData = {
            ...sale,
            number: saleItem.number || sale.number,
            description: saleItem.description || sale.description,
            price: parseFloat(saleItem.price) || sale.price,
            quantity: parseInt(saleItem.quantity) || sale.quantity,
            total: parseFloat(saleItem.total) || sale.total,
            datesold: sale.datesold ? new Date(sale.datesold) : new Date(),
            saleperson: sale.saleperson,
            commission: saleItem.commission || sale.commission,
            pnumber: saleItem.pnumber || sale.pnumber,
            code: saleItem.code || sale.code,
            colour: saleItem.colour || sale.colour,
            image: image,
            customerName: customerInfo.customerName,
            customerPhone: customerInfo.customerPhone,
            customerEmail: customerInfo.customerEmail,
          };

          //console.log("saleData", saleData);

          await axios.post("addSale", saleData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          axios.post("/send-email", {
            to: "valuemart.kenya@gmail.com",
            subject: "New sale!",
            text: JSON.stringify(saleData),
            imageUrl: saleData.image,
          });
        }
      }

      setShowAlert(true);
      setShowAnimation(true);
      setLoading(false);
      toast.success("Sales entered successfully");
      setTimeout(() => {
        navigate(user.role !== "admin" ? "/login" : "/sales");
      }, 1000);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setMessage(err.response?.data?.error || "An error occurred");
      toast.error("Failed to add sale");
    }
  };

  const back = (e) => {
    e.preventDefault();
    navigate("/sales");
  };

  const handleReceipt = () => {
    window.print();
    console.log("\x1B|m");
  };

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
    }),
  };

  const productOptions = fetching
    ? [
        {
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>
                <p>Fetching items. Please wait...</p>
              </span>
            </div>
          ),
        },
      ]
    : products.map((product) => ({
        value: product.number,
        product,
        label: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <span>{`${product.number} — ${product.description} (${product.code}) | [${product.colour}] - (${product.location})`}</span>
            <img src={product.img} alt="_" style={{ width: "20px" }} />
          </div>
        ),
      }));

  const filterOption = ({ label, value, data }, input) => {
    if (input) {
      const searchTerm = input.toLowerCase();
      return (
        data.product.number.toLowerCase().includes(searchTerm) ||
        data.product.description.toLowerCase().includes(searchTerm) ||
        data.product.code.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  };

  return (
    <>
      <Navbar />
      <div id="main">
        <button className="backbtn" onClick={back}>
          Back to Sales
        </button>
        <form className="sale-form">
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
            onChange={(e) => setSale({ ...sale, number: e.target.value })}
            name="number"
          />
          <br />
          <br />
          <label>Date:</label>
          <DatePicker
            selected={sale.datesold}
            onChange={handleDateChange}
            dateFormat="dd-MM-yyyy"
            readOnly={user.role === "salesperson"}
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
            filterOption={filterOption}
            placeholder="Type to search..."
            isSearchable={true}
          />
          <br />
          <p>Use the search bar to add an item</p>
          <br />
          <div className="sale-table">
            {/*<button
              onClick={addNewRow}
              style={{ cursor: "pointer" }}
              className="addbtn"
            >
              Add item
  </button>*/}
            <table className="sale-item-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Item</th>
                  <th>Colour</th>
                  <th>Code</th>
                  <th>Quantity</th>
                  <th>Price per Item (Ksh.)</th>
                  <th>Total (Ksh.)</th>
                  <th>Commission (Ksh.)</th>
                </tr>
              </thead>
              <tbody>
                {saleItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={item.image}
                        alt="_"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          padding: "5px",
                        }}
                      />
                    </td>
                    <td>{item.description}</td>
                    <td>{item.colour}</td>
                    <td>{item.code}</td>
                    <td>
                      <input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleRowChange(index, e)}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        name="price"
                        value={item.price.toLocaleString()}
                        onChange={(e) => handleRowChange(index, e)}
                        style={{ width: "250px" }}
                      />
                    </td>
                    <td>{item.total.toLocaleString()}</td>
                    <td>{item.commission.toLocaleString()}</td>
                    <td>
                      <button onClick={(e) => removeCurrentRow(index, e)}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />
          <button onClick={openCustomerFormModal} className="open-modal-btn">
            {" "}
            Enter Customer info
          </button>
          <br />
          <br />
          <label>Sold By:</label>
          {user.role === "admin" ? (
            <select
              name="saleperson"
              onChange={(e) => setSale({ ...sale, saleperson: e.target.value })}
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
          ) : (
            <input type="text" value={user.name.toUpperCase()} disabled />
          )}

          <br />
          <br />
          <button onClick={handleEnterSale} className="addbtn">
            Enter Sale
          </button>
          <br />
          <br />
          <hr />
          <div className="button-div">
            <button onClick={submit} className="submitbtn">
              {loading ? "Submit this sale" : "Submit Sale"}
            </button>
            <br />
            <br />
            <button onClick={back} className="backbtn">
              Cancel this sale
            </button>
          </div>
        </form>

        {enterCustomerInfo && (
          <div
            className="customer-form-modal-overlay"
            onClick={closeCustomerInfoFormModal}
          >
            <div
              className="customer-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="customer-modal-close-button"
                onClick={closeCustomerInfoFormModal}
              >
                &times;
              </button>
              <div className="customer-modal-body">
                <form
                  onSubmit={handleCustomerFormSubmit}
                  className="customer-form"
                >
                  <div>
                    <label>Customer Name</label>
                    <input
                      type="text"
                      name="customerName"
                      onChange={handleCustomerInfoChange}
                      placeholder=""
                      className="customer-input"
                    />
                    <label>Customer Phone Number</label>{" "}
                    <input
                      type="text"
                      name="customerPhone"
                      onChange={handleCustomerInfoChange}
                      placeholder=""
                      className="customer-input"
                    />
                    <label>Email address</label>{" "}
                    <input
                      type="email"
                      name="customerEmail"
                      onChange={handleCustomerInfoChange}
                      placeholder=""
                      className="customer-input"
                    />
                  </div>
                  <button type="submit" className="save-customer-form-btn">
                    Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        {sales.length > 0 && (
          <div className="print-table">
            <div className="receipt" id="receipt">
              <div className="receipt-header">
                <h1 style={{ fontFamily: "Georgia" }}>VALUEMART</h1>
                <p>
                  <i>~ Transforming the office workspace ~</i>
                </p>
                <p>Ngara Rd, P.O BOX 513-00600</p>
                <p>Tel: +254 720 731 982</p>
                <p>Date: {new Date().toLocaleString()}</p>
                <br />
                <p style={{ textAlign: "left" }}>Receipt No. {sale.number}</p>
                {/*<Barcode code={sale.number} />*/}
              </div>
              ------------------------------------------------------------------------------
              {sales.map((sale, index) => {
                let saleTotal = 0; // Initialize the total for each sale
                return (
                  <div className="receipt-body" key={index}>
                    <div
                      className="receipt-item header"
                      style={{ fontFamily: "retro" }}
                    >
                      <span>
                        <strong>Qty</strong>
                      </span>
                      <span>
                        <strong>Item</strong>
                      </span>
                      <span>
                        <strong>Code</strong>
                      </span>
                      <span>
                        <strong>Each</strong>
                      </span>
                      <span>
                        <strong>Total</strong>
                      </span>
                    </div>
                    ---------------------------------------------------------------
                    {sale.map((item, i) => {
                      saleTotal += item.total; // Accumulate the total for each item
                      return (
                        <div key={i}>
                          <div className="receipt-item">
                            <span>{item.quantity}</span>
                            <span>{item.description}</span>
                            <span>({item.code})</span>
                            <span>{item.price.toLocaleString()}</span>
                            <span>{item.total.toLocaleString()}</span>{" "}
                          </div>
                        </div>
                      );
                    })}
                    <div className="total">
                      <p>
                        ---------------------------------------------------------------
                      </p>
                      <span>Total: Ksh. {saleTotal.toLocaleString()}</span>
                      <p>
                        ---------------------------------------------------------------
                      </p>
                    </div>
                  </div>
                );
              })}
              <div className="receipt-footer">
                <p>Served by: {sale.saleperson}</p>
              </div>
              <div className="footer-message">
                <br />
                <p>
                  <strong>
                    <i>Thank you for shopping!</i>
                  </strong>
                </p>
                <p>**********************************************</p>
              </div>
            </div>
          </div>
        )}

        {/*isImageAvailable && (
          <div className="image-container">
            <img src={image} alt="Selected product" className="product-image" />
          </div>
        )*/}
      </div>
    </>
  );
}

export default AddSale;
