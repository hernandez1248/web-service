let chai = require("chai");
let chaiHttp = require("chai-http");
let expect = chai.expect;

chai.use(chaiHttp);

const url = "http://localhost:3000/api";

describe("CRUD de Componentes.", () => {
  describe("Registro de componente.", () => {
    it("Debe registrar un nuevo componente", (done) => {
      chai
        .request(url)
        .post("/components")
        .send({
          name: "Fan cooler 80mm",
          price: 345,
          stock: 12,
          deviceId: 1,
        })
        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar registro de un nuevo componente sin nombre", (done) => {
      chai
        .request(url)
        .post("/components")
        .send({
          price: 345,
          stock: 12,
          deviceId: 1,
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar registro de un nuevo componente sin precio", (done) => {
      chai
        .request(url)
        .post("/components")
        .send({
          name: "Fan cooler 80mm",
          stock: 12,
          deviceId: 1,
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar registro de un nuevo componente con precio inválido (solo numeros)", (done) => {
      chai
        .request(url)
        .post("/components")
        .send({
          name: "Fan cooler 80mm",
          price: "hbhj",
          stock: 12,
          deviceId: 1,
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("Actualizar componente.", () => {
    it("Debe actualizar el registro de un componente con datos que cumplan las validaciones", (done) => {
      chai
        .request(url)
        .patch("/components")
        .send({
          id: 2,
          name: "Fan cooler 60mm",
          price: 315,
          stock: 11,
          deviceId: 1,
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar la actualización de un componente con algún campo vacío", (done) => {
      chai
        .request(url)
        .patch("/components?id=2")
        .send({
          name: "",
          price: 345,
          stock: 17,
          deviceId: 1,
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar la actualización de un componente sin el id del dispositivo correspondiente", (done) => {
      chai
        .request(url)
        .patch("/components?id=2")
        .send({
          name: "Fan cooler 80mm",
          price: 345,
          stock: 12,
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar registro de un nuevo componente con precio inválido (solo numeros)", (done) => {
      chai
        .request(url)
        .patch("/components?id=2")
        .send({
          name: "Fan cooler 80mm",
          price: "hbhj",
          stock: 12,
          deviceId: 1,
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("Visualizar componentes.", () => {
    it("Debe visualizarse todo los componentes", (done) => {
      chai
        .request(url)
        .get("/components")
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
    it("Debe visualizarse el registro de un componente por medio de su id", (done) => {
      chai
        .request(url)
        .get("/components?id=2")
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
    it("Debe visualizarse el registro de un componente por medio de su nombre", (done) => {
      chai
        .request(url)
        .get("/components")
        .send({
          name: "Batería 4.000 mAh",
        })
        .end((err, res) => {
          // console.log(res.body);
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  describe("Eliminar componente.", () => {
    it("Debe eliminar el registro de un componente", (done) => {
      chai
        .request(url)
        .delete("/components?id=5")
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
        .delete("/components?id=")
        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("message");
          done();
        });
    });
    it("Debe rechazar la eliminación del registro de un componente con id inexistente", (done) => {
      chai
        .request(url)
        .delete("/components?id=98")
        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });
});
