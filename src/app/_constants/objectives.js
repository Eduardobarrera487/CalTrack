// Opciones predefinidas para objetivos de los usuarios
// Estas opciones se usan para el cálculo de calorías y macronutrientes

export const OBJETIVO_OPTIONS = [
  {
    value: "perder_peso",
    label: "Perder peso",
    description: "Reducir peso corporal mediante déficit calórico"
  },
  {
    value: "mantener_peso", 
    label: "Mantener peso",
    description: "Conservar el peso actual con balance calórico"
  },
  {
    value: "ganar_peso",
    label: "Ganar peso", 
    description: "Aumentar peso corporal mediante superávit calórico"
  },
  {
    value: "ganar_musculo",
    label: "Ganar músculo",
    description: "Aumentar masa muscular con entrenamiento y nutrición adecuada"
  },
  {
    value: "definir_musculo",
    label: "Definir músculo",
    description: "Reducir grasa corporal manteniendo masa muscular"
  }
];

// Función auxiliar para obtener el valor de objetivo por su clave
export const getObjetivoByValue = (value) => {
  return OBJETIVO_OPTIONS.find(option => option.value === value);
};

// Función auxiliar para verificar si un objetivo implica perder peso
export const isObjetivoPerderPeso = (objetivo) => {
  return objetivo === "perder_peso" || objetivo === "definir_musculo";
};

// Función auxiliar para verificar si un objetivo implica ganar peso  
export const isObjetivoGanarPeso = (objetivo) => {
  return objetivo === "ganar_peso" || objetivo === "ganar_musculo";
};
