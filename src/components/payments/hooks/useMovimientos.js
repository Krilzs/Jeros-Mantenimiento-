import { useEffect, useState } from "react";
import { getData } from "@/utils/utils";

export const useMovimientos = () => {
  const [pagos, setPagos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMovimientos = async () => {
    setIsLoading(true);
    const pagosData = await getData("/api/payments/getAllPagos");
    const gastosData = await getData("/api/gastos/getAllGastos");
    setPagos(pagosData);
    setGastos(gastosData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMovimientos();
  }, []);

  return { pagos, gastos, isLoading };
};