import { useState } from "react";
import "./Sidebar.css";

export type MenuItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  children?: MenuItem[];
};

type SidebarProps = {
  items: MenuItem[];
  title?: string;
  logo?: React.ReactNode;
  defaultOpen?: boolean;
  onNavigate?: (item: MenuItem) => void;
  onToggle?: (isOpen: boolean) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  title = "Navegación",
  logo,
  defaultOpen = true,
  onNavigate,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) {
      onToggle(newState);
    }
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
          {isOpen && <span className="menu-label">{item.label}</span>}
          {item.children && item.children.length > 0 && isOpen && (
            <span className="submenu-indicator">
              {expandedItems[item.id] ? "▼" : "▶"}
            </span>
          )}
        </div>
        {item.children && expandedItems[item.id] && isOpen && (
          <div className="submenu">
            {renderMenuItems(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isOpen ? "◀" : "▶"}
        </button>
        {isOpen && (
          <>
            {logo && <div className="sidebar-logo">{logo}</div>}
            <h2 className="sidebar-title">{title}</h2>
          </>
        )}
      </div>
      <div className="sidebar-content">{renderMenuItems(items)}</div>
    </div>
  );
};
