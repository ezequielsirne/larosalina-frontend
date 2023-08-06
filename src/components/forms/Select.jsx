import React, { useState } from "react";
import { Form } from "react-bootstrap";

function CustomSelect({
  options,
  defaultOption,
  onOptionChange,
  unselected = true,
  isInvalid,
}) {
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    if (typeof onOptionChange === "function") {
      onOptionChange(selectedValue);
    }
  };

  return (
    <Form.Select
      value={selectedOption}
      onChange={handleChange}
      isInvalid={isInvalid}
    >
      {unselected && <option value="">Seleccioná una opción...</option>}
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.descripcion}
        </option>
      ))}
    </Form.Select>
  );
}

export default CustomSelect;
