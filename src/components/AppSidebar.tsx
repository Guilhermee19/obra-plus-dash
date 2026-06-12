import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  HardHat,
  Users,
  Building2,
  TrendingUp,
  Settings,
  CalendarRange,
  UserCog,
  FileText,
  Wallet,
  FileSpreadsheet,
  Truck,
} from "lucide-react";

const menuGroups = [
  {
    label: "Operação",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Obras", url: "/obras", icon: HardHat },
      { title: "Orçamentos", url: "/orcamentos", icon: FileSpreadsheet },
      { title: "Clientes", url: "/clientes", icon: Users },
    ],
  },
  {
    label: "RH / Mão de obra",
    items: [
      { title: "Funcionários", url: "/funcionarios", icon: UserCog },
      { title: "Folha Semanal", url: "/folha-semanal", icon: CalendarRange },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { title: "Notas Fiscais", url: "/notas-fiscais", icon: FileText },
      { title: "Financeiro", url: "/financeiro", icon: Wallet },
      { title: "Fornecedores / PIX", url: "/fornecedores", icon: Truck },
      { title: "Relatórios", url: "/relatorios", icon: TrendingUp },
    ],
  },
  {
    label: "Sistema",
    items: [{ title: "Configurações", url: "/configuracoes", icon: Settings }],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { open } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar className="w-64" collapsible="icon">
      <SidebarContent className="bg-card border-r">
        {/* Logo */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-construction rounded-lg flex items-center justify-center">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            {open && (
              <div>
                <h2 className="font-bold text-sm text-foreground">ObrasPro</h2>
                <p className="text-xs text-muted-foreground">Gestão Inteligente</p>
              </div>
            )}
          </div>
        </div>

        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="px-2 py-2">
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isActive(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={`
                            flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                            ${active
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "hover:bg-accent hover:text-accent-foreground"
                            }
                          `}
                        >
                          <item.icon className="h-5 w-5" />
                          {open && <span className="font-medium">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
