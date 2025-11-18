import React, { useState } from "react";
import hero_left_bg from "../../../images/b9f7c5e8-c835-403b-8029-47dcb0f0172c.jpg";
import { useNavigate } from "react-router-dom";
import Footer from "../../sections/Footer";
import Navbar from "../../sections/Navbar";
import { justpostDataWithoutToken } from "../../../apiUtils";

const RegisterPage = () => {
  const navigate = useNavigate();

  // consolidated form state
  const [form, setForm] = useState({
    gender: "",
    firstName: "",
    lastName: "",
    dob: "",
    caste: "",
    city: "",
    onBehalf: "",
    contactNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    // clear field-level error
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.gender) e.gender = "Please select gender.";
    if (!form.firstName) e.firstName = "First name is required.";
    if (!form.lastName) e.lastName = "Last name is required.";
    if (!form.dob) e.dob = "Date of birth is required.";
    if (!form.city) e.city = "City is required.";
    if (!form.contactNumber) e.contactNumber = "Contact number is required.";
    if (!form.email) e.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.password) e.password = "Password is required.";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }

    setSubmitting(true);

    const parameter = {
      url: "/api/user/",
      payload: {
        // your API expects name field as username (previously userName) — using first+last
        name: `${form.firstName} ${form.lastName}`.trim(),
        contact_number: form.contactNumber,
        password: form.password,
        dob: form.dob,
        caste: form.caste,
        city: form.city,
        on_behalf: form.onBehalf,
        gender: form.gender,
        email: form.email,
      },
      setErrors: setErrors,
      navigate: navigate,
      navUrl: `/login`,
    };

    try {
      await justpostDataWithoutToken(parameter);
      // justpostDataWithoutToken likely handles navigation via parameter.navigate,
      // but if it doesn't, you can uncomment below:
      // navigate("/login");
    } catch (err) {
      // If your justpostDataWithoutToken throws, you can set a general error:
      setErrors((p) => ({ ...p, global: "Registration failed. Try again." }));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen bg-gray-900 text-white font-sans overflow-hidden">
        {/* decorative blur / svg */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width="2200"
          height="1200"
          viewBox="0 0 3057 1612"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <g opacity="0.4" filter="url(#filter0_f)">
            <path
              d="M792.911 1177.39C2161.93 1205.37 2687.91 1336.3 2676.83 1053.46C2665.75 770.607 2531.75 162.933 1919.78 608.194C1307.81 1053.46 -348.73 258.382 744.376 396.308C1618.86 506.649 1812.51 859.393 1800.02 1021.97"
              stroke="url(#paint0_linear)"
              strokeWidth="191"
            />
          </g>
          <defs>
            <filter id="filter0_f" x="0" y="0" width="3058" height="1612" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="142" />
            </filter>
            <linearGradient id="paint0_linear" x1="722.914" y1="380" x2="2586.83" y2="1256.18" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F998CE" />
              <stop offset="1" stopColor="#A188EE" />
            </linearGradient>
          </defs>
        </svg>

        {/* Content */}
        <section className="container mx-auto px-4 py-12 flex items-start justify-center">
          <div className="w-full max-w-4xl">
            <div
              className="bg-gradient-to-b from-pink-50/90 to-pink-100/80 p-4 sm:p-6 md:p-8 rounded-xl shadow-xl border border-pink-200 backdrop-blur"
              style={{ background: "radial-gradient(at bottom left, #FFBCE1, #FFE0F1)" }}
            >
              <h3 className="text-center text-[#9E286A] text-lg font-medium mb-6">
                Fill out the fields — your perfect Nikah partner could be just a step away.
              </h3>

              {errors.global && (
                <div className="mb-4 text-sm text-red-600 text-center">{errors.global}</div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Gender (spans full width on small screens) */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                  <label className="block text-sm font-medium text-[#9E286A]">Gender</label>
                  <div className="mt-2 flex items-center gap-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={form.gender === "male"}
                        onChange={handleChange}
                        className="accent-pink-400"
                        aria-checked={form.gender === "male"}
                        aria-label="Male"
                      />
                      <span className="ml-2 text-sm text-[#9E286A]">Male</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={form.gender === "female"}
                        onChange={handleChange}
                        className="accent-pink-400"
                        aria-checked={form.gender === "female"}
                        aria-label="Female"
                      />
                      <span className="ml-2 text-sm text-[#9E286A]">Female</span>
                    </label>
                  </div>
                  {errors.gender && <p className="text-xs text-red-600 mt-1">{errors.gender}</p>}
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#9E286A]">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Abdullah"
                    className="mt-2 h-12 px-4 w-full rounded-lg border border-pink-200 bg-white/90 text-pink-600 placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-100 font-semibold"
                  />
                  {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#9E286A]">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    type="text"
                    placeholder="Afridi"
                    className="mt-2 h-12 px-4 w-full rounded-lg border border-pink-200 bg-white/90 text-pink-600 placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-100 font-semibold"
                  />
                  {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
                </div>

                {/* DOB */}
                <div>
                  <label htmlFor="dob" className="block text-sm font-medium text-[#9E286A]">
                    Date Of Birth
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    type="date"
                    className="mt-2 h-12 px-4 w-full rounded-lg border border-pink-200 bg-white/90 text-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                  {errors.dob && <p className="text-xs text-red-600 mt-1">{errors.dob}</p>}
                </div>

                {/* Caste */}
                <div>
                  <label htmlFor="caste" className="block text-sm font-medium text-[#9E286A]">
                    Caste
                  </label>
                  <input
                    id="caste"
                    name="caste"
                    value={form.caste}
                    onChange={handleChange}
                    type="text"
                    placeholder="-----------"
                    className="mt-2 h-12 px-4 w-full rounded-lg border border-pink-200 bg-white/90 text-pink-600 placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                  {errors.caste && <p className="text-xs text-red-600 mt-1">{errors.caste}</p>}
                </div>

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-[#9E286A]">City</label>
                  <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    type="text"
                    placeholder="Pune"
                    className="mt-2 h-12 px-4 w-full rounded-lg border border-pink-200 bg-white/90 text-pink-600 placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                  {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                </div>

                {/* On Behalf */}
                <div>
                  <label htmlFor="onBehalf" className="block text-sm font-medium text-[#9E286A]">On Behalf</label>
                  <input
                    id="onBehalf"
                    name="onBehalf"
                    value={form.onBehalf}
                    onChange={handleChange}
                    type="text"
                    placeholder="Brother / Self / Sister"
                    className="mt-2 h-12 px-4 w-full rounded-lg border border-pink-200 bg-white/90 text-pink-600 placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                  {errors.onBehalf && <p className="text-xs text-red-600 mt-1">{errors.onBehalf}</p>}
                </div>

                {/* Contact */}
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-[#9E286A]">Contact Number</label>
                  <input
                    id="contactNumber"
                    name="contactNumber"
                    value={form.contactNumber}
                    onChange={handleChange}
                    type="tel"
                    inputMode="tel"
                    placeholder="+91 1234567890"
                    className="mt-2 h-12 px-4 w-full rounded-lg border border-pink-200 bg-white/90 text-pink-600 placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                  {errors.contactNumber && <p className="text-xs text-red-600 mt-1">{errors.contactNumber}</p>}
                </div>

                {/* Email - spans 2 columns on small screens */}
                <div className="sm:col-span-2 lg:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-[#9E286A]">Email</label>
                  <input
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="abdullahafridi@email.com"
                    className="mt-2 h-12 px-4 w-full rounded-lg border border-pink-200 bg-white/90 text-pink-600 placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#9E286A]">Password</label>
                  <input
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    type="password"
                    placeholder="************"
                    className="mt-2 h-12 px-4 w-full rounded-lg border border-pink-200 bg-white/90 text-pink-600 placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                  {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#9E286A]">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    type="password"
                    placeholder="************"
                    className="mt-2 h-12 px-4 w-full rounded-lg border border-pink-200 bg-white/90 text-pink-600 placeholder-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-100"
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* Submit */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`mt-4 inline-flex items-center justify-center py-3 px-8 rounded-md text-white font-medium transition duration-300 ${submitting ? "opacity-70 cursor-not-allowed" : "bg-gradient-to-r from-[#EE68B3] to-[#FF8DCD] hover:shadow-lg"}`}
                  >
                    {submitting ? "Registering..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default RegisterPage;
