import React from "react";
import { useState, useEffect } from "react";
import avatar from "./../images/default-user.png";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
export const UserForm = (props) => {
  const params = useParams();
  const [Roles, setRoles] = useState([]);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roles, setUserRoles] = useState([]);
  const [enabled, setEnabled] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkEmail = (e) => {
    e.preventDefault();
    fetch("http://localhost:8082/ShoppingCartAdmin/users/check_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        id: params.id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.message === "Ok") {
          saveUser();
        } else {
          setError(result.message);
        }
      });
  };
  //save user
  const saveUser = () => {
    const id = params.id ? params.id : null;
    const newUser = {
      id,
      email,
    };
    console.log(newUser);
    //dynamic parameter url ?email=
    fetch("http://localhost:8082/ShoppingCartAdmin/users/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        // window.location.href = "/users";
        // navigate("/users", { state: { message: result } });
      });
  };

  //check role
  const handleRoleChange = (role, event) => {
    let checked = !event.target.checked;
    if (checked) {
      console.log("Clearing");
      setUserRoles([...roles].filter((element) => element.name !== role.name));
    } else {
      setUserRoles([...roles, role]);
    }
  };
  const hasRole = (role) => {
    var check = false;
    if (roles.length === 0) {
      return false;
    }
    roles.forEach((element) => {
      if (element.id === role.id) {
        check = true;
      }
    });
    return check;
  };

  //load data
  useEffect(() => {
    fetch("http://localhost:8082/ShoppingCartAdmin/role/getAll")
      .then((res) => res.json())
      .then((result) => {
        setRoles(result);
      });
    if (params.id) {
      fetch("http://localhost:8082/ShoppingCartAdmin/user/get/" + params.id)
        .then((res) => res.json())
        .then((result) => {
          setEmail(result.email);
          setFirstName(result.firstName);
          setLastName(result.lastName);
          setEnabled(result.enabled);
          setPassword(result.password);
          setUserRoles(result.roles);
        });
    }
  }, []);
  return (
    <>
      <div>
        <h2 className="text-center">Manage Users - Create new User</h2>
      </div>
      <form
        action=""
        method="post"
        style={{ maxWidth: "700px", margin: "0 auto" }}
        //   style="max-wid 700px; margin: 0 auto;"
        //   object="${user}"
        //   enctype="multipart/form-data"
        //   onsubmit="return checkEmailUnique(this);"
      >
        <input type="hidden" />
        <div className="border border-secondary rounded p-3">
          <div className="form-group row">
            <label htmlFor="" className="col-sm-4 col-form-label">
              E-mail:
            </label>
            <div className="col-sm-8">
              <input
                type="email"
                className="form-control"
                required
                minLength="8"
                maxLength="128"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="" className="col-sm-4 col-form-label">
              First Name:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                required
                minLength="2"
                maxLength="45"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="" className="col-sm-4 col-form-label">
              Last Name:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                required
                minLength="2"
                maxLength="45"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label htmlFor="" className="col-sm-4 col-form-label">
              Password:
            </label>
            <div className="col-sm-8">
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Roles: </label>
            <div className="col-sm-8">
              {Roles.map((role, index) => {
                return (
                  <div key={index}>
                    <input
                      type="checkbox"
                      text={role.name}
                      value={role.id}
                      checked={hasRole(role)}
                      onChange={(event) => handleRoleChange(role, event)}
                      className="m-2"
                    />
                    - <small>{role.description}</small>
                    <br />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="" className="col-sm-4 col-form label">
              Enabled:
            </label>
            <div className="col-sm-8">
              <input
                type="checkbox"
                defaultChecked={enabled}
                onChange={(e) => setEnabled(!enabled)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="" className="col-sm-4 col-form-label">
              Photos:{" "}
            </label>
            <div className="col-sm-8">
              {/* <input type="hidden" field="*{photos}" /> */}
              <input
                type="file"
                id="fileImage"
                name="image"
                accept="image/png, image/jpg"
                className="mb-2"
              />
              <img
                src={avatar}
                alt="Photos Review"
                id="thumbmail"
                className="img-fluid"
              />
            </div>
          </div>
          <div className="text-center">
            <input
              type="submit"
              value="Save"
              className="btn btn-primary m-3"
              onClick={(e) => {
                checkEmail(e);
              }}
            />
            <input
              type="button"
              value="Cancel"
              className="btn btn-secondary"
              id="buttonCancel"
              onClick={() => navigate("/users")}
            />
          </div>
        </div>
      </form>
      <Modal
        show={error === "" ? false : true}
        onHide={() => {
          setError("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Oops! There was a problem</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setError("");
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
