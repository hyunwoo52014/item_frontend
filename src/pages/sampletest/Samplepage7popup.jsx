import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import "./Samplepage7popup.css";
import copy_img from "../../assets/images/admin/comm/copy.png";

const Samplepage7popup = ({ imageurllist, imagesellist, item }) => {
  let [imagenum, setImagenum] = useState(0);

  const [optionimagelist, setOptionimagelist] = useState([]);
  const [optionimageurllist, setOptionimageurllist] = useState([]);

  const imagenumadd = useCallback((index) => {
    setImagenum(index);
  }, []);

  const moveimage = (movenum) => {
    let moveimagenum = imagenum + movenum;

    // console.log(imagesellist.length);

    if (movenum < 0) {
      movenum = moveimagenum < 0 ? 0 : moveimagenum;
    } else {
      movenum =
        imagesellist.length <= moveimagenum
          ? imagesellist.length - 1
          : moveimagenum;
    }

    // console.log(movenum, moveimagenum);

    setImagenum(movenum);
  };

  const extractFilenames = (array) => {
    return array.map((item) => item.file_name);
  };

  const imagelist = useCallback(async () => {
    try {
      const param = new URLSearchParams(Object.entries(item));
      param.append("type", 2);
      const res = await axios.post("/shopping/imagelist", param);

      setOptionimagelist(extractFilenames(res.data.imagelist));
    } catch (err) {
      console.error("Error fetching product list:", err);
    }
  }, []);

  const imageroad = useCallback(async (filename) => {
    try {
      const param = new URLSearchParams();
      param.append("type", 2);
      param.append("product_no", item.product_no);
      param.append("file_name", filename);

      const res = await axios.post("/shopping/imageblob", param, {
        responseType: "blob",
      });

      console.log(res);

      setOptionimageurllist((prev) => [
        ...prev,
        window.URL.createObjectURL(res.data),
      ]);
    } catch (err) {
      console.error("Error fetching product list:", err);
    }
  }, []);

  useEffect(() => {
    imagelist();
  }, [imagelist]);

  useEffect(() => {
    if (optionimagelist.length > 0) {
      setOptionimageurllist([]);
      optionimagelist.forEach((fileName) => {
        imageroad(fileName);
      });
    }
  }, [optionimagelist]);

  const copyToClipboard = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      //console.log("텍스트가 클립보드에 복사되었습니다!");
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>
              <div>
                <div className="image-container">
                  <span className="left-arrow" onClick={() => moveimage(-1)}>
                    &lt;
                  </span>
                  <img
                    src={new URL(imageurllist[imagenum])}
                    style={{ width: 450, height: 450 }}
                  />
                  <span className="right-arrow" onClick={() => moveimage(1)}>
                    &gt;
                  </span>
                </div>
                <div className="product-image">
                  {imageurllist.map((imageitem, index) => {
                    return (
                      <img
                        src={new URL(imageitem)}
                        alt={imagesellist[imagenum]}
                        style={{ width: 80, height: 80, margin: 5 }}
                        key={index}
                        onClick={() => imagenumadd(index)}
                      />
                    );
                  })}
                </div>
              </div>
            </td>
            <td className="detail-body">
              <div className="product-detail">
                <div className="product-header">
                  <h1 className="big-bold">
                    상품번호 : {item.product_no}{" "}
                    <img
                      src={copy_img}
                      style={{ width: 20, height: 20, margin: 5 }}
                      onClick={() => copyToClipboard(item.product_no)}
                    />
                  </h1>
                  <h1 className="big-bold">
                    {item.product_no} {item.product_name}
                  </h1>
                  <br></br>
                  <div className="price-info">
                    <span className="original-price">
                      {item.price.toLocaleString()}원 /
                    </span>
                    <span className="sale-price">
                      {item.free_price.toLocaleString()}
                    </span>
                    <span className="discount">
                      {item.free_rate.toLocaleString()}% 할인
                    </span>
                  </div>
                  <br></br>
                  <div>
                    {" "}
                    <span className="small-normal">
                      총 {(item.price - item.free_price).toLocaleString()}원
                      할인
                    </span>
                    <span
                      className="small-normal"
                      style={{
                        margin: "5",
                      }}
                    >
                      - 할인특가 12 : 38 : 27 남았습니다
                    </span>
                  </div>
                </div>
                <div className="coupon-section">
                  <p>
                    쿠폰 사용 시 최대 할인 금액 <span>17,910원</span>
                  </p>
                </div>
                <div className="benefits">
                  <ul>
                    <table style={{ width: 210 }}>
                      <tbody>
                        <tr>
                          <td style={{ width: 80 }}>카드혜택</td>
                          <td style={{ width: 130, margin: 20 }}>
                            무이자 혜택
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: 80 }}>멤버십 혜택</td>
                          <td style={{ width: 130, margin: 20 }}>
                            등급별 혜택 보기
                          </td>
                        </tr>
                        <tr>
                          <td style={{ width: 80 }}>배송예상</td>
                          <td style={{ width: 130, margin: 20 }}>
                            부분 오늘출발 가능
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </ul>
                </div>
                <div className="options">
                  <h2>옵션</h2>
                  <div className="product-image">
                    {optionimageurllist.map((optionimage) => {
                      return (
                        <img
                          src={new URL(optionimage)}
                          alt="Option Image"
                          style={{ width: 80, height: 80, margin: 5 }}
                        />
                      );
                    })}
                  </div>
                  <div className="size-options">
                    <button className="size-btn">S</button>
                    <button className="size-btn">M</button>
                    <button className="size-btn">L</button>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Samplepage7popup;
