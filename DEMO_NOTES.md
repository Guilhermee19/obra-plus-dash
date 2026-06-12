# Demo ARF — o que foi adicionado

Modelo **visual / demo, sem back-end** (tudo em `localStorage`, seguindo o padrão dos seus `services`). A integração Supabase continua no projeto, porém **dormente** — nenhuma tela depende dela.

## Telas novas
| Rota | Página | Origem (planilha) |
|---|---|---|
| `/funcionarios` | Cadastro da equipe com cargo, diária, encargos, quentinha e PIX | DIÁRIA DE FUNCIONÁRIOS |
| `/folha-semanal` | Folha do RH: marca presença por dia → calcula pagamento por obra | 2025/2026 Despesa da Semana |
| `/notas-fiscais` | Notas emitidas por ARF/Manu, competência e "a receber" | ARF/Manu Notas fiscais |
| `/financeiro` | Caixa/extratos (ARF e Manu), despesas mensais e empréstimos | Extratos, Despesas mensais, Empréstimo |

## Arquivos criados
- `src/types/`: `funcionario.ts`, `folha.ts`, `financeiro.ts`
- `src/services/`: `funcionarioService.ts`, `folhaService.ts`, `financeiroService.ts` (todos com **seed** de dados de demonstração)
- `src/pages/`: `Funcionarios.tsx`, `FolhaSemanal.tsx`, `NotasFiscais.tsx`, `Financeiro.tsx`
- `src/lib/format.ts`: helpers `formatBRL` / `formatData`

## Arquivos alterados
- `src/App.tsx`: novas rotas
- `src/components/AppSidebar.tsx`: menu agrupado (Operação · RH · Financeiro · Sistema)
- `public/dados-obras.json`: reseed com obras reais da ARF (São Conrado, Aterro do Flamengo, Leblon, etc.) + transações

## Importante sobre os dados
Os dados da demo são **representativos** — **não** uso os CPFs e chaves PIX reais das planilhas (privacidade/LGPD). Os números de PIX são fictícios (`(21) 9 0000-000X`). Os dados reais entram depois via importação.

> Para "zerar" a demo (recarregar os seeds), limpe o `localStorage` do navegador (DevTools → Application → Local Storage → limpar). As chaves usadas: `dados-obras`, `clientes_data`, `funcionarios_data`, `folha_semanal_data`, `notas_fiscais_data`, `despesas_mensais_data`, `emprestimos_data`, `caixa_data`.

## Como rodar localmente
```bash
npm i
npm run dev
```

## Como levar para a Lovable
Como a Lovable sincroniza com o GitHub, basta os arquivos chegarem ao repo `obra-plus-dash`:
```bash
# dentro de C:\GuiDev\obra-plus-dash (seu clone)
# copie por cima os arquivos deste zip e:
git add .
git commit -m "feat: módulos RH (folha semanal), funcionários, notas fiscais e financeiro (demo visual)"
git push
```
A Lovable vai puxar o commit automaticamente.
