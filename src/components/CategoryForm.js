import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { storage } from "../base";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
export const CategoryForm = (props) => {
  const [error, setError] = useState("");
  const params = useParams();
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [enabled, setEnabled] = useState(null);
  const [percent, setPercent] = useState("");
  // const dispatch = useDispatch();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(new FormData());

  // const { image } = useSelector((state) => state.upload);
  const navigate = useNavigate();
  // const history = useNavigate();

  //check name
  const checkName = (e) => {
    e.preventDefault();
    fetch("http://localhost:8082/ShoppingCartAdmin/categories/check_name", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        id: params.id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        if (result.message === "Ok") {
          saveCategory();
        } else {
          setError(result.message);
        }
      });
  };

  const saveCategory = () => {
    imageData.append("name", name);
    imageData.append("id", params.id ? params.id : "");
    imageData.append("alias", alias);
    imageData.append("enabled", enabled);

    fetch("http://localhost:8082/ShoppingCartAdmin/categories/save", {
      method: "POST",
      body: imageData,
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        navigate("/categories", { state: { message: result } });
      })
      .then(() => {
        console.log("Category saved");
      });
  };
  const handleUploadClick = (event) => {
    let file = event.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setImageData(formData);
    setImagePreview(URL.createObjectURL(file));
    const storageRef = ref(storage, `/files/${file.name}`); // progress can be paused and resumed. It also exposes progress updates. // Receives the storage reference and the file to upload.
    uploadBytes(storageRef, file).then(() => {
      alert("Uploaded");
    });
  };

  useEffect(() => {
    if (params.id) {
      fetch(
        "http://localhost:8082/ShoppingCartAdmin/category/get/" + params.id,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
          setName(result.name);
          setAlias(result.alias);
          setEnabled(result.enabled);
        });
    }
  }, []);
  return (
    <>
      <div>
        <h2 className="text-center">Manage Category</h2>
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
        <div className="border border-secondary rounded p-3">
          <div className="form-group row">
            <label htmlFor="" className="col-sm-4 col-form-label">
              Name:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                required
                minLength="8"
                maxLength="128"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group row">
            <label htmlFor="" className="col-sm-4 col-form-label">
              Alias:
            </label>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                required
                minLength="2"
                maxLength="45"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
              />
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
                accept="image/*"
                id="upload-profile-image"
                type="file"
                onChange={handleUploadClick}
              />
              <img
                src={
                  imagePreview !== null
                    ? imagePreview
                    : "https://www.amerikickkansas.com/wp-content/uploads/2017/04/default-image.jpg"
                }
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
                checkName(e);
              }}
            />
            <input
              type="button"
              value="Cancel"
              className="btn btn-secondary"
              id="buttonCancel"
              onClick={() => {
                navigate("/categories");
              }}
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
