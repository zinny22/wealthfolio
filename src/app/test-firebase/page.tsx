"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function TestFirebase() {
  const [status, setStatus] = useState<string>("Testing connection...");
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to add a document
        const testCollection = collection(db, "test_connection");
        await addDoc(testCollection, {
          timestamp: new Date(),
          message: "Firebase connection successful!",
        });

        setStatus("Write successful! Attempting to read...");

        // Try to read documents
        const querySnapshot = await getDocs(testCollection);
        const docs = querySnapshot.docs.map((doc) =>
          JSON.stringify(doc.data())
        );

        setData(docs);
        setStatus("Connection successful! Read/Write works.");
      } catch (error: any) {
        console.error("Firebase Error:", error);
        setStatus(`Error: ${error.message}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
      <div
        className={`p-4 rounded-md mb-4 ${
          status.includes("Error")
            ? "bg-red-100 text-red-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        Status: {status}
      </div>

      <h2 className="text-xl font-semibold mb-2">Data from Firestore:</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {data.length > 0 ? data.join("\n") : "No data found"}
      </pre>
    </div>
  );
}
