document.querySelectorAll('.widget').forEach(widget => {
    widget.addEventListener('click', () => {
        widget.classList.toggle('flipped');
    });
});
// Function to show about information
function showAbout() {
    alert("TradingView is a popular platform for charting and analyzing financial markets, including stocks like Apple Inc. (AAPL). Using TradingView for Apple Inc. provides a robust set of tools for traders and investors to analyze stock price movements, identify trends, and make informed decisions. Whether you’re day trading or investing long-term, the platform’s features cater to a variety of trading strategies.");
}

// Function to collect data
/*function collectData() {
    alert("Collecting data from the graph...");

    const symbol = document.getElementById('stock-symbol').value.trim() || "AAPL"; // Use user input or default to AAPL

    // Create the TradingView widget
    const widget = new TradingView.widget({
        "width": 800,
        "height": 600,
        "symbol": `NASDAQ:${symbol}`, // Example symbol
        "interval": "D", // Interval (Daily in this case)
        "container_id": "graph-iframe",
        "autosize": true,
    });

    // Fetch historical data from an API
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = `${proxyUrl}https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`;

    // Show loading indicator
    const loadingMessage = document.createElement('div');
    loadingMessage.innerText = "Loading data...";
    document.body.appendChild(loadingMessage);

    fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const prices = data.chart.result[0].indicators.quote[0];
        const timestamps = data.chart.result[0].timestamp;

        // Map the data to the desired format
        const excelData = timestamps.map((timestamp, index) => ({
            Date: new Date(timestamp * 1000).toLocaleDateString(),
            Open: prices.open[index],
            High: prices.high[index],
            Low: prices.low[index],
            Close: prices.close[index],
        }));

        localStorage.setItem('graphData', JSON.stringify(excelData));
        console.log("Collected Data: ", excelData);

        // Create an Excel file and download it
        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Graph Data");
        XLSX.writeFile(workbook, 'graph_data.xlsx');

        alert("Data collected and saved to Excel successfully!");
    })
    .catch(error => {
        console.error("Error fetching data: ", error);
        alert("Failed to collect data from API: " + error.message);
    })
    .finally(() => {
        // Remove loading message
        if (loadingMessage) {
            document.body.removeChild(loadingMessage);
        }
    });
}*/

//this for local storage still under testing--------------------------------------------------------------------------------
function collectData() {
    alert("Collecting data from the graph...");

    const symbol = document.getElementById('stock-symbol').value || "AAPL"; // Use user input or default to AAPL

    // Create the TradingView widget
    const widget = new TradingView.widget({
        "width": 800,
        "height": 600,
        "symbol": `NASDAQ:${symbol}`, // Example symbol
        "interval": "D", // Interval (Daily in this case)
        "container_id": "graph-iframe",
        "autosize": true,
    });

    // Wait until the chart is ready before collecting data
    widget.onChartReady(function() {
        const chart = widget.chart();
        const symbol = chart.symbol();
        const interval = chart.interval();

        const now = Date.now();
        const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000; // Last 30 days

        // Fetch historical data from the widget's chart
        chart.getBars(symbol, interval, oneMonthAgo / 1000, now / 1000, function(bars) {
            if (!bars || bars.length === 0) {
                alert("No data found!");
                return;
            }

            const excelData = bars.map(bar => ({
                date: new Date(bar.time * 1000).toLocaleDateString(),
                open: bar.open,
                high: bar.high,
                low: bar.low,
                close: bar.close,
            }));

            // Save data to localStorage for analysis
            localStorage.setItem('graphData', JSON.stringify(excelData));

            console.log("Collected Data: ", excelData);

            // Create an Excel file and download it
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Graph Data");

            XLSX.writeFile(workbook, 'graph_data.xlsx');
            alert("Data collected and saved to Excel successfully!");
        });
    });
}

   
// Function to analyze data
function analyzeData() {
    const fileInput = document.getElementById('file-input');
    
    if (fileInput.files.length === 0) {
        alert("Please upload a JSON file.");
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const data = JSON.parse(event.target.result);

        if (!data || data.length === 0) {
            alert("No data available.");
            return;
        }

        // Calculate mean and standard deviation of the closing prices
        const mean = data.reduce((acc, curr) => acc + curr.close, 0) / data.length;
        const stdDev = Math.sqrt(data.reduce((acc, curr) => acc + Math.pow(curr.close - mean, 2), 0) / data.length);

        // Render the chart using Chart.js
        const ctx = document.getElementById('chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.date),
                datasets: [{
                    label: 'Closing Price',
                    data: data.map(d => d.close),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });

        // Display analysis results
        document.getElementById('results').innerHTML = `
            <h2>Analysis Results</h2>
            <p>Mean: ${mean.toFixed(2)}</p>
            <p>Standard Deviation: ${stdDev.toFixed(2)}</p>
        `;
    };

    reader.readAsText(file);
}

// Add event listener for analyze button
document.getElementById('analyze-button').addEventListener('click', analyzeData);


  let isAnimationActive = false;
  let animationInterval = null;
  // Function to toggle the animation
/*function toggleWidget3Animation() {
  const widget3 = document.getElementById('widget3');

  if (!isAnimationActive) {
      // Start the animation
      widget3.classList.add('active-animation');
      animationInterval = setInterval(() => {
          widget3.style.transform = `rotate(${Math.random() * 360}deg) scale(${1 + Math.random() * 0.5})`;
      }, 1000); // Adjust interval for speed of animation
      isAnimationActive = true;
      console.log('Animation started');
  } else {
      // Stop the animation
      clearInterval(animationInterval);
      widget3.style.transform = 'rotate(0deg) scale(1)'; // Reset the transformation
      widget3.classList.remove('active-animation');
      isAnimationActive = false;
      console.log('Animation stopped');
  }
}*/
function toggleWebsiteAnimation() {
  const body = document.body;

  if (!isAnimationActive) {
      // Start the animation on the entire website
      body.classList.add('active-website-animation');
      animationInterval = setInterval(() => {
          body.style.transform = `rotate(${Math.random() * 5}deg) scale(${1 + Math.random() * 0.05})`;
      }, 500); // Adjust interval and intensity of animation
      isAnimationActive = true;
      console.log('Website animation started');
  } else {
      // Stop the animation
      clearInterval(animationInterval);
      body.style.transform = 'rotate(0deg) scale(1)'; // Reset transformation
      body.classList.remove('active-website-animation');
      isAnimationActive = false;
      console.log('Website animation stopped');
  }
}

// Attach the toggle function to the widget3 click event
document.getElementById('widget3').addEventListener('click', toggleWebsiteAnimation);

// Attach the toggle function to the widget3 click event
//document.getElementById('widget3').addEventListener('click', toggleWidget3Animation);
// Function to update the trading graph URL
function isValidTradingUrl(url) {
    // Check if the URL belongs to a known list of trading websites (example: groww, tradingview, etc.)
    const allowedDomains = ['groww.in', 'tradingview.com', 'nseindia.com']; // Add other domains as needed
    try {
        const parsedUrl = new URL(url);
        return allowedDomains.some(domain => parsedUrl.hostname.includes(domain));
    } catch (error) {
        return false;
    }
}

function updateGraph() {
    const tradingUrl = document.getElementById('trading-url').value;
    const iframe = document.getElementById('graph-iframe');

    if (tradingUrl && isValidTradingUrl(tradingUrl)) {
        iframe.src = tradingUrl; // Update the iframe source
        alert('Graph updated with new URL: ' + tradingUrl);
    } else {
        alert('Please enter a valid trading website URL from supported domains.');
    }
}
