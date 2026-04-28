import mysql from "mysql2/promise";
import { dbConfig } from "../config/database.js";

async function testConnection() {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.query("SELECT 1 as result");
    console.log("Database connected successfully:", rows);
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  } finally {
    await connection.end();
  }
}

testConnection();
