//Carregando módulos
const express = require("express")
const app = express()
app.use(express.json())

//Classe de Serviço de Usuario

/**
 * classe responsável pela manipulação de usuarios
 * é através dela que vamos fazer as operações de validação, inclusão, alteração e exclusão
 */
class UsuarioService{
    usuarios = []

    validarUsuario(usuario){
        return ("nomeCompleto" in usuario && "username" in usuario && "email" in usuario)
    }

    buscarUsuario(indice){
        const pesquisa = this.usuarios.filter( usuario => usuario.id == indice )
        if(pesquisa.length == 0)
            return null
        return pesquisa[0]
    }

    inserirUsuario(usuario){
        this.usuarios.push(usuario)
    }

    alterarUsuario(indice, usuario){
        this.usuarios[indice] = usuario
    }

    removerUsuario(indice){
        this.usuarios.splice(indice,1)
        this.reordenarUsuarios()
    }

    reordenarUsuarios(){
        var i = 0
        while(i < this.usuarios.length){
            this.usuarios[i]["id"] = (i+1)
            i++
        }
    }
}

//Classe Responsável pelo Modelo de usuários
class Usuario{

    id = null
    username = null
    senha = null
    nomeCompleto = null
    nomeSocial = null
    email = null

    constructor(id, username, senha, nomeCompleto, nomeSocial, email){
        this.id = id
        this.username = username
        this.senha = senha
        this.nomeCompleto = nomeCompleto
        this.nomeSocial = nomeSocial
        this.email = email
    }

}

const usuariosService = new UsuarioService()

const primeiroUsuario = new Usuario(1, "Gabriel", "gabriel", "123456", "gabriel.espindola@ligaeducacional.com.br")

//adicionando o usuário através de uma variável
usuariosService.inserirUsuario(primeiroUsuario)

//adicionando o usuário diretamente utilizando o construtor como parâmetro
usuariosService.inserirUsuario(new Usuario(2, "Yasmim", "Yasmim", "123456", "yasmim@ligaeducacional.com.br"))

//Mensagem de erro
erro_mensagem = {
    'erro.id.naoinformada': { 
        "erro": true, "mensagem":"Identificador não informado!" 
    },
    'erro.camposorbigatorios.naopreenchidos': { 
        "erro": true, "mensagem":" Todos os campos obrigatórios devem ser preenchidos! " 
    },
    'error.usuario.naoencontrado': { 
        "erro": false, "mensagem": " Usuário não encontrado! " 
    },
    'usuario.excluido.sucesso': { 
        "erro": false, "mensagem": " Usuário excluído com sucesso! " 
    }
}

//***************************************************************

//Rotas
app.get("/usuario",(req,res)=>{
    res.status(200).send(usuariosService.usuarios)
})

app.get("/usuario/:id",(req,res)=>{
    const {id} = req.params
    const indice = id - 1 
    if (id > usuariosService.usuarios.length){
        res.status(400).send(erro_mensagem['erro.id.naoinformada'])
        return
    }

    if (id == usuariosService.usuarios[indice].id){
        res.status(200).send(usuariosService.buscarUsuario(id))
        return
    }

    res.status(400).send(erro_mensagem['erro.usuario.naoencontrado'])
})

app.post("/usuario",(req,res)=>{
    novo_usuario = req.body
    indice = (usuariosService.usuarios.length) - 1
    const ultimaId = usuariosService.usuarios[indice] ? (usuariosService.usuarios[indice].id) : 0
    novo_usuario["id"] = ultimaId + 1
    
    if (!("nomeSocial" in novo_usuario)){
        novo_usuario["nomeSocial"] = novo_usuario["nomeCompleto"]
    }

    const novoUsuario = new Usuario(novo_usuario.id, novo_usuario.username, novo_usuario.senha, novo_usuario.nomeCompleto, novo_usuario.nomeSocial, novo_usuario.email)
    if (!usuariosService.validarUsuario(novoUsuario)){
        res.status(400).send(erro_mensagem['erro.camposorbigatorios.naopreenchidos'])
        return
    }

    usuariosService.inserirUsuario(novoUsuario)
    res.status(201).send(novoUsuario)
})

app.patch("/usuario/:id",(req,res)=>{
    edit_usuario = req.body
    const {id} = req.params
    var indice = id - 1
    
    const usuario = usuariosService.buscarUsuario(id)
    if (!usuario){
        res.status(400).send(erro_mensagem['erro.id.naoinformada'])
        return
    }
    
    usuario.id = indice + 1
    usuario.nomeCompleto = edit_usuario.nomeCompleto || null
    usuario.username = edit_usuario.username || null
    usuario.email = edit_usuario.email || null
    if (!usuariosService.validarUsuario(usuario)){
        res.status(400).send(erro_mensagem['erro.camposorbigatorios.naopreenchidos'])
        return
    }

    usuariosService.alterarUsuario(indice, usuario)
    res.status(200).send(usuariosService.usuarios[indice])
})

app.delete("/usuario/:id",(req,res)=>{
    const {id} = req.params
    var indice = id - 1
    
    const usuario = usuariosService.buscarUsuario(id)
    if (!usuario){
        res.status(400).send(erro_mensagem['erro.usuario.naoencontrado'])
        return
    }

    usuariosService.removerUsuario(indice)
    res.status(200).send(erro_mensagem['usuario.excluido.sucesso'])
})

//Outros
const port = 3000
app.listen(port, ()=>{
    console.log(`Iniciando servidor...`)
})

    usuariosService.removerUsuario(indice)
    res.status(200).send(erro_mensagem['usuario.excluido.sucesso'])
})

//Outros
const port = 3000
app.listen(port, ()=>{
    console.log(`Iniciando servidor...`)
})
