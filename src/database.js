import mongoose from "mongoose";

mongoose.connect("mongodb+srv://ayudantecno:coderhouse@codercluster0.ldh1a.mongodb.net/")
    .then(() => console.log("Conexión exitosa"))
    .catch((error) => console.log("Vamos a morir, tenemos un error:", error));