import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarRange,
  Users,
  Wallet,
  UtensilsCrossed,
  Building2,
} from "lucide-react";
import { FolhaSemana, DIAS_SEMANA, DiaSemana } from "@/types/folha";
import { Funcionario } from "@/types/funcionario";
import { Obra } from "@/types/obra";
import {
  obterSemanas,
  togglePresenca,
  valorRegistro,
  diasTrabalhados,
  resumoSemanaPorObra,
  totalSemana,
} from "@/services/folhaService";
import { obterFuncionarios } from "@/services/funcionarioService";
import { obterObras } from "@/services/obraService";
import { formatBRL } from "@/lib/format";

const FolhaSemanal = () => {
  const [semanas, setSemanas] = useState<FolhaSemana[]>([]);
  const [semanaId, setSemanaId] = useState<number | null>(null);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [obras, setObras] = useState<Obra[]>([]);
  const [tick, setTick] = useState(0); // força re-render após toggle

  useEffect(() => {
    const s = obterSemanas();
    setSemanas(s);
    setSemanaId(s[0]?.id ?? null);
    setFuncionarios(obterFuncionarios());
    obterObras().then(setObras);
  }, []);

  const semana = semanas.find((s) => s.id === semanaId);
  const nomeFunc = (id: number) => funcionarios.find((f) => f.id === id)?.nome ?? "—";
  const cargoFunc = (id: number) => funcionarios.find((f) => f.id === id)?.cargo ?? "";
  const nomeObra = (id: number) =>
    obras.find((o) => o.id === id)?.nome ?? `Obra ${id}`;

  const handleToggle = (funcionarioId: number, obraId: number, dia: DiaSemana) => {
    if (!semanaId) return;
    togglePresenca(semanaId, funcionarioId, obraId, dia);
    setSemanas(obterSemanas());
    setTick((t) => t + 1);
  };

  const obraIds = semana
    ? [...new Set(semana.registros.map((r) => r.obraId))]
    : [];

  const totalGeral = semana ? totalSemana(semana) : 0;
  const totalFunc = semana
    ? new Set(semana.registros.map((r) => r.funcionarioId)).size
    : 0;
  const totalQuentinhas = semana
    ? semana.despesas
        .filter((d) => d.descricao.toLowerCase().includes("quentinha"))
        .reduce((s, d) => s + d.valor, 0)
    : 0;

  return (
    <div className="space-y-6" key={tick}>
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CalendarRange className="h-6 w-6 text-primary" />
            Folha Semanal
          </h1>
          <p className="text-muted-foreground">
            Marque a presença e o pagamento é calculado automaticamente
          </p>
        </div>
        <Select
          value={semanaId ? String(semanaId) : ""}
          onValueChange={(v) => setSemanaId(Number(v))}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Selecione a semana" />
          </SelectTrigger>
          <SelectContent>
            {semanas.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                Semana {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* KPIs da semana */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Obras na semana</p>
              <p className="text-xl font-bold">{obraIds.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-construction/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-construction" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Funcionários</p>
              <p className="text-xl font-bold">{totalFunc}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-income/10 flex items-center justify-center">
              <UtensilsCrossed className="h-5 w-5 text-income" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quentinhas</p>
              <p className="text-xl font-bold">{formatBRL(totalQuentinhas)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-primary/30">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total a pagar</p>
              <p className="text-xl font-bold text-primary">{formatBRL(totalGeral)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blocos por obra */}
      {semana &&
        obraIds.map((obraId) => {
          const regs = semana.registros.filter((r) => r.obraId === obraId);
          const resumo = resumoSemanaPorObra(semana, obraId);
          const despesasObra = semana.despesas.filter((d) => d.obraId === obraId);
          return (
            <Card key={obraId} className="shadow-card overflow-hidden">
              <CardHeader className="bg-muted/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    {nomeObra(obraId)}
                  </CardTitle>
                  <Badge className="bg-primary text-primary-foreground">
                    {formatBRL(resumo.total)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="text-left font-medium px-4 py-2">Funcionário</th>
                        {DIAS_SEMANA.map((d, i) => (
                          <th key={i} className="px-1 py-2 w-9 text-center font-medium">
                            {d.label}
                          </th>
                        ))}
                        <th className="px-3 py-2 text-center font-medium">Dias</th>
                        <th className="px-4 py-2 text-right font-medium">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regs.map((reg) => (
                        <tr
                          key={reg.funcionarioId}
                          className="border-b last:border-0 hover:bg-muted/30"
                        >
                          <td className="px-4 py-2">
                            <div className="font-medium">{nomeFunc(reg.funcionarioId)}</div>
                            <div className="text-xs text-muted-foreground">
                              {cargoFunc(reg.funcionarioId)}
                            </div>
                          </td>
                          {DIAS_SEMANA.map((d) => {
                            const on = reg.presenca[d.key];
                            return (
                              <td key={d.key} className="px-1 py-2 text-center">
                                <button
                                  onClick={() =>
                                    handleToggle(reg.funcionarioId, obraId, d.key)
                                  }
                                  className={`w-7 h-7 rounded-md border text-xs font-semibold transition-colors ${
                                    on
                                      ? "bg-income text-white border-income"
                                      : "bg-background border-border text-muted-foreground hover:border-primary"
                                  }`}
                                  aria-label={`Presença ${d.key}`}
                                >
                                  {on ? "✓" : ""}
                                </button>
                              </td>
                            );
                          })}
                          <td className="px-3 py-2 text-center font-medium">
                            {diasTrabalhados(reg.presenca)}
                          </td>
                          <td className="px-4 py-2 text-right font-semibold text-income">
                            {formatBRL(valorRegistro(reg.funcionarioId, reg.presenca))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Despesas da obra na semana */}
                <div className="border-t bg-muted/20 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
                    <span className="text-muted-foreground font-medium">
                      Despesas da obra:
                    </span>
                    {despesasObra.map((d) => (
                      <span key={d.id} className="text-muted-foreground">
                        {d.descricao}{" "}
                        <span className="text-expense font-medium">
                          {formatBRL(d.valor)}
                        </span>
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-end gap-6 mt-2 text-sm">
                    <span>
                      Mão de obra:{" "}
                      <span className="font-semibold">{formatBRL(resumo.maoDeObra)}</span>
                    </span>
                    <span>
                      Despesas:{" "}
                      <span className="font-semibold text-expense">
                        {formatBRL(resumo.despesas)}
                      </span>
                    </span>
                    <span className="text-primary font-bold">
                      Total: {formatBRL(resumo.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

      {/* Total geral */}
      {semana && (
        <Card className="shadow-card bg-primary/5 border-primary/30">
          <CardContent className="p-4 flex items-center justify-between">
            <span className="font-semibold text-foreground">
              Total geral a pagar na semana {semana.label}
            </span>
            <span className="text-2xl font-bold text-primary">
              {formatBRL(totalGeral)}
            </span>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FolhaSemanal;
