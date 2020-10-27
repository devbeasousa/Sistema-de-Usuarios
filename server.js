//Carregando módulos
const express = require("express")
const app = express()
app.use(express.json())

// Array Usuarios
var usuarios = []

//Mensagem de erro
erro_mensagem = [{ 

        "erro": true, 
    
        "mensagem":"Identificador não informado!" 
    
    },
    { 

        "erro": true, 
    
        "mensagem":" Todos os campos obrigatórios devem ser preenchidos! " 
    
    },
    { 

        "erro": false, 
    
        "mensagem": " Usuário excluído com sucesso! " 
    
    }]


//Rotas
app.get("/usuario",(req,res)=>{
    res.status(200).send(usuarios)
})
app.get("/usuario/:id",(req,res)=>{
    const {id} = req.params
    const indice = id - 1 
    if (id > usuarios.length){
        res.status(400).send(erro_mensagem[0])
    }else{
        if (id == usuarios[indice].id){
            res.status(200).send(usuarios[indice])
        } 
    }
})

app.post("/usuario",(req,res)=>{
    novo_usuario = req.body
    indice = (usuarios.length) - 1
    const ultimoId = usuarios[indice]? (usuarios[indice].id) : 0
    novo_usuario["id"] = (ultimoId) + 1
    
    if ("nomeCompleto" in novo_usuario && "username" in novo_usuario && "email" in novo_usuario){
        if ("nomeSocial" in novo_usuario){
            usuarios.push(novo_usuario)
            res.status(201).send(novo_usuario)
        }else{
            novo_usuario["nomeSocial"] = novo_usuario ["nomeCompleto"]
            usuarios.push(novo_usuario)
            res.status(201).send(novo_usuario)
        }
    }else{
        res.status(400).send(erro_mensagem[1])
    }

})
app.patch("/usuario/:id",(req,res)=>{
    edit_usuario = req.body
    const {id} = req.params
    const indice = id - 1 
    if (id > usuarios.length){
        res.status(400).send(erro_mensagem[0])
    }else{
        if (id == usuarios[indice].id){
            if ("nomeCompleto" in edit_usuario && "username" in edit_usuario && "email" in edit_usuario){
                edit_usuario.id = indice + 1
                usuarios[indice] = edit_usuario
                res.status(200).send(usuarios[indice])
            }else{
                res.status(400).send(erro_mensagem[1])
            }
        } 
    }
})
app.delete("/usuario/:id",(req,res)=>{
    const {id} = req.params
    const indice = id - 1 
    if (id > usuarios.length){
        res.status(400).send(erro_mensagem[0])
    }else{
        usuarios.splice(indice,1)
        res.status(200).send(erro_mensagem[2])
        var i = 0
        while(i < usuarios.length){
            usuarios[i]["id"] = (i+1)
            i++
        }
            
    }   
})

//Outros
const port = 3000
app.listen(port, ()=>{
    console.log(`Iniciando servidor...`)
})
