import { useEffect } from "react";

export default function LogOut({ onLogout }: { onLogout: () => void }) {
  useEffect(() => {
    localStorage.removeItem("token");
    onLogout();
  }, [onLogout]);
  return (
    <>
      <h1>LogOut Page</h1>
    </>
  );
}
