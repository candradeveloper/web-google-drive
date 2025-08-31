import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function DriveSearchApp() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const folderId = process.env.REACT_APP_GOOGLE_FOLDER_ID;
const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  const searchFiles = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+name+contains+'${query}'&key=${apiKey}&fields=files(id,name,mimeType,webViewLink,iconLink)`
      );
      const data = await res.json();
      setResults(data.files || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-6"
        >
          🔍 Cari File di Google Drive
        </motion.h1>
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Masukkan nama file..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-gray-700 border-none text-white"
          />
          <Button onClick={searchFiles} disabled={loading}>
            {loading ? "Mencari..." : <Search className="w-5 h-5" />}
          </Button>
        </div>

        <div className="grid gap-4">
          {results.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <img src={file.iconLink} alt="icon" className="w-6 h-6" />
                    <span className="text-lg font-medium">{file.name}</span>
                  </div>
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Buka
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
