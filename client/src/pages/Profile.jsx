import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  signoutUser,
} from "../redux/userSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listing, setListing] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/auth/user/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/auth/user/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/user/signout", {
        method: "GET",
      });
      dispatch(signoutUser());
    } catch (error) {}
  };

  const handleShowListing = async () => {
    try {
      const res = await fetch(`/api/listing/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setListing(data);
    } catch (error) {}
  };

  const deleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) return;

      setListing(listing.filter((prev) => prev._id !== id));
    } catch (error) {}
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        ref={fileRef}
        className="hidden"
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover cursor-pointer self-center"
        />
        <p className="text-sm mx-auto">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload! must be less than 2 mb
            </span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className="text-green-700">{`Uploading ${filePer}% ...`}</span>
          ) : filePer === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          name="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          name="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="*********"
          className="border p-3 rounded-lg"
          name="password"
          defaultValue={currentUser.password}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 p-3"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-white  hover:bg-opacity-95 p-3 rounded-lg uppercase text-center"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-4">
        <button className="text-red-700 cursor-pointer" onClick={handleDelete}>
          Delete account
        </button>
        <button className="text-red-700 cursor-pointer" onClick={handleSignout}>
          Sign out
        </button>
      </div>
      <p className="text-red-700 mt-4 mx-auto">{error ? error : ""}</p>
      <p className="text-green-700 mt-4 mx-auto">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
      {listing ? (
        <button
          onClick={() => setListing(null)}
          className="text-red-700 w-full mb-4 text-lg"
        >
          Hide Listing
        </button>
      ) : (
        <button
          onClick={handleShowListing}
          className="text-green-700 w-full mb-4 text-lg"
        >
          Show Listing
        </button>
      )}
      {listing &&
        listing.map((list) => {
          return (
            <div
              key={list._id}
              className="border rounded-lg flex justify-between items-center gap-4 p-1"
            >
              <Link to={`/listing/${list._id}`}>
                <img
                  src={list.imageUrls[0]}
                  alt="list-image"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link to={`/listing/${list._id}`} className="flex-1">
                <p className="text-slate-700 font-semibold  hover:underline truncate">
                  {list.name}
                </p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => deleteListing(list._id)}
                  className="text-red-700"
                >
                  Delete
                </button>
                <Link
                  to={`/update-listing/${list._id}`}
                  className="text-green-700"
                >
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Profile;
