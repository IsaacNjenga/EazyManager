import React, { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Rectangle,
  Tooltip,
  Label,
} from "recharts";
import "./App.css";
import empty from "./empty-box.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const Dashboard = () => {
  let [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [sales, setSales] = useState([]);
  const [salePresent, setSalePresent] = useState(true);
  const [salePresentYesterday, setSalePresentYesterday] = useState(true);
  const [salePresentLastWeek, setSalePresentLastWeek] = useState(true);
  const [salePresentLastMonth, setSalePresentLastMonth] = useState(true);
  const [salePresentAnotherDay, setSalePresentAnotherDay] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [selectedRevenue, setSelectedRevenue] = useState("today");
  const [selectedProfit, setSelectedProfit] = useState("today");
  const [selectedExpense, setSelectedExpense] = useState("today");
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentWeekMonth, setCurrentWeekMonth] = useState(new Date());
  const [daySelected, setDaySelected] = useState(false);
  const [weekData, setWeekData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [day, setDay] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const yearOnly = currentDateTime.toLocaleDateString("en-Us", {
    year: "numeric",
  });

  const formattedDate2 = currentDateTime.toLocaleDateString("en-UK", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  useEffect(() => {
    axios
      .get(`https://eazy-manager.vercel.app/sales`)
      .then((result) => setSales(result.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`https://eazy-manager.vercel.app/expenses`)
      .then((result) => setExpenses(result.data))
      .catch((err) => console.log(err));
  }, []);

  const formatDate = currentDateTime.toISOString().slice(0, 10);
  const formattedDateMidnight = new Date(formatDate);
  formattedDateMidnight.setHours(0, 0, 0, 0);

 const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.datesold);  
    const formattedSaleDate = new Date(saleDate);
    formattedSaleDate.setHours(0, 0, 0, 0);
    return formattedSaleDate.getTime() === formattedDateMidnight.getTime();
  });

   const filteredExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const formattedExpenseDate = new Date(expenseDate);
    formattedExpenseDate.setHours(0, 0, 0, 0);
    return formattedExpenseDate.getTime() === formattedDateMidnight.getTime();
  });


  useEffect(() => {
    setSalePresent(filteredSales.length > 0);
  }, [filteredSales]);

  const revenue = filteredSales
    .reduce((acc, sale) => acc + sale.total, 0)
    .toLocaleString();

  const commissions = filteredSales
    .reduce((acc, sale) => acc + sale.commission, 0)
    .toLocaleString();

  const expenseToday = (
    filteredExpenses.reduce((acc, expense) => acc + expense.cost, 0) +
    (commissions ? parseFloat(commissions.replace(/,/g, "")) : 0)
  ).toLocaleString();

  const netProfit = (
    (revenue ? parseFloat(revenue.replace(/,/g, "")) : 0) -
    (expenseToday ? parseFloat(expenseToday.replace(/,/g, "")) : 0)
  ).toLocaleString();

  const styles = {
    width: "110px",
    height: "110px",
    maxHeight: "50%",
    objectFit: "contain",
    borderRadius: "7px",
    transition: "all 0.4s ease-in",
    border: "1px inset #050101",
    boxShadow: "5px 5px 36px #a78e8e, -5px -5px 36px #e7c4c4",
    position: "relative",
  };

  const boxStyle = {
    width: "110px",
    height: "110px",
    maxHeight: "50%",
    objectFit: "contain",
  };

  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const filteredSalesYesterday = sales.filter((sale) => {
    const saleDate = new Date(sale.datesold);
    return (
      saleDate.getDate() === yesterday.getDate() &&
      saleDate.getMonth() === yesterday.getMonth() &&
      saleDate.getFullYear() === yesterday.getFullYear()
    );
  });

  const filteredExpensesYesterday = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getDate() === yesterday.getDate() &&
      expenseDate.getMonth() === yesterday.getMonth() &&
      expenseDate.getFullYear() === yesterday.getFullYear()
    );
  });

  useEffect(() => {
    setSalePresentYesterday(filteredSalesYesterday.length > 0);
  }, [filteredSalesYesterday]);

  const yesterdayRevenue = filteredSalesYesterday
    .reduce((acc, sale) => acc + sale.total, 0)
    .toLocaleString();

  const yesterdayCommissions = filteredSalesYesterday
    .reduce((acc, sale) => acc + sale.commission, 0)
    .toLocaleString();

  const yesterdayExpense = (
    filteredExpensesYesterday.reduce((acc, expense) => acc + expense.cost, 0) +
    (yesterdayCommissions
      ? parseFloat(yesterdayCommissions.replace(/,/g, ""))
      : 0)
  ).toLocaleString();

  const yesterdayNetProfit = (
    (yesterdayRevenue ? parseFloat(yesterdayRevenue.replace(/,/g, "")) : 0) -
    (yesterdayExpense ? parseFloat(yesterdayExpense.replace(/,/g, "")) : 0)
  ).toLocaleString();

  const lastWeek = new Date(currentDate);
  lastWeek.setDate(currentDate.getDate() - 7);
  lastWeek.setHours(0, 0, 0, 0);
  const filteredSalesLastWeek = sales.filter((sale) => {
    const saleDate = new Date(sale.datesold);
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    lastWeekStart.setHours(0, 0, 0, 0);
    const lastWeekEnd = new Date();
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
    lastWeekEnd.setHours(23, 59, 59, 999);
    return saleDate >= lastWeekStart && saleDate <= lastWeekEnd;
  });
  const filteredExpensesLastWeek = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    lastWeekStart.setHours(0, 0, 0, 0);
    const lastWeekEnd = new Date();
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
    lastWeekEnd.setHours(23, 59, 59, 999);
    return expenseDate >= lastWeekStart && expenseDate <= lastWeekEnd;
  });

  useEffect(() => {
    setSalePresentLastWeek(filteredSalesLastWeek.length > 0);
  }, [filteredSalesLastWeek]);

  const weeklyRevenue = filteredSalesLastWeek
    .reduce((acc, sale) => acc + sale.total, 0)
    .toLocaleString();

  const weeklyCommissions = filteredSalesLastWeek
    .reduce((acc, sale) => acc + sale.commission, 0)
    .toLocaleString();

  const weeklyExpense = (
    filteredExpensesLastWeek.reduce((acc, expense) => acc + expense.cost, 0) +
    (weeklyCommissions ? parseFloat(weeklyCommissions.replace(/,/g, "")) : 0)
  ).toLocaleString();

  const weeklyNetProfit = (
    (weeklyRevenue ? parseFloat(weeklyRevenue.replace(/,/g, "")) : 0) -
    (weeklyExpense ? parseFloat(weeklyExpense.replace(/,/g, "")) : 0)
  ).toLocaleString();

  const lastMonth = new Date(currentDate);
  lastMonth.setDate(currentDate.getDate() - 30);
  lastMonth.setHours(0, 0, 0, 0);
  const filteredSalesLastMonth = sales.filter((sale) => {
    const saleDate = new Date(sale.datesold);
    const lastMonthStart = new Date();
    lastMonthStart.setDate(lastMonthStart.getDate() - 30);
    lastMonthStart.setHours(0, 0, 0, 0);
    const lastMonthEnd = new Date();
    lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);
    lastMonthEnd.setHours(23, 59, 59, 999);
    return saleDate >= lastMonthStart && saleDate <= lastMonthEnd;
  });
  const filteredExpensesLastMonth = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const lastMonthStart = new Date();
    lastMonthStart.setDate(lastMonthStart.getDate() - 30);
    lastMonthStart.setHours(0, 0, 0, 0);
    const lastMonthEnd = new Date();
    lastMonthEnd.setDate(lastMonthEnd.getDate() - 1);
    lastMonthEnd.setHours(23, 59, 59, 999);
    return expenseDate >= lastMonthStart && expenseDate <= lastMonthEnd;
  });

  useEffect(() => {
    setSalePresentLastMonth(filteredSalesLastMonth.length > 0);
  }, [filteredSalesLastMonth]);

  const monthlyRevenue = filteredSalesLastMonth
    .reduce((acc, sale) => acc + sale.total, 0)
    .toLocaleString();

  const monthlyCommissions = filteredSalesLastMonth
    .reduce((acc, sale) => acc + sale.commission, 0)
    .toLocaleString();

  const monthlyExpense = (
    filteredExpensesLastMonth.reduce((acc, expense) => acc + expense.cost, 0) +
    (monthlyCommissions ? parseFloat(monthlyCommissions.replace(/,/g, "")) : 0)
  ).toLocaleString();

  const monthlyNetProfit = (
    (monthlyRevenue ? parseFloat(monthlyRevenue.replace(/,/g, "")) : 0) -
    (monthlyExpense ? parseFloat(monthlyExpense.replace(/,/g, "")) : 0)
  ).toLocaleString();

  function salesToday() {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      setSelectedPeriod("today");
      setSelectedRevenue("today");
      setSelectedProfit("today");
      setSelectedExpense("today");
      setDaySelected(false);
    }, 1000);
  }

  function salesYesterday() {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      setSelectedPeriod("yesterday");
      setSelectedRevenue("yesterday");
      setSelectedProfit("yesterday");
      setSelectedExpense("yesterday");
      setDaySelected(false);
    }, 1000);
  }

  function salesLastWeek() {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      setSelectedPeriod("lastWeek");
      setSelectedRevenue("lastWeek");
      setSelectedProfit("lastWeek");
      setSelectedExpense("lastWeek");
      setDaySelected(false);
    }, 1000);
  }

  function salesLastMonth() {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      setSelectedPeriod("lastMonth");
      setSelectedRevenue("lastMonth");
      setSelectedProfit("lastMonth");
      setSelectedExpense("lastMonth");
      setDaySelected(false);
    }, 1000);
  }

  function salesAnotherDay() {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false);
      setSelectedPeriod("anotherDay");
      setSelectedRevenue("anotherDay");
      setSelectedProfit("anotherDay");
      setSelectedExpense("anotherDay");
    }, 1000);
  }

  const lastMonthStarting = new Date();
  lastMonthStarting.setDate(lastMonthStarting.getDate() - 30);
  const lastMonthEnding = new Date();
  lastMonthEnding.setDate(lastMonthEnding.getDate() - 0);

  const lastWeekStarting = new Date();
  lastWeekStarting.setDate(lastWeekStarting.getDate() - 7);
  const lastWeekEnding = new Date();
  lastWeekEnding.setDate(lastWeekEnding.getDate() - 0);

  const dateYesterday = new Date(currentDate);
  dateYesterday.setDate(currentDate.getDate() - 1);

  function getSuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  const weekGraph = useCallback(
    (action) => {
      let newDate = new Date(currentWeekMonth);
      if (action === "nextWeek") {
        newDate.setDate(newDate.getDate() + 7);
      } else if (action === "lastWeek") {
        newDate.setDate(newDate.getDate() - 7);
      } else if (action === "currentWeek") {
        newDate = new Date();
      }

      newDate.setHours(0);
      newDate.setMinutes(0);
      newDate.setSeconds(0);
      newDate.setMilliseconds(0);
      setCurrentWeekMonth(newDate);

      let startDate = new Date(newDate);
      startDate.setHours(0, 0, 0, 0);

      const weeksData = {};

      for (let i = 1; i <= 7; i++) {
        const dayStartDate = new Date(startDate);
        const dayEndDate = new Date(startDate);
        dayEndDate.setHours(23, 59, 59, 999);

        const dayOfMonth = dayStartDate.getDate();
        const suffix = getSuffix(dayOfMonth);
        const month = dayStartDate.toLocaleString("en-UK", {
          month:"short",
        });
        const weekday = dayStartDate.toLocaleString("en-UK", {
          weekday: "long",
        });

        const dayName = `${weekday}, ${dayOfMonth}${suffix} ${month}`;

        const weekSales = sales.filter((sale) => {
          const saleDate = new Date(sale.datesold);
          return saleDate >= dayStartDate && saleDate <= dayEndDate;
        });

        const weekExpense = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= dayStartDate && expenseDate <= dayEndDate;
        });

        const weekTotalAmount = weekSales.reduce(
          (acc, sale) => acc + sale.total,
          0
        );
        const weekTotalCommissions = weekSales.reduce(
          (acc, sale) => acc + sale.commission,
          0
        );
        const weekTotalExpense = weekExpense.reduce(
          (acc, expense) => acc + expense.cost + weekTotalCommissions,
          0
        );
        const netProfit = weekTotalAmount - weekTotalExpense;
        const weekTotalProfit = netProfit > 0 ? netProfit : 0;

        weeksData[dayName] = {
          day: dayName,
          startDate: dayStartDate.toISOString().slice(0, 10),
          endDate: dayEndDate.toISOString().slice(0, 10),
          sales: weekSales.length,
          totalAmount: weekTotalAmount,
          totalProfit: weekTotalProfit,
          totalExpense: weekTotalExpense,
        };

        startDate.setDate(startDate.getDate() - 1);
      }

      const updatedWeekData = Object.keys(weeksData).map((dayName) => ({
        name: dayName,
        Revenue: weeksData[dayName].totalAmount,
        Profit: weeksData[dayName].totalProfit,
        Expenses: weeksData[dayName].totalExpense,
      }));

      setWeekData(updatedWeekData);
    },
    [currentWeekMonth, sales, expenses]
  );

 useEffect(() => {
    weekGraph();
  }, [weekGraph]); 
  

  const handleDateChange = (date) => {
    setShowAnimation(true);
    setTimeout(() => {
      setShowAnimation(false); 
      setDay(date);
      console.log(daySelected);
      setDaySelected(true);
      salesAnotherDay();
    }, 1000);
  };

  const dayChose = format(day, "EEEE, dd-MM-yyyy");

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

  const revenueByDay = groupedSalesByDate[dayChose]
    ? groupedSalesByDate[dayChose]
        .reduce((acc, sale) => acc + sale.total, 0)
        .toLocaleString()
    : 0;

  const commish = groupedSalesByDate[dayChose]
    ? groupedSalesByDate[dayChose]
        .reduce((acc, sale) => acc + sale.commission, 0)
        .toLocaleString()
    : 0;

  const totExpenses = (
    (totalExpenseByDate[dayChose]
      ? parseFloat(totalExpenseByDate[dayChose].replace(/,/g, ""))
      : 0) + (commish ? parseFloat(commish.replace(/,/g, "")) : 0)
  ).toLocaleString();

  const totRevenue = revenueByDay
    ? parseFloat(revenueByDay.replace(/,/g, ""))
    : 0;

  const netProfitByDay = (
    totRevenue - (totExpenses ? parseFloat(totExpenses.replace(/,/g, "")) : 0)
  ).toLocaleString();

  return (
    <div>
      <div id="main">
        <div>
          <div style={{ textAlign: "center" }}>
            <span
              style={{ fontSize: "55px", color: "purple", fontStyle: "italic" }}
            >
              Easy
            </span>
            <span
              style={{ fontSize: "55px", color: "red", fontWeight: "bold" }}
            >
              Manager
            </span>
          </div>
          <hr />
          <h1 style={{ fontSize: "34px", color: "purple" }}>
            Welcome Admin <i class="material-icons">spa</i>
          </h1>
        </div>

        <div>
          <label>Select date:</label>
          <DatePicker
            className="customDatePicker"
            type="date"
            selected={day}
            onChange={handleDateChange}
            dateFormat="EEEE, dd-MM-yyyy"
          />

          {daySelected && (
            <div>
              <h3>{format(new Date(day), "EEEE, dd MMMM yyyy")}</h3>
            </div>
          )}
        </div>
        <br />

        <div style={{ display: "flex" }}>
          <div className="tooltipp">
            <button className="button-name" onClick={salesLastMonth}>
              Last 30 days
            </button>
            <span className="tooltipptext">
              {lastMonthStarting.toLocaleDateString("en-UK", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {lastMonthEnding.toLocaleDateString("en-UK", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="tooltipp">
            <button className="button-name" onClick={salesLastWeek}>
              Last 7 days
            </button>
            <span className="tooltipptext">
              {lastWeekStarting.toLocaleDateString("en-UK", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {lastWeekEnding.toLocaleDateString("en-UK", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="tooltipp">
            <button className="button-name" onClick={salesYesterday}>
              Yesterday
            </button>
            <span className="tooltipptext">
              {dateYesterday.toLocaleDateString("en-UK", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="tooltipp">
            <button className="button-name" onClick={salesToday}>
              Today
            </button>
            <span className="tooltipptext">{formattedDate2}</span>
          </div>
        </div>
        <br />

        <br />

        <div className="container1">
          <div className="revenue">
            <p>
              <i
                class="material-icons"
                style={{ fontSize: "55px", color: "purple" }}
              >
                monetization_on
              </i>
            </p>
            <p style={{ fontSize: "23px", color: "purple" }}>Revenue</p>
            <p style={{ fontSize: "30px", color: "purple" }}>
              Ksh.{" "}
              {selectedRevenue === "today" && (
                <React.Fragment>{revenue}</React.Fragment>
              )}
              {selectedRevenue === "yesterday" && (
                <React.Fragment>{yesterdayRevenue}</React.Fragment>
              )}
              {selectedRevenue === "lastWeek" && (
                <React.Fragment>{weeklyRevenue}</React.Fragment>
              )}
              {selectedRevenue === "lastMonth" && (
                <React.Fragment>{monthlyRevenue}</React.Fragment>
              )}
              {selectedRevenue === "anotherDay" && (
                <React.Fragment>{revenueByDay}</React.Fragment>
              )}
            </p>
          </div>

          <div className="purchase-return">
            <p>
              <i
                class="material-icons"
                style={{ fontSize: "55px", color: "red" }}
              >
                style
              </i>
            </p>
            <p style={{ fontSize: "23px", color: "red" }}>Expenses</p>
            <p style={{ fontSize: "30px", color: "red" }}>
              Ksh.{" "}
              {selectedExpense === "today" && (
                <React.Fragment>{expenseToday}</React.Fragment>
              )}
              {selectedExpense === "yesterday" && (
                <React.Fragment>{yesterdayExpense}</React.Fragment>
              )}
              {selectedExpense === "lastWeek" && (
                <React.Fragment>{weeklyExpense}</React.Fragment>
              )}
              {selectedExpense === "lastMonth" && (
                <React.Fragment>{monthlyExpense}</React.Fragment>
              )}
              {selectedExpense === "anotherDay" && (
                <React.Fragment>{totExpenses}</React.Fragment>
              )}
            </p>
          </div>

          <div className="profit">
            <p>
              <i
                class="material-icons"
                style={{ fontSize: "55px", color: "green" }}
              >
                trending_up
              </i>
            </p>
            <p style={{ fontSize: "23px", color: "green" }}>Profits</p>
            <p style={{ fontSize: "30px", color: "green" }}>
              Ksh.
              {selectedProfit === "today" && (
                <React.Fragment>{netProfit}</React.Fragment>
              )}
              {selectedProfit === "yesterday" && (
                <React.Fragment>{yesterdayNetProfit}</React.Fragment>
              )}
              {selectedProfit === "lastWeek" && (
                <React.Fragment>{weeklyNetProfit}</React.Fragment>
              )}
              {selectedProfit === "lastMonth" && (
                <React.Fragment>{monthlyNetProfit}</React.Fragment>
              )}
              {selectedProfit === "anotherDay" && (
                <React.Fragment>{netProfitByDay}</React.Fragment>
              )}
            </p>
          </div>
        </div>

        <div className="container2">
          <div className="dates-and-stuff">
            {selectedPeriod === "today" && (
              <React.Fragment>
                <h1 style={{ textAlign: "center" }}>Sales Today</h1>
                {salePresent === true ? (
                  <table className="dashtable">
                    <thead>
                      <tr>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Image
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                            alignItems: "center",
                          }}
                        >
                          Description
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Qty.
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Total
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Sold by
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSales.map((sale) => (
                        <React.Fragment key={sale.number}>
                          <tr>
                            <td>
                              <img
                                src={sale.image}
                                alt="img_here"
                                style={styles}
                              />
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                backgroundColor: "#AFCECE",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {sale.description}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                              }}
                            >
                              Ksh.{sale.price.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {sale.quantity}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                                color: "green",
                                fontWeight: "bold",
                              }}
                            >
                              Ksh.{sale.total.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                              }}
                            >
                              {sale.saleperson}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: "center", paddingTop: "5px" }}>
                    <h2 style={{ fontWeight: "bold" }}>No sale made...</h2>
                    <img src={empty} alt="Graph" style={boxStyle} />
                  </div>
                )}
              </React.Fragment>
            )}

            {selectedPeriod === "yesterday" && (
              <React.Fragment>
                <h1 style={{ textAlign: "center" }}>Sales yesterday</h1>
                <h2 style={{ textAlign: "center", backgroundColor: "#B1BDB9" }}>
                  {dateYesterday.toLocaleDateString("en-UK", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h2>
                {salePresentYesterday === true ? (
                  <table className="dashtable">
                    <thead>
                      <tr>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Image
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Description
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Qty.
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Total
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Sold by
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalesYesterday.map((sale) => (
                        <React.Fragment key={sale.number}>
                          <tr>
                            <td>
                              <img
                                src={sale.image}
                                alt="img_here"
                                style={styles}
                              />
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                backgroundColor: "#AFCECE",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {sale.description}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                              }}
                            >
                              Ksh.{sale.price.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {sale.quantity}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                                color: "green",
                                fontWeight: "bold",
                              }}
                            >
                              Ksh.{sale.total.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                              }}
                            >
                              {sale.saleperson}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: "center", paddingTop: "5px" }}>
                    <h2 style={{ fontWeight: "bold" }}>No sale made...</h2>
                    <img src={empty} alt="Graph" style={boxStyle} />
                  </div>
                )}
              </React.Fragment>
            )}

            {selectedPeriod === "lastWeek" && (
              <React.Fragment>
                <h1 style={{ textAlign: "center" }}>Sales as from:</h1>
                <h2 style={{ textAlign: "center", backgroundColor: "#B1BDB9" }}>
                  {lastWeekStarting.toLocaleDateString("en-UK", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {lastWeekEnding.toLocaleDateString("en-UK", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h2>
                {salePresentLastWeek === true ? (
                  <table className="dashtable">
                    <thead>
                      <tr>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Image
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Description
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Qty.
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Total
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Sold by
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Date Sold
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalesLastWeek.map((sale) => (
                        <React.Fragment key={sale.number}>
                          <tr>
                            <td>
                              <img
                                src={sale.image}
                                alt="img_here"
                                style={styles}
                              />
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                backgroundColor: "#AFCECE",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {sale.description}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                              }}
                            >
                              Ksh.{sale.price.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {sale.quantity}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                                color: "green",
                                fontWeight: "bold",
                              }}
                            >
                              Ksh.{sale.total.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                              }}
                            >
                              {sale.saleperson}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                              }}
                            >
                              {format(
                                new Date(sale.datesold),
                                "EEEE, dd/MM/yyyy"
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: "center", paddingTop: "5px" }}>
                    <h2 style={{ fontWeight: "bold" }}>No sale made...</h2>
                    <img src={empty} alt="Graph" style={boxStyle} />
                  </div>
                )}
              </React.Fragment>
            )}

            {selectedPeriod === "anotherDay" && (
              <React.Fragment>
                <h1 style={{ textAlign: "center" }}>Sales on:</h1>
                <h2 style={{ textAlign: "center", backgroundColor: "#B1BDB9" }}>
                  {dayChose}
                </h2>
                {salePresentAnotherDay === true ? (
                  <table className="dashtable">
                    <thead>
                      <tr>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Image
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Description
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Qty.
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Total
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Sold by
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Date Sold
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedSalesByDate[dayChose] &&
                        groupedSalesByDate[dayChose].map((sale) => (
                          <React.Fragment key={sale.number}>
                            <tr>
                              <td>
                                <img
                                  src={sale.image}
                                  alt="img_here"
                                  style={styles}
                                />
                              </td>
                              <td
                                style={{
                                  padding: "10px",
                                  backgroundColor: "#AFCECE",
                                  color: "black",
                                  fontWeight: "bold",
                                }}
                              >
                                {sale.description}
                              </td>
                              <td
                                style={{
                                  padding: "7px",
                                  backgroundColor: "#AFCECE",
                                }}
                              >
                                Ksh.{sale.price.toLocaleString()}
                              </td>
                              <td
                                style={{
                                  padding: "7px",
                                  backgroundColor: "#AFCECE",
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                {sale.quantity}
                              </td>
                              <td
                                style={{
                                  padding: "7px",
                                  backgroundColor: "#AFCECE",
                                  color: "green",
                                  fontWeight: "bold",
                                }}
                              >
                                Ksh.{sale.total.toLocaleString()}
                              </td>
                              <td
                                style={{
                                  padding: "7px",
                                  backgroundColor: "#AFCECE",
                                }}
                              >
                                {sale.saleperson}
                              </td>

                              <td
                                style={{
                                  padding: "7px",
                                  backgroundColor: "#AFCECE",
                                }}
                              >
                                {format(
                                  new Date(sale.datesold),
                                  "EEEE, dd/MM/yyyy"
                                )}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: "center", paddingTop: "5px" }}>
                    <h2 style={{ fontWeight: "bold" }}>No sale made...</h2>
                    <img src={empty} alt="Graph" style={boxStyle} />
                  </div>
                )}
              </React.Fragment>
            )}

            {selectedPeriod === "lastMonth" && (
              <React.Fragment>
                <h1 style={{ textAlign: "center" }}>Sales as from:</h1>
                <h2 style={{ textAlign: "center", backgroundColor: "#B1BDB9" }}>
                  {lastMonthStarting.toLocaleDateString("en-UK", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  -{" "}
                  {lastMonthEnding.toLocaleDateString("en-UK", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h2>
                {salePresentLastMonth === true ? (
                  <table className="dashtable">
                    <thead>
                      <tr>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Image
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Description
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Price
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Qty.
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Total
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Sold by
                        </th>
                        <th
                          style={{
                            padding: "7px",
                            backgroundColor: "#127a8c",
                            color: "white",
                          }}
                        >
                          Date Sold
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSalesLastMonth.map((sale) => (
                        <React.Fragment key={sale.number}>
                          <tr>
                            <td>
                              <img
                                src={sale.image}
                                alt="img_here"
                                style={styles}
                              />
                            </td>
                            <td
                              style={{
                                padding: "10px",
                                backgroundColor: "#AFCECE",
                                color: "black",
                                fontWeight: "bold",
                              }}
                            >
                              {sale.description}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                              }}
                            >
                              Ksh.{sale.price.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {sale.quantity}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                                color: "green",
                                fontWeight: "bold",
                              }}
                            >
                              Ksh.{sale.total.toLocaleString()}
                            </td>
                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                              }}
                            >
                              {sale.saleperson}
                            </td>

                            <td
                              style={{
                                padding: "7px",
                                backgroundColor: "#AFCECE",
                              }}
                            >
                              {format(
                                new Date(sale.datesold),
                                "EEEE, dd/MM/yyyy"
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ textAlign: "center", paddingTop: "5px" }}>
                    <h2 style={{ fontWeight: "bold" }}>No sale made...</h2>
                    <img src={empty} alt="Graph" style={boxStyle} />
                  </div>
                )}
              </React.Fragment>
            )}
          </div>
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

      <div>
        <h2 style={{ textAlign: "center" }}>
          <u>Sales of the Week</u>
        </h2>
        <br />
        <div style={{ alignItems: "center", textAlign: "center" }}>
          <button
            onClick={() => weekGraph("nextWeek")}
            style={{ fontSize: "16px" }}
          >
            <i className="material-icons" style={{ fontSize: "16px" }}>
              arrow_back
            </i>
            Next Week
          </button>{" "}
          <button
            onClick={() => weekGraph("currentWeek")}
            style={{ fontSize: "16px" }}
          >
            Current Week
          </button>{" "}
          <button
            onClick={() => weekGraph("lastWeek")}
            style={{ fontSize: "16px" }}
          >
            Last Week
            <i className="material-icons" style={{ fontSize: "16px" }}>
              arrow_forward
            </i>
          </button>
        </div>
        <br />
        <br />
        <div style={{ maxWidth: "1350px", margin: "auto" }}>
          <BarChart
            width={1350}
            height={500}
            data={weekData}
            margin={{ left: 40, right: 20 }}
          >
            <CartesianGrid />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value.toLocaleString()}`}>
              <Label
                value="(Ksh)"
                offset={-20}
                position="insideLeft"
                style={{ textAnchor: "middle", fontSize: "16px" }}
              />
            </YAxis>
            <Legend />
            <Tooltip
              formatter={(value, name, props) =>
                `Ksh.${value.toLocaleString()}`
              }
            />
            <Bar dataKey="Revenue" fill="green">
              {weekData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Revenue}
                  fill="#8884d8"
                />
              ))}
            </Bar>
            <Bar dataKey="Profit" fill="blue">
              {weekData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Profit}
                  fill="#82ca9d"
                />
              ))}
            </Bar>
            <Bar dataKey="Expenses" fill="red">
              {weekData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Expenses}
                  fill="red"
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
      <br />
      <hr />

      <footer style={{ textAlign: "center" }}>
        Copyright © {yearOnly}, EasyManager. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
