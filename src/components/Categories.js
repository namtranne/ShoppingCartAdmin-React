import { useState, useEffect } from "react";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBowlFood } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {
  faCheckCircle,
  faFilePen,
  faXmark,
  faSortAmountUp,
  faSortAmountDown,
  faFileCsv,
  faFilePdf,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
export const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    updateCategories();

    onClickHandler();
  }, []);
  navigate(window.location.pathname, {});
  const { state } = useLocation();

  const [image, setImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const categoryPerPage = 4;
  const totalPage =
    categories.length / categoryPerPage -
      Math.floor(categories.length / categoryPerPage) ===
    0
      ? categories.length / categoryPerPage
      : Math.floor(categories.length / categoryPerPage) + 1;
  const [message, setMessage] = useState(
    state && state.message ? state.message.message : ""
  );
  const [isAsc, setIsAsc] = useState(true);
  const [sortField, setSortField] = useState("");

  //load data

  const onClickHandler = async () => {
    const result = await fetch("http://localhost:8082/category/loadImage/2", {
      mode: "no-cors", // 'cors' by default
    });
    const blob = await result.blob();
    const url = URL.createObjectURL(blob);
    setImage(url);
    console.log(url);
  };

  //update data
  const updateCategories = () => {
    fetch("http://localhost:8082/ShoppingCartAdmin/category/getAll")
      .then((res) => res.json())
      .then((result) => {
        setCategories(result);
      });
  };

  //delete category
  const handleDelete = (id) => {
    fetch("http://localhost:8082/ShoppingCartAdmin/category/delete/" + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((result) => {
        setMessage(result.message);
      })
      .then(updateCategories);
  };
  //enable/disable category
  const handleEnable = (id, bool) => {
    fetch(
      "http://localhost:8082/ShoppingCartAdmin/category/" +
        id +
        "/enabled/" +
        bool,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((result) => setMessage(result.message))
      .then(() => {
        updateCategories();
      });
  };

  return (
    <>
      <img src={image ? image : null} alt="" />
      <div>
        <h2 className="text-center">Manage Categories - View All</h2>
      </div>
      {message !== "" ? (
        <div className="alert alert-success text-center">{message}</div>
      ) : null}
      <InputGroup>
        <Form.Control
          className="col-sm-2"
          placeholder="Search Key"
          aria-label="Recipient's username with two button addons"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
        <Button
          variant="outline-secondary"
          className="bg-danger text-light"
          onClick={() => {
            setFilter("");
          }}
        >
          Clear
        </Button>
      </InputGroup>
      <a
        href="http://localhost:8082/ShoppingCartAdmin/categories/export/csv"
        style={{ margin: "0 5px 0 5px" }}
      >
        <FontAwesomeIcon icon={faFileCsv} />
      </a>
      <a
        href="http://localhost:8082/ShoppingCartAdmin/categories/export/pdf"
        style={{ margin: "0 5px 0 5px" }}
      >
        <FontAwesomeIcon icon={faFilePdf} />
      </a>
      <a
        href="http://localhost:8082/ShoppingCartAdmin/categories/export/excel"
        style={{ margin: "0 5px 0 5px" }}
      >
        <FontAwesomeIcon icon={faFileExcel} />
      </a>
      <div className="full-details">
        <table className="table table-bordered table-striped table-hover table-reponsive-xl">
          <thead className="thead-dark">
            <tr>
              <th className="hideable-column">
                <span
                  className="text-white"
                  onClick={() => {
                    if (
                      (isAsc && sortField === "id") ||
                      (!isAsc && sortField !== "id")
                    ) {
                      setIsAsc(false);
                      setSortField("id");
                      setCategories(
                        [...categories].sort((a, b) => (a.id > b.id ? -1 : 1))
                      );
                    } else if (
                      (!isAsc && sortField === "id") ||
                      (isAsc && sortField !== "id")
                    ) {
                      setIsAsc(true);
                      setSortField("id");
                      setCategories(
                        [...categories].sort((a, b) => (a.id > b.id ? 1 : -1))
                      );
                    }
                  }}
                >
                  Category ID
                </span>
                {sortField === "id" && isAsc === true ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountUp} />
                  </span>
                ) : sortField === "id" && !isAsc ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountDown} />
                  </span>
                ) : null}
              </th>
              <th className="hideable-column">Image</th>
              <th>
                <span
                  className="text-white"
                  onClick={() => {
                    if (
                      (isAsc && sortField === "name") ||
                      (!isAsc && sortField !== "name")
                    ) {
                      setIsAsc(false);
                      setSortField("name");
                      setCategories(
                        [...categories].sort((a, b) =>
                          a.name > b.name ? -1 : 1
                        )
                      );
                    } else if (
                      (!isAsc && sortField === "name") ||
                      (isAsc && sortField !== "name")
                    ) {
                      setIsAsc(true);
                      setSortField("name");
                      setCategories(
                        [...categories].sort((a, b) =>
                          a.name > b.name ? 1 : -1
                        )
                      );
                    }
                  }}
                >
                  Category Name
                </span>
                {sortField === "name" && isAsc === true ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountUp} />
                  </span>
                ) : sortField === "name" && !isAsc ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountDown} />
                  </span>
                ) : null}
              </th>

              <th>
                <span
                  className="text-white"
                  onClick={() => {
                    if (
                      (isAsc && sortField === "alias") ||
                      (!isAsc && sortField !== "alias")
                    ) {
                      setIsAsc(false);
                      setSortField("alias");
                      setCategories(
                        [...categories].sort((a, b) =>
                          a.alias > b.alias ? -1 : 1
                        )
                      );
                    } else if (
                      (!isAsc && sortField === "alias") ||
                      (isAsc && sortField !== "alias")
                    ) {
                      setIsAsc(true);
                      setSortField("alias");
                      setCategories(
                        [...categories].sort((a, b) =>
                          a.alias > b.alias ? 1 : -1
                        )
                      );
                    }
                  }}
                >
                  Alias
                </span>
                {sortField === "alias" && isAsc === true ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountUp} />
                  </span>
                ) : sortField === "alias" && !isAsc ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountDown} />
                  </span>
                ) : null}
              </th>
              <th>
                <span
                  className="text-white"
                  onClick={() => {
                    if (
                      (isAsc && sortField === "enable") ||
                      (!isAsc && sortField !== "enable")
                    ) {
                      setIsAsc(false);
                      setSortField("enable");
                      setCategories(
                        [...categories].sort((a, b) =>
                          a.enable > b.enable ? -1 : 1
                        )
                      );
                    } else if (
                      (!isAsc && sortField === "enable") ||
                      (isAsc && sortField !== "enable")
                    ) {
                      setIsAsc(true);
                      setSortField("enable");
                      setCategories(
                        [...categories].sort((a, b) =>
                          a.enable > b.enable ? 1 : -1
                        )
                      );
                    }
                  }}
                >
                  Enable
                </span>
                {sortField === "enable" && isAsc === true ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountUp} />
                  </span>
                ) : sortField === "enable" && !isAsc ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountDown} />
                  </span>
                ) : null}
              </th>
              <th>
                <span>Edit</span>
              </th>
              <th>
                <span>Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories
              .filter(
                (category) =>
                  category.id.toString().includes(filter) ||
                  category.name.includes(filter) ||
                  category.alias.includes(filter)
              )
              .map((category, index) => {
                return (
                  <tr key={index}>
                    <td className="hideable-column">{category.id}</td>
                    <td>
                      <span className="fa fa-portait fa-3x icon-silver">
                        <FontAwesomeIcon icon={faBowlFood} color="grey" />
                      </span>
                      {/* <img
                    th:if="${category.photos !== null}"
                    th:src="@{${category.photosImagePath}}"
                    alt=""
                    style="width: 100px;"
                  /> */}
                    </td>
                    <td className="hideable-column">{category.name}</td>
                    <td>{category.alias}</td>
                    <td>
                      <div>
                        {category.enabled ? (
                          <span
                            onClick={() => {
                              handleEnable(category.id, false);
                            }}
                            tittle="'Disable this ' + 'category'"
                            className="fas fa-check-circle fa-2x icon-green"
                          >
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </span>
                        ) : (
                          <span
                            onClick={() => {
                              handleEnable(category.id, true);
                            }}
                            //   th:if="${category.enabled === false}"
                            //   th:href="@{'/categorys/' + ${category.id} + '/enabled/true'}"
                            //   th:tittle="'Enabled this ' + 'category'"
                            className="fas fa-circle fa-2x icon-dark"
                          >
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              color="grey"
                            />
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <a
                        href={"/category/update/" + category.id}
                        // th:tittle="'Edit this' + 'category'"
                        className="fas fa-edit fa-2x icon-green"
                      >
                        <FontAwesomeIcon icon={faFilePen} color="grey" />
                      </a>
                    </td>
                    <td>
                      <span
                        onClick={() => handleDelete(category.id)}
                        // th:href="@{'/category/delete/' + ${category.id}}"
                        // th:entityId="${category.id}"
                        // th:tittle="'Delete this' + 'category'"
                        className="fas fa-trash fa-2x icon-dark link-delete"
                      >
                        <FontAwesomeIcon icon={faXmark} color="grey" />
                      </span>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <nav>
        <ul className="pagination justify-content-center flex-wrap">
          <li
            className={
              currentPage > 1 ? "page-item active" : "page-item disabled"
            }
          >
            <button
              onClick={() => {
                setCurrentPage(1);
              }}
              className="page-link"
            >
              First
            </button>
          </li>
          <li
            className={
              currentPage > 1 ? "page-item active" : "page-item disabled"
            }
          >
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }}
              className="page-link"
            >
              Previous
            </button>
          </li>
          {Array(totalPage)
            .fill(null)
            .map((item, index) => {
              if (index + 1 === currentPage) {
                return (
                  <div key={index} className="page-item active">
                    <span className="page-link">{index + 1}</span>
                  </div>
                );
              } else {
                return (
                  <div key={index} className="page-item">
                    <button
                      onClick={() => {
                        setCurrentPage(index + 1);
                      }}
                      className="page-link"
                    >
                      {index + 1}
                    </button>
                  </div>
                );
              }
            })}
          <li
            className={
              currentPage < totalPage
                ? "page-item active"
                : "page-item disabled"
            }
          >
            <button
              onClick={() => {
                if (currentPage < totalPage) {
                  setCurrentPage(currentPage + 1);
                }
              }}
              className="page-link"
            >
              Next
            </button>
          </li>

          <li
            className={
              currentPage < totalPage
                ? "page-item active"
                : "page-item disabled"
            }
          >
            <button
              onClick={() => {
                setCurrentPage(totalPage);
              }}
              className="page-link"
            >
              Last
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};
