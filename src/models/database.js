const {MongoClient} = require('mongodb');
const fs = require('fs').promises;

var db, teachers, doors;

async function conecta() {
  const client = new MongoClient('mongodb://127.0.0.1:27017');
  await client.connect();
  db = await client.db("DOOR-CONTROL");
  
  teachers = await db.collection("teachers");
  doors = await db.collection("doors");

  await populaProfessores();

  return {db, teachers, doors};
}

async function portasDisponiveis(idUFSC){
  if(!teachers){
    throw new Error("A conexão com o banco não foi inicializada.");
  }

  const professor = await teachers.findOne({id: idUFSC });

  if(professor){
    return professor.portasDisponiveis;
  } else{
    throw new Error(`Professor com ID ${idUFSC} não encontrado!`);
  }
}

// Função para popular o banco com os professores do JSON
async function populaProfessores() {
  try {
    // Lê o arquivo JSON contendo os professores
    const data = await fs.readFile('./src/models/professores.json', 'utf8');
    const professores = JSON.parse(data);

    // Insere os professores no banco de dados
    await teachers.insertMany(professores);
    console.log('Professores inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao popular o banco de dados:', error);
  }
}


module.exports = {
  conecta,
  portasDisponiveis
};