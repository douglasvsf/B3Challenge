# B3Challenge

Dashboard para consulta de preços de fechamento diário de ativos da B3 com visualização em gráfico interativo usando APIs públicas reais.

## 📋 Sobre o Projeto

Sistema full-stack desenvolvido como desafio técnico que permite consultar múltiplos ativos da B3 utilizando APIs públicas reais (Yahoo Finance e BRAPI). O frontend exibe os resultados em um gráfico de linhas responsivo com tema escuro neon, enquanto o backend integra-se com APIs públicas para buscar cotações históricas reais da B3.

## 🛠️ Tecnologias

### Frontend
- **React 19** com **TypeScript**
- **Tailwind CSS** para estilização
- **Recharts** para visualização de gráficos
- **Create React App** como base

### Backend
- **Node.js** com **Express** e **TypeScript**
- **Axios** para requisições HTTP
- **CORS** habilitado para comunicação com frontend
- **Nodemon** com **ts-node** para hot-reload em desenvolvimento
- **Jest** para testes unitários
- Integração com **Yahoo Finance API** e **BRAPI** para cotações reais

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
│   │   │   ├── index.ts     # Servidor e rotas da API
│   │   │   ├── controllers/ # Controllers
│   │   │   ├── services/    # Services (B3Service, BrapiService)
│   │   │   ├── routes/      # Rotas
│   │   │   └── types/       # Definições TypeScript
│   │   ├── tsconfig.json    # Configuração TypeScript
│   │   └── package.json
│   └── web/                 # Frontend React
│       ├── public/          # Arquivos estáticos
│       ├── src/
│       │   ├── components/ # Componentes React
│       │   │   ├── ChartSkeleton.tsx
│       │   │   ├── ErrorMessage.tsx
│       │   │   ├── ExportButtons.tsx
│       │   │   ├── HistoryPanel.tsx
│       │   │   ├── IndicatorsPanel.tsx
│       │   │   ├── PageHeader.tsx
│       │   │   ├── QuoteForm.tsx
│       │   │   └── QuoteResults.tsx
│       │   ├── hooks/       # Custom hooks
│       │   │   └── useRetry.ts
│       │   ├── logic/       # Lógica de negócio
│       │   │   └── quotes.ts
│       │   ├── types/       # Definições TypeScript
│       │   │   ├── errors.ts
│       │   │   └── quotes.ts
│       │   ├── utils/       # Utilitários
│       │   │   ├── export.ts
│       │   │   ├── history.ts
│       │   │   ├── indicators.ts
│       │   │   └── validation.ts
│       │   └── App.tsx      # Componente principal
│       └── package.json
├── package.json             # Configuração do monorepo
└── README.md
```

## 🎯 Funcionalidades

### Consulta e Visualização
- ✅ Consulta múltiplos ativos simultaneamente (ex: PETR4, VALE3)
- ✅ Seleção de API de cotações (Yahoo Finance ou BRAPI)
- ✅ Seleção de intervalo de datas (início e fim)
- ✅ Visualização em gráfico de linhas interativo com múltiplas séries
- ✅ Tema escuro com paleta neon personalizada
- ✅ Interface responsiva e moderna

### Indicadores Técnicos
- ✅ Variação percentual e absoluta (com cores indicativas)
- ✅ Preço atual, máxima e mínima do período
- ✅ Média móvel de 7 dias (MM7)
- ✅ Média móvel de 30 dias (MM30) quando disponível
- ✅ Formatação em R$ e percentual (pt-BR)

### Exportação de Dados
- ✅ Exportar gráfico para CSV (com encoding UTF-8)
- ✅ Exportar dados completos para JSON
- ✅ Download automático com nome baseado em data

### Histórico de Consultas
- ✅ Armazenamento local das últimas 10 consultas
- ✅ Histórico diferenciado por API selecionada
- ✅ Painel dropdown com consultas recentes
- ✅ Seleção rápida que preenche formulário e executa consulta automaticamente
- ✅ Formatação de data relativa ("Agora", "5 min atrás", etc.)
- ✅ Remoção individual ou limpeza completa do histórico

### Tratamento de Erros e Validação
- ✅ Validação de formulário em tempo real
- ✅ Validação de formato de tickers (AAAA11)
- ✅ Validação de intervalo de datas (mínimo 1 dia, máximo 365 dias)
- ✅ Mensagens de erro específicas e categorizadas
- ✅ Retry automático em falhas de rede (até 3 tentativas)
- ✅ Timeout de requisições (10 segundos)
- ✅ Skeleton screens durante carregamento
- ✅ Feedback visual em todos os estados (loading, erro, sucesso)

### Dados
- ✅ Cotações reais da B3 através de APIs públicas
- ✅ Suporte a Yahoo Finance (padrão)
- ✅ Suporte a BRAPI (API brasileira)
- ✅ Seleção de API pelo usuário

## 📝 Scripts Disponíveis

Na raiz do projeto:

- `npm run dev` - Inicia frontend e backend simultaneamente
- `npm run api` - Inicia apenas o backend
- `npm run web` - Inicia apenas o frontend
- `npm run web:build` - Gera build de produção do frontend

No diretório `apps/api`:
- `npm test` - Executa testes unitários
- `npm run test:watch` - Executa testes em modo watch
- `npm run test:coverage` - Gera relatório de cobertura de testes

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
Consulta preços reais de ativos da B3 através de APIs públicas.

**Query Parameters:**
- `tickers` (obrigatório): Lista de tickers separados por espaço ou vírgula (ex: `PETR4 VALE3`)
- `start` (obrigatório): Data inicial no formato `YYYY-MM-DD`
- `end` (obrigatório): Data final no formato `YYYY-MM-DD`
- `api` (opcional): API a ser utilizada (`yahoo` ou `brapi`). Padrão: `yahoo`

**Exemplo:**
```
GET /quotes?tickers=PETR4%20VALE3&start=2024-01-01&end=2024-01-07&api=yahoo
GET /quotes?tickers=PETR4%20VALE3&start=2024-01-01&end=2024-01-07&api=brapi
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

### Cores do Gráfico

As linhas do gráfico utilizam paletas variadas sem verde, incluindo:
- Vermelhos e Rosas
- Laranjas e Amarelos
- Azuis
- Roxos e Violetas

## 💡 Recursos Avançados

### Validação de Formulário
- Validação em tempo real dos campos
- Formato de ticker: AAAA11 (ex: PETR4, VALE3)
- Máximo de 10 tickers por consulta
- Intervalo de datas: mínimo 1 dia, máximo 365 dias
- Feedback visual com bordas coloridas em caso de erro

### Tratamento de Erros
- Categorização de erros (Rede, Validação, API, Desconhecido)
- Mensagens específicas e acionáveis
- Retry automático para erros de rede (3 tentativas com delay progressivo)
- Botão de retry manual em mensagens de erro
- Timeout de 10 segundos nas requisições

### Performance
- Memoização de cálculos pesados (indicadores, paletas)
- Skeleton screens para melhor percepção de carregamento
- Lazy loading de componentes quando aplicável
- Otimização de re-renders com React.memo e useMemo

### Acessibilidade
- Mensagens de erro com `role="alert"`
- Labels descritivos nos campos
- Navegação por teclado
- Contraste adequado em todos os elementos

## 📄 Licença

Este projeto foi desenvolvido como desafio técnico.

## 👤 Autor

Desenvolvido para o B3Challenge.

---

**Nota**: Este projeto utiliza APIs públicas reais (Yahoo Finance e BRAPI) para buscar cotações históricas da B3. Os dados retornados são valores reais de fechamento dos ativos negociados na bolsa brasileira.

