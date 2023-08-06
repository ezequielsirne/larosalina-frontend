import React from "react";

//Pages
import Login from "../pages/Login";
import ProtectedRoutes from "../pages/ProtectedRoutes";
import Home from "../pages/Home";
import ReservasCalendar from "../pages/Reservas/ReservasCalendar";
import ReservasCalendarioNueva from "../pages/Reservas/ReservasCalendarioNueva";
import ReservasListado from "../pages/Reservas/ReservasListado";
import ReservasEnConflicto from "../pages/Reservas/ReservasEnConflicto";
import ReservasNueva from "../pages/Reservas/ReservasNueva";
import ReservasDetalle from "../pages/Reservas/ReservasDetalle";
import ReservasDetalleComprobantes from "../pages/Reservas/ReservasDetalleComprobantes";
import ReservasPagoNuevo from "../pages/Reservas/ReservasPagoNuevo";
import HuespedesListado from "../pages/Huespedes/HuespedesListado";
import HuespedesNuevo from "../pages/Huespedes/HuespedesNuevo";
import HuespedesDetalle from "../pages/Huespedes/HuespedesDetalle";
import GastosListado from "../pages/Gastos/GastosListado";
import GastosNuevo from "../pages/Gastos/GastosNuevo";
import GastosDetalle from "../pages/Gastos/GastosDetalle";
import GastosDetalleComprobantes from "../pages/Gastos/GastosDetalleComprobantes";
import MovimientosListado from "../pages/Movimientos/MovimientosListado";
import MovimientosDetalle from "../pages/Movimientos/MovimientosDetalle";
import MovimientosDetalleComprobantes from "../pages/Movimientos/MovimientosDetalleComprobantes";
import InformesGeneral from "../pages/Informes/InformesGeneral";

// Const
export const PROTECTED = "/app";
export const LOGIN = "/";

const routes = [
  {
    path: LOGIN,
    title: "Iniciar sesión",
    component: () => <Login />,
  },
  {
    path: PROTECTED,
    title: "Inicio",
    component: () => <ProtectedRoutes />,
    children: [
      {
        path: "",
        title: "Inicio",
        component: () => <Home />,
      },
      {
        path: "calendario",
        title: "Reservas",
        component: () => <ReservasCalendar />,
      },
      {
        path: "calendario/:idReserva",
        title: "Detalle Reserva",
        component: () => <ReservasDetalle />,
      },
      {
        path: "calendario/nueva",
        title: "Nueva Reserva",
        component: () => <ReservasCalendarioNueva />,
      },
      {
        path: "reservas",
        title: "Reservas",
        component: () => <ReservasListado />,
      },
      {
        path: "reservas/nueva",
        title: "Nueva Reserva",
        component: () => <ReservasNueva />,
      },
      {
        path: "reservas/:idReserva",
        title: "Detalle Reserva",
        component: () => <ReservasDetalle />,
      },
      {
        path: "reservas/enconflicto",
        title: "Nuevo Pago",
        component: () => <ReservasEnConflicto />,
      },
      {
        path: "reservas/enconflicto/:idReserva",
        title: "Detalle Reserva",
        component: () => <ReservasDetalle />,
      },
      {
        path: "reservas/:idReserva/pago/:idReserva",
        title: "Nuevo Pago",
        component: () => <ReservasPagoNuevo />,
      },
      {
        path: "reservas/:idReserva/pagos/:idMovimiento",
        title: "Detalle Pago",
        component: () => <MovimientosDetalle />,
      },
      {
        path: "reservas/:idReserva/pagos/comprobantes/:idMovimiento",
        title: "Detalle Pago",
        component: () => <MovimientosDetalleComprobantes />,
      },
      {
        path: "reservas/comprobantes/:idReserva",
        title: "Comprobantes de Reserva",
        component: () => <ReservasDetalleComprobantes />,
      },
      {
        path: "reservas/:idReserva/huespedes/:idHuesped",
        title: "Detalle Huesped",
        component: () => <HuespedesDetalle />,
      },
      {
        path: "reservas/:idReserva/huesped/:idReserva",
        title: "Nuevo Huesped",
        component: () => <HuespedesNuevo />,
      },
      {
        path: "huespedes",
        title: "Huespedes",
        component: () => <HuespedesListado />,
      },
      {
        path: "huespedes/:idHuesped",
        title: "Detalle Huesped",
        component: () => <HuespedesDetalle />,
      },
      {
        path: "gastos",
        title: "Gastos",
        component: () => <GastosListado />,
      },
      {
        path: "gastos/nuevo",
        title: "Nuevo Gasto",
        component: () => <GastosNuevo />,
      },
      {
        path: "gastos/:idGasto",
        title: "Detalle Gasto",
        component: () => <GastosDetalle />,
      },
      {
        path: "gastos/comprobantes/:idGasto",
        title: "Comprobantes del Gasto",
        component: () => <GastosDetalleComprobantes />,
      },
      {
        path: "movimientos",
        title: "Movimientos",
        component: () => <MovimientosListado />,
      },
      {
        path: "movimientos/:idMovimiento",
        title: "Detalle Movimiento",
        component: () => <MovimientosDetalle />,
      },
      {
        path: "movimientos/comprobantes/:idMovimiento",
        title: "Detalle Movimiento",
        component: () => <MovimientosDetalleComprobantes />,
      },
      {
        path: "informes",
        title: "Informe General",
        component: () => <InformesGeneral />,
      },
      // Puedes agregar más rutas protegidas aquí
    ],
  },
];

export default routes;
