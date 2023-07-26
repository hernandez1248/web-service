let chai = require("chai");
let chaiHttp = require("chai-http");
let expect = chai.expect;

chai.use(chaiHttp);

const url = "http://localhost:3000/api";

describe("CRUD de States.", () => {
  describe("Registro de estado de una orden.", () => {
    it("Debe registrar un nuevo estado de la orden", (done) => {
      chai
        .request(url)
        .post("/states")
        .send({
          ordersId: 1,
          status: "Cancelada",
          description: "El cliente que solicitó la orden canceló el servicio.",
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe rechazar registro de un nuevo estado de la orden sin status", (done) => {
      chai
        .request(url)
        .post("/states")
        .send({
          ordersId: 1,
          description: "El cliente que solicitó la orden canceló el servicio.",
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar registro de un nuevo estado de la orden sin descripción", (done) => {
      chai
        .request(url)
        .post("/states")
        .send({
          ordersId: 1,
          description: "El cliente que solicitó la orden canceló el servicio.",
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("Actualizar estado de la orden.", () => {
    it("Debe actualizar el registro del estado de la orden", (done) => {
      chai
        .request(url)
        .patch("/states")
        .send({
          id: 4,
          ordersId: 1,
          status: "Entregada",
          description: "El servicio se completó",
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar la actualización de un estado de orden sin el id de la orden correspondiente", (done) => {
      chai
        .request(url)
        .patch("/states")
        .send({
          id: 4,
          status: "En proceso",
          description: "El servicio esta en proceso.",
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe rechazar la actualización de un nuevo estado de orden con status vacío", (done) => {
      chai
        .request(url)
        .patch("/states?id=5")
        .send({
          ordersId: 1,
          status: "",
          description: "El cliente que solicitó la orden canceló el servicio.",
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("Eliminar estado de la orden.", () => {
    it("Debe eliminar el registro de un estado de la orden", (done) => {
      chai
        .request(url)
        .delete("/states?id=1")
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar la eliminación del registro de un componente sin otorgar su id", (done) => {
      chai
        .request(url)
        .delete("/states?id=")
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar la eliminación del registro de un componente con id inexistente", (done) => {
      chai
        .request(url)
        .delete("/states?id=498")
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("Visualizar estados de las ordenes.", () => {
    it("Deben visualizarse todos los estados de las ordenes", (done) => {
      chai
        .request(url)
        .get("/states")
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
    it("Debe visualizarse el registro de un estado de la orden por medio de su id", (done) => {
      chai
        .request(url)
        .get("/states?id=3")
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
    it("Debe rechazar la visualización de estados por ruta inexistente", (done) => {
      chai
        .request(url)
        .get("/estates")
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
