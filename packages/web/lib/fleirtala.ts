const fleirtala = (tala: number, eintala: string, fleirala: string) => {
  if (tala === 11) return fleirala;
  if (tala % 10 === 1) return eintala;
  return fleirala;
};

export default fleirtala;
