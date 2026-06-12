import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Obras from "./pages/Obras";
import ObraDetalhes from "./pages/ObraDetalhes";
import Clientes from "./pages/Clientes";
import Funcionarios from "./pages/Funcionarios";
import FolhaSemanal from "./pages/FolhaSemanal";
import NotasFiscais from "./pages/NotasFiscais";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="obras" element={<Obras />} />
              <Route path="obras/:id" element={<ObraDetalhes />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="funcionarios" element={<Funcionarios />} />
              <Route path="folha-semanal" element={<FolhaSemanal />} />
              <Route path="notas-fiscais" element={<NotasFiscais />} />
              <Route path="financeiro" element={<Financeiro />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
