import { useState, useEffect, useRef } from "react";
import "./Drawer.css";

export type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  children?: MenuItem[];
};

type DrawerProps = {
  items: MenuItem[];
  title?: string;
  logo?: React.ReactNode;
  defaultOpen?: boolean;
  onNavigate?: (item: MenuItem) => void;
};

export const Drawer: React.FC<DrawerProps> = ({
  items,
  title = "Navegación",
  logo,
  defaultOpen = true,
  onNavigate,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const drawerRef = useRef<HTMLDivElement>(null);

  // Cierra el drawer en pantallas pequeñas cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        window.innerWidth <= 768 &&
        isOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubmenu = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children && item.children.length > 0) {
      toggleSubmenu(item.id);
    } else {
      if (item.onClick) {
        item.onClick();
      }
      if (onNavigate) {
        onNavigate(item);
      }
      // En pantallas pequeñas, cerrar el drawer después de la navegación
      if (window.innerWidth <= 768) {
        setIsOpen(false);
      }
    }
  };

  const renderMenuItems = (menuItems: MenuItem[], level = 0) => {
    return menuItems.map((item) => (
      <div key={item.id} className={`menu-item-container level-${level}`}>
        <div
          className={`menu-item ${
            item.children && expandedItems[item.id] ? "expanded" : ""
          }`}
          onClick={() => handleItemClick(item)}
        >
          {item.icon && <span className="menu-icon">{item.icon}</span>}
          <span className="menu-label">{item.label}</span>
          {item.children && item.children.length > 0 && (
            <span className="submenu-indicator">
              {expandedItems[item.id] ? "▼" : "▶"}
            </span>
          )}
        </div>
        {item.children && expandedItems[item.id] && (
          <div className="submenu">
            {renderMenuItems(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      {isOpen && <div className="drawer-backdrop" onClick={toggleDrawer}></div>}
      <div className={`drawer ${isOpen ? "open" : "closed"}`} ref={drawerRef}>
        <div className="drawer-header">
          {logo && <div className="drawer-logo">{logo}</div>}
          <h2 className="drawer-title">{title}</h2>
          <button className="drawer-toggle" onClick={toggleDrawer}>
            {isOpen ? "×" : "☰"}
          </button>
        </div>
        <div className="drawer-content">{renderMenuItems(items)}</div>
      </div>
      <button className="drawer-toggle-button" onClick={toggleDrawer}>
        {isOpen ? "×" : "☰"}
      </button>
    </>
  );
};
