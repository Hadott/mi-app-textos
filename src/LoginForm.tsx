import React, { useState } from "react";
import { config } from "./config";

type LoginFormProps = {
  onLogin: (token: string) => void;
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [sendUser, setSendUser] = useState(true);
  const [sendPass, setSendPass] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
    const body: Record<string, string> = {};
    if (sendUser) body.username = username;
    if (sendPass) body.password = password;
   ;
   console.log("Enviando datos de login:", body);

    //POST
    const res = await fetch(config.backend.loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || "Error al hacer login");
    }

  
    const data = await res.json();
    if (data && data.exito === true) {
      onLogin('token-fake'); 
    } else {
      throw new Error('Credenciales incorrectas o respuesta inesperada');
    }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 10 }}>
        <label>
          Usuario:{" "}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="checkbox"
            checked={sendUser}
            onChange={(e) => setSendUser(e.target.checked)}
            disabled={loading}
          />{" "}
          Enviar
        </label>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          Contraseña:{" "}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="checkbox"
            checked={sendPass}
            onChange={(e) => setSendPass(e.target.checked)}
            disabled={loading}
          />{" "}
          Enviar
        </label>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

      {error && (
        <div style={{ marginTop: 10, color: "red" }}>
          Error: {error}
        </div>
      )}

    </form>
  );
}
