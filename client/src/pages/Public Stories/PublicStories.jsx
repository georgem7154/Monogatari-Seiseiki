import React, { useEffect, useState } from "react";
import Ribbon from "../Home/Ribbon.jsx";
import { Glow, GlowCapture } from "@codaworks/react-glow";
import axios from "axios";
import { Link } from "react-router-dom";
import { DNA } from "react-loader-spinner";
import { Bounce } from "react-awesome-reveal";
import { Tooltip } from "react-tooltip";

const Crypto = ({ authChecker, setAuthChecker }) => {
  const [symbol1, setSymbol1] = useState([]);
  const [tradeCount1, setTradeCount1] = useState([]);
  const [volume1, setVolume1] = useState([]);
  const [error1, setError1] = useState("");
  const [search, setSearch] = useState("");
  const [search1, setSearch1] = useState("");
  const [name, setName] = useState([]);
  const [tick, setTick] = useState([]);

  const [color, setColor] = useState([
    "Red",
    "Blue",
    "Green",
    "Purple",
    "Pink",
    "Yellow",
    "Orange",
    "Cyan",
  ]);
  const [loading, setLoading] = useState(true);

    const handleChange1 = (e) => {
    setSearch1(e.target.value);
  };
  const handleSearch1 = () => {
    if (!search1) return;
    navigate(`${search1.toUpperCase()}`);
  };

  const getData = async (e) => {
    if (search == "") {
      setName("");
      return;
    }
    const response = await axios.get(`/api/${search}/stocksearch`);
    const extract = response.data;
    // console.log(response.data);

    setName(extract.map((data) => data.Name));
    setTick(extract.map((data) => data.Symbol));
  };
    useEffect(() => {
      if (search === "") {
        setName([]);
        return;
      }
  
      const searchTimeout = setTimeout(() => {
        getData();
      }, 200);
  
      return () => clearTimeout(searchTimeout);
    }, [search]);
    const handleChange = (e) => {
      setSearch(e.target.value);
    };
  const getTopStocks = async () => {
    try {
      const response = await axios.get("/api/ctopmovers");
      const extract = response.data.gainers;
      // console.log(response.data);
      setSymbol1(extract.map((data) => data.symbol));
      setTradeCount1(extract.map((data) => data.price));
      setVolume1(extract.map((data) => data.percent_change));
      setLoading(false);
    } catch (error) {
      // console.error(error);
      setError1(error.response.data.message.toString());
    }
  };
  useEffect(() => {
    setAuthChecker(!authChecker);
    getTopStocks();
  }, []);
  return (
    <div className="bg-black">
      {/* <Ribbon /> */}
      <GlowCapture>
        <div className="px-5 pt-20">
          <Glow color="white">
            <div className=" max-sm:m-0 mt-10 mb-5 mx-10  max-md:flex-col-reverse flex flex-row justify-evenly">
              <div
                data-tooltip-id="my-tooltip"
                data-tooltip-content="get all matching companies available eg: amazon"
                className="flex text-xl flex-row max-md:my-5 max-md:ml-14"
              >
                Search:
                <input
                  value={search}
                  onChange={handleChange}
                  className="w-40 cur2 bg-black text-center glow:border-glow glow:ring-glow glow:bg-glow/5 rounded-lg border-indigo-700 mx-5 border-2 font-bold  text-lg text-white"
                />
                <Tooltip id="my-tooltip" />
              </div>
              <div
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Specify the exact ticker/stock Symbol and search eg: GOLD"
                className="flex text-xl flex-row"
              >
                Direct Search:{" "}
                <input
                  value={search1}
                  onChange={handleChange1}
                  className="w-40 cur2 bg-black text-center glow:border-glow glow:ring-glow glow:bg-glow/5 rounded-lg border-indigo-700 mx-5 border-2 font-bold  text-lg text-white"
                />
                <button
                  onClick={handleSearch1}
                  className="bg-glow rounded-full p-1 cur3"
                >
                  🔍
                </button>
                <Tooltip id="my-tooltip" />
              </div>
            </div>
          </Glow>
          {name ? (
            <div className="rounded-xl mb-10">
              {name.map((data, i) => (
                <Link to={`/stocks/${tick[i]}`}>
                  <div className="grid justify-between hover:bg-red-500 hover:bg-opacity-100 rounded-xl hover:text-black hover:font-semibold  grid-cols-12">
                    <div className="col-span-10 rounded-xl border-y-2 border-l-2 border-green-500 p-2">
                      {data}
                    </div>
                    <div className="col-span-2 rounded-xl glow:bg-glow/50 border-y-2 border-r-2 border-green-500  p-2">
                      {tick[i]}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            ""
          )}
          <div className="text-3xl text-center font-press">
            Top Market Movers
          </div>
          {loading ? (
            <div className="flex justify-center m-10 p-10">
              <DNA
                visible={true}
                height="100"
                width="100"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
              />
            </div>
          ) : error1 ? (
            <div>error: {error1}</div>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-0">
              {symbol1.map((data, i) => (
                <Link to={`/stocks/${data}`}>
                  <Glow color={color[i % 8]} className="grid cur3">
                    <Bounce
                      direction="up"
                      cascade
                      triggerOnce
                      fraction={0.5}
                      duration={1000}
                    >
                      <div className="relative p-4 text-slate-400">
                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 bg-opacity-0">
                          <div className=" glow:ring-glow glow:ring-2 bg-slate-900 glow:text-white justify-center px-2 py-1 rounded-full">
                            {data}
                          </div>
                        </div>
                        <div className="py-4 px-8  glow:ring-2 flex-col text-center glow:ring-glow rounded-xl bg-slate-900 flex">
                          <div>Price: {tradeCount1[i]}</div>
                          <div>
                            Percent Change: {Number(volume1[i]).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </Bounce>
                  </Glow>
                </Link>
              ))}
            </div>
          )}
        </div>
      </GlowCapture>
    </div>
  );
};

export default Crypto;
