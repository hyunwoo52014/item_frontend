import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Samplepage7list from "./Samplepage7list";

import "./Samplepage7list.css";

const SamplePage7 = () => { 
  const [isPaused, setIsPaused] = useState(false);

  const [productlist, setProductlist] = useState({
    plist: [],
    totalcnt: 0,
  });

  const fetchproductlist = useCallback(async () => {
    try {
      const param = new URLSearchParams();

      const res = await axios.post("/shopping/productlist", param);
      console.log("Product List Response:", res.data);

      setProductlist((prev) => ({
        ...prev,
        plist: res.data.productlist || [],
        totalcnt: res.data.totalcnt,
      }));
    } catch (err) {
      console.error("Error fetching product list:", err);
    }
  }, []);

  useEffect(() => {
    fetchproductlist();
  }, [fetchproductlist]);

  return (
    <div>
      <h1>참조 사이트 :</h1>
      <a
        href="https://attrangs.co.kr/?srsltid=AfmBOop8NhN6F4JLhdVj_LvPe6CIubDcuui4wxZZMjp-7CTgp81Ckuhm"
        target="_blank"
        rel="noreferrer noopener"
      >
        <h1>아뜨랑드</h1>
      </a>{" "}
      <div
        className="product-list-container"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`product-list-scroll ${isPaused ? "paused" : ""}`}>
          {productlist.plist.map((item, index) => {
            return (
              <Samplepage7list
                key={item.product_no}
                item={item}
                index={index}
              />
            );
          })}
        </div>
      </div>
      <div className="product-list">
        {productlist.plist.map((item, index) => {
          return (
            <Samplepage7list key={item.product_no} item={item} index={index} />
          );
        })}
      </div>
    </div>
  );
};

export default SamplePage7;
