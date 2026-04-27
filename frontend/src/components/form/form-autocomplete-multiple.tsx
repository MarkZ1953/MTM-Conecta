import { useEffect, useState } from "react";
import {
  AutoComplete,
  type AutoCompleteCompleteEvent,
} from "primereact/autocomplete";

interface Country {
  name: string;
  code: string;
}

// Servicio simulado
const CountryService = {
  getCountries: async (): Promise<Country[]> => {
    return [
      { name: "Argentina", code: "AR" },
      { name: "Brasil", code: "BR" },
      { name: "Colombia", code: "CO" },
      { name: "Chile", code: "CL" },
      { name: "Perú", code: "PE" },
      { name: "México", code: "MX" },
      { name: "España", code: "ES" },
      { name: "Estados Unidos", code: "US" },
    ];
  },
};

export default function UIAutoCompleteMultiple() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  const search = (event: AutoCompleteCompleteEvent) => {
    setTimeout(() => {
      let _filteredCountries: Country[];

      if (!event.query.trim().length) {
        _filteredCountries = [...countries];
      } else {
        _filteredCountries = countries.filter((country) =>
          country.name.toLowerCase().startsWith(event.query.toLowerCase()),
        );
      }

      setFilteredCountries(_filteredCountries);
    }, 250);
  };

  useEffect(() => {
    CountryService.getCountries().then((data) => setCountries(data));
  }, []);

  return (
    <div className="card p-fluid">
      <AutoComplete
        field="name"
        multiple
        value={selectedCountries}
        suggestions={filteredCountries}
        completeMethod={search}
        onChange={(e) => setSelectedCountries(e.value)}
        placeholder="Selecciona países"
      />
    </div>
  );
}
