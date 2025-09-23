import { useParams } from "react-router-dom";
import React, {Suspense} from "react";
import fourHundredFour from './assets/images/error/404error.jpg'
  
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state  = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.log('error: ', error);
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 에러 리포팅 서비스에 에러를 기록
    console.log('error: ', error);
    console.log('errorInfo: ', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      this.state = { hasError: false };
      return <div id='404'>
              <img alt='404' src={fourHundredFour} />
            </div>;
    }

    return this.props.children;
  }
}
// 첫문자 대문자 변경 함수
function toCapitalize(str) {
  return str.replace(/\b\w/g, (match) => match.toUpperCase());
}

function Content() {
  const params = useParams();
  console.log('params:::'+JSON.stringify(params));
  const Page = React.lazy(() => import(/* @vite-ignore */'./pages/' + params.type + '/' + toCapitalize(params.menu) + '.jsx'));
  console.log('Page:::'+JSON.stringify(Page));
  return(
    <ErrorBoundary>
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
    </ErrorBoundary>
  )
}

export default Content;