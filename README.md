# AutoDash React Local

Projeto React pronto para rodar localmente, sem Base44.

## O que esse projeto entrega

- Dashboard público em `/`
- Área administrativa em `/admin`
- Cadastro de nova automação em `/admin/add`
- Gráficos com Recharts
- Persistência local no navegador usando `localStorage`
- Reset dos dados de exemplo

## Requisitos

- Node.js 18 ou superior

## Como rodar

```bash
npm install
npm run dev
```

Depois, abra no navegador:

```bash
http://localhost:5173
```

## Como gerar build

```bash
npm run build
```

## Observação

Os dados ficam salvos no navegador do computador que abrir o projeto. Se depois você quiser colocar isso em servidor interno com banco real, o próximo passo é trocar o `localStorage` por API + banco.
