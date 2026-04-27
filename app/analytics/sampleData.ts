export const generateSampleData = () => {
    const today = new Date();
    const mockData = [];
    
    // Starting baseline vitals
    let bp_sys = 120;
    let bp_dia = 80;
    let hr = 75;
    let glucose = 95;

    // Generate 30 days of data with slight, realistic random drift
    for (let i = 29; i >= 0; i--) {
        const recordDate = new Date(today);
        recordDate.setDate(today.getDate() - i);
        
        // Realistic medical drift (Random walk)
        bp_sys = Math.max(105, Math.min(145, bp_sys + (Math.random() * 8 - 4)));
        bp_dia = Math.max(65, Math.min(95, bp_dia + (Math.random() * 6 - 3)));
        hr = Math.max(60, Math.min(100, hr + (Math.random() * 10 - 5)));
        glucose = Math.max(75, Math.min(130, glucose + (Math.random() * 15 - 6)));

        // Inject a mild spike around day 15
        if (i === 15 || i === 14) {
            bp_sys += 15;
            hr += 10;
        }

        mockData.push({
            id: `sample-record-${i}`,
            createdAt: recordDate.toISOString(),
            bloodPressureH: Number(bp_sys.toFixed(1)),
            bloodPressureL: Number(bp_dia.toFixed(1)),
            heartRate: Number(hr.toFixed(0)),
            bloodGlucose: Number(glucose.toFixed(1)),
            bloodSaturation: 98.0 + (Math.random() * 1.5 - 0.5),
            temperature: 98.4 + (Math.random() * 0.4 - 0.2),
            riskStatus: bp_sys > 135 ? 'MEDIUM' : 'LOW'
        });
    }
    
    return mockData;
};

export const generateSampleSummary = (data: any[]) => {
    const latest = data[data.length - 1];
    const avg_hr = data.reduce((acc, val) => acc + val.heartRate, 0) / data.length;
    
    return {
        latest: latest,
        averages: {
            heartRate: Number(avg_hr.toFixed(1))
        },
        count: data.length
    };
};
