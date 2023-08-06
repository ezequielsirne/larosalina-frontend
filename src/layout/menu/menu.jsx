const Menu = [
  { path: "/app", icon: "fas fa-home", title: "Inicio" },
  {
    path: "/app/reservas",
    icon: "fas fa-calendar-alt",
    title: "Reservas",
    children: [
      { path: "/app/calendario", title: "Calendario" },
      { path: "/app/reservas", title: "Ver Listado" },
      { path: "/app/reservas/enconflicto", title: "En Conflicto" },
    ],
  },
  { path: "/app/huespedes", icon: "fas fa-users", title: "Huespedes" },
  { path: "/app/gastos", icon: "fas fa-cart-arrow-down", title: "Gastos" },
  {
    path: "/app/movimientos",
    icon: "fas fa-dollar-sign",
    title: "Movimientos",
  },
  { path: "/app/informes", icon: "fas fa-info", title: "Informes" },
];

export default Menu;
