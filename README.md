# B3Challenge

Dashboard mockado para consulta de preços de fechamento diário de ativos da B3 com visualização em gráfico interativo.

## 📋 Sobre o Projeto

Sistema full-stack desenvolvido como desafio técnico que permite consultar múltiplos ativos da B3 simulando preços de fechamento diário. O frontend exibe os resultados em um gráfico de linhas responsivo com tema escuro neon, enquanto o backend fornece uma API mockada que gera dados determinísticos para demonstração.

## 🛠️ Tecnologias

### Frontend
- **React 19** com **TypeScript**
- **Tailwind CSS** para estilização
- **Recharts** para visualização de gráficos
- **Create React App** como base

### Backend
- **Node.js** com **Express**
- **CORS** habilitado para comunicação com frontend
- **Nodemon** para hot-reload em desenvolvimento

### Infraestrutura
- **Monorepo** com npm workspaces
- **Concurrently** para executar frontend e backend simultaneamente

## 📦 Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** (geralmente vem com Node.js)

## 🚀 Como Executar

### 1. Clone o repositório

```bash
git clone https://github.com/douglasvsf/B3Challenge.git
cd B3Challenge
```

### 2. Instale as dependências

Na raiz do projeto, execute:

```bash
npm install
```

Este comando instalará automaticamente as dependências de todos os workspaces (`apps/web` e `apps/api`).

### 3. Execute o projeto

#### Opção 1: Executar frontend e backend juntos (recomendado)

```bash
npm run dev
```

Isso iniciará:
- **Backend API** em `http://localhost:3001`
- **Frontend React** em `http://localhost:3000` (abre automaticamente no navegador)

#### Opção 2: Executar separadamente

**Backend apenas:**
```bash
npm run api
```

**Frontend apenas:**
```bash
npm run web
```

### 4. Acesse a aplicação

Abra seu navegador em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
B3Challenge/
├── apps/
│   ├── api/                 # Backend Express
│   │   ├── src/
│   │   │   └── index.js     # Servidor e rotas da API
│   │   └── package.json
│   └── web/                 # Frontend React
│       ├── public/          # Arquivos estáticos
│       ├── src/
│       │   ├── components/ # Componentes React
│       │   ├── logic/       # Lógica de negócio
│       │   ├── types/       # Definições TypeScript
│       │   └── App.tsx      # Componente principal
│       └── package.json
├── package.json             # Configuração do monorepo
└── README.md
```

## 🎯 Funcionalidades

- ✅ Consulta múltiplos ativos simultaneamente (ex: PETR4, VALE3)
- ✅ Seleção de intervalo de datas (início e fim)
- ✅ Visualização em gráfico de linhas interativo
- ✅ Tema escuro com paleta neon
- ✅ Interface responsiva
- ✅ Dados mockados determinísticos para demonstração

## 📝 Scripts Disponíveis

Na raiz do projeto:

- `npm run dev` - Inicia frontend e backend simultaneamente
- `npm run api` - Inicia apenas o backend
- `npm run web` - Inicia apenas o frontend
- `npm run web:build` - Gera build de produção do frontend

## 🔌 API Endpoints

### GET `/health`
Retorna status da API.

**Resposta:**
```json
{
  "status": "ok"
}
```

### GET `/quotes`
Consulta preços mockados de ativos.

**Query Parameters:**
- `tickers` (obrigatório): Lista de tickers separados por espaço ou vírgula (ex: `PETR4 VALE3`)
- `start` (obrigatório): Data inicial no formato `YYYY-MM-DD`
- `end` (obrigatório): Data final no formato `YYYY-MM-DD`

**Exemplo:**
```
GET /quotes?tickers=PETR4%20VALE3&start=2024-01-01&end=2024-01-07
```

**Resposta:**
```json
{
  "tickers": ["PETR4", "VALE3"],
  "range": {
    "start": "2024-01-01",
    "end": "2024-01-07"
  },
  "series": [
    {
      "ticker": "PETR4",
      "points": [
        { "date": "2024-01-01", "close": 52.34 },
        { "date": "2024-01-02", "close": 53.12 }
      ]
    }
  ]
}
```

## 🎨 Paleta de Cores

O projeto utiliza um tema escuro com as seguintes cores:

- **Primária**: `#00E6B0` (Verde neon)
- **Secundária**: `#00B894` (Verde escuro)
- **Fundo principal**: `#000000` (Preto)
- **Fundo secundário**: `#0A0A0A` (Preto suave)
- **Texto**: `#E5E5E5` (Cinza claro)
- **Destaques**: `#1EFFD2` (Verde neon claro)

## 📄 Licença

Este projeto foi desenvolvido como desafio técnico.

## 👤 Autor

Desenvolvido para o B3Challenge.

---

**Nota**: Este projeto utiliza dados mockados para fins de demonstração. Os preços gerados são determinísticos baseados no ticker e data, mas não representam valores reais da B3.

