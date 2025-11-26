// export default MemStepTwo;
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchDataV2, justputDataWithoutToken } from "../../../apiUtils";
import StepTrackerAgent from "../../StepTracker/StepTrackerAgent";

import './AgentStepOne.css';

const MemStepTwo = () => {
  const [userId] = useState(localStorage.getItem("userId"));
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    town: '',
    city: '',
    state: '',
    country: '',
    pin_code: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId) {
      const parameter = {
        url: `/api/agent/${userId}/`,
        setterFunction: setApiData,
        setErrors: setErrors,
      };
      fetchDataV2(parameter);
    }
  }, [userId]);

  useEffect(() => {
    if (apiData) {
      setProfileData({
        town: apiData.town || null,
        city: apiData.city || null,
        state: apiData.state || null,
        country: apiData.country || null,
        pin_code: apiData.pin_code || null,
        address: apiData.address || null,
      });
    }
  }, [apiData]);

  const validateForm = () => {
    const newErrors = {};

    // Validate Sect / School of Thought
    if (!profileData.town?.trim()) {
      newErrors.town = "town required";
    }
    if (!profileData?.address?.trim()) {
      newErrors.address = "address required";
    }

    // Validate Believe in Dargah/Fatiha/Niyah
    if (!profileData.country) {
      newErrors.country =
        "Country required";
    }
    if (!profileData.city) {
      newErrors.city =
        "city required";
    }
    if (!profileData.state) {
      newErrors.state =
        "state required";
    }
    if (!profileData.pin_code) {
      newErrors.pin_code =
        "pin_code required";
    }

    // Validate Hijab/Niqab Preference (only for females)
    // if (profileData.gender === "female" && !profileData.hijab_niqab_prefer) {
    //   newErrors.hijab_niqab_prefer =
    //     "Hijab/Niqab Preference is required for females";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const naviagteNextStep = () => {
    if (validateForm()) {
      const parameters = {
        url: `/api/agent/${userId}/`,
        payload: {
          town: profileData.town || null,
          city: profileData.city || null,
          state: profileData.state || null,
          country: profileData.country || null,
          pin_code: profileData.pin_code || null,
          address: profileData.address || null,
        },
        navigate: navigate,
        navUrl: `/agentstepthr/${userId}`,
        setErrors: setErrors,
      };
      // navigate(`/agentstepthr/${userId}`)
      justputDataWithoutToken(parameters);
    } else {
      console.log("Form has errors. Please fix them.");
    }
  };

  const updateField = (field, value) => {
    setProfileData((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    // Clear the error for the field when it is updated
    if (errors[field]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const countries = [
    { value: "india", label: "India" },
    { value: "usa", label: "USA" },
    { value: "canada", label: "Canada" },
    { value: "australia", label: "Australia" },
    { value: "uk", label: "UK" },
    { value: "china", label: "China" },
    { value: "japan", label: "Japan" },
    { value: "germany", label: "Germany" },
    { value: "france", label: "France" },
    { value: "italy", label: "Italy" },
    { value: "brazil", label: "Brazil" },
    { value: "south_africa", label: "South Africa" },
    { value: "russia", label: "Russia" },
    { value: "mexico", label: "Mexico" },
    { value: "new_zealand", label: "New Zealand" }
  ];

  const citys = [
    { value: "mumbai", label: "Mumbai" },
    { value: "delhi", label: "Delhi" },
    { value: "bangalore", label: "Bangalore" },
    { value: "hyderabad", label: "Hyderabad" },
    { value: "chennai", label: "Chennai" },
    { value: "kolkata", label: "Kolkata" },
    { value: "pune", label: "Pune" },
    { value: "ahmedabad", label: "Ahmedabad" },
    { value: "jaipur", label: "Jaipur" },
    { value: "lucknow", label: "Lucknow" }
  ];

  const statues = [
    { value: "andhra_pradesh", label: "Andhra Pradesh" },
    { value: "arunachal_pradesh", label: "Arunachal Pradesh" },
    { value: "assam", label: "Assam" },
    { value: "bihar", label: "Bihar" },
    { value: "chhattisgarh", label: "Chhattisgarh" },
    { value: "goa", label: "Goa" },
    { value: "gujarat", label: "Gujarat" },
    { value: "haryana", label: "Haryana" },
    { value: "himachal_pradesh", label: "Himachal Pradesh" },
    { value: "jharkhand", label: "Jharkhand" },
    { value: "karnataka", label: "Karnataka" },
    { value: "kerala", label: "Kerala" },
    { value: "madhya_pradesh", label: "Madhya Pradesh" },
    { value: "maharashtra", label: "Maharashtra" },
    { value: "manipur", label: "Manipur" },
    { value: "meghalaya", label: "Meghalaya" },
    { value: "mizoram", label: "Mizoram" },
    { value: "nagaland", label: "Nagaland" },
    { value: "odisha", label: "Odisha" },
    { value: "punjab", label: "Punjab" },
    { value: "rajasthan", label: "Rajasthan" },
    { value: "sikkim", label: "Sikkim" },
    { value: "tamil_nadu", label: "Tamil Nadu" },
    { value: "telangana", label: "Telangana" },
    { value: "tripura", label: "Tripura" },
    { value: "uttar_pradesh", label: "Uttar Pradesh" },
    { value: "uttarakhand", label: "Uttarakhand" },
    { value: "west_bengal", label: "West Bengal" }
  ];

  const Dropdown = ({ options, name, value, onChange }) => {

    return (
      <select
        name={name}
        value={value || ''}
        onChange={onChange}
        className="mt-1 px-[12px] text-[12px] h-[38px] w-[100%] border rounded-[10px] border-[#ccc] focus:ring-[gray] focus:border-[gray]"
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="flex h-screen">
      <main className="flex-1 bg-white steps-title">
        <h3
          style={{
            fontSize: "1.8rem",
            padding: "3vh 0 0 10vh",
            fontWeight: "400",
            color: "#ec4899",
          }}
        >
          Create Your Mehram Match Profile
        </h3>
        <h5
          style={{
            fontSize: "1rem",
            padding: "0 1vh 3vh 10vh",
            fontWeight: "100",
          }}
        >
          Follow these 6 simple steps to complete your profile and find the
          perfect match
        </h5>

        <div
          style={{
            height: "1px",
            width: "91.5%",
            backgroundColor: "#ccc",
            marginLeft: "10vh",
          }}
        ></div>

        <div className="form_container_user_creation h-auto bg-white pb-[12px] w-[100vw]">
          <div
            className="step-tracker"
            style={{
              width: "33.8%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <StepTrackerAgent percentage={45} />
          </div>

          <div style={{ width: "86.1%", marginLeft: "19.5%" }}>
            <form
              style={{
                borderLeft: "0.5px solid #ccc",
                padding: "1rem",
                width: "70%",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                padding: "1% 4%",
                margin: "auto",
                height: "auto",
                position: "absolute",
                left: "24.2rem",
                zIndex: "0",
              }}
            >
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  margin: "0",
                  padding: "0",
                }}
              >
                step 2/6
              </p>
              <h4 className="col-span-3 m-0 p-0" style={{ fontWeight: "bold" }}>
                Residence Details
              </h4>
              <p
                style={{
                  fontSize: "small",
                  color: "gray",
                  marginBottom: "1vh",
                  padding: "0",
                }}
              >
                Please provide your Residence Details to help us create a
                profile that aligns with your values and preferences
              </p>
              <div
                style={{
                  height: "0.7px",
                  width: "100%",
                  backgroundColor: "#ccc",
                }}
              ></div>

              {/* Sect / School of Thought */}
              <div style={{ display: "flex", gap: "2rem" }}>
                {/* Islam Practicing Level */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="town"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Town
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="town"
                      name="town"
                      value={profileData.town || ''}
                      className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      onChange={(e) =>
                        updateField("town", e.target.value)
                      }
                    />
                    {errors.town && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.town}
                      </p>
                    )}
                  </div>

                  {/* Information icon positioned at right corner of input */}
                  <div className="absolute right-2 bottom-1  transform -translate-y-1/2 group z-20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500 cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {/* Tooltip text */}
                    <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-2 top-full">
                      This is additional information about the Islam Practicing Level field.
                    </div>
                  </div>
                </div>



                {/* Islam Practicing Level */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label htmlFor="city" className="block text-sm font-medium text-[#000000] mb-0">
                    City
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={profileData.city || ''}
                    onChange={(e) => updateField("city", e.target.value)}
                    className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                  >
                    <option value="">Select City</option>
                    {citys.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>


                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label htmlFor="state" className="block text-sm font-medium text-[#000000] mb-0">
                    State
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={profileData.state || ''}
                    onChange={(e) => updateField("state", e.target.value)}
                    className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                  >
                    <option value="">Select State</option>
                    {statues.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>

              </div>

              {/* Sect / School of Thought */}
              <div style={{ display: "flex", gap: "2rem" }}>
                {/* Islam Practicing Level */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label htmlFor="country" className="block text-sm font-medium text-[#000000] mb-0">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={profileData.country || ''}
                    onChange={(e) => updateField("country", e.target.value)}
                    className=" h-10 w-[100%] text-[#6D6E6F]  placeholder-[#898B92] font-semibold rounded-lg border-1 border-[#898B92] 
                          text-[#6D6E6F] text-sm font-semibold pl-[12px] pr-[24px] text-[12px] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>




                {/* Islam Practicing Level */}
                <div className="w-[50%] relative flex flex-col gap-[10px]">
                  <label
                    htmlFor="pincode"
                    className="block text-sm font-medium text-[#000000] mb-0"
                  >
                    Pin Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={profileData.pin_code || ''}
                      className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                      onChange={(e) =>
                        updateField("pin_code", e.target.value)
                      }
                    />
                    {errors.pin_code && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pin_code}
                      </p>
                    )}
                  </div>
                  {/* Information icon positioned at right corner of input */}
                  <div className="absolute right-2 bottom-1 transform -translate-y-1/2 group z-20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-red-500 cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {/* Tooltip text */}
                    <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-2 top-full">
                      This is additional information about the Islam Practicing Level field.
                    </div>
                  </div>
                </div>

              </div>
              <div className="w-[100%] relative flex flex-col gap-[10px]">
                <label
                  htmlFor="fulladdress"
                  className="block text-sm font-medium text-[#000000] mb-0"
                >
                  Full Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fulladdress"
                    name="fulladdress"
                    value={profileData.address || ''}
                    className="h-10 px-[12px] text-[#6D6E6F] font-semibold placeholder-[#898B92] w-full rounded-lg border-1 border-[#898B92] focus:ring-[#ffa4a4] focus:border-[#ffa4a4]"
                    onChange={(e) =>
                      updateField("address", e.target.value)
                    }
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>
                {/* Information icon positioned at right corner of input */}
                <div className="absolute right-2 bottom-1 transform -translate-y-1/2 group z-20">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-red-500 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {/* Tooltip text */}
                  <div className="absolute z-10 hidden group-hover:block w-64 p-2 text-sm bg-yellow-100 text-yellow-800 rounded shadow-lg left-1/2 transform -translate-x-1/2 mt-2 top-full">
                    This is additional information about the Islam Practicing Level field.
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <button
                  onClick={() => navigate(`/agentstepone/${userId}`)}
                  className="text-[black] bg-[white] mt-[24px] h-[40px] w-[150px]"
                  style={{
                    borderRadius: "5vh",
                    fontWeight: "400",
                    border: "1px solid black",
                  }}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={naviagteNextStep}
                  className="text-[white] bg-[#0fd357] mt-[24px] h-[40px] w-[150px]"
                  style={{
                    borderRadius: "5vh",
                    fontWeight: "400",
                  }}
                >
                  Next Step
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemStepTwo;

