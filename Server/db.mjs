import { createClient} from '@libsql/client'
import express from "express";
import cors from "cors";



let token = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJleHAiOjE3NjMyMTUyMzMsImlhdCI6MTczMTY3OTIzMywiaWQiOiJlYWQyYjg1NS0zNzFlLTQ4MTMtYjgyYS1kODRmZTFhZDZkYzMifQ.GVYcH-xRbUsMOfD_GEvOTW0qW-IhYy8vJQfgtR2b8pP9zyHSSP26u2TwS1BEdU6vJZKOj78n6AmLHIdT4qyFAw";

const app = express();
app.use(cors());

export const turso = createClient({
  url:"libsql://webtech-s0583272.turso.io",
  authToken: token,
});

// Ruft die produktliste auf
let response = await turso.execute("SELECT * FROM Produkte");
console.log(response);

// Funktion, die ein Produkt anhand seiner ID abruft
async function getProductById(productId) {
  try {
    // Abfrage mit Platzhalter für die Produkt-ID
    const response = await turso.execute("SELECT * FROM Produkte WHERE id = ?", [productId]);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Fehler beim Abrufen des Produkts:", error);
  }
}

app.get("/product/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const result = await turso.execute("SELECT * FROM Produkte WHERE id = ?", [productId]);
    res.json(result);
  } catch (error) {
    res.status(500).send("Fehler beim Abrufen des Produkts");
  }
});

app.listen(3000, () => console.log("Server läuft auf http://localhost:3000"));






