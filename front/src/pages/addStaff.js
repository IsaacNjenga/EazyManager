import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  read as readExcel,
  utils as XLSXUtils,
  write as writeExcel,
} from "xlsx";
import { format } from "date-fns";
import fileSaver from "file-saver";

function AddStaff() {
  const [staff, setStaff] = useState({
    id: "",
    firstname: "",
    lastname: "",
    number: "",
    datejoined: new Date(),
    image: "",
  });

  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [excel, setExcel] = useState(false);
  const [singleEntry, setSingleEntry] = useState(false);

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
    setStaff((prev) => ({
      ...prev,
      [e.target.name]: inputValueInCaps,
    }));
  };

  const handleDateChange = (date) => {
    setStaff((prev) => ({
      ...prev,
      datejoined: date,
    }));
  };

  const submit = (e) => {
    e.preventDefault();

    const staffData = {
      ...staff,
      image: image,
    };
    axios
      .post("https://eazy-manager.vercel.app/addStaff", staffData)
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
      console.log(reader.result);
      setImage(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const parseDateString = (dateString) => {
    if (!isNaN(dateString)) {
      // Check if dateString is a number
      const excelSerialDate = parseFloat(dateString);
      const excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's epoch starts from 1900-01-01 (with a 2-day adjustment)
      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const utcMilliseconds = excelSerialDate * millisecondsPerDay;
      const date = new Date(excelEpoch.getTime() + utcMilliseconds);
      return date;
    } else {
      console.log("Invalid date string:", dateString);
      return new Date(); // Return current date as fallback
    }
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
        dateNF: "yyyy-mm-dd",
      });

      const staffFromExcel = excelData.slice(1).map((row) => ({
        id: row[0],
        firstname: row[1].toUpperCase(),
        lastname: row[2].toUpperCase(),
        number: row[3],
        datejoined: parseDateString(row[4]), // Assuming date format is consistent
      }));
      setStaffData(staffFromExcel);
    };
    reader.readAsArrayBuffer(file);
  };

  const addExcelDoc = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        staffData.map(async (staffMember) => {
          try {
            await axios.post("https://eazy-manager.vercel.app/addStaff", staffMember);
          } catch (error) {
            console.error("Error adding staff:", error);
          }
        })
      );
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        navigate("/");
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
    const headers = ["ID", "First Name", "Last Name", "Number", "Date Joined"];
    const data = [headers];
    const workbook = XLSXUtils.book_new();
    const worksheet = XLSXUtils.aoa_to_sheet(data);
    XLSXUtils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelFile = writeExcel(workbook, {
      bookType: "xlsx",
      type: "binary",
    });
    const blob = new Blob([s2ab(excelFile)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fileSaver.saveAs(blob, "staff-template.xlsx");
  };

  const back = () => {
    navigate("/");
  };

  return (
    <div>
      <h2>Add new staff</h2>
      <button className="backbtn" onClick={back}>
        Back to Staff
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
          <label>Get the Excel document from here:</label>
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
          {staffData.length > 0 && (
            <table className="productstable">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Number</th>
                  <th>Date Joined</th>
                </tr>
              </thead>
              <tbody>
                {staffData.map((staff, index) => (
                  <tr key={index}>
                    <td>{staff.id}</td>
                    <td>{staff.firstname}</td>
                    <td>{staff.lastname}</td>
                    <td>{staff.number}</td>
                    <td>{format(new Date(staff.datejoined), "yyyy-MM-dd")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {singleEntry && (
        <div>
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
              <h3>Staff Entry</h3>
            </div>
            <hr />
            <br />
            ID Number:
            <input
              type="text"
              placeholder="ID Number"
              onChange={handleChange}
              name="id"
            />
            <br />
            First Name:
            <input
              type="text"
              placeholder="First Name"
              onChange={handleChange}
              name="firstname"
            />
            Last Name:
            <input
              type="text"
              placeholder="Last Name"
              onChange={handleChange}
              name="lastname"
            />
            Staff Number:
            <input
              type="text"
              placeholder="Staff Number"
              onChange={handleChange}
              name="number"
            />
            Date Joined:
            <DatePicker
              selected={staff.datejoined}
              onChange={handleDateChange}
            />
            <br />
            Image:
            <hr />
            <input accept="image/*" type="file" onChange={convertToBase64} />
            <br />
            {showAlert && (
              <div className="alert">
                <p style={{ textAlign: "center" }}>
                  Success! <i className="material-icons">check</i>{" "}
                </p>
              </div>
            )}
            <hr />
            <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <button className="addbtn">Add</button>
            <button className="backbtn" onClick={back}>
              Cancel
            </button>
            </div>
          </form>
        </div>
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
  );
}

export default AddStaff;
