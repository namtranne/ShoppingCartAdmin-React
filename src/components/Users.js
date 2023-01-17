import { useState, useEffect } from "react";
import React from "react";
import { RxAvatar } from "react-icons/all";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { storage } from "../base";
// import fireBase from'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
  fireBase,
} from "firebase/storage";
import {
  faCheckCircle,
  faFilePen,
  faXmark,
  faSortAmountDown,
  faSortAmountUp,
  faFileCsv,
  faFilePdf,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useResolvedPath } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export const Users = () => {
  const [users, setUsers] = useState([]);
  // const [isUpdate, setIsUpdate] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const userPerPage = 4;
  const totalPage =
    users.length / userPerPage - Math.floor(users.length / userPerPage) === 0
      ? users.length / userPerPage
      : Math.floor(users.length / userPerPage) + 1;
  const { state } = useLocation();
  const [message, setMessage] = useState(
    state && state.message ? state.message.message : ""
  );
  const navigate = useNavigate();
  const [isAsc, setIsAsc] = useState(true);
  const [sortField, setSortField] = useState("");
  //Enable users
  const handleEnable = (id, bool) => {
    fetch(
      "http://localhost:8082/ShoppingCartAdmin/users/" +
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
        setUsers(
          [...users].map((user) => {
            if (user.id === id) {
              const newUser = { ...user, enabled: bool };
              return newUser;
            }
            return user;
          })
        );
      });
  };

  //Delete users
  const handleDelete = (id) => {
    fetch("http://localhost:8082/ShoppingCartAdmin/user/delete/" + id, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((result) => {
        setMessage(result.message);
      })
      .then(setUsers([...users].filter((user) => user.id !== id)));
  };

  //Update users after actions
  const updateUsers = () => {
    fetch("http://localhost:8082/ShoppingCartAdmin/user/getAll")
      .then((res) => res.json())
      .then((result) => {
        result = [...result].map((item) => {
          if (item.photos != null) {
            getDownloadURL(ref(storage, `files/${item.id}/${item.photos}`))
              .then((url) => {
                item.photos = url;
              })
              .catch((error) => {
                // Handle any errors
              });
          }
          return item;
        });
        return result;
      })
      .then((result) => {
        setUsers(result);
      });
  };

  //Load the users
  useEffect(() => {
    fetch("http://localhost:8082/ShoppingCartAdmin/user/getAll")
      .then((res) => res.json())
      .then((result) => {
        const newResult = result.map((item) => {
          getDownloadURL(ref(storage, `files/${item.id}/${item.photos}`)).then(
            (url) => {
              return { ...item, photos: url };
            }
          );
          // return item;
        });
        console.log(newResult);
        setUsers([...newResult]);
      });
    navigate(window.location.pathname, {});
  }, []);
  return (
    <>
      <div>
        <h2 className="text-center">Manage Users - View All</h2>
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
        href="http://localhost:8082/ShoppingCartAdmin/users/export/csv"
        style={{ margin: "0 5px 0 5px" }}
      >
        <FontAwesomeIcon icon={faFileCsv} />
      </a>
      <a
        href="http://localhost:8082/ShoppingCartAdmin/users/export/pdf"
        style={{ margin: "0 5px 0 5px" }}
      >
        <FontAwesomeIcon icon={faFilePdf} />
      </a>
      <a
        href="http://localhost:8082/ShoppingCartAdmin/users/export/excel"
        style={{ margin: "0 5px 0 5px" }}
      >
        <FontAwesomeIcon icon={faFileExcel} />
      </a>
      <div className="full-details">
        <table className="table table-bordered table-striped table-hover table-reponsive-xs">
          <thead className="thead-dark">
            <tr>
              <th className="hideable-column">
                <a
                  className="text-white"
                  onClick={() => {
                    if (
                      (isAsc && sortField === "id") ||
                      (!isAsc && sortField !== "id")
                    ) {
                      setIsAsc(false);
                      setSortField("id");
                      setUsers(
                        [...users].sort((a, b) => (a.id > b.id ? -1 : 1))
                      );
                    } else if (
                      (!isAsc && sortField === "id") ||
                      (isAsc && sortField !== "id")
                    ) {
                      setIsAsc(true);
                      setSortField("id");
                      setUsers(
                        [...users].sort((a, b) => (a.email > b.email ? 1 : -1))
                      );
                    }
                  }}
                >
                  User ID
                </a>
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
              <th>Photos</th>
              <th className="hideable-column">
                <a
                  className="text-white"
                  onClick={() => {
                    if (
                      (isAsc && sortField === "email") ||
                      (!isAsc && sortField !== "email")
                    ) {
                      setIsAsc(false);
                      setSortField("email");
                      setUsers(
                        [...users].sort((a, b) => (a.email > b.email ? -1 : 1))
                      );
                    } else if (
                      (!isAsc && sortField === "email") ||
                      (isAsc && sortField !== "email")
                    ) {
                      setIsAsc(true);
                      setSortField("email");
                      setUsers(
                        [...users].sort((a, b) => (a.email > b.email ? 1 : -1))
                      );
                    }
                  }}
                >
                  E-mail
                </a>
                {sortField === "email" && isAsc === true ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountUp} />
                  </span>
                ) : sortField === "email" && !isAsc ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountDown} />
                  </span>
                ) : null}
              </th>
              <th>
                <a
                  className="text-white"
                  onClick={() => {
                    if (
                      (isAsc && sortField === "firstName") ||
                      (!isAsc && sortField !== "firstName")
                    ) {
                      setIsAsc(false);
                      setSortField("firstName");
                      setUsers(
                        [...users].sort((a, b) =>
                          a.firstName > b.firstName ? -1 : 1
                        )
                      );
                    } else if (
                      (!isAsc && sortField === "firstName") ||
                      (isAsc && sortField !== "firstName")
                    ) {
                      setIsAsc(true);
                      setSortField("firstName");
                      setUsers(
                        [...users].sort((a, b) =>
                          a.firstName > b.firstName ? 1 : -1
                        )
                      );
                    }
                  }}
                >
                  First Name
                </a>
                {sortField === "firstName" && isAsc === true ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountUp} />
                  </span>
                ) : sortField === "firstName" && !isAsc ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountDown} />
                  </span>
                ) : null}
              </th>
              <th>
                <a
                  className="text-white"
                  onClick={() => {
                    if (
                      (isAsc && sortField === "lastName") ||
                      (!isAsc && sortField !== "lastName")
                    ) {
                      setIsAsc(false);
                      setSortField("lastName");
                      setUsers(
                        [...users].sort((a, b) =>
                          a.lastName > b.lastName ? -1 : 1
                        )
                      );
                    } else if (
                      (!isAsc && sortField === "lastName") ||
                      (isAsc && sortField !== "lastName")
                    ) {
                      setIsAsc(true);
                      setSortField("lastName");
                      setUsers(
                        [...users].sort((a, b) =>
                          a.lastName > b.lastName ? 1 : -1
                        )
                      );
                    }
                  }}
                >
                  Last Name
                </a>
                {sortField === "lastName" && isAsc === true ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountUp} />
                  </span>
                ) : sortField === "lastName" && !isAsc ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountDown} />
                  </span>
                ) : null}
              </th>
              <th>Roles</th>
              <th>
                <a
                  className="text-white"
                  onClick={() => {
                    if (
                      (isAsc && sortField === "enabled") ||
                      (!isAsc && sortField !== "enabled")
                    ) {
                      setIsAsc(false);
                      setSortField("enabled");
                      setUsers(
                        [...users].sort((a, b) =>
                          a.enabled > b.enabled ? -1 : 1
                        )
                      );
                    } else if (
                      (!isAsc && sortField === "enabled") ||
                      (isAsc && sortField !== "enabled")
                    ) {
                      setIsAsc(true);
                      setSortField("enabled");
                      setUsers(
                        [...users].sort((a, b) =>
                          a.enabled > b.enabled ? 1 : -1
                        )
                      );
                    }
                  }}
                >
                  Enabled
                </a>
                {sortField === "enabled" && isAsc === true ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountUp} />
                  </span>
                ) : sortField === "enabled" && !isAsc ? (
                  <span>
                    <FontAwesomeIcon icon={faSortAmountDown} />
                  </span>
                ) : null}
              </th>
              <th>
                <span>Edit</span>
                &nbsp; &nbsp; &nbsp;
                <span>Delete</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {users
              .slice(
                (currentPage - 1) * userPerPage,
                currentPage * userPerPage < users.length
                  ? currentPage * userPerPage
                  : users.length
              )
              .filter(
                (user) =>
                  user.id.toString().includes(filter) ||
                  user.email.includes(filter) ||
                  user.firstName.includes(filter) ||
                  user.lastName.includes(filter)
              )
              .map((user, index) => {
                return (
                  <tr key={index}>
                    <td className="hideable-column">{user.id}</td>
                    <td>
                      {user.photos == null ? (
                        <span className="fa fa-portait fa-3x icon-silver">
                          <RxAvatar></RxAvatar>
                        </span>
                      ) : (
                        <img src={user.photos} />
                      )}
                    </td>
                    <td className="hideable-column">{user.email}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>
                      {user.roles.map((role, index) => {
                        return <div key={index}>{role.name}</div>;
                      })}
                    </td>
                    <td>
                      <div>
                        {user.enabled ? (
                          <span
                            onClick={() => {
                              handleEnable(user.id, false);
                            }}
                            tittle="'Disable this ' + 'user'"
                            className="fas fa-check-circle fa-2x icon-green"
                          >
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </span>
                        ) : (
                          <span
                            onClick={() => {
                              handleEnable(user.id, true);
                            }}
                            //   th:if="${user.enabled === false}"
                            //   th:href="@{'/users/' + ${user.id} + '/enabled/true'}"
                            //   th:tittle="'Enabled this ' + 'user'"
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
                        href={"/user/update/" + user.id}
                        // th:tittle="'Edit this' + 'user'"
                        className="fas fa-edit fa-2x icon-green"
                      >
                        <FontAwesomeIcon icon={faFilePen} color="grey" />
                      </a>
                      &nbsp;&nbsp;
                      <span
                        onClick={() => {
                          handleDelete(user.id);
                        }}
                        // th:href="@{'/user/delete/' + ${user.id}}"
                        // th:entityId="${user.id}"
                        // th:tittle="'Delete this' + 'user'"
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
          <li className={currentPage > 1 ? "page-item" : "page-item disabled"}>
            <button
              onClick={() => {
                setCurrentPage(1);
              }}
              className="page-link"
            >
              First
            </button>
          </li>
          <li className={currentPage > 1 ? "page-item" : "page-item disabled"}>
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
                    <a href="" className="page-link">
                      {index + 1}
                    </a>
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
              currentPage < totalPage ? "page-item" : "page-item disabled"
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
              currentPage < totalPage ? "page-item" : "page-item disabled"
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
