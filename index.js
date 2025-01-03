const express = require('express');
const whatsapp = require('velixs-md');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());  // to parse incoming JSON requests
app.use(cors());

// Start a session
const sessionName = 'nama_session';  // replace this with your session name
whatsapp.startSession(sessionName);

// Webhook route to receive message and respond
app.post('/send-message', async (req, res) => {
  console.log({res,req})
  const { orderId } = req.body;  // Extract `to` and `text` from the request body
  
  try {
    await whatsapp.sendTextMessage({
      sessionId: sessionName,
      to: "+628114915666",
      text: orderId,
      isGroup: false  // Assuming single user message
    });
    
    res.status(200).send({ status: 'success', message: 'Message sent' });
  } catch (error) {
    res.status(500).send({ status: 'error', message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
