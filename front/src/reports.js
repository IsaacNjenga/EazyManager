import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  Rectangle,
  Label,
} from "recharts";
import { BarChart, Bar } from "recharts";

const Reports = () => {
  let [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [currentDayMonth, setCurrentDayMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date());
  const [monthData, setMonthData] = useState([]);
  const [dayData, setDayData] = useState([]);
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [bar, setBar] = useState(true);
  const [line, setLine] = useState(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get(`sales`);
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
        const resExpenses = await axios.get(`expenses`);
        setExpenses(resExpenses.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchExpenses();
  }, [currentDateTime]);

  function lineGraph() {
    setBar(false);
    setLine(true);
  }

  function barGraph() {
    setBar(true);
    setLine(false);
  }


  const prevNextMonth = useCallback(
    (action) => {
      let newDayMonth = new Date(currentDayMonth);

      if (action === "prevDayMonth") {
        newDayMonth.setMonth(newDayMonth.getMonth() - 1);
        newDayMonth.setDate(1);
      } else if (action === "nextDayMonth") {
        newDayMonth.setMonth(newDayMonth.getMonth() + 1);
        newDayMonth.setDate(1);
      } else if (action === "currentDayMonth") {
        const currentDate = new Date();
        newDayMonth = currentDate;
        newDayMonth.setDate(1);
      }

      newDayMonth.setDate(1);
      newDayMonth.setHours(0);
      newDayMonth.setMinutes(0);
      newDayMonth.setSeconds(0);
      newDayMonth.setMilliseconds(0);
      setCurrentDayMonth(newDayMonth);

      let StartDate = new Date(newDayMonth);
      let currentDate = new Date(StartDate);

      const totalDayAmount = {};
      const totalDayExpense = {};
      const totalDayProfit = {};
      const dailyData = {};
      let updatedDayData = [];

      for (let i = 1; i <= 31; i++) {
        const dayStartDate = new Date(currentDate);
        const dayEndDate = new Date(dayStartDate);
        dayEndDate.setHours(23, 59, 59, 999);

        const dailySales = sales.filter((sale) => {
          const saleDate = new Date(sale.datesold);
          return saleDate >= dayStartDate && saleDate <= dayEndDate;
        });

        const dailyExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= dayStartDate && expenseDate <= dayEndDate;
        });

        const dayNumber = i;
        const dailyTotalAmount = dailySales.reduce(
          (acc, sale) => acc + sale.total,
          0
        );

        const dailyTotalCommissions = dailySales.reduce(
          (acc, sale) => acc + sale.commission,
          0
        );
        const dailyExpenseAmount = dailyExpenses.reduce(
          (acc, expense) => acc + expense.cost + dailyTotalCommissions,
          0
        );

        const netProfit = dailyTotalAmount - dailyExpenseAmount;
        const dailyTotalProfit = netProfit > 0 ? netProfit : 0;

        totalDayAmount[`day ${dayNumber}`] = dailyTotalAmount;
        totalDayProfit[`day ${dayNumber}`] = dailyTotalProfit;
        totalDayExpense[`day ${dayNumber}`] = dailyExpenseAmount;

        dailyData[`day ${dayNumber}`] = {
          day: `day ${dayNumber}`,
          startDate: dayStartDate.toISOString().slice(0, 10),
          endDate: dayEndDate.toISOString().slice(0, 10),
          sales: dailySales.length,
          totalAmount: dailyTotalAmount,
          totalProfit: dailyTotalProfit,
          totalExpense: dailyExpenseAmount,
        };

        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }

      const currentMonth = currentDate.getMonth();
      let days;
      if (
        currentMonth === 9 ||
        currentMonth === 4 ||
        currentMonth === 6 ||
        currentMonth === 11
      ) {
        days = 30;
      } else if (currentMonth === 2) {
        const currentYear = currentDate.getFullYear();
        if (
          (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
          currentYear % 400 === 0
        ) {
          days = 29;
        } else {
          days = 28;
        }
      } else {
        days = 31;
      }

      for (let i = 1; i <= days; i++) {
        let daySuffix;
        if (i === 1 || i === 21 || i === 31) {
          daySuffix = `${i}st`;
        } else if (i === 2 || i === 22) {
          daySuffix = `${i}nd`;
        } else if (i === 3 || i === 23) {
          daySuffix = `${i}rd`;
        } else {
          daySuffix = `${i}th`;
        }

        updatedDayData.push({
          name: daySuffix,
          Revenue: totalDayAmount[`day ${i}`],
          Profit: totalDayProfit[`day ${i}`],
          Expenses: totalDayExpense[`day ${i}`],
        });
      }
      setDayData(updatedDayData);
    },
    [currentDayMonth, setCurrentDayMonth, expenses, sales]
  );

  const prevNextYear = useCallback(
    (action) => 
    {
      let newYear = new Date(currentYear);
      if (action === "prevYear") {
        newYear.setFullYear(newYear.getFullYear() - 1);
        newYear.setMonth(0);
        newYear.setDate(1);
      } else if (action === "nextYear") {
        newYear.setFullYear(newYear.getFullYear() + 1);
        newYear.setMonth(0);
        newYear.setDate(1);
      } else if (action === "currentYear") {
        newYear = new Date();
        newYear.setMonth(0);
        newYear.setDate(1);
      }

      setCurrentYear(newYear);
      const year = newYear.getFullYear();

      const monthsData = {};
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const totalMonthAmount = {};
      const totalMonthProfit = {};
      const totalMonthExpense = {};

      for (let i = 0; i < 12; i++) {
        const monthStartDate = new Date(year, i, 1); 
        const monthEndDate = new Date(year, i + 1, 0); 

        const monthSales = sales.filter((sale) => {
          const saleDate = new Date(sale.datesold);
          return saleDate >= monthStartDate && saleDate <= monthEndDate;
        });
        const monthExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= monthStartDate && expenseDate <= monthEndDate;
        });

        const monthNumber = i + 1;
        const monthTotalAmount = monthSales.reduce(
          (acc, sale) => acc + sale.total,
          0
        );
        const monthlyTotalCommissions = monthSales.reduce(
          (acc, sale) => acc + sale.commission,
          0
        );
        const monthExpenseAmount = monthExpenses.reduce(
          (acc, expense) => acc + expense.cost + monthlyTotalCommissions,
          0
        );

        const netProfit = monthTotalAmount - monthExpenseAmount;
        const monthTotalProfit = netProfit > 0 ? netProfit : 0;

        totalMonthAmount[`month ${monthNumber}`] = monthTotalAmount;
        totalMonthProfit[`month ${monthNumber}`] = monthTotalProfit;
        totalMonthExpense[`month ${monthNumber}`] = monthExpenseAmount;

        monthsData[`month ${monthNumber}`] = {
          month: `month ${monthNumber}`,
          startDate: monthStartDate.toISOString().slice(0, 10),
          endDate: monthEndDate.toISOString().slice(0, 10),
          sales: monthSales.length,
          totalAmount: monthTotalAmount,
          totalProfit: monthTotalProfit,
          totalExpense: monthExpenseAmount,
        };
      }

      const monthlyData = Array.from({ length: 12 }, (_, i) => {
        const monthNumber = i + 1;
        return {
          name: monthNames[i],
          Revenue: totalMonthAmount[`month ${monthNumber}`] || 0,
          Profit: totalMonthProfit[`month ${monthNumber}`] || 0,
          Expenses: totalMonthExpense[`month ${monthNumber}`] || 0,
        };
      });

      setMonthData(monthlyData);
    },
    [currentYear, sales, expenses]
  );

  useEffect(() => {
    prevNextYear();
  }, [prevNextYear]);

  useEffect(() => {
    prevNextMonth();
  }, [prevNextMonth]);

  return (
    <div id="main">
      <h1 style={{ textAlign: "center" }}>Reports</h1>
      <hr />
      <button
        className="backbtn"
        onClick={barGraph}
        style={{ fontSize: "16px" }}
      >
        <i class="glyphicon glyphicon-stats"></i>
      </button>
      {" | "}
      <button
        className="addbtn"
        onClick={lineGraph}
        style={{ fontSize: "16px" }}
      >
        <i class="material-icons">show_chart</i>
      </button>
      <br />
      <br />
      <br />
      <button
        onClick={() => prevNextMonth("prevDayMonth")}
        style={{ fontSize: "16px" }}
      >
        <i className="material-icons" style={{ fontSize: "16px" }}>
          arrow_back
        </i>
        Previous month
      </button>{" "}
      <button
        onClick={() => prevNextMonth("currentDayMonth")}
        style={{ fontSize: "16px" }}
      >
        This month
      </button>{" "}
      <button
        onClick={() => prevNextMonth("nextDayMonth")}
        style={{ fontSize: "16px" }}
      >
        Next month{" "}
        <i className="material-icons" style={{ fontSize: "16px" }}>
          arrow_forward
        </i>
      </button>
      <h2 style={{ textAlign: "center" }}>
        Daily{" "}
        {currentDayMonth.toLocaleDateString("en-UK", {
          month: "long",
          year: "numeric",
        })}{" "}
        Sales
      </h2>
      {bar && (
        <div>
          <BarChart
            width={1500}
            height={500}
            data={dayData}
            margin={{ left: 40, right: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
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
              {monthData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Revenue}
                  fill="#8884d8"
                />
              ))}
            </Bar>
            <Bar dataKey="Profit" fill="blue">
              {dayData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Profit}
                  fill="#82ca9d"
                />
              ))}
            </Bar>
            <Bar dataKey="Expenses" fill="red">
              {dayData.map((entry, index) => (
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
      )}
      {line && (
        <div>
          <LineChart
            width={1310}
            height={500}
            data={dayData}
            margin={{ left: 40, right: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
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
            <Line datakey="Revenue" fill="green">
              {dayData.map((entry, index) => (
                <Rectangle
                  key={`bar -${index}`}
                  width={5}
                  height={entry.Revenue}
                  fill="#8884d8"
                />
              ))}
            </Line>
            <Line
              type="monotone"
              dataKey="Revenue"
              stroke="red"
              activeDot={{ r: 8 }}
            />
            <Line dataKey="Profit" fill="blue">
              {dayData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Profit}
                  fill="#82ca9d"
                />
              ))}
            </Line>
            <Line dataKey="Expenses" fill="red">
              {dayData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Expenses}
                  fill="red"
                />
              ))}
            </Line>
          </LineChart>
        </div>
      )}
     
      <hr />
      <br />
      <button
        onClick={() => prevNextYear("prevYear")}
        style={{ fontSize: "16px" }}
      >
        <i class="material-icons" style={{ fontSize: "16px" }}>
          arrow_back
        </i>
        Previous Year
      </button>{" "}
      <button
        onClick={() => prevNextYear("currentYear")}
        style={{ fontSize: "16px" }}
      >
        This Year
      </button>{" "}
      <button
        onClick={() => prevNextYear("nextYear")}
        style={{ fontSize: "16px" }}
      >
        Next Year{" "}
        <i class="material-icons" style={{ fontSize: "16px" }}>
          arrow_forward
        </i>
      </button>{" "}
      <h2 style={{ textAlign: "center" }}>
        Annual Sales of{" "}
        {currentYear.toLocaleDateString("en-UK", {
          year: "numeric",
        })}
      </h2>
      {bar && (
        <div>
          <BarChart
            width={1310}
            height={500}
            data={monthData}
            margin={{ left: 40, right: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
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
              {monthData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Revenue}
                  fill="#8884d8"
                />
              ))}
            </Bar>
            <Bar dataKey="Profit" fill="blue">
              {monthData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Profit}
                  fill="#82ca9d"
                />
              ))}
            </Bar>
            <Bar dataKey="Expenses" fill="red">
              {dayData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Expenses}
                  fill="#82ca9d"
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      )}
      {line && (
        <div>
          <LineChart
            width={1310}
            height={500}
            data={monthData}
            margin={{ left: 40, right: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
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
            <Line datakey="Revenue" fill="green">
              {monthData.map((entry, index) => (
                <Rectangle
                  key={`bar -${index}`}
                  width={5}
                  height={entry.Revenue}
                  fill="#8884d8"
                />
              ))}
            </Line>
            <Line
              type="monotone"
              dataKey="Revenue"
              stroke="red"
              activeDot={{ r: 8 }}
            />
            <Line dataKey="Profit" fill="blue">
              {monthData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Profit}
                  fill="#82ca9d"
                />
              ))}
            </Line>
            <Line dataKey="Expenses" fill="red">
              {monthData.map((entry, index) => (
                <Rectangle
                  key={`bar-${index}`}
                  width={5}
                  height={entry.Expenses}
                  fill="red"
                />
              ))}
            </Line>
          </LineChart>
        </div>
      )}
      <br />
      <hr />
    </div>
  );
};

export default Reports;
