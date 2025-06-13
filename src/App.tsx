import { useState, useEffect } from "react"; // Asegúrate de importar useEffect
import { Table, type TableColumn } from "./components/table/Table";
import { Modal } from "./components/modal/Modal";
import { Sidebar, type MenuItem } from "./components/sidebar/Sidebar";

const formatDuration = (totalSeconds: number | undefined | null): string => {
  if (typeof totalSeconds !== "number" || totalSeconds < 0) {
    return "00:00:00";
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export default function Home() {
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: string;
    record: any | null;
    newData: any | null;
  }>({
    isOpen: false,
    type: "",
    record: null,
    newData: null,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeModule, setActiveModule] = useState("general");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://192.168.100.40:3000/api/v1/service-request",
          {
            method: "GET",
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.data && Array.isArray(result.data)) {
          // Mapear los datos de la API a la estructura que espera la tabla
          const formattedData = result.data.map((item: any) => ({
            id: item.id,
            room: item.roomNumber,
            huesped: item.guestName,
            fecha_estancia: `${item.checkInDate} - ${item.checkOutDate}`,
            hora_creacion: item.creationTime,
            hora_inicio: item.startTime,
            hora_finalizacion: item.completionTime,
            duracion: formatDuration(item.duration),
            departamento: item.department ? item.department.name : "-",
            requerimiento: item.requirement ? item.requirement.name : "-",
            tipo: item.requirementType ? item.requirementType.code : "-",
            solicitado: item.requestedByEmployeeName,
            asignado_a: item.assignedToEmployeeName,
            notas_huesped: item.guestNotes,
            comentario_atencion: item.serviceComments,
            callback: item.callbackNotes,
            realizo_llamada: item.callbackPerformedByEmployeeName,
          }));
          setTableData(formattedData);
        } else {
          setTableData([]);
          console.warn(
            "API response structure might be different than expected or data is empty.",
            result
          );
        }
      } catch (err) {
        console.error("Failed to fetch service requests:", err);
        setError(err instanceof Error ? err.message : String(err));
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: TableColumn[] = [
    { key: "room", title: "ROOM", width: "10%", sortable: true },
    { key: "huesped", title: "Huesped", width: "30%", sortable: true },
    {
      key: "fecha_estancia",
      title: "Fecha de Estancia",
      width: "50%",
      sortable: true,
      render: (value: any, record: any) => {
        if (typeof value !== "string" || !value) {
          return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>-</span>
              <span>-</span>
            </div>
          );
        }

        const parts = value.split(" - ");
        const checkIn = parts[0]?.trim() ?? "";
        const checkOut = parts[1]?.trim() ?? "";

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ textAlign: "left" }}>{checkIn}</div>
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
      render: (value: any, record: any) => (
        <span
          className="role-badge"
          style={{
            backgroundColor: getRolColor(value as string),
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
    },
    { key: "callback", title: "Callback", width: "20%", sortable: true },
    {
      key: "realizo_llamada",
      title: "Realizó Llamada",
      width: "20%",
      sortable: true,
    },
  ];

  const menuItems: MenuItem[] = [
    {
      id: "general",
      label: "General",
      icon: "🌎",
      children: [
        {
          id: "ays",
          label: "At Your Service",
          icon: "📋",
          onClick: () => setActiveModule("ays"),
        },
        {
          id: "graficoAys",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoAys"),
        },
      ],
    },
    {
      id: "aLl",
      label: "Ama de Llaves",
      icon: "🧴",
      children: [
        {
          id: "tablaALl",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaALl"),
        },
        {
          id: "graficoALl",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoALl"),
        },
      ],
    },
    {
      id: "bB",
      label: "Bell Boys",
      icon: "🛗",
      children: [
        {
          id: "tablaBB",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaBB"),
        },
        {
          id: "graficoBB",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoBB"),
        },
      ],
    },
    {
      id: "Doc",
      label: "Doctor",
      icon: "👨‍⚕️",
      children: [
        {
          id: "tablaD",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaD"),
        },
        {
          id: "graficoD",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoD"),
        },
      ],
    },
    {
      id: "HB",
      label: "HB",
      icon: "❔",
      children: [
        {
          id: "tablaHB",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaHB"),
        },
        {
          id: "graficoHB",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoHB"),
        },
      ],
    },
    {
      id: "Lav",
      label: "Lavandería",
      icon: "👚",
      children: [
        {
          id: "tablaLav",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaLav"),
        },
        {
          id: "graficoLav",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoLav"),
        },
      ],
    },
    {
      id: "Mantto",
      label: "Mantenimiento",
      icon: "👨‍🏭",
      children: [
        {
          id: "tablaMantto",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaMantto"),
        },
        {
          id: "graficoMantto",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoMantto"),
        },
      ],
    },
    {
      id: "MY",
      label: "Mayordomía",
      icon: "🤵",
      children: [
        {
          id: "tablaMY",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaMY"),
        },
        {
          id: "graficoMY",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoMY"),
        },
      ],
    },
    {
      id: "PV",
      label: "Prevención",
      icon: "🦺",
      children: [
        {
          id: "tablaPV",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaPV"),
        },
        {
          id: "graficoPV",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoPV"),
        },
      ],
    },
    {
      id: "QJ",
      label: "Quejas",
      icon: "📌",
      children: [
        {
          id: "tablaQJ",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaQJ"),
        },
        {
          id: "graficoQJ",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoQJ"),
        },
      ],
    },
    {
      id: "IT",
      label: "Sistemas",
      icon: "🖥️",
      children: [
        {
          id: "tablaIT",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaIT"),
        },
        {
          id: "graficoIT",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoIT"),
        },
      ],
    },
    {
      id: "SS",
      label: "SS",
      icon: "❔",
      children: [
        {
          id: "tablaSS",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaSS"),
        },
        {
          id: "graficoSS",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoSS"),
        },
      ],
    },
    {
      id: "Tel",
      label: "Teléfonos",
      icon: "☎️",
      children: [
        {
          id: "tablaTel",
          label: "Tabla",
          icon: "📋",
          onClick: () => setActiveModule("tablaTel"),
        },
        {
          id: "graficoTel",
          label: "Gráfico",
          icon: "📊",
          onClick: () => setActiveModule("graficoTel"),
        },
      ],
    },
    // {
    //   id: "dashboard",
    //   label: "Dashboard",
    //   icon: "📊",
    //   onClick: () => setActiveModule("dashboard"),
    // },
    // {
    //   id: "general",
    //   label: "General",
    //   icon: "🌎",
    //   onClick: () => setActiveModule("general"),
    // },
    // {
    //   id: "proyectos",
    //   label: "Proyectos",
    //   icon: "📁",
    //   onClick: () => setActiveModule("proyectos"),
    // },
    // {
    //   id: "configuracion",
    //   label: "Configuración",
    //   icon: "⚙️",
    //   children: [
    //     {
    //       id: "perfil",
    //       label: "Perfil de Usuario",
    //       icon: "👤",
    //       onClick: () => setActiveModule("perfil"),
    //     },
    //     {
    //       id: "seguridad",
    //       label: "Seguridad",
    //       icon: "🔒",
    //       onClick: () => setActiveModule("seguridad"),
    //     },
    //   ],
    // },
    // {
    //   id: "reportes",
    //   label: "Reportes",
    //   icon: "📈",
    //   children: [
    //     {
    //       id: "mensual",
    //       label: "Reporte Mensual",
    //       icon: "📅",
    //       onClick: () => setActiveModule("reporte-mensual"),
    //     },
    //     {
    //       id: "anual",
    //       label: "Reporte Anual",
    //       icon: "📆",
    //       onClick: () => setActiveModule("reporte-anual"),
    //     },
    //   ],
    // },
  ];

  // Función para obtener color según el tipo de requerimiento
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
        tableData.length > 0
          ? tableData.map((item: any) =>
              item.id === modal.record.id ? { ...item, ...modal.newData } : item
            )
          : []
      );
    }
    setModal({ isOpen: false, type: "", record: null, newData: null });
  };

  // Función para confirmar la eliminación
  const confirmDelete = () => {
    if (modal.record) {
      setTableData(
        tableData.filter((item: any) => item.id !== modal.record.id)
      );
    }
    setModal({ isOpen: false, type: "", record: null, newData: null });
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModal({ isOpen: false, type: "", record: null, newData: null });
  };

  // Función para manejar el toggle del sidebar
  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  const renderContent = () => {
    // Manejo de estados de carga y error
    if (loading) {
      return <p className="text-center py-10">Cargando datos...</p>;
    }
    if (error) {
      return (
        <p className="text-center py-10 text-red-500">
          Error al cargar datos: {error}
        </p>
      );
    }

    switch (activeModule) {
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
      case "ays": // Cambiado para reflejar el uso de 'ays' o 'general'
      case "general":
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">
              At Your Service / General
            </h2>
            {tableData.length > 0 ? (
              <Table
                columns={columns}
                data={tableData}
                hoverable
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <p className="text-center py-10">No hay datos disponibles.</p>
            )}
          </>
        );
      // ... (resto de tus cases de renderContent)
      default:
        // Si el activeModule es para una tabla, puedes generalizarlo
        // o mostrar la tabla "general" por defecto si es lo que deseas.
        // Aquí asumimos que si no es un caso especial, es una tabla.
        // Podrías tener un filtro en `fetchData` basado en `activeModule` si cada uno tiene su propio endpoint o filtro.
        if (
          activeModule.startsWith("tabla") ||
          [
            "ays",
            "tablaALl",
            "tablaBB",
            "tablaD",
            "tablaHB",
            "tablaLav",
            "tablaMantto",
            "tablaMY",
            "tablaPV",
            "tablaQJ",
            "tablaIT",
            "tablaSS",
            "tablaTel",
          ].includes(activeModule)
        ) {
          // Por ahora, todas las tablas muestran los mismos datos generales
          // En una implementación real, aquí filtrarías `tableData` o harías una nueva llamada a API
          // según `activeModule` si los datos fueran diferentes.
          const moduleName =
            menuItems
              .flatMap((m) => m.children || m)
              .find((sub) => sub.id === activeModule)?.label || activeModule;
          return (
            <>
              <h2 className="text-xl font-semibold mb-4">{moduleName}</h2>
              {tableData.length > 0 ? (
                <Table
                  columns={columns}
                  data={tableData} // Idealmente, filtrarías o tendrías datos específicos aquí
                  hoverable
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                <p className="text-center py-10">
                  No hay datos disponibles para {moduleName}.
                </p>
              )}
            </>
          );
        }
        return <p>Selecciona un módulo del menú</p>;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        items={menuItems}
        title="Sistema Admin"
        logo="🚀"
        onToggle={handleSidebarToggle}
      />

      <main className={`main-content ${isSidebarOpen ? "" : "sidebar-closed"}`}>
        <h1 className="text-2xl font-bold mb-6">Sistema de Administración</h1>
        <div className="content-container">{renderContent()}</div>
      </main>

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
