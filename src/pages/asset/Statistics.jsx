import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const Statistics = () => {
    const [searchInfo, setSearchInfo] = useState({
        searchPeriod: 'monthly',
        searchCategory: '',
        searchYear: ''
    });

    const [statisticsData, setStatisticsData] = useState({
        totalAmount: 0,
        canUseAmount: 0,
        totalList: []
    });

    const [selectOptions, setSelectOptions] = useState({
        yearList: [],
        categoryList: []
    });

    const chartRef = useRef(null);
    const chartRef2 = useRef(null);
    const chartInstance = useRef(null);
    const chartInstance2 = useRef(null);

    // 초기 데이터 로드
    useEffect(() => {
        initializeData();
    }, []);

    // 검색 조건 변경 시 통계 데이터 재조회
    useEffect(() => {
        if (searchInfo.searchYear) {
            fetchStatistics();
        }
    }, [searchInfo]);

    // 초기화 함수
    const initializeData = async () => {
        try {
            // 연도 목록 조회
            const yearResponse = await axios.get('/asset/searchYear');
            const years = yearResponse.data.yearList || [];

            // 카테고리 목록 조회
            const categoryParam = new URLSearchParams();
            categoryParam.set("groupcode", "equip");
            categoryParam.set("cpage", "1");
            categoryParam.set("pagesize", "100");

            const categoryResponse = await axios.post('/system/listdetailcode', categoryParam);
            console.log("카테고리 응답:", categoryResponse.data);

            const categories = categoryResponse.data.result === "Y"
                ? (categoryResponse.data.commcodeModel || [])
                : [];

            setSelectOptions({
                yearList: years,
                categoryList: categories
            });

            // 첫 번째 연도를 기본값으로 설정
            if (years.length > 0) {
                setSearchInfo(prev => ({
                    ...prev,
                    searchYear: years[0]
                }));
            }
        } catch (error) {
            console.error('초기 데이터 로드 실패:', error);
            console.log("응답 데이터:", error.response?.data);
            alert('데이터를 불러오는데 실패했습니다.');
        }
    };

    // 통계 데이터 조회
    const fetchStatistics = async () => {
        try {
            const params = new URLSearchParams();
            params.set("period", searchInfo.searchPeriod);
            params.set("category", searchInfo.searchCategory);
            params.set("year", searchInfo.searchYear);

            const response = await axios.post('/asset/statisticsByPeriod', params);
            const data = response.data;

            setStatisticsData({
                totalAmount: data.totalAmount || 0,
                canUseAmount: data.canUseAmount || 0,
                totalList: data.totalList || []
            });

            // 기간별 차트 생성
            createPeriodChart(data.totalList);

            // 연간 조회 시 카테고리 차트 생성
            if (searchInfo.searchPeriod === 'annual') {
                fetchAnnualCategory();
            } else {
                // 월간으로 변경 시 카테고리 차트 제거
                if (chartInstance2.current) {
                    chartInstance2.current.destroy();
                    chartInstance2.current = null;
                }
            }
        } catch (error) {
            console.error('통계 데이터 조회 실패:', error);
            console.log("응답 데이터:", error.response?.data);
            alert('통계 데이터를 불러오는데 실패했습니다.');
        }
    };

    // 연간 카테고리별 통계 조회
    const fetchAnnualCategory = async () => {
        try {
            const params = new URLSearchParams();
            params.set("year", searchInfo.searchYear);

            const response = await axios.post('/asset/searchAnnualCategory', params);
            const categoryData = response.data.annualCategoryList || [];

            createCategoryChart(categoryData);
        } catch (error) {
            console.error('카테고리 통계 조회 실패:', error);
            console.log("응답 데이터:", error.response?.data);
        }
    };

    // 기간별 차트 생성 (막대 그래프)
    const createPeriodChart = (dataList) => {
        if (!chartRef.current) return;

        // 기존 차트 제거
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        const dateUnit = searchInfo.searchPeriod === 'monthly' ? '월' : '년';

        const labels = dataList.map(item => `${item.periodValue}${dateUnit}`);
        const amounts = dataList.map(item => item.amount);

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: dateUnit,
                    data: amounts,
                    backgroundColor: '#9BD0F5',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    // 카테고리별 차트 생성 (도넛 차트)
    const createCategoryChart = (categoryData) => {
        if (!chartRef2.current) return;

        // 기존 차트 제거
        if (chartInstance2.current) {
            chartInstance2.current.destroy();
        }

        const ctx = chartRef2.current.getContext('2d');

        const labels = categoryData.map(item => item.name);
        const quantities = categoryData.map(item => item.quantity);

        chartInstance2.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: quantities,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                return `${label}: ${value}개`;
                            }
                        }
                    }
                }
            }
        });
    };

    // 컴포넌트 언마운트 시 차트 정리
    useEffect(() => {
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
            if (chartInstance2.current) {
                chartInstance2.current.destroy();
            }
        };
    }, []);

    return (
        <div>
            <div>
                <p className="Location">
                    <a href="/dashboard" className="btn_set home">메인으로</a>
                    <span className="btn_nav bold">입고/통계</span>
                    <span className="btn_nav bold">자산통계</span>
                    <a href="/asset/statistics" className="btn_set refresh">새로고침</a>
                </p>
                <p className="conTitle">
                    <span>자산통계</span>
                </p>



                {/* 통계 카드 */}
                <div style={{
                    maxWidth: '600px',
                    margin: '20px auto',
                    display: 'flex',
                    gap: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        flex: 1,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e8e8e8'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px'
                        }}>
                            <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                                {searchInfo.searchPeriod === 'monthly'
                                    ? `${searchInfo.searchYear}년 총 자산 수`
                                    : '총 자산 수'}
                            </span>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: 'linear-gradient(45deg, #4285f4, #34a853)',
                                borderRadius: '4px'
                            }}></div>
                        </div>
                        <div style={{
                            fontSize: '32px',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            marginBottom: '8px'
                        }}>
                            {statisticsData.totalAmount.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '13px', color: '#34a853', fontWeight: 500 }}>
                            {searchInfo.searchPeriod === 'monthly' ? '전월대비' : '전년대비'}
                        </div>
                    </div>

                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        flex: 1,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                        border: '1px solid #e8e8e8'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px'
                        }}>
                            <span style={{ fontSize: '14px', color: '#666', fontWeight: 500 }}>
                                {searchInfo.searchPeriod === 'monthly'
                                    ? `${searchInfo.searchYear}년 활성 자산`
                                    : '활성 자산'}
                            </span>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#34a853',
                                borderRadius: '50%'
                            }}></div>
                        </div>
                        <div style={{
                            fontSize: '32px',
                            fontWeight: 600,
                            color: '#1a1a1a',
                            marginBottom: '8px'
                        }}>
                            {statisticsData.canUseAmount.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '13px', color: '#34a853', fontWeight: 500 }}>
                            {searchInfo.searchPeriod === 'monthly' ? '전월대비' : '전년대비'}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', marginBottom: '20px' }}>
                        <select
                            id="searchPeriod"
                            name="searchPeriod"
                            style={{ width: 100 }}
                            value={searchInfo.searchPeriod}
                            onChange={(e) => {
                                setSearchInfo(prev => ({
                                    ...prev,
                                    searchPeriod: e.target.value
                                }));
                            }}
                        >
                            <option value="monthly">월간</option>
                            <option value="annual">연간</option>
                        </select>
                        <select
                            id="searchCategory"
                            name="searchCategory"
                            style={{ width: 100 }}
                            value={searchInfo.searchCategory}
                            onChange={(e) => {
                                setSearchInfo(prev => ({
                                    ...prev,
                                    searchCategory: e.target.value
                                }));
                            }}
                        >
                            <option value="">전체</option>
                            {selectOptions.categoryList.map((category) => (
                                <option key={category.detail_code} value={category.detail_code}>
                                    {category.detail_name}
                                </option>
                            ))}
                        </select>
                        <select
                            id="searchYear"
                            name="searchYear"
                            style={{ width: 100 }}
                            value={searchInfo.searchYear}
                            onChange={(e) => {
                                setSearchInfo(prev => ({
                                    ...prev,
                                    searchYear: e.target.value
                                }));
                            }}
                        >
                            {selectOptions.yearList.map((year) => (
                                <option key={year} value={year}>
                                    {year}년
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 차트 영역 */}
                <div style={{
                    width: '600px',
                    margin: '20px auto',
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e8e8e8'
                }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                            {searchInfo.searchPeriod === 'monthly'
                                ? '월별 자산 현황'
                                : '연도별 자산 현황'}
                        </h3>
                        <div style={{ height: '300px' }}>
                            <canvas ref={chartRef}></canvas>
                        </div>
                    </div>

                    {searchInfo.searchPeriod === 'annual' && (
                        <div>
                            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                                카테고리별 자산 분포
                            </h3>
                            <div style={{ height: '350px' }}>
                                <canvas ref={chartRef2}></canvas>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Statistics;