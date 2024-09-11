// Función para convertir la fecha en formato dd/mm/yyyy a ISO 8601 (que es el formato aceptado por Prisma)
export const convertDateToISO = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return new Date(`${year}-${month}-${day}T00:00:00.000Z`); // Fecha en formato ISO con hora a medianoche (UTC)
};
