import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Modal from "react-modal";
// import validator from "validator";

import "./Samplepage7list.css";
import Samplepage7popup from "./Samplepage7popup";

const Samplepage7list = ({ item, index }) => {
  // 앱의 루트 요소를 지정
  Modal.setAppElement("#root");

  const [imageinfo, setImageinfo] = useState({
    product_no: item.product_no,
    file_name: item.file_name,
  });

  const [imageurl, setImageurl] = useState("");

  let [imageurllist, setImageurllist] = useState([]);

  const [imagesellist, setImagesellist] = useState([]);

  let [imagenum, setImagenum] = useState(1);

  const [isopen, setIsopen] = useState(false);

  const imagenumadd = useCallback(() => {
    setImagenum((prev) => (prev === imagesellist.length - 1 ? 0 : prev + 1));
  }, [imagesellist.length]);

  useEffect(() => {
    setImageinfo((prev) => ({
      ...prev,
      file_name: imagesellist[imagenum],
    }));

    const intervalId = setInterval(() => {
      imagenumadd();
    }, 1000); // 1초마다 실행

    // 컴포넌트가 언마운트될 때 interval 정리
    return () => clearInterval(intervalId);
  }, [imagenum, imagenumadd, imagesellist]);

  const imageroad = useCallback(
    async (type) => {
      if (imageurllist[imagenum]) {
        const url = new URL(imageurllist[imagenum]);

        if (url.protocol === "blob:") {
          //console.log("return ", imagenum, imageurllist[imagenum]);
          setImageurl(imageurllist[imagenum]);
          return;
        }
      }

      try {
        const param = new URLSearchParams(Object.entries(imageinfo));
        param.append("type", type);

        const res = await axios.post("/shopping/imageblob", param, {
          responseType: "blob",
        });

        setImageurllist((prev) => [
          ...prev,
          (imageurllist[imagenum] = window.URL.createObjectURL(res.data)),
        ]);

        setImageurl(window.URL.createObjectURL(res.data));
      } catch (err) {
        console.error("Error fetching product list:", err);
      }
    },
    [imageinfo]
  );

  useEffect(() => {
    imageroad(1);
  }, [imageinfo.file_name, imageroad]);

  const imagelist = useCallback(
    async (type) => {
      try {
        const param = new URLSearchParams(Object.entries(item));
        param.append("type", type);
        const res = await axios.post("/shopping/imagelist", param);

        setImagesellist(extractFilenames(res.data.imagelist));
      } catch (err) {
        console.error("Error fetching product list:", err);
      }
    },
    [item]
  );

  useEffect(() => {
    imagelist(1);
  }, [imagelist]);

  const extractFilenames = (array) => {
    return array.map((item) => item.file_name);
  };

  const modalStyle = {
    content: {
      width: "900px", // 팝업 너비
      height: "700px", // 높이를 내용에 맞게 자동 조정
      margin: "auto", // 중앙 정렬
      maxHeight: "90vh", // 최대 높이를 화면 높이에 맞게 제한
      padding: "0px", // 내부 여백
      backgroundColor: "#fff", // 배경 흰색
      border: "2px", // 테두리 제거
      solid: "#000",
      borderRadius: "8px", // 둥근 모서리
      boxShadow: "none",
      overflow: true, // 내용이 넘치면 스크롤 활성화
    },
    overlay: {
      backgroundColor: "transparent", // 외부 배경 투명화
      display: "flex", // 팝업 중앙 정렬
      alignItems: "center", // 수직 중앙 정렬
      justifyContent: "center", // 수평 중앙 정렬
    },
  };

  const openpopup = () => {
    setIsopen(true);
  };

  const closemodal = () => {
    setIsopen(false);
  };

  return (
    <div>
      <div className="product-card">
        <div className="product-image">
          <img src={imageurl} alt={item.product_name} />
          <button className="quick-view" onClick={openpopup}>
            상세보기
          </button>
        </div>
        <div className="product-details">
          <p className="discount-price">
            <span className="original-price">
              쿠폰최대할인가 {item.price.toLocaleString()}
            </span>
            <span className="discount-rate"> {item.free_rate}%</span>
            <span className="current-price">
              {item.free_price.toLocaleString()}
            </span>
          </p>
          <p className="product-title">
            {item.product_no}
            {item.product_name}
          </p>
          <p className="product-title">{item.maker}</p>
          <div className="product-footer">
            <span className="best">{item.best === "Y" ? "BEST" : ""}</span>
            <span className="made">{"MADE"}</span>
            <span className="delivery">{"부분오늘출발"}</span>
          </div>
        </div>
      </div>
      <Modal style={modalStyle} isOpen={isopen} onRequestClose={closemodal}>
        <Samplepage7popup
          imageurllist={imageurllist}
          imagesellist={imagesellist}
          item={item}
        />
      </Modal>
    </div>
  );
};

export default Samplepage7list;
