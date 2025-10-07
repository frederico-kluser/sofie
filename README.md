# 🎓 Sofie - Professor de Matemática com IA

## 📋 Visão Geral

Sofie é um tutor inteligente de matemática que combina o poder dos LLMs para explicação pedagógica com a precisão computacional de bibliotecas matemáticas especializadas. Este projeto implementa uma POC (Proof of Concept) de um sistema de tutoria matemática que evita as alucinações comuns em IA através da separação rigorosa entre raciocínio pedagógico (LLM) e cálculos matemáticos (Math.js).

## 🎯 Objetivo Principal

Criar uma POC funcional **SEM BACKEND** de um professor de matemática IA que:
- **Nunca erra cálculos** através da separação LLM/Math.js
- **Ensina através do método socrático** ao invés de dar respostas diretas
- **Renderiza matemática elegantemente** com LaTeX
- **Interage por voz** usando Whisper API
- **Visualiza conceitos** com gráficos interativos

## 🚀 Roadmap da POC

### 📅 Fase 1: Foundation (Semana 1)
**Meta:** Transformar o chat atual em um assistente matemático preciso

#### 1.1 Arquitetura e Dependências ✅
- [x] Análise do código existente
- [x] Migrar de Create React App para Vite (performance)
- [x] Instalar dependências core:
  ```bash
  npm install mathjs katex react-katex zustand @tanstack/react-query
  npm install react-markdown remark-math rehype-katex
  npm install recharts mafs
  ```

#### 1.2 Math.js Integration
- [ ] Criar serviço `mathEngine.js` para todos os cálculos
- [ ] Implementar parser de expressões matemáticas
- [ ] Adicionar suporte para:
  - Aritmética básica e avançada
  - Álgebra simbólica
  - Cálculo diferencial/integral
  - Matrizes e vetores
  - Números complexos

#### 1.3 Renderização LaTeX com KaTeX
- [ ] Configurar react-markdown com plugins matemáticos
- [ ] Criar componente `MathDisplay` para equações
- [ ] Normalizar output LaTeX do LLM
- [ ] Adicionar suporte inline e display mode

### 📅 Fase 2: Pedagogia Inteligente (Semana 2)
**Meta:** Implementar metodologia socrática e scaffolding

#### 2.1 Sistema de Prompts Pedagógicos
- [ ] Criar `tutorPrompts.js` com:
  - System prompt socrático principal
  - Templates para diferentes tipos de problemas
  - Detector de misconceptions comuns
- [ ] Implementar Chain-of-Thought (CoT) estruturado
- [ ] Adicionar parsing de passos com marcadores `[CALC:]`

#### 2.2 Sistema de Hints Progressivos
- [ ] Implementar 5 níveis de hints:
  1. Metacognitive prompts
  2. Strategic hints
  3. Conceptual clarification
  4. Worked example parcial
  5. Bottom-out (último recurso)
- [ ] Criar componente `HintPanel` interativo
- [ ] Adicionar timer de "struggle time" mínimo

#### 2.3 Tracking de Progresso
- [ ] Implementar store Zustand para:
  - Histórico de problemas
  - Taxa de acertos/erros
  - Padrões de misconceptions
  - Tempo por problema
- [ ] Criar dashboard de métricas do aluno

### 📅 Fase 3: Interface Rica (Semana 3)
**Meta:** UI/UX otimizada para aprendizado matemático

#### 3.1 Redesign da Interface
- [ ] Migrar para layout de tutoria (não chat)
- [ ] Criar áreas distintas:
  - Problema atual
  - Workspace do aluno
  - Painel de hints
  - Visualizações
- [ ] Implementar tema educacional clean

#### 3.2 Visualizações Matemáticas
- [ ] Integrar Recharts para:
  - Gráficos de funções
  - Estatísticas
  - Progressão de aprendizado
- [ ] Adicionar Mafs para:
  - Geometria interativa
  - Sistemas de coordenadas
  - Animações matemáticas

#### 3.3 Input Matemático Avançado
- [ ] Criar `EquationEditor` com:
  - Paleta de símbolos matemáticos
  - Preview LaTeX em tempo real
  - Atalhos de teclado
