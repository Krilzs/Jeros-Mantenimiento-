import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useRouter } from "next/router";

export default function Home() {
  const { user, loading } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>{user ? <h2>Hola {user.email}</h2> : <p>No estás logueado</p>}</div>
  );
}
