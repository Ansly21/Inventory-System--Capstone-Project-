const MongoClient = require('mongodb').MongoClient;
const plotly = require('plotly')('Steph401', 'sbqllhEzOvrV03bJuKtE'); // Replace with your Plotly credentials

const xData = [];
const yData = [];
const MAX_DATA_POINTS = 10; // Set the maximum number of data points to display

const mongoURL = 'mongodb+srv://dababies:letsgo123@six7twoinventorysystem.lij0pnd.mongodb.net/Six7TwoInventorySystem?retryWrites=true&w=majority'; // Replace with your MongoDB URL
const collectionName = 'your-collection'; // Replace with your collection name

function updateGraph() {
  const trace = {
    x: xData,
    y: yData,
    mode: 'lines+markers',
    type: 'scatter'
  };

  const layout = {
    title: 'Dynamic Graph',
    xaxis: {
      title: 'X-axis'
    },
    yaxis: {
      title: 'Y-axis'
    }
  };

  const graphOptions = { layout: layout, filename: 'dynamic-graph' };

  plotly.plot(trace, graphOptions, (err, msg) => {
    if (err) {
      console.error(err);
    } else {
      console.log(msg.url);
    }
  });
}

function addValue(value) {
  xData.push(new Date().toLocaleTimeString()); // Use time as x-axis
  yData.push(value);

  if (xData.length > MAX_DATA_POINTS) {
    xData.shift();
    yData.shift();
  }

  updateGraph();
}

async function connectToMongoDB() {
  try {
    const client = await MongoClient.connect(mongoURL, { useNewUrlParser: true });
    const db = client.db();
    const collection = db.collection(collectionName);

    // Example: Listen for changes in a MongoDB collection and update the graph
    collection.watch().on('change', (change) => {
      if (change.operationType === 'insert') {
        const newValue = change.fullDocument.value; // Adjust this based on your MongoDB schema
        addValue(newValue);
      }
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Connect to MongoDB and start listening for changes
connectToMongoDB();