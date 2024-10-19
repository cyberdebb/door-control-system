var express = require('express');
const webSocket = require('ws');
const os = require('os');

const { conecta, portasDisponiveis } = require('./models/database')

var app = express();
app.use(express.json());  // Middleware para JSON
app.use(express.static(__dirname + '/public'));

const wss = new webSocket.Server({ port: 8080 });

// Obter o IP local da máquina
function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;  // Retorna o IP da interface
      }
    }
  }
  return 'IP não encontrado';
}

// APP
app.get('/', function(req, res) {
  // debs
});

app.get('/login', function(req, res) {
  // debs
});

// Acessa o
app.get('/lista', async function(req, res) {
  const idUFSC = req.params.idUFSC;  // Email do professor passado na URL

  try {
    const portas = await portasDisponiveis(idUFSC);
    // for each portas?
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/abre', function(req, res) {
  // Recebe id da porta que é pra abrir
  // Conectar ao websocket esp e enviar comando abrir porta
  // Retornar pro front IDporta, simbolizando que foi aberta
  
});

conecta().then(() => {
  const ipAddress = getLocalIPAddress();
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
    console.log(`Acesse o servidor no IP: ${ipAddress}`);
  });
});
// END APP

// WEBSOCKET
wss.on('connection', (ws) => {
  console.log("Client connected");

  ws.send("Bem vindo ao websocket");

  ws.on('message', (message) => {
    console.log(`Mensagem recebida: ${message}`);
  });

  ws.on('close', () => {
    console.log("Cliente desconectado");
  });
});
// END WEBSOCKET
