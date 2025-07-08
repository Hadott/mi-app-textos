import React, { useEffect, useState } from "react";
import { config } from "./config";

type Text = {
  id: string;
  contenido: string;
};

type TextViewerProps = {
  token: string;
  onLogout: () => void;
};


const misTextos = [
  "Me gustó mucho este curso ya que aprendí a hacer una aplicación web tanto como backend como frontend.",
  "Lamentablemente no pude aprender al maximo ni uno ni el otro si no que a media los dos.",
  "Quizás si hubiera tenido más tiempo podría haber aprendido más.",
];

export function TextViewer({ token, onLogout }: TextViewerProps) {
  const [texts, setTexts] = useState<Text[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showMisTextos, setShowMisTextos] = useState(false);

  async function fetchTexts() {
    setLoading(true);
    setError(null);

    try {
      // Traemos textos del backend
      const res = await fetch(config.backend.textUrl, {
        headers: {
          Authorization: `Bearer ${token}`, // si tu backend usa token Bearer
        },
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Error al obtener textos");
      }

      // Suponemos que backend devuelve un array de textos con id y contenido
      const data: Text[] = await res.json();

      setTexts(data);
      setCurrentIndex(0);
      setShowMisTextos(false);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTexts();
  }, []);

  async function handleLogout() {
    try {
      await fetch(config.backend.logoutUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // ignoramos error logout
    }
    onLogout();
  }

  function nextText() {
    if (currentIndex < texts.length - 1) setCurrentIndex(currentIndex + 1);
  }

  return (
    <div>
      <h2>Textos del backend</h2>

      {loading && <p>Cargando textos...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {!loading && !error && texts.length === 0 && (
        <p>No hay textos para mostrar.</p>
      )}

      {!loading && !error && texts.length > 0 && !showMisTextos && (
        <div>
          <p
            style={{
              border: "1px solid #ddd",
              padding: 10,
              minHeight: 100,
              whiteSpace: "pre-wrap",
              backgroundColor: "#f9f9f9",
            }}
          >
            {texts[currentIndex].contenido}
          </p>

          <button
            onClick={nextText}
            disabled={currentIndex === texts.length - 1}
          >
            Siguiente texto
          </button>
        </div>
      )}

      {/* Botón para mostrar textos propios */}
      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowMisTextos(!showMisTextos)}>
          {showMisTextos ? "Volver a textos backend" : "Mostrar mis textos"}
        </button>
      </div>

      {/* Mostrar textos propios */}
      {showMisTextos && (
        <div style={{ marginTop: 10 }}>
          <h3>Mis textos escritos</h3>
          <ol>
            {misTextos.map((txt, i) => (
              <li key={i} style={{ marginBottom: 10 }}>
                {txt}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}
