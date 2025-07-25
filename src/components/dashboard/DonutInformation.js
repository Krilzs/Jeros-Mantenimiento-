import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { fetchEstadoClientes, fetchPagosDelMes } from "@/services/clients";

const COLORS = ["#e53e3e", "#007700"]; // azul y rojo

const DonutCharts = () => {
  const [estadosClientes, setEstadosClientes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesData = await fetchEstadoClientes();

        setEstadosClientes(clientesData);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Flex
      direction={{ base: "column" }}
      backgroundColor={"#eee"}
      gap={8}
      width={"fit-content"}
      justify="center"
      align="center"
      p={6}
    >
      {/* Donut de Clientes */}
      <Box textAlign="center">
        <Text fontWeight="bold" mb={2}>
          Clientes Totales :{" "}
          {estadosClientes.reduce((acc, curr) => acc + curr.value, 0)}
        </Text>
        <PieChart width={300} height={300}>
          <Pie
            data={estadosClientes}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label
          >
            {estadosClientes.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </Box>
    </Flex>
  );
};

export default DonutCharts;
