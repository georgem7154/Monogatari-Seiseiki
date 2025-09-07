import { Glow, GlowCapture } from "@codaworks/react-glow";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageTransition from "../../PageTransition";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Ribbon from "../Home/Ribbon";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [pwdLength, setPwdLength] = useState("❌");
  const [upperCase, setUpperCase] = useState("❌");
  const [number, setNumber] = useState("❌");
  const [special, setSpecial] = useState("❌");
  const [exsist, setExsist] = useState(false);
  const [uname, setUname] = useState("❌");
  const [email, setEmail] = useState("❌");
  const [isDisabled, setIsDisabled] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isHovered1, setIsHovered1] = useState(false);
  const [counter, setCounter] = useState();
  const [error, setError] = useState("");
  const [showpwd, setShowPwd] = useState(false);
  const emailValidate = async () => {
    // console.log("validating");
    setCounter(10);
    if (formData.email.length < 10) {
      setError("Please provide proper email");
      return;
    }
    if (!formData.email) {
      setError("Please provide email");
      return;
    }
    let status;
    try {
      const response = await axios.get("/user/find/user", {
        params: {
          email: formData.email,
        },
      });
      status = true;
    } catch (error) {
      status = false;
    }

    if (!status) {
      setEmail("✅");
      setExsist(false);
    } else {
      setExsist(true);
    }
  };

  const Validation = () => {
    if (formData.name.length > 2) {
      setUname("✅");
      // console.log(formData.name);
    } else {
      setUname("❌");
    }
    if (formData.email.length < 10) {
      setEmail("❌");
      setExsist(false);
    }
    if (formData.password.length >= 8) {
      setPwdLength("✅");
    } else {
      setPwdLength("❌");
    }
    if (/[A-Z]/.test(formData.password)) {
      setUpperCase("✅");
    } else {
      setUpperCase("❌");
    }
    if (/\d/.test(formData.password)) {
      setNumber("✅");
    } else {
      setNumber("❌");
    }
    if (/[!@#$%^&*()_+{}\[\]:;<>,.?/~\\]/.test(formData.password)) {
      setSpecial("✅");
    } else {
      setSpecial("❌");
    }
  };

  useEffect(() => {
    if (
      pwdLength === "✅" &&
      upperCase === "✅" &&
      number === "✅" &&
      special === "✅" &&
      uname === "✅" &&
      email === "✅"
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [pwdLength, upperCase, number, special, uname, email]);

  useEffect(() => {
    setTimeout(() => {
      setError("");
    }, 5000);
  }, [error]);

  useEffect(() => {
    if (counter <= 0) return;
    const interval = setInterval(() => {
      setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [counter]);

  useEffect(() => {
    Validation();
  }, [formData]);

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/user/", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      // console.log(response);
      // console.log("hi");
      if (response.status == 201) {
        toast.success("user created");
        // console.log("bye");
        navigate("/auth/login");
      }
    } catch (error) {
      setError("couldn't create use please contact admin");
    }
  };

  return (
    <GlowCapture className="bg-black max-sm:py-24 w-screen h-screen">
      {/* <Ribbon/> */}
      <div className="w-screen h-screen flex text-slate-400 justify-center items-center">
        <Glow color="red">
          <div className="flex flex-col glow:ring-2 glow:ring-glow m-1 glow:bg-blue-600/25 rounded-2xl px-14 pb-14 p-5">
            <div className="text-center  mb-5 text-4xl font-press glow:text-fuchsia-500/100">
              Register
            </div>
            <div
              className="flex max-sm:flex-col  flex-row"
              aria-autocomplete="off"
            >
              <form
                className="flex flex-col glow:ring-2 glow-ring p-10 text-2xl mr-10"
                onSubmit={handleSubmit}
              >
                <div className="text-base">
                  Already Registered?{" "}
                  <Link
                    className="hover:text-black cur3 text-white"
                     onClick={() => localStorage.setItem("prevPage", "/auth/register")}
                    to="/auth/login"
                  >
                    Login
                  </Link>
                </div>
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="my-2 ml-5 rounded-xl text-xl p-1 cur2 text-white text-opacity-100 bg-black bg-opacity-0 ring-2"
                  onChange={handleChange}
                />
                <div>
                  <label>Email</label>
                  {counter ? (
                    <button
                      type="button"
                      className="text-base ml-10 px-2 rounded-full text-white"
                    >
                      wait {counter}
                    </button>
                  ) : (
                    <button
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      type="button"
                      onClick={emailValidate}
                      className={`text-base ml-10 ${
                        isHovered ? "bg-green-500" : "glow:bg-yellow-500/100"
                      } px-2 rounded-full text-white cur3`}
                    >
                      Validate
                    </button>
                  )}
                </div>
                <input
                  type="email"
                  name="email"
                  className="my-2 ml-5 rounded-xl text-xl p-1 cur2 text-white text-opacity-100 bg-black bg-opacity-0 ring-2"
                  required
                  onChange={handleChange}
                />
                <label>Password</label>

                <div className="flex flex-row items-center">
                  <input
                    type={showpwd ? "text" : "password"}
                    name="password"
                    className="my-2 ml-5 mb-4 rounded-xl text-xl p-1 cur2 text-white text-opacity-100 bg-black bg-opacity-0 ring-2"
                    required
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      showpwd ? setShowPwd(false) : setShowPwd(true);
                    }}
                    className="ml-3 flex hover:text-red-50 text-slate-600"
                  >
                    <svg
                      width="30px"
                      height="30px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 6C8.76722 6 5.95965 8.31059 4.2048 11.7955C4.17609 11.8526 4.15483 11.8948 4.1369 11.9316C4.12109 11.964 4.11128 11.9853 4.10486 12C4.11128 12.0147 4.12109 12.036 4.1369 12.0684C4.15483 12.1052 4.17609 12.1474 4.2048 12.2045C5.95965 15.6894 8.76722 18 12 18C15.2328 18 18.0404 15.6894 19.7952 12.2045C19.8239 12.1474 19.8452 12.1052 19.8631 12.0684C19.8789 12.036 19.8888 12.0147 19.8952 12C19.8888 11.9853 19.8789 11.964 19.8631 11.9316C19.8452 11.8948 19.8239 11.8526 19.7952 11.7955C18.0404 8.31059 15.2328 6 12 6ZM2.41849 10.896C4.35818 7.04403 7.7198 4 12 4C16.2802 4 19.6419 7.04403 21.5815 10.896C21.5886 10.91 21.5958 10.9242 21.6032 10.9389C21.6945 11.119 21.8124 11.3515 21.8652 11.6381C21.9071 11.8661 21.9071 12.1339 21.8652 12.3619C21.8124 12.6485 21.6945 12.8811 21.6032 13.0611C21.5958 13.0758 21.5886 13.09 21.5815 13.104C19.6419 16.956 16.2802 20 12 20C7.7198 20 4.35818 16.956 2.41849 13.104C2.41148 13.09 2.40424 13.0758 2.39682 13.0611C2.3055 12.881 2.18759 12.6485 2.13485 12.3619C2.09291 12.1339 2.09291 11.8661 2.13485 11.6381C2.18759 11.3515 2.3055 11.119 2.39682 10.9389C2.40424 10.9242 2.41148 10.91 2.41849 10.896ZM12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10ZM8.00002 12C8.00002 9.79086 9.79088 8 12 8C14.2092 8 16 9.79086 16 12C16 14.2091 14.2092 16 12 16C9.79088 16 8.00002 14.2091 8.00002 12Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
                <div className="text-red-500 text-base mb-8">{error}</div>
                {isDisabled ? (
                  <button
                    className="glow:bg-glow/100 rounded-full mx-5"
                    type="button"
                  >
                    Locked
                  </button>
                ) : (
                  <button
                    onMouseEnter={() => setIsHovered1(true)}
                    onMouseLeave={() => setIsHovered1(false)}
                    className={`cur3 rounded-full mx-5 ${
                      isHovered1 ? "bg-green-700" : "glow:bg-green-600/100"
                    }`}
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Register
                  </button>
                )}
              </form>
              <div className="glow:ring-2 glow-ring max-sm:text-center">
                <div className="my-6 text-xl text-center glow:text-green-500/100">
                  Rules
                </div>
                <div className="my-4">{uname} Name</div>
                {exsist ? (
                  <div className="my-4">
                    🥸 Email Already exists please{" "}
                    <Link
                      className="hover:text-black cur3 text-white"
                      to="/auth/login"
                    >
                      Login
                    </Link>
                  </div>
                ) : (
                  <div className="my-4">{email} Unique Email</div>
                )}
                <div className="my-4">
                  {pwdLength} password must be 8 characters long
                </div>
                <div className="my-4">
                  {upperCase} password must have uppercase
                </div>
                <div className="my-4">{number} password must have numbers</div>
                <div className="my-4">
                  {special} password must have special characters
                </div>
              </div>
            </div>
          </div>
        </Glow>
      </div>
    </GlowCapture>
  );
};
export default Register;
