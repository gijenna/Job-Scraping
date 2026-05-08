import { useEffect, useState } from "react";
import { ImpersonationBanner } from "./ImpersonationBanner";
import { consumeImpersonationToken } from "@/lib/connect-session";

interface Props {
  children: React.ReactNode;
}

export const ImpersonationGate = ({ children }: Props) => {
  const [ready, setReady] = useState(false);
  const [impersonated, setImpersonated] = useState(false);
  useEffect(() => {
    (async () => {
      const used = await consumeImpersonationToken();
      setImpersonated(used);
      setReady(true);
    })();
  }, []);
  if (!ready) return null;
  return (
    <>
      {impersonated && <ImpersonationBanner />}
      {children}
    </>
  );
};

export default ImpersonationGate;
