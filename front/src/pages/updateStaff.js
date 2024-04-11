import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";

function UpdateStaff() {
  const [staff, setStaff] = useState({
    id: "",
    firstname: "",
    lastname: "",
    number: "",
    datejoined: new Date(),
  });

  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);
  const [newImage, setNewImage] = useState("");
  const [imageChange, setImageChange] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/getStaff/` + id)
      .then((result) => {
        setStaff(result.data);
        console.log("Staff",staff)
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      return;
    }
    const inputValueInCaps = value.toUpperCase();
    setStaff((prev) => ({ ...prev, [name]: inputValueInCaps }));
  };

  const handleDateChange = (date) => {
    setStaff((prev) => ({
      ...prev,
      datejoined: date,
    }));
  };

  const convertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setNewImage(reader.result);
      setImageChange(true);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const update = async (e) => {
    e.preventDefault();
    const staffData = {
      ...staff,
      image: imageChange ? newImage : staff.image,
    };
    axios
      .put(`http://localhost:3001/updateStaff/` + id, staffData)
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

  const back = () => {
    navigate("/");
  };

  return (
    <div>
      <h1>Staff Update</h1>
      <form className="form">
        ID Number:
        <input type="text" value={staff.id} onChange={handleChange} name="id" />
        <br />
        First Name:
        <input
          type="text"
          value={staff.firstname}
          onChange={handleChange}
          name="firstname"
        />
        Last Name:
        <input
          type="text"
          value={staff.lastname}
          onChange={handleChange}
          name="lastname"
        />
        Staff Number:
        <input
          type="text"
          value={staff.number}
          onChange={handleChange}
          name="number"
        />
        Date Joined:
        <DatePicker selected={staff.datejoined} onChange={handleDateChange} />
        <br />
        Image:
        <input
          accept="image/*"
          type="file"
          onChange={convertToBase64}
          name="image"
        />
        <br />
        {showAlert && (
          <div className="alert">
            <p style={{ textAlign: "center" }}>
              Success! <i className="material-icons">check</i>{" "}
            </p>
          </div>
        )}
        <button className="addbtn" onClick={update}>
          Update
        </button>
        <button className="backbtn" onClick={back}>
          Cancel
        </button>
      </form>
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

export default UpdateStaff;
