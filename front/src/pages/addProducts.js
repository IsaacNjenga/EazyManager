import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  read as readExcel,
  utils as XLSXUtils,
  write as writeExcel,
} from "xlsx";
import fileSaver from "file-saver";
import Navbar from "../source/navbar";

function AddProducts() {
  const [product, setProduct] = useState([
    {
      number: "",
      description: "",
      colour: "",
      price: "",
      quantity: "",
      code: "",
      location: "",
      bnumber: "",
      summary: "",
    },
  ]);
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [productData, setProductData] = useState([]);
  const [singleEntry, setSingleEntry] = useState(false);
  const [excel, setExcel] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filled, setFilled] = useState(true);

  useEffect(() => {
    setLoading(true);
    setShowAnimation(true);
    axios
      .get("products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => {
        const productsArray = Array.isArray(result.data.products)
          ? result.data.products
          : [];
        setProducts(productsArray);
        setLoading(false);
        setShowAnimation(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        alert("An error occured. Try refreshing the page");
        setLoading(false);
        setShowAnimation(false);
        setProducts([]);
      });
  }, []);

  const lastProduct = [...products]
    .sort((a, b) => Number(a.number) - Number(b.number)) // Sort by numeric value
    .pop();

  let incrementedProductNumber;
  if (lastProduct) {
    incrementedProductNumber = Number(lastProduct.number) + 1;
  }

  const excelEntry = () => {
    setExcel(true);
    setSingleEntry(false);
  };

  const individualEntry = () => {
    setSingleEntry(true);
    setExcel(false);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const inputValueInCaps = inputValue.toUpperCase();
    setProduct((prev) => ({ ...prev, [e.target.name]: inputValueInCaps }));
  };

  const validateRequiredFields = () => {
    const requiredFields = [
      "number",
      "description",
      "code",
      "quantity",
      "price",
    ];
    const isValid = requiredFields.every(
      (field) => product[field].trim() !== ""
    );
    setFilled(isValid);
    return isValid;
  };

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    if (validateRequiredFields()) {
      setError("");
      const productData = {
        ...product,
        image: image,
      };
      axios
        .post("add", productData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((result) => {
          setShowAlert(true);
          setShowAnimation(true);
          setLoading(false);
          setTimeout(() => {
            setShowAnimation(true);
            navigate("/products");
          }, 2000);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response && err.response.status === 400) {
            const errorMessage = err.response.data.message;
            setError(`Error: ${errorMessage}`);
          } else {
            setError("The image selected is too large. Choose another.");
          }
        });
    }
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
      console.log(reader.result);
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
      alert("Payload is too large. Select a smaller image");
    };
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = readExcel(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const excelData = XLSXUtils.sheet_to_json(sheet, {
        header: 1,
        dateNF: "yyyy-MM-dd",
      });

      const productFromExcel = excelData.slice(1).map((row) => ({
        description: row[0].toUpperCase(),
        colour: row[1].toUpperCase(),
        code: row[2].toUpperCase(),
        number: row[3],
        quantity: row[4],
        bnumber: row[5],
        price: row[6],
        location: row[7].toUpperCase(),
        summary: row[8],
      }));
      setProductData(productFromExcel);
    };
    reader.readAsArrayBuffer(file);
  };

  const addExcelDoc = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        productData.map(async (productMember) => {
          try {
            await axios.post(`add`, productMember, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
          } catch (error) {
            console.log("Error adding product", error);
          }
        })
      );
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        navigate("/products");
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const generateExcelTemplate = () => {
    const headers = [
      "Description",
      "Colour",
      "Code",
      "P/No",
      "Quantity",
      "FC/No",
      "AMT",
      "Location",
      "Summary",
    ];
    const data = [headers];
    const workbook = XLSXUtils.book_new();
    const worksheet = XLSXUtils.aoa_to_sheet(data);
    XLSXUtils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelFile = writeExcel(workbook, {
      bookType: "xlsx",
      type: "binary",
    });
    const blob = new Blob([s2ab(excelFile)], {
      type: "application/vnc.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fileSaver.saveAs(blob, "product-template.xlsx");
  };

  const back = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div>
        <div
          style={{
            textAlign: "center",
            margin: "auto",
            justifyContent: "center",
          }}
        >
          <p>
            <strong>Just a second...</strong>
          </p>
          <p>
            <strong>Gathering your data</strong>
          </p>
        </div>
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
        <button onClick={back} className="backbtn">
          Back to Inventory
        </button>

        <div className="entry-container">
          <p className="text-content">
            Add from <br /> Excel Document or Single Entry?
          </p>
          <div className="btnbox">
            <button className="excelbtn" onClick={excelEntry}>
              Excel Document
            </button>{" "}
            <button className="singlebtn" onClick={individualEntry}>
              Single Entry
            </button>
          </div>
        </div>

        {excel && (
          <div>
            <label>Get the Excel Document from here:</label>
            <button onClick={generateExcelTemplate}>Download Template</button>
            <br />
            <br />
            <h3>Upload Document</h3>
            <input
              type="file"
              style={{ width: "300px" }}
              onChange={handleExcelUpload}
              accept=".xlsx,.xls"
            />
            <br />
            <button onClick={addExcelDoc}>Upload Excel Document</button>
            <br />
            <hr />
            {productData.length > 0 && (
              <table className="productstable">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Colour</th>
                    <th>Code</th>
                    <th>P/No</th>
                    <th>Quantity</th>
                    <th>FC/No</th>
                    <th>AMT</th>
                    <th>Location</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.map((product, index) => (
                    <tr key={index}>
                      <td>{product.description}</td>
                      <td>{product.colour}</td>
                      <td>{product.code}</td>
                      <td>{product.number}</td>
                      <td>{product.quantity}</td>
                      <td>{product.bnumber}</td>
                      <td>Ksh.{product.price.toLocaleString()}</td>
                      <td>{product.location}</td>
                      <td>{product.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {singleEntry && (
          <form className="form" onSubmit={submit}>
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
              <span
                style={{ fontSize: "35px", color: "red", fontWeight: "bold" }}
              >
                Manager
              </span>
              <h3>Product Entry</h3>
            </div>
            <hr />
            <br />
            <span>Product Number</span>{" "}
            <span
              style={{ color: "red", fontWeight: "bolder", fontSize: "18px" }}
            >
              *
            </span>
            :
            <input
              type="text"
              placeholder={
                incrementedProductNumber || incrementedProductNumber === 0
                  ? incrementedProductNumber.toString()
                  : ""
              }
              onChange={handleChange}
              name="number"
            />
            <br />
            <span>Description</span>{" "}
            <span
              style={{ color: "red", fontWeight: "bolder", fontSize: "18px" }}
            >
              *
            </span>
            :
            <input
              type="text"
              placeholder="Description"
              onChange={handleChange}
              name="description"
            />
            <br />
            <span>Product Code</span>{" "}
            <span
              style={{ color: "red", fontWeight: "bolder", fontSize: "18px" }}
            >
              *
            </span>
            :
            <input
              type="text"
              placeholder="XX123"
              onChange={handleChange}
              name="code"
            />
            <br />
            Colour:
            <input
              type="text"
              placeholder="Colour"
              onChange={handleChange}
              name="colour"
            />
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
              Quantity *:
              <input
                type="text"
                placeholder="Quantity"
                onChange={handleChange}
                name="quantity"
              />
              Price per unit *:
              <input
                type="text"
                placeholder="Price"
                onChange={handleChange}
                name="price"
              />
              FC Number:
              <input
                type="text"
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
              placeholder="Location"
              onChange={handleChange}
              name="location"
            />
            <br />
            <br />
            Summary
            <textarea
              onChange={handleChange}
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
            <input accept="image/*" type="file" onChange={convertToBase64} />
            <br />
            <hr />*/}
            {showAlert && (
              <div className="alert">
                <p style={{ textAlign: "center" }}>
                  Success! <i className="material-icons">check</i>{" "}
                </p>
              </div>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!filled && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Please fill out all the fields marked with '
                <span
                  style={{
                    color: "red",
                    fontWeight: "bolder",
                    fontSize: "18px",
                  }}
                >
                  *
                </span>
                ' before proceeding
              </div>
            )}
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button className="addbtn">Add Product</button>
              <button onClick={back} className="backbtn">
                Cancel
              </button>
            </div>
          </form>
        )}

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

export default AddProducts;
