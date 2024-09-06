{
  /*<div className="grid-layout">
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
                    to={`/update-product/${product._id}`}
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
                      onClick={() => {
                        handleYesClick(product._id);
                        toast.success("Product deleted!");
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
                    </div>*/
}
