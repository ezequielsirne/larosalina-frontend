import React from "react";
import { Row, Col, Form } from "react-bootstrap";

function HuespedForm({ huesped, reserva, setReserva, required, title }) {
  const handleChange = (e, field) =>
    setReserva({
      ...reserva,
      huespedes: [
        ...reserva.huespedes.slice(0, huesped), // Mantener los huéspedes anteriores sin cambios
        {
          ...reserva.huespedes[huesped], // Copiar el huésped actual
          [field]: e.target.value, // Actualizar el campo específico del huésped actual
        },
        ...reserva.huespedes.slice(huesped + 1), // Mantener los huéspedes siguientes sin cambios
      ],
    });

  return (
    <Row>
      <Form.Group as={Col} md="3">
        <Form.Label>{title}:</Form.Label>
        <Form.Control
          required={required}
          type="text"
          value={reserva.huespedes[huesped].nombre_apellido}
          onChange={(e) => handleChange(e, "nombre_apellido")}
        />
      </Form.Group>
      <Form.Group as={Col} md="3">
        <Form.Label>DNI:</Form.Label>
        <Form.Control
          type="text"
          value={reserva.huespedes[huesped].dni}
          onChange={(e) => handleChange(e, "dni")}
        />
      </Form.Group>
      <Form.Group as={Col} md="3">
        <Form.Label>Domicilio:</Form.Label>
        <Form.Control
          type="text"
          value={reserva.huespedes[huesped].domicilio}
          onChange={(e) => handleChange(e, "domicilio")}
        />
      </Form.Group>
      <Form.Group as={Col} md="3">
        <Form.Label>Patente:</Form.Label>
        <Form.Control
          type="text"
          value={reserva.huespedes[huesped].patente}
          onChange={(e) => handleChange(e, "patente")}
        />
      </Form.Group>
    </Row>
  );
}

export default HuespedForm;
