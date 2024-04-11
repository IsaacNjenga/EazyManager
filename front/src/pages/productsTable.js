import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

function ProductsTable() {
  const [products, setProducts] = useState([]);
  const [grid, setGrid] = useState(false);
  const [list, SetList] = useState(true);
  const [search, setSearch] = useState("");
  const [userWantsToDelete, setUserWantsToDelete] = useState(true);
  const [selectedProductNumber, setSelectedProductNumber] = useState(null);

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
      await axios.delete(`https://eazy-manager.vercel.app/deleteProduct/` + id);
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

  useEffect(() => {
    axios
      .get(`https://eazy-manager.vercel.app/products`)
      .then((result) => setProducts(result.data))
      .catch((err) => console.log(err));
  }, []);

  const styles = {
    width: "auto",
    height: "auto",
    maxHeight: "auto",
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

      <Link to="/add" className="addbtn" style={{ fontWeight: "bold" }}>
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
                          to={`/update/${product._id}`}
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
                            onClick={() => handleYesClick(product._id)}
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
          <table className="productstable">
            <thead>
              <tr>
                <th>Image</th>
                <th style={{ verticalAlign: "middle" }}>Description</th>
                <th
                  className="th hover-pointer"
                  style={{ verticalAlign: "middle" }}
                >
                  Colour
                </th>
                <th>Code</th>
                <th className="th hover-pointer">P/No </th>

                <th
                  className="th hover-pointer"
                  style={{ verticalAlign: "middle" }}
                >
                  Quantity
                </th>
                <th>FC/No</th>
                <th>AMT</th>
                <th className="th hover-pointer">Location</th>
                <th>Summary</th>
              </tr>
              <tr>
                <td colSpan="14"></td>
              </tr>
            </thead>
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
                      <td>
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
                          fontWeight: "bold",
                        }}
                      >
                        {product.description}
                      </td>
                      <td
                        style={{ backgroundColor: "#5bacba", color: "white" }}
                      >
                        {product.colour}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#e0e0e0",
                          fontWeight: "bold",
                        }}
                      >
                        {product.code}
                      </td>
                      <td
                        style={{ backgroundColor: "#5bacba", color: "white" }}
                      >
                        {product.number}
                      </td>
                      <td
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          backgroundColor: "#e0e0e0",
                        }}
                      >
                        {product.quantity}
                      </td>
                      <td
                        style={{ backgroundColor: "#5bacba", color: "white" }}
                      >
                        {product.bnumber}
                      </td>
                      <td
                        style={{
                          backgroundColor: "#e0e0e0",
                          fontWeight: "bold",
                        }}
                      >
                        Ksh.{product.price.toLocaleString()}
                      </td>
                      <td
                        style={{ backgroundColor: "#5bacba", color: "white" }}
                      >
                        {product.location}
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#e0e0e0",
                          color: "red",
                        }}
                      >
                        {product.summary}
                      </td>
                      <td>
                        <div className="buttons-container">
                          <button className="updatebtn">
                            <Link
                              to={`/update/${product._id}`}
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
                                  onClick={() => handleYesClick(product._id)}
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
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default ProductsTable;
