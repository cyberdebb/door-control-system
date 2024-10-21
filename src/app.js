var express = require('express');
const webSocket = require('ws');
const os = require('os');

// const { conecta, portasDisponiveis } = require('./models/database')

var app = express();
app.use(express.json());  // Middleware para JSON
app.use(express.static(__dirname + '/public'));

const wss = new webSocket.Server({ port: 8080 });
var clients = new Map();


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
    // const portas = await portasDisponiveis(idUFSC);
    // for each portas?
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/abre', function(req, res) {
  let idPorta = req.body.idPorta;
  let wsFound = null;
  
  for (let [ws, id] of clients) {
    if (id === idPorta) {
      wsFound=ws;
      break;
    }
  }

  //!Ver como o front quer que res.json seja enviado, esse é só template
  if (wsFound) {
    wsFound.send("abre");  
    //?Template response
    res.json({ status: 'success', idPorta: idPorta, message: 'Comando enviado' });
  } else {
    res.status(404).json({ status: 'error', message: `Porta com ID ${idPorta} não encontrada` });
  }
  
  // Recebe id da porta que é pra abrir
  // Conectar ao websocket esp e enviar comando abrir porta
  // Retornar pro front IDporta, simbolizando que foi aberta
  
});

  app.listen(3000, () => {
    const ipAddress = getLocalIPAddress();
    console.log('Servidor rodando na porta 3000');
    console.log(`Acesse o servidor no IP: ${ipAddress}`);
  });
// END APP

// WEBSOCKET
wss.on('connection', (ws) => {
  console.log("Client connected");

  ws.send("Bem vindo ao websocket");
  clients.set(ws, -1);

  ws.on('message', (message) => {
    try{
      const porta = JSON.parse(message);
     
      //Recebe sempre id para garantir que o ws está correto  
      if(porta.id){
        clients.set(ws,porta.id);
        console.log(`ID ${porta.id} associado ao WebSocket.`);
      }
      if(porta.status){
        console.log(`Porta ${porta.id}: ${porta.status}`);
      }
    }
    catch (error){
        console.error("Erro ao processar a mensagem:", error);
    }
});

  ws.on('close', () => {
    clients.delete(ws)
    console.log("Cliente desconectado");
  });
});
// END WEBSOCKET
