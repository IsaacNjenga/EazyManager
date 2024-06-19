import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
function ExpenseTable() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [daySelected, setDaySelected] = useState(false);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [day, setDay] = useState(new Date());
  const [userWantsToDelete, setUserWantsToDelete] = useState(true);
  const [selectedExpenseNumber, setSelectedExpenseNumber] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(`https://eazy-manager.vercel.app/sales`);
        setSales(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSales();
  }, [currentDateTime]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const resExpense = await axios.get(`https://eazy-manager.vercel.app/expenses`);
        setExpenses(resExpense.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExpenses();
  }, [currentDateTime]);

  const click = (expenseNumber) => {
    setUserWantsToDelete(false);
    setSelectedExpenseNumber(expenseNumber);
  };

  const handleYesClick = async (id) => {
    try {
      await axios.delete(`https://eazy-manager.vercel.app/deleteExpense/` + id);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense._id!== id)
      );
      setUserWantsToDelete(true);
      setSelectedExpenseNumber(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleNoClick = () => {
    setUserWantsToDelete(true);
    setSelectedExpenseNumber(null);
  };

  const handleDateChange = (date) => {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      setDay(date);
      console.log(daySelected);
      setDaySelected(true);
    }, 1000);
  };

  const formattedDate = format(day, "EEEE, dd-MM-yyyy");

  const groupedExpensesByDate = expenses.reduce((acc, expense) => {
    const expenseDate = new Date(expense.date);
    const expenseDay = format(expenseDate, "EEEE, dd-MM-yyyy");
    acc[expenseDay] = acc[expenseDay] || [];
    acc[expenseDay].push(expense);
    return acc;
  }, {});

  const groupedSalesByDate = sales.reduce((acc, sale) => {
    const saleDate = new Date(sale.datesold);
    const saleDay = format(saleDate, "EEEE, dd-MM-yyyy");
    acc[saleDay] = acc[saleDay] || [];
    acc[saleDay].push(sale);
    return acc;
  }, {});

  const totalExpenseByDate = Object.keys(groupedExpensesByDate).reduce(
    (acc, date) => {
      const totalForDate = groupedExpensesByDate[date].reduce(
        (cost, expense) => cost + expense.cost,
        0
      );
      acc[date] = totalForDate.toLocaleString();
      return acc;
    },
    {}
  );

  const revenue = groupedSalesByDate[formattedDate]
    ? groupedSalesByDate[formattedDate]
        .reduce((acc, sale) => acc + sale.total, 0)
        .toLocaleString()
    : 0;

  const commish = groupedSalesByDate[formattedDate]
    ? groupedSalesByDate[formattedDate]
        .reduce((acc, sale) => acc + sale.commission, 0)
        .toLocaleString()
    : 0;

  const profits = groupedSalesByDate[formattedDate]
    ? groupedSalesByDate[formattedDate]
        .reduce((acc, sale) => acc + (sale.total - sale.commission), 0)
        .toLocaleString()
    : 0;

  const totExpenses =
    (totalExpenseByDate[formattedDate]
      ? parseFloat(totalExpenseByDate[formattedDate].replace(/,/g, ""))
      : 0) + (commish ? parseFloat(commish.replace(/,/g, "")) : 0);

  const totRevenue = revenue ? parseFloat(revenue.replace(/,/g, "")) : 0;

  const netProfit = totRevenue - totExpenses;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <br />
      <br />
      <label>Select Date:</label>
      <DatePicker
        className="customeDatePicker"
        type="date"
        selected={day}
        onChange={handleDateChange}
        dateFormat="EEEE, dd-MM-yyyy"
      />
      <br />
      <button className="button-name" onClick={handlePrint}>
        Print
      </button><br/><br/>
      <Link to="/add" className="addbtn" style={{ fontWeight: "bold" }}>
        {" "}
        + Add Expense{" "}
      </Link>
      <div className="print-table">
        {" "}
        <h1>{format(new Date(day), "EEEE, dd MMMM yyyy")}</h1>
        {groupedSalesByDate[formattedDate] &&
          groupedSalesByDate[formattedDate].map((sale) => (
            <React.Fragment key={sale.number}>
              <p>{sale.details}</p>
            </React.Fragment>
          ))}
        <table className="productstable">
          <thead>
            <tr>
              <th>Expense No.</th>
              <th>Description</th>
              <th>Cost</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {groupedExpensesByDate[formattedDate] &&
              groupedExpensesByDate[formattedDate].map((expense) => (
                <tr key={expense.number}>
                  <td
                    style={{ backgroundColor: "#e0e0e0", fontWeight: "bold" }}
                  >
                    {expense.number}
                  </td>
                  <td style={{ backgroundColor: "#5bacba", color: "white" }}>
                    {expense.description}
                  </td>
                  <td
                    style={{ backgroundColor: "#e0e0e0", fontWeight: "bold" }}
                  >
                    Ksh.{expense.cost.toLocaleString()}
                  </td>
                  <td style={{ backgroundColor: "#5bacba", color: "white" }}>
                    {expense.category}
                  </td>
                  <td>
                  <div className="buttons-container">
                    <button className="updatebtn">
                      <Link
                        to={`/update/${expense._id}`}
                        style={{ color: "black" }}
                      >
                        <i className="material-icons">edit</i>
                      </Link>
                    </button>{" "}
                    <button
                      className="deletebtn"
                      onClick={() => click(expense._id)}
                    >
                      <i className="material-icons">delete</i>
                    </button>
                    {!userWantsToDelete &&
                      selectedExpenseNumber === expense._id && (
                        <div>
                          <p>Are you sure you want to delete?</p>
                          <button
                            className="addbtn"
                            onClick={() => handleYesClick(expense._id)}
                          >
                            Yes
                          </button>
                          <button className="backbtn" onClick={handleNoClick}>
                            No
                          </button>
                        </div>
                      )}
                      </div>
                  </td>
                </tr>
              ))}
            <tr>
              <td colSpan="1" style={{ textAlign: "right" }}></td>
              <td><b>Total</b></td>
              <td
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "green",
                }}
              >
                Ksh.{totalExpenseByDate[formattedDate]}
              </td>
            </tr>
          </tbody>
        </table>
        <br /><hr/>
        <table className="productstable">
          <thead>
            <tr>
              <th>Revenue</th>
              <th>Profits</th>
              <th>Commissions</th>
              <th>Total Expenses</th>
              <th>Net Profit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "green",
                }}
              >
                Ksh.{revenue.toLocaleString()}
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "green",
                }}
              >
                Ksh.{profits.toLocaleString()}
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "red",
                }}
              >
                Ksh.{commish.toLocaleString()}
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "red",
                }}
              >
                Ksh.{totalExpenseByDate[formattedDate]}
              </td>
              <td
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "green",
                }}
              >
                Ksh.{netProfit.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
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
    </div>
  );
}

export default ExpenseTable;
