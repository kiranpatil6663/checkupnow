import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const {backendUrl, getProfileData, dToken, setProfileData, profileData } =
    useContext(DoctorContext);
  const { currency,  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile =async()=>{
    try {

      const updateData={
        address:profileData.address,
        fees:profileData.fees,
        available:profileData.available
      }
      const {data}=await axios.post(backendUrl+'/api/doctor/update-profile',updateData,{headers:{dToken}})
      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()

        
        
      } else {
        toast.error(data.message)

        
      }
      
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }

  }


  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);
  return (
    profileData && (
      <div className="p-5">
        <div className="flex flex-col gap-6 max-w-xl mx-auto">
          {/* Profile Image */}
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-xl shadow-md"
              src={profileData.image}
              alt="Doctor Profile"
            />
          </div>

          {/* Doctor Info Card */}
          <div className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm space-y-2">
            <p className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
              {profileData.name}
            </p>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <span className="px-2 py-0.5 bg-gray-100 border text-xs rounded-full">
                {profileData.experience}
              </span>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-700">About:</p>
            <p className="text-sm text-gray-600">{profileData.about}</p>
          </div>

          {/* Appointment Fee */}
          <p className="text-sm text-gray-700 font-medium">
            Appointment Fee:{" "}
            <span className="text-gray-900 font-semibold">
              {currency}
              {isEdit ? (
                <input
                  type="number"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                  value={profileData.fees}
                />
              ) : (
                profileData.fees
              )}
            </span>
          </p>

          {/* Address Section */}
          <div className="text-sm text-gray-700">
            <p className="font-medium">Address:</p>
            <p className="text-gray-600">
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  value={profileData.address.line1}
                />
              ) : (
                profileData.address.line1
              )}
              <br />
              {isEdit ? (
                <input
                  type="text"
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  value={profileData.address.line2}
                />
              ) : (
                profileData.address.line2
              )}
            </p>
          </div>

          {/* Available Toggle */}
          <div className="flex items-center gap-2">
            <input onChange={()=>isEdit && setProfileData(prev => ({...prev,available:!prev.available}))} checked={profileData.available} type="checkbox" />
            <label className="text-sm text-gray-700">Available</label>
          </div>
             

             {isEdit ?
              <button
            onClick={updateProfile}
            className="self-start mt-2 border border-primary px-4 py-1.5 rounded-full text-sm text-primary hover:bg-primary hover:text-white transition-all"
          >
            Save
          </button>:
          <button
            onClick={() => setIsEdit(true)}
            className="self-start mt-2 border border-primary px-4 py-1.5 rounded-full text-sm text-primary hover:bg-primary hover:text-white transition-all"
          >
            Edit
          </button>

             }
          {/* Edit Button */}
         
           
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
