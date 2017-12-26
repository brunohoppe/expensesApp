(function() {
    'use strict';

    function routes() {
        const Joi = require('joi');
        var routesArr = [];
        //------Default Routes------//
        routesArr = routesArr.concat(defaultArrRoutes());
		routesArr = routesArr.concat(defaultServerRoutes());
        //------Supermercado Routes------//
        routesArr = routesArr.concat(supermercadoArrRoutes(Joi));
        //------Produto Routes------//
        routesArr = routesArr.concat(produtoArrRoute());

        routesArr = routesArr.concat(usuarioArrRoute(Joi));
		
		routesArr = routesArr.concat(categoriaGastos(Joi));
		

        return routesArr;
    }

    function defaultServerRoutes() {
        return [{
            method: 'GET',
            path: '/ws',
            config: {
                handler: (request, reply) => {
                    reply('Server On');
                }
            }
        }, ];
    }

    function defaultArrRoutes() {
        return [{
            method: 'GET',
            path: '/',
            config: {
                handler: (request, reply) => {
                    reply.file('dist/index.html');
                }
            }
        }, ];
    }

    function supermercadoArrRoutes(Joi) {
        return [{
            method: 'POST',
            path: '/supermercado',
            config: {
                handler: (request, reply) => {
                    let supermercado = request.payload;
                    var db = request.server.plugins['hapi-mongodb'].db;
                    db.collection('supermercados').save(supermercado, (err, result) => {

                        if (err) return reply(Boom.wrap(err, "Internal MongoDB error"));
                        reply(supermercado);
                    });
                },
                validate: {
                    payload: {
                        nome: Joi.string().min(5).max(20).required()
                    }
                },
                cors: true
            }
        }];
    }

    function produtoArrRoute() {
        return [{
            method: 'GET',
            path: '/produtos',
            config: {
                handler: (request, reply) => {
                    var db = request.server.plugins['hapi-mongodb'].db;
                    reply(db.collection('produto').find({}).limit(20).toArray());
                },
                cors: true
            }
        }, {
            method: 'GET',
            path: '/produto/{nome}',
            config: {
                handler: (request, reply) => {
                    var db = request.server.plugins['hapi-mongodb'].db;
                    var query = {
                        nome: new RegExp('^' + request.params.nome, 'i')
                    };
                    reply(db.collection('produto').find(query).limit(20).toArray());

                },
                cors: true

            }
        }, ];
    }

    function usuarioArrRoute(Joi) {
        return [{
            method: 'GET',
            path: '/ws/usuarios',
            config: {
                handler: (request, reply) => {
                    var db = request.server.plugins['hapi-mongodb'].db;
                    reply(db.collection('usuarios').find({}).limit(20).toArray());
                },
                cors: true
            }
        }, {
            method: 'GET',
            path: '/ws/usuario',
            config: {
                handler: (request, reply) => {
                    var db = request.server.plugins['hapi-mongodb'].db;
                    db.collection('usuarios').findOne({
                        "facebookid": request.query.facebookid
                    }, function(err, result) {
                        if (err) return reply(Boom.internal('Internal MongoDB error', err));
                        reply(result);
                    });

                },
                cors: true

            }
        }, {
            method: 'GET',
            path: '/ws/usuario/login',
            config: {
                handler: (request, reply) => {
                    var db = request.server.plugins['hapi-mongodb'].db;
                    db.collection('usuarios').findOne({
                        "email": request.query.email,
                        "senha": request.query.senha
                    }, function(err, result) {
                        if (err) return reply(Boom.internal('Internal MongoDB error', err));
                        reply(result);
                    });

                },
                cors: true

            }
        }, {
            method: 'GET',
            path: '/ws/usuario/{id}',
            config: {
                handler: (request, reply) => {
                    var db = request.server.plugins['hapi-mongodb'].db;
                    var ObjectID = request.server.plugins['hapi-mongodb'].ObjectID;
                    db.collection('usuarios').findOne({
                        "_id": new ObjectID(request.params.id)
                    }, function(err, result) {
                        if (err) return reply(Boom.internal('Internal MongoDB error', err));
                        reply(result);
                    });

                },
                cors: true

            }
        }, {
            method: 'POST',
            path: '/ws/usuario/novo',
            config: {
                handler: (request, reply) => {
                    let usuario = request.payload;
                    var db = request.server.plugins['hapi-mongodb'].db;
                    db.collection('usuarios').save(usuario, (err, result) => {
                        if (err) return reply(Boom.wrap(err, "Internal MongoDB error"));
                        reply(usuario);
                    });
                },
                validate: {
                    payload: {
                        nome: Joi.string().min(5).max(20).required(),
                        cpf: Joi.string().min(11).max(11),
                        email: Joi.string().email().required(),
                        perfil: Joi.string(),
                        senha: Joi.string().min(4).required(),
                        telefone: Joi.string(),
                        telwhatsapp: Joi.string(),
                        endereco: Joi.array(),
                        facebookid: Joi.string(),
                    }
                },
                cors: true
            }
        }, {
            method: 'POST',
            path: '/ws/usuario/completo',
            config: {
                handler: (request, reply) => {
                    let usuario = request.payload;
                    var db = request.server.plugins['hapi-mongodb'].db;
                    db.collection('usuarios').save(usuario, (err, result) => {
                        if (err) return reply(Boom.wrap(err, "Internal MongoDB error"));
                        reply(usuario);
                    });
                },
                validate: {
                    payload: {
                        nome: Joi.string().min(5).max(20).required(),
                        cpf: Joi.string().min(11).max(11).required(),
                        email: Joi.string().email().required(),
                        perfil: Joi.string().required(),
                        senha: Joi.string().min(4).required(),
                        telefone: Joi.string().required(),
                        telwhatsapp: Joi.string().required(),
                        endereco: Joi.array().required(),
                        facebookid: Joi.string(),
                    }
                },
                cors: true
            }
        },
        {
            method: 'POST',
            path: '/ws/login',
            config: {
                handler: (request, reply) => {
                    var db = request.server.plugins['hapi-mongodb'].db;
                    let usuario = request.payload;
                    db.collection('usuarios').findOne({
                        "email": usuario.email,
                        "senha": usuario.senha
                    }, function(err, result) {
                        if (err) return reply(Boom.internal('Internal MongoDB error', err));
                        if(!result){
                            return reply({}).code(400);
                        }
                        return reply(result);
                        
                    });

                },
                cors: true

            }
        }];
    }
	function categoriaGastos(Joi){
		return [{
            method: 'POST',
            path: '/ws/categoriagastos',
            config: {
                handler: (request, reply) => {
                    let categoria = request.payload;
                    var db = request.server.plugins['hapi-mongodb'].db;
                    db.collection('categorias').save(categoria, (err, result) => {
                        if (err) return reply(Boom.wrap(err, "Serviço Indisponível"));
                        categoria.mensagem = "Categoria salva com sucesso!";
                        reply(categoria);
                    });

                },
                cors: true

            }
        },
        {
            method: 'GET',
            path: '/ws/categoriasgastos',
            config: {
                handler: (request, reply) => {
                    var db = request.server.plugins['hapi-mongodb'].db;
                    reply(db.collection('categorias').find({}).limit(20).toArray());
                },
                cors: true
            }
        }]
	}
    module.exports = routes();
})();
