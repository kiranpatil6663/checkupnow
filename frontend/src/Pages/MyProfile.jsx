import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

function MyProfile() {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("address", JSON.stringify(userData.address));
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    userData && (
      <div className="max-w-2xl w-full mx-auto mt-6 p-6 bg-white shadow-xl rounded-2xl text-sm space-y-4">
        <div className="flex flex-col items-center">
          {isEdit ? (
            <label htmlFor="image" className="cursor-pointer relative">
              <img
                className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile"
              />
              {!image && (
                <img
                  className="w-8 absolute bottom-2 right-2"
                  src={assets.upload_icon}
                  alt="Upload"
                />
              )}
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
              />
            </label>
          ) : (
            <img
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-200 shadow"
              src={userData.image}
              alt="Profile"
            />
          )}

          {isEdit ? (
            <input
              className="text-2xl text-center font-semibold mt-4 bg-gray-100 px-2 py-1 rounded"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <p className="text-2xl font-semibold text-gray-800 mt-4">
              {userData.name}
            </p>
          )}
        </div>

        <hr className="my-4" />

        <div>
          <h2 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-2">
            Contact Information
          </h2>
          <div className="grid grid-cols-[120px_1fr] gap-y-2 gap-x-4">
            <span className="font-medium">Email:</span>
            <span className="text-blue-600">{userData.email}</span>

            <span className="font-medium">Phone:</span>
            {isEdit ? (
              <input
                className="bg-gray-100 px-2 py-1 rounded"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
              />
            ) : (
              <span className="text-gray-700">{userData.phone}</span>
            )}

            <span className="font-medium">Address:</span>
            {isEdit ? (
              <div className="space-y-2">
                <input
                  className="bg-gray-100 px-2 py-1 rounded w-full"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={userData.address?.line1 || ""}
                  type="text"
                />
                <input
                  className="bg-gray-100 px-2 py-1 rounded w-full"
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={userData.address?.line2 || ""}
                  type="text"
                />
              </div>
            ) : (
              <span className="text-gray-700">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </span>
            )}
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <h2 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-2">
            Basic Information
          </h2>
          <div className="grid grid-cols-[120px_1fr] gap-y-2 gap-x-4">
            <span className="font-medium">Gender:</span>
            {isEdit ? (
              <select
                className="bg-gray-100 px-2 py-1 rounded max-w-[120px]"
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <span className="text-gray-700">{userData.gender}</span>
            )}

            <span className="font-medium">Birthday:</span>
            {isEdit ? (
              <input
                className="bg-gray-100 px-2 py-1 rounded max-w-[160px]"
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <span className="text-gray-700">{userData.dob}</span>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          {isEdit ? (
            <button
              className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
              onClick={updateUserProfileData}
            >
              Save Information
            </button>
          ) : (
            <button
              className="px-6 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition"
              onClick={() => setIsEdit(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    )
  );
}

export default MyProfile;
