let chai = require("chai");
let chaiHttp = require("chai-http");
let expect = chai.expect;

chai.use(chaiHttp);

const url = "http://localhost:3000/api";

describe("CRUD de Dispositivos", () => {
  before(() => {
    console.log("Probando el funcionamiento del CRUD de Devices");
  });

  describe("Registro de dispositivo.", () => {
    it("Debe registrar una nuevo dispositivo", (done) => {
      chai
        .request(url)
        .post("/device")
        .send({
          model: "MotoG6",
          brand: "Motorola",
          deviceCategoryId: "1",
        })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("devices");
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe rechazar registro de un nuevo dispositivo con una marca invalida (caracteres invalidos)", (done) => {
      chai
        .request(url)
        .post("/device")
        .send({
          model: "MotoG7",
          brand: "LG ¨}+++-{[[[}}",
          deviceCategoryId: "1",
        })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe rechazar registro de un nuevo dispositivo sin nombre del modelo del dispositivo", (done) => {
      chai
        .request(url)
        .post("/device")
        .send({
          //model: "vghgbbhbbh",
          brand: "Huawey",
          deviceCategoryId: "2",
        })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("Visualizacion de dispositivo.", () => {
    it("Debe visualizar un dispositivo existente", (done) => {
      chai
        .request(url)
        .get("/device")
        .query({ deviceId: "2" })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("devices");
          expect(res.body.devices[0]).to.have.property("id", 2);
          expect(res.body.devices[0]).to.have.property("model");
          done();
        });
    });

    it("Debe retornar un error al visualizar un dispositivo inexistente", (done) => {
      chai
        .request(url)
        .get("/device")
        .query({ deviceId: "9999" })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe visualizar todos los dipositivos relacionados al modelo Inspiron", (done) => {
      chai
        .request(url)
        .get("/device")
        .query({ queryDevice: "Inspiron" })

        .end((err, res) => {
          //console.log(res.body)
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("devices");
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("Editar dispositivo.", () => {
    it("Debe editar un dispositivo existente", (done) => {
      chai
        .request(url)
        .patch("/device")
        .send({
          id: 11,
          model: "Alcatel YUHYUHYU",
          brand: "Alca",
        })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe retornar un error al intentar actualizar un dispositivo inexistente", (done) => {
      chai
        .request(url)
        .patch("/device")
        .send({
          id: 897987789789,
          model: "YUHYUHYU",
          brand: "Alca",
        })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe rechazar la actualizacion de un dispositivo existente, con marca invalida (caracteres invalidos)", (done) => {
      chai
        .request(url)
        .patch("/device")
        .send({
          id: 4,
          model: "Alcatel YUHYUHYU",
          brand: "Alca 8777+++",
        })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("Eliminar dispositivo.", () => {
    it("Debe eliminar un dispositivo existente", (done) => {
      chai
        .request(url)
        .delete("/device")
        .query({ deviceSelected: "12" })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe retornar un error al intentar eliminar un dispositivo inexistente", (done) => {
      chai
        .request(url)
        .delete("/device")
        .query({ deviceSelected: "999888" })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe eliminar múltiples dispositivos a la vez", (done) => {
      chai
        .request(url)
        .delete("/device")
        .query({ deviceSelected: ["13", "14"] })

        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  after(() => {
    console.log("Fin del test de Devices");
  });
});
