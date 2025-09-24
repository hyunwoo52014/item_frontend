const { createProxyMiddleware } = require('http-proxy-middleware');

//CORS(보안등을 위해 생긴 협약)에러 방지 
//지금 이 위치에 setupProxy.js의 이름으로 파일을 만들면 node에서 자동으로 이곳을 참고한다 그렇기때문에
//별도로 import없이 사용가능
module.exports = function(app) {
  app.use(
    '/api', //proxy가 필요한 path prameter를 입력합니다.
    createProxyMiddleware({
      target: 'http://localhost:80', //타겟이 되는 api url를 입력합니다.
      changeOrigin: true, //대상 서버 구성에 따라 호스트 헤더가 변경되도록 설정하는 부분입니다.
    })
  );

};