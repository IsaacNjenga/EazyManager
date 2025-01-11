import React, { useCallback, useEffect, useState } from "react";
import Navbar from "./source/navbar";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast } from "react-hot-toast";
import { format } from "date-fns";

function Customers() {
  const [loading, setLoading] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  const fetchCustomerData = useCallback(async () => {
    setLoading(true);
    setShowAnimation(true);
    try {
      const { data } = await axios.get("sales", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const filteredSalesByCustomerData = data.filter(
        (sales) =>
          sales.customerName?.trim() || // Check if customerName exists and is not empty
          sales.customerPhone?.trim() || // Check if customerPhone exists and is not empty
          sales.customerEmail?.trim() // Check if customerEmail exists and is not empty
      );

      setCustomerData(filteredSalesByCustomerData);
      setLoading(false);
      setShowAnimation(false);
    } catch (error) {
      setLoading(false);
      setShowAnimation(false);
      console.error("Error fetching info", error);
      toast.error("Error loading data");
    }
  }, []);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const saleHistory = (saleNumber) => {
    try {
      axios
        .get("sales", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((result) => {
          const fetchedSale = result.data.find(
            (sale) => sale._id === saleNumber
          );
          setSelectedSale(fetchedSale);
          console.log(fetchedSale);
        });
    } catch (error) {
      console.error("Error fetching info", error);
      toast.error("Error loading data");
    }
  };

  const columns = [
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
      sortable: true,
    },
    {
      name: "Customer Phone",
      selector: (row) => row.customerPhone,
      sortable: true,
    },
    {
      name: "Customer Email",
      selector: (row) => row.customerEmail,
      sortable: true,
    },
    {
      name: "Item",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Total",
      selector: (row) => `Ksh. ${row.total.toLocaleString()}`,
      sortable: true,
      style: {
        fontWeight: "bold",
        color: "#007BFF",
      },
    },
    {
      name: "Details",
      cell: (row) => (
        <button className="details-btn" onClick={() => saleHistory(row._id)}>
          More
        </button>
      ),
      button: true,
    },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
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
      </>
    );
  }

  const closeCustomerModal = () => {
    setSelectedSale(null);
  };

  const customStyles = {
    headCells: {
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#333333",
        backgroundColor: "#f2f2f2",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
        color: "#555555",
      },
    },
    rows: {
      style: {
        "&:nth-of-type(odd)": {
          backgroundColor: "#f9f9f9",
        },
        "&:nth-of-type(even)": {
          backgroundColor: "#ffffff",
        },
      },
    },
  };
  return (
    <>
      <Navbar />
      <div id="main">
        <h1>Customers</h1>
        <div>
          {loading ? (
            <p>Loading. Please Wait</p>
          ) : (
            <div className="datatable-container">
              <DataTable
                title="Customer Data"
                columns={columns}
                data={customerData}
                pagination
                highlightOnHover
                customStyles={customStyles}
              />
            </div>
          )}

          {selectedSale && (
            <div
              className="customer-sale-modal-overlay"
              onClick={closeCustomerModal}
            >
              <div
                className="customer-sale-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="customer-sale-modal-header">
                  <button
                    onClick={closeCustomerModal}
                    className="close-customer-modal-btn"
                  >
                    &times;
                  </button>
                  <h2 className="modal-title">Sale Details</h2>
                </div>
                <div className="customer-sale-modal-body">
                  <div className="modal-image-section">
                    <img
                      src={selectedSale.image}
                      alt={selectedSale.code}
                      className="sale-modal-image"
                    />
                  </div>
                  <div className="modal-details-section">
                    <div className="sale-info">
                      <h3>
                        <u>Item Information</u>
                      </h3>
                      <p>
                        <strong>Description:</strong> {selectedSale.description}
                      </p>
                      <p>
                        <strong>Price per item:</strong> Ksh.
                        {selectedSale.price.toLocaleString()}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {selectedSale.quantity}
                      </p>
                      <p>
                        <strong>Total:</strong> Ksh.
                        {selectedSale.total.toLocaleString()}
                      </p>
                      <p>
                        <strong>Code:</strong> {selectedSale.code}
                      </p>
                      <p>
                        <strong>Colour:</strong> {selectedSale.colour}
                      </p>
                    </div>
                    <div className="customer-info">
                      <h3>
                        <u>Customer Information</u>
                      </h3>
                      <p>
                        <strong>Name:</strong>{" "}
                        {selectedSale.customerName
                          ? selectedSale.customerName
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {selectedSale.customerPhone
                          ? selectedSale.customerPhone
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {selectedSale.customerEmail
                          ? selectedSale.customerEmail
                          : "N/A"}
                      </p>
                    </div>
                    <div className="sale-metadata">
                      <h3>
                        <u>Sale Information</u>
                      </h3>
                      <p>
                        <strong>Date Sold:</strong>{" "}
                        {format(new Date(selectedSale.datesold), "PPPP")}
                      </p>
                      <p>
                        <strong>Salesperson:</strong>{" "}
                        {selectedSale.saleperson
                          ? selectedSale.saleperson
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Customers;