- [ ] Adicionar reconhecimento de escrita (opcional)

### 📅 Fase 4: Voz e Interatividade (Semana 4)
**Meta:** Interação natural por voz mantendo precisão

#### 4.1 Melhorias no STT (Speech-to-Text)
- [ ] Otimizar Whisper para vocabulário matemático
- [ ] Adicionar comandos de voz:
  - "calcule..." → Math.js
  - "mostre o gráfico..." → visualização
  - "próximo passo" → hint
- [ ] Implementar correção contextual

#### 4.2 Text-to-Speech Educacional
- [ ] Integrar TTS para:
  - Ler problemas em voz alta
  - Narrar soluções passo-a-passo
  - Feedback verbal encorajador
- [ ] Adicionar controle de velocidade

#### 4.3 Modo de Prática Adaptativa
- [ ] Banco de problemas categorizados
- [ ] Algoritmo de seleção adaptativa
- [ ] Geração procedural de variações

## 🏗️ Arquitetura Técnica

### Estrutura de Diretórios
```
sofie/
├── src/
│   ├── components/
│   │   ├── math/
│   │   │   ├── MathDisplay.jsx      # Renderização LaTeX
│   │   │   ├── EquationEditor.jsx   # Input matemático
│   │   │   └── Calculator.jsx       # Interface Math.js
│   │   ├── tutor/
│   │   │   ├── ProblemView.jsx      # Display do problema
│   │   │   ├── HintPanel.jsx        # Sistema de hints
│   │   │   ├── WorkSpace.jsx        # Área de trabalho
│   │   │   └── ProgressTracker.jsx  # Métricas
│   │   ├── visualizations/
│   │   │   ├── FunctionGraph.jsx    # Gráficos Recharts
│   │   │   └── GeometryCanvas.jsx   # Geometria Mafs
│   │   └── voice/
│   │       ├── VoiceRecorder.jsx    # Gravação otimizada
│   │       └── AudioPlayer.jsx      # TTS player
│   ├── services/
│   │   ├── mathEngine.js            # Math.js wrapper
│   │   ├── openaiService.js         # API calls
│   │   ├── tutorService.js          # Lógica pedagógica
│   │   └── voiceService.js          # STT/TTS
│   ├── stores/
│   │   ├── tutorStore.js            # Estado global Zustand
│   │   └── sessionStore.js          # Sessão atual
│   ├── prompts/
│   │   ├── systemPrompts.js         # Prompts principais
│   │   ├── hintTemplates.js         # Templates de hints
│   │   └── misconceptions.js        # Base de erros comuns
│   └── utils/
│       ├── latexParser.js           # Normalização LaTeX
│       ├── mathParser.js            # Parser expressões
│       └── validators.js            # Validações
```

### Fluxo de Dados Crítico

```javascript
// PADRÃO FUNDAMENTAL: Separação LLM vs Cálculo

// ❌ ERRADO - LLM calculando
const response = await askGPT("Quanto é 17 * 23?");
// Resultado: Pode errar (391, 381, 401...)

// ✅ CORRETO - LLM explica, Math.js calcula
const explanation = await askGPT("Explique como multiplicar 17 * 23");
const result = math.evaluate('17 * 23'); // Sempre 391
const combined = formatResponse(explanation, result);
```

### Sistema de Prompts

```javascript
const SOCRATIC_SYSTEM_PROMPT = `
Você é um tutor de matemática socrático que NUNCA dá respostas diretas.

REGRAS FUNDAMENTAIS:
1. NUNCA calcule - use [CALC: expressão] para Math.js processar
2. Guie através de perguntas, não respostas
3. Detecte e corrija misconceptions imediatamente
4. Use LaTeX para todas as expressões: $inline$ ou $$display$$
5. Forneça hints progressivos, nunca a solução completa

QUANDO O ALUNO ERRA:
- Reconheça o esforço
- Identifique a misconception
- Faça uma pergunta guia
- Forneça um hint se necessário

