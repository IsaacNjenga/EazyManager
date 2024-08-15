import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [grid, setGrid] = useState(false);
  const [list, SetList] = useState(true);
  const [search, setSearch] = useState("");
  const [userWantsToDelete, setUserWantsToDelete] = useState(true);
  const [selectedProductNumber, setSelectedProductNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  const [sortByCode, setSortByCode] = useState(true);
  const [sortByNumber, setSortByNumber] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  function gridlayout() {
    setGrid(true);
    SetList(false);
  }

  function listLayout() {
    SetList(true);
    setGrid(false);
  }

  const click = (productNumber) => {
    setUserWantsToDelete(false);
    setSelectedProductNumber(productNumber);
  };

  const handleYesClick = async (id) => {
    try {
      await axios.delete(`deleteProduct/` + id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
      setUserWantsToDelete(true);
      setSelectedProductNumber(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNoClick = () => {
    setUserWantsToDelete(true);
    setSelectedProductNumber(null);
  };

  const sortProducts = (productsArray, sortByCode) => {
    return sortByCode
      ? productsArray.sort((a, b) => a.code.localeCompare(b.code))
      : productsArray.sort((a, b) => a.number.localeCompare(b.number));
  };

  useEffect(() => {
    setLoading(true);
    setShowAnimation(true);
    axios
      .get(`products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => {
        const productsArray = Array.isArray(result.data.products)
          ? result.data.products
          : [];
        const sortedProducts = sortProducts(productsArray, sortByCode);
        setProducts(sortedProducts);
        setLoading(false);
        setShowAnimation(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        alert("An error occured. Try refreshing the page");
        setLoading(false);
        setShowAnimation(false);
      });
  }, [sortByCode, sortByNumber]);

  const styles = {
    width: "150px",
    height: "150px",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "10px",
    border: "1px inset #050101",
    boxShadow: "5px 5px 36px #a78e8e, -5px -5px 36px #e7c4c4",
  };

  const styles2 = {
    width: "160px",
    height: "150px",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "10px",
    border: "1px inset #050101",
    boxShadow: "5px 5px 36px #a78e8e, -5px -5px 36px #e7c4c4",
  };

  const buttonStyle = {
    backgroundColor: grid ? "black" : "initial",
    color: grid ? "white" : "initial",
  };

  const buttonStyle2 = {
    backgroundColor: list ? "black" : "initial",
    color: list ? "white" : "initial",
  };

  const handlePrint = () => {
    window.print();
  };

  const groupedProductsByCode = products.reduce((acc, product) => {
    const code = product.code;

    if (!acc[code]) {
      acc[code] = [];
    }
    acc[code].push(product);
    return acc;
  }, {});

  const codeTotals = {};
  for (const code in groupedProductsByCode) {
    codeTotals[code] = groupedProductsByCode[code].reduce(
      (total, product) => total + product.quantity,
      0
    );
  }

  function byCode() {
    setSortByCode(true);
    setSortByNumber(false);
  }

  function byNumber() {
    setSortByNumber(true);
    setSortByCode(false);
  }

  const productHistory = (productNumber) => {
    try {
      axios
        .get(`products`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((result) => {
          const productsArray = Array.isArray(result.data.products)
            ? result.data.products
            : [];
          const fetchedProduct = productsArray.find(
            (product) => product._id === productNumber
          );
          setSelectedItem(fetchedProduct);
        });
    } catch (error) {
      alert("An error occurred. Try refreshing or logging in again");
      console.log(error);
    }
  };

  const closeHistoryModal = () => {
    setSelectedItem(null);
  };

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
    <div>
      <form className="search-panels">
        <InputGroup className="search-groups">
          <Form.Control
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Products..."
          />
        </InputGroup>
      </form>
      <br />

      <Link
        to="/add-product"
        className="addbtn"
        title="Add a new product"
        style={{ fontWeight: "bold" }}
      >
        + Add Product
      </Link>
      <br />
      <br />
      <button onClick={gridlayout} style={buttonStyle}>
        <i className="material-icons">view_module</i>
      </button>
      <button onClick={listLayout} style={buttonStyle2}>
        <i className="material-icons">list</i>
      </button>
      <br />
      <br />
      <button className="button-name" onClick={handlePrint}>
        Print
      </button>
      <br />
      <br />
      <div className="dropdown-content">
        <button onClick={byCode}>Sort by Code</button>
        {"  "}
        <button onClick={byNumber}>Sort by Number</button>
      </div>
      <br />
      <br />
      <br />
      <br />

      {grid && Array.isArray(products) ? (
        <div className="grid-layout">
          {products
            .filter(
              (product) =>
                search.toLowerCase() === "" ||
                Object.values(product).some(
                  (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(search)
                )
            )

            .map((product) => (
              <div className="product" key={product.number}>
                <div className="card">
                  <p className="img">
                    <img
                      src={product.image}
                      alt="Image_here"
                      style={styles2}
                      className="img2"
                    />
                  </p>
                  <hr />
                  <div className="content">
                    <p>
                      <b>Product Number:</b> {product.number}
                    </p>
                    <p>
                      <b>Code:</b> {product.code}
                    </p>
                    <p>
                      <b>Description:</b> {product.description}
                    </p>
                    <p>
                      <b>Colour:</b> {product.colour}
                    </p>
                    <span>
                      <b>Quantity:</b>
                    </span>{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {product.quantity}
                    </span>
                    <p>
                      <b>B/No:</b> {product.bnumber}
                    </p>
                    <p>
                      <b>Location:</b> {product.location}
                    </p>
                    <p>
                      <b>Summary:</b> {product.summary}
                    </p>
                    <hr />
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "34px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Ksh.{product.price.toLocaleString()}
                    </span>
                    <br />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <button className="updatebtn">
                        <Link
                          to={`/update-product/${product._id}`}
                          style={{ color: "black" }}
                        >
                          <i className="material-icons">edit</i>
                        </Link>
                      </button>{" "}
                      <button
                        className="deletebtn"
                        onClick={() => click(product._id)}
                      >
                        <i className="material-icons">delete</i>
                      </button>
                      <br />
                    </div>{" "}
                    {!userWantsToDelete &&
                      selectedProductNumber === product._id && (
                        <div
                          style={{ textAlign: "center", alignItems: "center" }}
                        >
                          <p>Are you sure you want to delete?</p>
                          <button
                            className="addbtn"
                            onClick={() => {
                              handleYesClick(product._id);
                              toast.success("Product deleted!");
                            }}
                          >
                            Yes
                          </button>
                          <button className="backbtn" onClick={handleNoClick}>
                            No
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p></p>
      )}

      {list && Array.isArray(products) ? (
        <div className="print-table">
          <div className="table-container">
            <table className="productstable">
              <thead className="table-header">
                <tr>
                  <th
                    style={{
                      borderRight: "0.5px solid white",
                      textAlign: "center",
                    }}
                  >
                    Image
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      borderRight: "0.5px solid white",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      borderRight: "0.5px solid white",
                    }}
                  >
                    Colour
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      borderRight: "0.5px solid white",
                    }}
                  >
                    Code
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      borderRight: "0.5px solid white",
                    }}
                  >
                    Product No.
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      borderRight: "0.5px solid white",
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      borderRight: "0.5px solid white",
                    }}
                  >
                    Batch No.
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      borderRight: "0.5px solid white",
                    }}
                  >
                    AMT
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      borderRight: "0.5px solid white",
                    }}
                  >
                    Location
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      borderRight: "0.5px solid white",
                    }}
                  >
                    Total Quantity
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                    }}
                  >
                    Summary
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tr>
                <td colSpan="16">
                  <hr />
                </td>
              </tr>

              <tbody>
                {products
                  .filter(
                    (product) =>
                      search.toLowerCase() === "" ||
                      Object.values(product).some(
                        (value) =>
                          typeof value === "string" &&
                          value.toLowerCase().includes(search)
                      )
                  )
                  .map((product) => (
                    <React.Fragment key={product._id}>
                      <tr>
                        <td
                          style={{
                            backgroundColor: "#5bacba",
                            color: "white",
                          }}
                        >
                          {
                            <img
                              src={product.image}
                              alt="Image_here"
                              style={styles}
                              className="img2"
                            />
                          }
                        </td>
                        <td
                          style={{
                            backgroundColor: "#e0e0e0",
                            color: "black",
                            textAlign: "center",
                            fontWeight: "bold",
                            width: "150px",
                          }}
                        >
                          {product.description}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#5bacba",
                            color: "white",
                            width: "95px",
                          }}
                        >
                          {product.colour}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#e0e0e0",
                            color: "black",
                            fontWeight: "bold",
                            width: "100px",
                          }}
                        >
                          {product.code}
                        </td>

                        <td
                          style={{
                            backgroundColor: "#5bacba",
                            color: "white",
                            width: "100px",
                          }}
                        >
                          {product.number}
                        </td>
                        <td
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            backgroundColor: "#e0e0e0",
                            width: "100px",
                          }}
                        >
                          {product.quantity}
                        </td>
                        <td
                          style={{
                            width: "100px",
                            backgroundColor: "#5bacba",
                            color: "white",
                          }}
                        >
                          {product.bnumber}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#e0e0e0",
                            color: "black",
                            width: "100px",
                          }}
                        >
                          Ksh.{product.price.toLocaleString()}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#5bacba",
                            color: "white",
                            fontWeight: "bold",
                            width: "100px",
                          }}
                        >
                          {product.location}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#e0e0e0",
                            color: "black",
                            width: "100px",
                          }}
                        >
                          <b>{codeTotals[product.code]}</b>
                        </td>
                        <td
                          style={{
                            fontWeight: "bold",
                            backgroundColor: "#5bacba",
                            color: "red",
                            width: "155px",
                          }}
                        >
                          {product.summary}
                        </td>
                        <td>
                          <div className="buttons-container">
                            <button
                              className="historybtn"
                              title="View the history"
                              onClick={() => productHistory(product._id)}
                            >
                              <i className="material-icons">visibility</i>
                            </button>
                            <button
                              className="updatebtn"
                              title="Update this record"
                            >
                              <Link
                                to={`/update-product/${product._id}`}
                                style={{ color: "black" }}
                              >
                                <i className="material-icons">edit</i>
                              </Link>
                            </button>{" "}
                            <button
                              className="deletebtn"
                              title="Delete this record"
                              onClick={() => click(product._id)}
                            >
                              <i className="material-icons">delete</i>
                            </button>
                            {!userWantsToDelete &&
                              selectedProductNumber === product._id && (
                                <div
                                  style={{
                                    textAlign: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <p>Are you sure you want to delete?</p>
                                  <button
                                    className="addbtn"
                                    onClick={() => {
                                      handleYesClick(product._id);
                                      toast.success("Product deleted!");
                                    }}
                                  >
                                    Yes
                                  </button>
                                  <button
                                    className="backbtn"
                                    onClick={handleNoClick}
                                  >
                                    No
                                  </button>
                                </div>
                              )}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="14">
                          <hr />
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p></p>
      )}
      {selectedItem && (
        <div className="modal-overlay" onClick={closeHistoryModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeHistoryModal}>
              &times;
            </button>
            <h1 className="modal-title">Product History</h1>
            <div className="modal-body">
              <img
                src={selectedItem.image}
                alt="Product"
                className="product-image"
              />
              <div className="product-details">
                <h3 className="product-description">
                  {selectedItem.description}
                </h3>
                {selectedItem.createdAt && (
                  <p className="product-info">
                    <strong>First Entered:</strong>{" "}
                    {format(
                      new Date(selectedItem.createdAt),
                      "EEEE, MMM do, yyyy"
                    )}
                  </p>
                )}
                <p className="product-info">
                  <strong>Quantity:</strong> {selectedItem.quantity}
                </p>
                <p className="product-info">
                  <strong>Colour:</strong> {selectedItem.colour}
                </p>
                <p className="product-info">
                  <strong>Location:</strong> {selectedItem.location}
                </p>
                <p className="product-info">
                  <strong>Batch No.:</strong> {selectedItem.bnumber}
                </p>
                {selectedItem.updatedAt && (
                  <p className="product-info">
                    <strong>Last Updated:</strong>{" "}
                    {format(
                      new Date(selectedItem.updatedAt),
                      "EEEE, MMM do, yyyy"
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsTable;
