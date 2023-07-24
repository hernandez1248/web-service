let chai = require("chai");
let chaiHttp = require("chai-http");
let expect = chai.expect;

chai.use(chaiHttp);

const url = "http://localhost:3000/api";
describe("CRUD de usuarios.", () => {
  describe('Registro de un usuario', () => {
    it("Debe registrar un nuevo usuario", (done) => {
      chai.request(url)
      .post("/users")
      .send({
        name: "Angel",
        lastName: "Flores",
        phone: 2431192311,
        email: "flores@gmail.com",
        password: "flores12",
        rol: "empleado",
      })
      .end((err, res) => {
        
        //console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('user');
        expect(res.body.user).to.have.property('name');
        expect(res.body.user.password).to.equal(null);
        expect(res.body).to.have.property('message');
        done();
      })
    });

    it("Debe rechazar registrar un nuevo usuario sin nombre", (done) => {
      chai.request(url)
      .post("/users")
      .send({
        lastName: "Torres",
        phone: 2431126590,
        email: "torres@gmail.com",
        password: "torres12",
        rol: "empleado",
      })
      .end((err, res) => {
        //console.log(res.body);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message');
        done();
      })
    });

    it("Debe rechazar registrar un nuevo usuario si el rol no es 'admin' o empleado'", (done) => {
      chai.request(url)
      .post("/users")
      .send({
        name: "Javier",
        lastName: "Torres",
        phone: 2431126590,
        email: "torres@gmail.com",
        password: "torres12",
        rol: "gerente",
      })
      .end((err, res) => {
        //console.log(res.body);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message');
        done();
      })
    });
  });


  describe('Actualizar un usuario existente', () => {
    it("Debe actualizar un usuario con datos correctos", (done) => {
      chai.request(url)
        .put("/users?id=52") 
        .send({
          name: "Felipe",
          lastName: "Lima",
          phone: 9876543212,
          email: "lima@gmail.com",
          password: "lima1235",
          rol: "empleado",
        })
        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it("Debe rechazar la actualización de un usuario con datos faltantes", (done) => {
      chai.request(url)
        .put("/users?id=52")
        .send({
          name: "Antony",
          
        })
        .end((err, res) => {
          //console.log(res.body);
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message');
          done();
        });
    });

    it(`Debe rechazar la actualización de un usuario con una 
        contraseña inválida (!= 8 carácteres)`, (done) => {
      chai.request(url)
        .put("/users?id=52")
        .send({
        name: "Felipe",
        lastName: "Lima",
        phone: 9876543214,
        email: "lima@gmail.com",
        password: "1234567",
        rol: "empleado",
      })
      .end((err, res) => {
        //console.log(res.body);
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('message');
        done();
      });
    });
  });


  describe('Obtener la lista de usuarios', () => {
    it("Debe obtener la lista de usuarios correctamente", (done) => {
      chai.request(url)
        .get("/users")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });

    it("Debe obtener un usuario con el ID 1", (done) => {
      chai.request(url)
        .get("/users?id=1")
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });     

    it("Debe rechazar obtener la lista de usuarios por que la ruta esta mal escrita", (done) => {
      chai.request(url)
        .get("/useres")
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });


  describe('Eliminar un usuario', () => {
    it("Debe eliminar un usuario correctamente", (done) => {
      chai.request(url)
        .delete("/users?id=57")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe rechazar la solicitud cuando faltan datos", (done) => {
      chai.request(url)
        .delete("/users?id=")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("message");
          done();
        });
    });

    it("Debe rechazar la eliminación de un usuario inexistente", (done) => {
      chai.request(url)
        .delete("/users?id=78")
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property("message");
          done();
        });
    });

  });
});