FORMATO DE RESPOSTA:
- Máximo 2-3 frases por vez
- Sempre termine com pergunta
- Marque cálculos com [CALC: ...]
- Use $LaTeX$ para matemática
`;
```

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- API Key da OpenAI
- Navegador moderno com suporte a MediaRecorder

### Setup Rápido

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/sofie.git
cd sofie

# Instale dependências
npm install

# Configure variáveis de ambiente
echo "VITE_OPENAI_API_KEY=sua-key-aqui" > .env.local

# Inicie o desenvolvimento
npm run dev
```

## 📊 Métricas de Sucesso da POC

### Técnicas
- ✅ 100% precisão em cálculos (via Math.js)
- ✅ <5s latência para respostas
- ✅ 95%+ accuracy na transcrição de voz
- ✅ Renderização LaTeX em <50ms

### Pedagógicas
- ✅ 70%+ problemas resolvidos em ≤5 interações
- ✅ <15% de respostas diretas (telling)
- ✅ 80%+ correção de misconceptions
- ✅ Progressão mensurável de dificuldade

### Experiência
- ✅ Interface intuitiva sem tutorial
- ✅ Feedback visual imediato
- ✅ Suporte a múltiplos tipos de problemas
- ✅ Personalização por nível do aluno

## 🚫 Limitações da POC (Sem Backend)

### Segurança
- ⚠️ API Key exposta no cliente (apenas para POC!)
- ⚠️ Sem autenticação de usuários
- ⚠️ Sem rate limiting próprio

### Persistência
- ⚠️ Dados apenas em localStorage
- ⚠️ Sem backup ou sincronização
- ⚠️ Histórico limitado ao dispositivo

### Escalabilidade
- ⚠️ Custos de API por cliente
- ⚠️ Sem cache compartilhado
- ⚠️ Processing no navegador

## 🔄 Próximos Passos (Pós-POC)

1. **Backend Seguro**
   - Proxy para API Keys
   - Autenticação JWT
   - Rate limiting
   - Cache Redis

2. **Banco de Dados**
   - PostgreSQL para dados estruturados
   - Vector DB para RAG
   - Analytics warehouse

3. **Features Avançadas**
   - Multi-agent para problemas complexos
   - RAG com livros didáticos
   - Modo colaborativo
   - API para escolas

4. **Mobile & Desktop**
   - React Native app
   - Electron desktop
   - PWA otimizada

## 📚 Referências Técnicas

### Bibliotecas Core
- [Math.js](https://mathjs.org/) - Motor computacional
- [KaTeX](https://katex.org/) - Renderização LaTeX
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Recharts](https://recharts.org/) - Visualizações
- [Mafs](https://mafs.dev/) - Matemática interativa

### Papers & Research
- Zhang & Graf (2025) - "LLM Accuracy in Mathematical Reasoning"
- Carnegie Mellon KLI Framework - Metodologia pedagógica
- OpenAI Whisper Papers - Otimização para vocabulário técnico

### Implementações de Referência
- Khan Academy Khanmigo - Tutor socrático puro
- Carnegie Learning LiveHint - 25 anos de dados
- Photomath - Interface de input matemático

## 🤝 Contribuindo

Este é um projeto educacional open-source. Contribuições são bem-vindas!

### Como Contribuir
1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Áreas Prioritárias
- 🧮 Novos tipos de problemas matemáticos
- 🎨 Melhorias de UI/UX
- 🌍 Traduções e localização
- 📊 Novas visualizações
- 🧪 Testes e validação pedagógica

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

## 🙏 Agradecimentos

- OpenAI pela API e Whisper
- Comunidade Math.js
- Pesquisadores em ITS (Intelligent Tutoring Systems)
- Todos os educadores que inspiram este projeto

---

**🎯 Missão:** Democratizar o acesso a tutoria matemática de qualidade através de IA pedagógicamente sólida e computacionalmente precisa.

**💡 Visão:** Um mundo onde cada estudante tem acesso a um tutor personalizado, paciente e sempre disponível.

**🔧 Status:** POC em desenvolvimento ativo - junte-se a nós!