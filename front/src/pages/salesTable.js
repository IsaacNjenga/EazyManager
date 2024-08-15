import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { format, isValid } from "date-fns";
import { toast } from "react-hot-toast";
function SalesTable() {
  const [sales, setSales] = useState([]);
  const [grid, setGrid] = useState(false);
  const [list, SetList] = useState(true);
  const [search, setSearch] = useState("");
  let [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [userWantsToDelete, setUserWantsToDelete] = useState(true);
  const [selectedSaleNumber, setSelectedSaleNumber] = useState(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function gridlayout() {
    setGrid(true);
    SetList(false);
    console.log(currentDateTime);
  }

  function listLayout() {
    SetList(true);
    setGrid(false);
  }

  const click = (saleNumber) => {
    setUserWantsToDelete(false);
    setSelectedSaleNumber(saleNumber);
  };

  const handleYesClick = async (id) => {
    try {
      await axios.delete(`deleteSale/` + id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSales((prevSales) => prevSales.filter((sale) => sale._id !== id));
      setUserWantsToDelete(true);
      setSelectedSaleNumber(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNoClick = () => {
    setUserWantsToDelete(true);
    setSelectedSaleNumber(null);
  };

  useEffect(() => {
    axios
      .get(`sales`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((result) => setSales(result.data))
      .catch((err) => console.log(err));
  }, []);

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

  const totalAmount = sales
    .reduce((acc, sale) => acc + sale.total, 0)
    .toLocaleString();

  const groupedSalesByDate = sales.reduce((acc, sale) => {
    const date = format(new Date(sale.datesold), "yyyy-MM-dd");
    acc[date] = acc[date] || [];
    acc[date].push(sale);
    return acc;
  }, {});

  const totalAmountByDate = Object.keys(groupedSalesByDate).reduce(
    (acc, date) => {
      const totalForDate = groupedSalesByDate[date].reduce(
        (total, sale) => total + sale.total,
        0
      );
      acc[date] = totalForDate.toLocaleString();
      return acc;
    },
    {}
  );

  const totalCommissionByDate = Object.keys(groupedSalesByDate).reduce(
    (acc, date) => {
      const totalCommissionForDate = groupedSalesByDate[date].reduce(
        (commission, sale) => commission + sale.commission,
        0
      );
      acc[date] = totalCommissionForDate.toLocaleString();
      return acc;
    },
    {}
  );

  const groupedSalesByDateSorted = Object.keys(groupedSalesByDate).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {grid && (
        <form className="search-panels">
          <InputGroup className="search-groups">
            <Form.Control
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sales..."
            />
          </InputGroup>
        </form>
      )}
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
      <Link to="/add-sale" className="addbtn" style={{ fontWeight: "bold" }}>
        + Add sale
      </Link>
      <br />
      {grid && Array.isArray(sales) ? (
        <div className="grid-layout">
          {sales
            .filter(
              (sale) =>
                search.toLowerCase() === "" ||
                Object.values(sale).some(
                  (value) =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(search)
                )
            )

            .map((sale) => (
              <div className="sale" key={sale.number}>
                <div className="card">
                  <p className="img">
                    <img
                      src={sale.image}
                      alt="Image_here"
                      style={styles2}
                      className="img2"
                    />
                  </p>
                  <hr />
                  <div className="content">
                    <p>
                      <b>Receipt No:</b> {sale.number}
                    </p>
                    <p>
                      <b>Item No:</b> {sale.pnumber}
                    </p>
                    <p>
                      <b>Code:</b> {sale.code}
                    </p>
                    <p>
                      <b>Item:</b>{" "}
                      <b>
                        {" "}
                        {sale.colour} {sale.description}{" "}
                      </b>
                    </p>
                    <p>
                      <b>Price:</b> Ksh.{sale.price.toLocaleString()}
                    </p>
                    <span>
                      <b>Quantity:</b>
                    </span>{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      {sale.quantity}
                    </span>
                    <p> </p>
                    {isValid(new Date(sale.datesold)) ? (
                      <p>
                        <b>Date Sold:</b>{" "}
                        {format(new Date(sale.datesold), "EEEE, dd/MM/yyyy")}
                      </p>
                    ) : (
                      <p>Invalid date format</p>
                    )}
                    <p>
                      <b>Salesperson:</b> {sale.saleperson}
                    </p>
                    <span>
                      <b>Commission:</b>
                    </span>{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Ksh. {sale.commission.toLocaleString()}
                    </span>
                    <hr />
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Total:{" "}
                    </span>
                    <span
                      style={{
                        color: "green",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      Ksh.{sale.total.toLocaleString()}
                    </span>
                    <br />
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
                          to={`/update-sale/${sale._id}`}
                          style={{ color: "black" }}
                        >
                          <i className="material-icons">edit</i>
                        </Link>
                      </button>{" "}
                      <button
                        className="deletebtn"
                        onClick={() => click(sale._id)}
                      >
                        <i className="material-icons">delete</i>
                      </button>
                      <br />
                    </div>{" "}
                    {!userWantsToDelete && selectedSaleNumber === sale._id && (
                      <div
                        style={{ textAlign: "center", alignItems: "center" }}
                      >
                        <p>Are you sure you want to delete?</p>
                        <button
                          className="addbtn"
                          onClick={() => {
                            handleYesClick(sale._id);
                            toast.success("Sale deleted!");
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
      {list &&
        groupedSalesByDateSorted.map((date) => (
          <div key={date}>
            <div className="print-table">
              <h3>{format(new Date(date), "EEEE, MMMM do, yyyy")}</h3>
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
                          borderRight: "0.5px solid white",
                        }}
                      >
                        Description{" "}
                      </th>
                      <th
                        style={{
                          borderRight: "0.5px solid white",
                        }}
                      >
                        Colour{" "}
                      </th>
                      <th
                        style={{
                          borderRight: "0.5px solid white",
                        }}
                      >
                        Item No.
                      </th>
                      <th
                        style={{
                          borderRight: "0.5px solid white",
                        }}
                      >
                        Code
                      </th>
                      <th
                        style={{
                          borderRight: "0.5px solid white",
                        }}
                      >
                        Receipt No.
                      </th>
                      <th
                        style={{
                          borderRight: "0.5px solid white",
                        }}
                      >
                        Price
                      </th>
                      <th
                        style={{
                          borderRight: "0.5px solid white",
                        }}
                      >
                        Quantity
                      </th>
                      <th
                        style={{
                          borderRight: "0.5px solid white",
                        }}
                      >
                        Total{" "}
                      </th>
                      <th
                        style={{
                          borderRight: "0.5px solid white",
                        }}
                      >
                        Salesperson{" "}
                      </th>
                      <th>Commission</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tr>
                    <td colSpan="13">
                      <hr />
                    </td>
                  </tr>

                  <tbody>
                    {groupedSalesByDate[date].map((sale, index) => (
                      <React.Fragment key={sale.number}>
                        <tr>
                          <td
                            style={{
                              backgroundColor: "#5bacba",
                              borderRight: "0px solid grey",
                            }}
                          >
                            <img
                              src={sale.image}
                              alt="img_here"
                              style={styles}
                              className="img2"
                            />
                          </td>
                          <td
                            style={{
                              backgroundColor: "#e0e0e0",
                              fontWeight: "bold",
                              width: "150px",
                            }}
                          >
                            {sale.description}
                          </td>
                          <td
                            style={{
                              backgroundColor: "#5bacba",
                              fontWeight: "bold",
                              color: "white",
                            }}
                          >
                            {sale.colour}
                          </td>
                          <td
                            style={{
                              backgroundColor: "#e0e0e0",
                              fontWeight: "bold",
                            }}
                          >
                            {sale.pnumber}
                          </td>
                          <td
                            style={{
                              fontWeight: "bold",
                              backgroundColor: "#5bacba",
                              color: "white",
                              width: "95px",
                            }}
                          >
                            {sale.code}
                          </td>
                          <td
                            style={{
                              backgroundColor: "#e0e0e0",
                              color: "black",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            {sale.number}
                          </td>
                          <td
                            style={{
                              fontWeight: "bold",
                              backgroundColor: "#5bacba",
                              color: "white",
                            }}
                          >
                            Ksh.{sale.price.toLocaleString()}
                          </td>
                          <td
                            style={{
                              backgroundColor: "#e0e0e0",
                              color: "purple",
                              fontWeight: "bold",
                            }}
                          >
                            {sale.quantity}
                          </td>
                          <td
                            style={{
                              padding: "14px",
                              backgroundColor: "#5bacba",
                              color: "white",
                            }}
                          >
                            <b>Ksh.{sale.total.toLocaleString()}</b>
                          </td>
                          <td
                            style={{
                              backgroundColor: "#e0e0e0",
                              color: "black",
                              fontWeight: "bold",
                              width: "90px",
                            }}
                          >
                            {sale.saleperson}
                          </td>
                          <td
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              backgroundColor: "#5bacba",
                              width: "95px",
                            }}
                          >
                            Ksh.{sale.commission.toLocaleString()}
                          </td>
                          <td style={{ width: "100px" }}>
                            <div className="buttons-container">
                              <button className="updatebtn">
                                <Link
                                  to={`/update-sale/${sale._id}`}
                                  style={{ color: "black" }}
                                >
                                  <i className="material-icons">edit</i>
                                </Link>
                              </button>{" "}
                              <button
                                className="deletebtn"
                                onClick={() => click(sale._id)}
                              >
                                <i className="material-icons">delete</i>
                              </button>
                              {!userWantsToDelete &&
                                selectedSaleNumber === sale._id && (
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
                                        handleYesClick(sale._id);
                                        toast.success("Sale deleted!");
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
                        {index < sales.length - 1 && (
                          <tr>
                            <td colSpan="13">
                              <hr />
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                    <tr>
                      <td colSpan="8" style={{ textAlign: "right" }}></td>
                      <td
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          color: "green",
                        }}
                      >
                        Ksh. {totalAmountByDate[date]}
                      </td>
                      <td colSpan="1" style={{ textAlign: "right" }}></td>
                      <td
                        colSpan="1"
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          color: "red",
                        }}
                      >
                        Ksh. {totalCommissionByDate[date]}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      <p>
        <b>Total Sales Amount: Ksh. {totalAmount}</b>
      </p>
    </div>
  );
}

export default SalesTable;
