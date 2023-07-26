let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;

chai.use(chaiHttp);

const url = 'http://localhost:3000/api'

    before(() => {
        console.log("Probando el funcionamiento del CRUD de Orders");
   })

    describe("Registro de orden.", () => {
        it("Debe registrar una nueva orden", (done) => {
            chai.request(url)
            .post('/orders')
            .send({
                servicesId:"2",
                deviceId:"1",
                userId:"1",
                fullName:"Marivel Herreria",
                phone:"2431166982",
                color:"rojo",
                observations:"El dispositivo trae la pantalla estrellada, además no funciona la bateria, al igual que su camara",
                advancePay:"300",
            
                detalles:[        
                    
                    {
                        "componentsId": 1,
                        "quantityComponent":1
                    },
                ]
            })

            .end((err,res) => {
                //console.log(res.body);
                //console.log( res.body.newIdOrden);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('newIdOrden');            
                expect(res.body).to.have.property('newState');
                expect(res.body).to.have.property('message');
                done();
            });
        })

        it("Debe rechazar registro de una nueva orden con telefono invalido (!= 10 caracteres)", (done) => {
            chai.request(url)
            .post('/orders')
            .send({
                servicesId:"1",
                deviceId:"3",
                userId:"1",
                fullName:"Marivell Herreria",
                phone:"9389",
                color:"rojo",
                observations:"El dispositivo trae la pantalla estrellada, además no funciona la bateria, al igual que su camara",
                advancePay:"300",
            
                detalles:[        
                    {
                        "componentsId": 2,
                        "quantityComponent":1
                    },
                    {
                        "componentsId": 1,
                        "quantityComponent":1
                    },
                    {
                        "componentsId": 3,
                        "quantityComponent":1
                    }
                ]
            })

            .end((err,res) => {
                //console.log(res.body);
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message');
                done();
            });
        })

        it("Debe rechazar registro de una nueva orden sin nombre del cliente", (done) => {
            chai.request(url)
            .post('/orders')
            .send({
                servicesId:"1",
                deviceId:"3",
                userId:"1",
                //fullName:"Marivell Herreria",
                phone: "2431189082",
                color:"rojo",
                observations:"El dispositivo trae la pantalla estrellada, además no funciona la bateria, al igual que su camara",
                advancePay:"300",
            
                detalles:[        
                    {
                        "componentsId": 2,
                        "quantityComponent":1
                    },
                    {
                        "componentsId": 1,
                        "quantityComponent":1
                    },
                    {
                        "componentsId": 3,
                        "quantityComponent":1
                    }
                ]
            })

            .end((err,res) => {
                //console.log(res.body);
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message');
                done();
            });
        })
    })

    describe("Visualizacion de orden.", () => {
        it("Debe visualizar una orden existente", (done) => {
            chai.request(url)
            .get('/orders')
            .query({ orderId: "17" })

            .end((err, res) => {
                //console.log(res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('orders');
                //expect(res.body.orders).to.be.an('array').with.lengthOf(1);
                expect(res.body.orders[0]).to.have.property('id', 17);
                expect(res.body.orders[0]).to.have.property('fullName');
                done();
            });
        });

        it("Debe retornar un error al visualizar una orden inexistente", (done) => {
        chai.request(url)
            .get('/orders')
            .query({ orderId: "999" })

            .end((err, res) => {
            //console.log(res.body);
            expect(res).to.have.status(404);
            expect(res.body).to.have.property('message');
            done();
            });
        });

        it("Debe visualizar todas las órdenes de la fecha 2023-07-03", (done) => {
            chai.request(url)
            .get('/orders')
            .query({ dateRegister: "2023-07-03" })

            .end((err, res) => {
                //console.log(res.body)
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('orders');
                expect(res.body).to.have.property('message');
                done();
            });        
        });
    })

    describe("Eliminar orden.", () => {
        
        it("Debe eliminar una orden existente", (done) => {
            chai.request(url)
            .delete('/orders')
            .query({ orderSelected: "18" })

            .end((err, res) => {
                //console.log(res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message');
                done();
            });
        });

        it("Debe retornar un error al intentar eliminar una orden inexistente", (done) => {
            chai.request(url)
            .delete('/orders')
            .query({ orderSelected: "999888" })

            .end((err, res) => {
                //console.log(res.body);
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message');
                done();
            });
        });

        it("Debe eliminar múltiples órdenes a la vez", (done) => {
            chai.request(url)
            .delete('/orders')
            .query({ orderSelected: ["20", "19"] })

            .end((err, res) => {
                //console.log(res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message');
                done();
            });
        });
        
        
    })

    describe("Editar orden.", () => {
        it("Debe editar una orden existente", (done) => {
            chai.request(url)
            .patch('/orders')
            .send({
                id:13,
                fullName:"Gissel Garcia",
                phone:"2431256890",
                color:"Verde",
                observations:"El dispositivo no enciende y tiene pantalla rota",

            })

            .end((err,res) => {
                //console.log(res.body);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message');
                done();
            });
        })

        it("Debe retornar un error al intentar actualizar una orden inexistente", (done) => {
            chai.request(url)
            .patch('/orders')
            .send({
                id:897987789789,
                fullName:"Daniel Perez",
                phone:"2431256890",
            })

            .end((err,res) => {
                //console.log(res.body);
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message');
                done();
            });
        })

        it("Debe rechazar la actualizacion de una orden existente, con telefono invalido (!= 10 caracteres)", (done) => {
            chai.request(url)
            .patch('/orders')
            .send({
                id:126,
                fullName:"Daniel Perez",
                phone:"3454",
            })

            .end((err,res) => {            
                //console.log(res.body);
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message');
                done();
            });
        })
    })

    after(() => {
        console.log("Fin del test de Orders")
    })

