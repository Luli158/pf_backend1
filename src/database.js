import mongoose from "mongoose";

mongoose.connect("mongodb+srv://ayudantecno:coderhouse@codercluster0.ldh1a.mongodb.net/E-commerce")
    .then(() => console.log("Conexión exitosa"))
    .catch((error) => console.log("Error al conectar:", error));