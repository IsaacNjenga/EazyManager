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
      .then((result) => {
        const sortedProducts = result.data.sort((a, b) => {
          return a.code.localeCompare(b.code);
        });
        setProducts(sortedProducts);
      })
      .catch((err) => console.log(err));
  }, []);

  
    /* useEffect(() => {
    axios
      .get(`http://localhost:3001/products`)
      .then((result) => setProducts(result.data))
      .catch((err) => console.log(err));
  }, []);*/
  

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
        to="/add"
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
                              className="updatebtn"
                              title="Update this record"
                            >
                              <Link
                                to={`/update/${product._id}`}
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
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default ProductsTable;

