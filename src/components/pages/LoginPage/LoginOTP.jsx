import { useState, useEffect } from "react";
import hero_left_bg from "../../../images/b9f7c5e8-c835-403b-8029-47dcb0f0172c.jpg";
import Navbar from "../../sections/Navbar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../../../images/footerLogo.svg";
import hero1 from "../../../images/herobg2.png";
import ReactCountryFlag from "react-country-flag"; // For displaying country flags

const LoginPage = () => {
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mobileNumber, setMobileNumber] = useState("");
    const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
    const [errorMessage, setErrorMessage] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    const countryCodes = [
        { code: "+1", iso: "US" },
        { code: "+91", iso: "IN" },
        { code: "+44", iso: "GB" },
        { code: "+61", iso: "AU" },
        // Add more country codes as needed
    ];

    const handleCountryCodeChange = (e) => {
        setSelectedCountryCode(e.target.value);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (errorMessage) {
            setTimeout(() => {
                setErrorMessage("");
            }, 5000);
        }
    }, [errorMessage]);

    useEffect(() => {
        const isMobileNumberValid = mobileNumber && validateMobileNumber(mobileNumber);
        setIsFormValid(isMobileNumberValid);
    }, [mobileNumber]);

    const validateMobileNumber = (mobileNumber) => {
        const mobileRegex = /^\d{10}$/; // Assuming a 10-digit mobile number
        return mobileRegex.test(mobileNumber);
    };

    const login = async (e) => {
        setErrorMessage("");

        if (!mobileNumber) {
            setErrorMessage("The phone number you entered is incorrect. Check and try again.");
            return;
        }

        if (!validateMobileNumber(mobileNumber)) {
            if (mobileNumber.length !== 10) {
                setErrorMessage("Invalid phone number. Please enter a 10-digit phone number.");
            } else {
                setErrorMessage("Phone number format is invalid. Example: 9090909090.");
            }
            return;
        }

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/generate-otp/`, // Replace with your OTP generation endpoint
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ mobileNumber, countryCode: selectedCountryCode }),
                }
            );

            if (!response.ok) {
                setErrorMessage("Failed to generate OTP. Please try again.");
                throw new Error("OTP generation failed");
            }

            const data = await response.json();
            navigate("/verify-otp", { state: { mobileNumber, countryCode: selectedCountryCode } });
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleOtpLogin = () => {
        navigate("/login");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            login();
        }
    };

    // Function to clear the mobile number input
    const clearMobileNumber = () => {
        setMobileNumber("");
    };

    return (
        <>
            <div
                className="flex flex-col justify-center items-center min-h-screen w-full"
                style={{
                    backgroundImage: `url(${hero1})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="w-[80%] max-w-[600px]  bg-white p-12 rounded-3xl shadow-2xl border-2 border-white">
                    <h2 className="text-center text-xxl font-bold text-black">
                        Login with OTP
                    </h2>
                    <p className="text-center text-sm text-black p-2">
                        Hey, Enter your registred mobile number and we will send you an OTP for login
                    </p>

                    <form className="space-y-4" onKeyDown={handleKeyDown}>
                        {/* Combined Country Code Selector and Mobile Number Input */}
                        <div className="flex flex-col space-y-2">
                            {/* Mobile Number Input Field */}
                            <div
                                className={`flex items-center h-12 px-2 text-[#6D6E6F] font-semibold border rounded-lg focus:outline-none focus:ring-2 ${errorMessage
                                        ? "border-red-500 focus:ring-red-500" // Red border if there's an error
                                        : "border-[#898B92] focus:ring-[#898B92]" // Default border
                                    }`}
                            >
                                {/* Country Code Selector */}
                                <div className="flex items-center">
                                    <ReactCountryFlag
                                        countryCode={
                                            countryCodes.find((country) => country.code === selectedCountryCode)?.iso
                                        }
                                        svg
                                        style={{ width: "20px", height: "15px", marginRight: "8px" }}
                                    />
                                    <select
                                        value={selectedCountryCode}
                                        onChange={handleCountryCodeChange}
                                        className="bg-transparent focus:outline-none"
                                    >
                                        {countryCodes.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.code}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Mobile Number Input */}
                                <input
                                    type="number"
                                    placeholder="Enter your mobile number"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    className="w-full h-full px-8 bg-transparent focus:outline-none"
                                />

                                {/* Exclamation Mark for Errors */}
                                {errorMessage && (
                                    <span className="text-red-500 text-lg font-bold pr-2">❗</span>
                                )}

                                {/* Clear Button */}
                                {mobileNumber && (
                                    <button
                                        type="button"
                                        onClick={clearMobileNumber}
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none text-2xl font-bold"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>


                            {/* Error Message Below the Input Field */}
                            {errorMessage && (
                                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="button"
                                className={`w-full py-2 rounded-[20px] shadow border-none font-medium transition duration-300 hover:shadow-lg ${isFormValid
                                        ? 'bg-pink-500 hover:bg-pink-600 text-white' // White text when enabled
                                        : 'bg-[#D3D3D3] hover:bg-[#C0C0C0] text-gray-600' // Gray text when disabled
                                    }`}
                                onClick={login}
                            >
                                Generate OTP
                            </button>
                        </div>


                        {/* OTP Login Button */}
                        <div>
                            <button
                                type="button"
                                className="w-full py-2 bg-white rounded-[20px] border-gray-300 text-pink-500 font-medium transition duration-300"
                                onClick={handleOtpLogin}
                            >
                                Login with password
                            </button>
                        </div>
                    </form>

                    {/* Help Text */}
                    <div className="mt-4 font-medium text-center text-sm text-black pb-2">
                        Need Help in Login? Call 📞
                        <a href="tel:+919898989898" className="text-sky-500 no-underline">
                            +91 9898989898
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;