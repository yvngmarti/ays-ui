import { useState, useEffect } from "react";
import { Table, type TableColumn } from "./components/table/Table"; // Asegúrate que TableColumn permita render
import { Modal } from "./components/modal/Modal";
import { Drawer, type MenuItem } from "./components/drawer/Drawer";

export default function Home() {
  // Estado para los datos de la tabla
  const [tableData, setTableData] = useState([
    {
      id: "1", // Añadido id para que funcione la edición/eliminación
      room: "4810",
      huesped: "MARTIN",
      fecha_estancia: "6 abril - 10 de abril",
      hora_creacion: "16:45:00",
      hora_inicio: "16:50:00",
      hora_finalizacion: "17:00:00",
      duracion: "00:10:00",
      departamento: "ESTILISTA",
      requerimiento: "BATA DE ADULTO",
      tipo: "E",
      solicitado: "MARTINfsffdfs",
      asignado_a: "MARTIN",
      notas_huesped: "HPD SOLICITA BATA DE BAÑO",
      comentario_atencion: "DIANA REALIZA ENTREGA DE PLANCHA",
      callback: "HPD NO CONTESTA LLAMADA",
      realizo_llamada: "MARTIN",
    },
    {
      id: "2", // Añadido id
      room: "4810",
      huesped: "MARTIN",
      fecha_estancia: "6 abril - 10 de abril",
      // ... (resto de datos para el segundo objeto)
      hora_creacion: "16:45:00",
      hora_inicio: "16:50:00",
      hora_finalizacion: "17:00:00",
      duracion: "00:10:00",
      departamento: "ESTILISTA",
      requerimiento: "BATA DE ADULTO",
      tipo: "E",
      solicitado: "MARTINfsffdfs",
      asignado_a: "MARTIN",
      notas_huesped: "HPD SOLICITA BATA DE BAÑO",
      comentario_atencion: "DIANA REALIZA ENTREGA DE PLANCHA",
      callback: "HPD NO CONTESTA LLAMADA",
      realizo_llamada: "MARTIN",
    },
    // Añade IDs únicos a todos los objetos de tableData si vas a usar editar/eliminar
    {
      id: "3",
      room: "4810",
      huesped: "MARTIN",
      fecha_estancia: "6 abril - 10 de abril",
      hora_creacion: "16:45:00",
      hora_inicio: "16:50:00",
      hora_finalizacion: "17:00:00",
      duracion: "00:10:00",
      departamento: "ESTILISTA",
      requerimiento: "BATA DE ADULTO",
      tipo: "E",
      solicitado: "MARTINfsffdfs",
      asignado_a: "MARTIN",
      notas_huesped: "HPD SOLICITA BATA DE BAÑO",
      comentario_atencion: "DIANA REALIZA ENTREGA DE PLANCHA",
      callback: "HPD NO CONTESTA LLAMADA",
      realizo_llamada: "MARTIN",
    },
    {
      id: "4",
      room: "4810",
      huesped: "MARTIN",
      fecha_estancia: "6 abril - 10 de abril",
      hora_creacion: "16:45:00",
      hora_inicio: "16:50:00",
      hora_finalizacion: "17:00:00",
      duracion: "00:10:00",
      departamento: "ESTILISTA",
      requerimiento: "BATA DE ADULTO",
      tipo: "E",
      solicitado: "MARTINfsffdfs",
      asignado_a: "MARTIN",
      notas_huesped: "HPD SOLICITA BATA DE BAÑO",
      comentario_atencion: "DIANA REALIZA ENTREGA DE PLANCHA",
      callback: "HPD NO CONTESTA LLAMADA",
      realizo_llamada: "MARTIN",
    },
  ]);

  // Estado para el modal
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: string;
    record: any | null; // Asegúrate que 'any' coincida con la estructura de tus datos
    newData: any | null;
  }>({
    isOpen: false,
    type: "",
    record: null,
    newData: null,
  });

  // Estado para el drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  // Estado para el módulo activo
  const [activeModule, setActiveModule] = useState("empleados");

  // Efecto para detectar cambios en el drawer
  useEffect(() => {
    const handleDrawerChange = () => {
      const drawerElement = document.querySelector(".drawer");
      if (drawerElement) {
        setIsDrawerOpen(drawerElement.classList.contains("open"));
      }
    };

    const observer = new MutationObserver(handleDrawerChange);
    const drawerElement = document.querySelector(".drawer");

    if (drawerElement) {
      observer.observe(drawerElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Definición de columnas
  const columns: TableColumn[] = [
    { key: "room", title: "ROOM", width: "10%", sortable: true },
    { key: "huesped", title: "Huesped", width: "30%", sortable: true },
    {
      key: "fecha_estancia",
      title: "Fecha de Estancia",
      width: "50%", // Este ancho es para la celda completa que contendrá ambas fechas
      sortable: true, // Ordenará por el string completo "checkIn - checkOut"
      render: (value: any, record: any) => {
        // value es record.fecha_estancia
        // Asegurarse que value es un string y no está vacío
        if (typeof value !== "string" || !value) {
          return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>-</span>
              <span>-</span>
            </div>
          );
        }

        const parts = value.split(" - ");
        const checkIn = parts[0]?.trim() ?? ""; // Fecha de check-in
        const checkOut = parts[1]?.trim() ?? ""; // Fecha de check-out

        // Usamos un div con flexbox para mostrar las dos fechas separadas
        // dentro de la misma celda de la tabla.
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Div para la fecha de check-in */}
            <div style={{ textAlign: "left" }}>{checkIn}</div>
            {/* Div para la fecha de check-out */}
            <div style={{ textAlign: "left" }}>{checkOut}</div>
          </div>
        );
      },
    },
    {
      key: "hora_creacion",
      title: "Hora de Creación",
      width: "20%",
      sortable: true,
    },
    {
      key: "hora_inicio",
      title: "Hora de Inicio",
      width: "20%",
      sortable: true,
    },
    {
      key: "hora_finalizacion",
      title: "Hora de Finalización",
      width: "20%",
      sortable: true,
    },
    { key: "duracion", title: "Duración", width: "20%", sortable: true },
    {
      key: "departamento",
      title: "Departamento",
      width: "20%",
      sortable: true,
    },
    {
      key: "requerimiento",
      title: "Requerimiento",
      width: "20%",
      sortable: true,
    },
    {
      key: "tipo",
      title: "Tipo",
      width: "25%",
      sortable: true,
      render: (
        value: any,
        record: any // Explicit 'any' or specific type
      ) => (
        <span
          className="role-badge"
          style={{
            backgroundColor: getRolColor(value as string), // Assert value as string if sure
            padding: "4px 8px",
            borderRadius: "4px",
            color: "white",
            fontSize: "0.85em",
          }}
        >
          {value}
        </span>
      ),
    },
    { key: "solicitado", title: "Solicitado", width: "20%", sortable: true },
    { key: "asignado_a", title: "Asignado a", width: "20%", sortable: true },
    {
      key: "notas_huesped",
      title: "Notas de Huésped",
      width: "20%",
      sortable: true,
    },
    {
      key: "comentario_atencion",
      title: "Comentario Atención",
      width: "20%",
      sortable: true,
    }, // Eliminada la columna duplicada de aquí
    { key: "callback", title: "Callback", width: "20%", sortable: true },
    {
      key: "realizo_llamada",
      title: "Realizó Llamada",
      width: "20%",
      sortable: true,
    },
  ];

  // Elementos del menú para el drawer
  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      onClick: () => setActiveModule("dashboard"),
    },
    {
      id: "empleados",
      label: "Empleados",
      icon: "👥",
      onClick: () => setActiveModule("empleados"),
    },
    {
      id: "proyectos",
      label: "Proyectos",
      icon: "📁",
      onClick: () => setActiveModule("proyectos"),
    },
    {
      id: "configuracion",
      label: "Configuración",
      icon: "⚙️",
      children: [
        {
          id: "perfil",
          label: "Perfil de Usuario",
          icon: "👤",
          onClick: () => setActiveModule("perfil"),
        },
        {
          id: "seguridad",
          label: "Seguridad",
          icon: "🔒",
          onClick: () => setActiveModule("seguridad"),
        },
      ],
    },
    {
      id: "reportes",
      label: "Reportes",
      icon: "📈",
      children: [
        {
          id: "mensual",
          label: "Reporte Mensual",
          icon: "📅",
          onClick: () => setActiveModule("reporte-mensual"),
        },
        {
          id: "anual",
          label: "Reporte Anual",
          icon: "📆",
          onClick: () => setActiveModule("reporte-anual"),
        },
      ],
    },
  ];

  // Función para obtener color según rol
  const getRolColor = (tipo: string) => {
    switch (tipo) {
      case "E":
        return "#4caf50";
      case "F":
        return "#2196f3";
      case "I":
        return "#9c27b0";
      case "S":
        return "#ff9800";
      case "SP":
        return "#795548";
      default:
        return "#607d8b";
    }
  };

  // Función para manejar la edición de una fila
  const handleEdit = (oldData: any, newData: any) => {
    setModal({
      isOpen: true,
      type: "edit",
      record: oldData,
      newData: newData,
    });
  };

  // Función para manejar la eliminación de una fila
  const handleDelete = (record: any) => {
    setModal({
      isOpen: true,
      type: "delete",
      record: record,
      newData: null,
    });
  };

  // Función para confirmar la edición
  const confirmEdit = () => {
    if (modal.record && modal.newData) {
      setTableData(
        tableData.map(
          (
            item: any // Explicitly type item if possible
          ) =>
            item.id === modal.record.id ? { ...item, ...modal.newData } : item // Spread item for safety
        )
      );
    }
    setModal({ isOpen: false, type: "", record: null, newData: null });
  };

  // Función para confirmar la eliminación
  const confirmDelete = () => {
    if (modal.record) {
      setTableData(
        tableData.filter((item: any) => item.id !== modal.record.id)
      ); // Explicitly type item
    }
    setModal({ isOpen: false, type: "", record: null, newData: null });
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModal({ isOpen: false, type: "", record: null, newData: null });
  };

  // Renderizar el contenido según el módulo activo
  const renderContent = () => {
    switch (activeModule) {
      case "empleados":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Gestión de Empleados</h2>
            <Table
              columns={columns}
              data={tableData}
              hoverable
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        );
      // ... (resto de los cases para renderContent)
      case "dashboard":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p>
                Aquí iría el contenido del dashboard con gráficos y
                estadísticas.
              </p>
            </div>
          </>
        );
      case "proyectos":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Gestión de Proyectos</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p>Aquí iría la lista de proyectos y su gestión.</p>
            </div>
          </>
        );
      case "perfil":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Perfil de Usuario</h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p>Configuración del perfil de usuario.</p>
            </div>
          </>
        );
      case "seguridad":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              Configuración de Seguridad
            </h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p>Ajustes de seguridad y permisos.</p>
            </div>
          </>
        );
      case "reporte-mensual":
      case "reporte-anual":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {activeModule === "reporte-mensual"
                ? "Reporte Mensual"
                : "Reporte Anual"}
            </h2>
            <div className="bg-gray-100 p-6 rounded-lg">
              <p>Visualización de reportes y estadísticas.</p>
            </div>
          </>
        );
      default:
        return <p>Selecciona un módulo del menú</p>;
    }
  };

  // Función para manejar cambios en el drawer (si la usas para algo más)
  // const handleDrawerToggle = (open: boolean) => {
  //   setIsDrawerOpen(open);
  // };

  return (
    <div className="app-container">
      <Drawer items={menuItems} title="Sistema Admin" logo="🚀" />

      <main className={`main-content ${isDrawerOpen ? "" : "drawer-closed"}`}>
        <h1 className="text-2xl font-bold mb-6">Sistema de Administración</h1>

        <div className="content-container">{renderContent()}</div>
      </main>

      {/* Modal de confirmación */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.type === "edit" ? confirmEdit : confirmDelete}
        title={
          modal.type === "edit" ? "Confirmar Edición" : "Confirmar Eliminación"
        }
        message={
          modal.type === "edit"
            ? "¿Estás seguro de que deseas guardar los cambios?"
            : "¿Estás seguro de que deseas eliminar este registro?"
        }
        confirmText={modal.type === "edit" ? "Guardar" : "Eliminar"}
      />
    </div>
  );
}
