import { Glow, GlowCapture } from "@codaworks/react-glow";
import focusIcon from "../../assets/focus.ico";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Ribbon = ({ authChecker, setAuthChecker }) => {
  const navigate = useNavigate();
  const [symbol, setSymbol] = useState("🔽");
  const [show, setShow] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const validateUser = async () => {
    try {
      const response = await axios.get("/user/verifytoken/user", {
        withCredentials: true,
      });
      if (response.status === 200 && response.data.userId) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("/user/logout/user", {}, { withCredentials: true });
      setIsAuthenticated(false);
      toast.success("User logged out");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    validateUser();
  }, [authChecker]);

  return (
    <div className="absolute bg-opacity-0 top-0 left-0 w-full h-14 font-dyna z-20">
      <div className="relative bg-opacity-0 w-full h-14">
        {/* Desktop Nav */}
        <div className="flex max-md:hidden justify-between text-center items-center flex-row absolute z-0 top-0 h-14 w-full">
          <Link className="ml-10 h-full w-fit" to="/">
            <img className="h-full cur3 w-auto" src={focusIcon} />
          </Link>
          <div className="mr-20 px-14 flex justify-end text-black">
            <Link to="/mystories">
              <button className="herobutton cur3">My Stories</button>
            </Link>
            <Link to="/publicstories">
              <button className="herobutton cur3">Public Stories</button>
            </Link>
          </div>
          <div className="text-black">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="herobutton cur3">
                Logout
              </button>
            ) : (
              <Link to="/register">
                <button className="herobutton cur3">Register</button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden justify-between text-center items-center flex-row absolute z-0 top-0 h-14 w-full">
          <Link className="ml-10 h-full w-fit" to="/">
            <img className="h-full cur3 w-auto" src={focusIcon} />
          </Link>
          <div className="px-4 text-4xl text-black">
            <button onClick={() => setShow(!show)}>{symbol}</button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {show && (
          <div
            onClick={() => setShow(false)}
            className="absolute flex flex-col justify-center text-white top-14 right-0 w-40 bg-black bg-opacity-90"
          >
            <Link className="flex my-2 justify-center cur3" to="/mystories">
              <button className="cur3">My Stories</button>
            </Link>
            <Link className="flex my-2 justify-center cur3" to="/publicstories">
              <button className="cur3">Public Stories</button>
            </Link>
            {isAuthenticated ? (
              <button onClick={handleLogout} className="cur3">
                Logout
              </button>
            ) : (
              <Link className="flex my-2 justify-center cur3" to="/register">
                <button className="cur3">Register</button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ribbon;
