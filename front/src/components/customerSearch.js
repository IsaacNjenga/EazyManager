import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { InputGroup, Form } from "react-bootstrap";

const CustomerSearch = ({ customerData, columns, customStyles }) => {
  const [search, setSearch] = useState("");
  const [searchedCustomerData, setSearchedCustomerData] =
    useState(customerData);

  // useEffect ensures that filtering runs when the search term or customerData changes.
  useEffect(() => {
    const filteredData = customerData.filter((c) =>
      Object.values(c).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(search.toLowerCase())
      )
    );
    setSearchedCustomerData(filteredData);
  }, [search, customerData]);

  return (
    <div>
      {/* Search Panel */}
      <form className="search-panels">
        <InputGroup className="search-groups">
          <Form.Control
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Customers..."
          />
        </InputGroup>
      </form>

      {/* Data Table */}
      {search && (
        <div>
          <DataTable
            columns={columns}
            data={searchedCustomerData}
            highlightOnHover
            customStyles={customStyles}
            pagination
          />
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;
