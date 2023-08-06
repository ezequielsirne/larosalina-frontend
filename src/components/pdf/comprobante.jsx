import React from "react";
import { Document, Page, Text, View, Image, Font } from "@react-pdf/renderer";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "http://larosalinaresort.com.ar/Fonts/Helvetica.ttf" },
    {
      src: "http://larosalinaresort.com.ar/Fonts/Helvetica-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

const styles = {
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingTop: 30,
    paddingLeft: 80,
    paddingRight: 80,
    paddingBotton: 60,
  },
  imageCell: {
    width: "30%",
  },
  titleCell: {
    width: "70%",
    paddingLeft: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: "normal",
    fontFamily: "Helvetica",
    textAlign: "right",
    marginBottom: 10,
  },
  data: {
    fontSize: 11,
    fontFamily: "Helvetica",
    textAlign: "right",
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
  },
  footerCell: {
    width: "50%",
  },
  footerText: {
    fontSize: 10,
    fontFamily: "Helvetica",
    marginBottom: 5,
  },
};

const PdfComponent = ({ dt }) => {
  const ArmarTituloComprobante = () => (
    <View style={{ ...styles.titleCell, paddingLeft: 0 }}>
      <Text style={styles.title}>COMPROBANTE DE RESERVA</Text>
      <Text style={styles.data}>
        info@larosalinaresort.com.ar +54 9 11 2405-2681
      </Text>
      <Text style={styles.data}>
        Ruta 40 (ex 200) km 63.500 - Gral Las Heras - Bs. As
      </Text>
      <Text style={styles.data}>La Rosalina Resort</Text>
    </View>
  );

  const ArmarDatos = () => {
    const {
      id,
      nombre_apellido,
      checkin,
      checkout,
      noches,
      adultos,
      menores,
      mascotas,
      total,
      saldo,
    } = dt;

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(value);
    };

    const formatGuests = () => {
      let guests = `${adultos} adulto/s`;
      if (menores > 0) guests += ` - ${menores} menor/es`;
      if (mascotas > 0) guests += ` - ${mascotas} mascota/s`;
      return guests;
    };

    return (
      <View style={{ ...styles.titleCell, paddingLeft: 0 }}>
        <Text style={styles.data}>
          Reserva: {id.toString().padStart(6, "0")}
        </Text>
        <Text style={styles.data}>A nombre de: {nombre_apellido}</Text>
        <Text style={styles.data}>
          Check-in: {formatDate(checkin)}{" "}
          {new Date(checkin).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          / Check-out: {formatDate(checkout)}{" "}
          {new Date(checkout).toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        <Text style={styles.data}>Noches: {noches}</Text>
        <Text style={styles.data}>Huéspedes: {formatGuests()}</Text>
        <Text style={styles.data}>Total: {formatCurrency(total)}</Text>
        <Text style={styles.data}>Saldo: {formatCurrency(saldo)}</Text>
      </View>
    );
  };

  const Mascotas = () => (
    <View style={styles.footerCell}>
      <Text style={styles.footerText}>MASCOTAS</Text>
      <Text style={styles.footerText}>
        Presentar el certificado de vacunación antirrábica (inferior a un año)
      </Text>
      <Text style={styles.footerText}>
        Deben permanecer con correa siempre que estén fuera del departamento.
      </Text>
      <Text style={styles.footerText}>
        Los animales no pueden ingresar a la pileta.
      </Text>
      <Text style={styles.footerText}>
        Cada dueño será responsable de limpiar las necesidades de su mascota.
      </Text>
    </View>
  );

  const PoliticaCancelacion = () => (
    <View style={styles.footerCell}>
      <Text style={styles.footerText}>POLÍTICA DE CANCELACIÓN</Text>
      <Text style={styles.footerText}>
        Hasta 7 días antes de tu reserva reprogramamos tu estadía, sujeto a
        disponibilidad.
      </Text>
      <Text style={styles.footerText}>
        Dentro de los 7 días previos a tu reserva solo se reprogramará por
        razones de fuerza mayor.
      </Text>
      <Text style={styles.footerText}>
        No se reprogramarán estadías por mal tiempo.
      </Text>
      <Text style={styles.footerText}>La seña no se reintegra.</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A5" orientation="landscape" style={styles.page}>
        <View style={styles.imageCell}>
          <Image src="/assets/img/logo/Logo-La-Rosalina-Gris.png" />
        </View>
        <ArmarTituloComprobante />
        {/* <ArmarDatos />
        <View style={styles.footer}>
          <PoliticaCancelacion />
          <Mascotas />
        </View> */}
      </Page>
    </Document>
  );
};

export default PdfComponent;
