# Documentação Técnica - Átomo Quântico

## 1. Visão Geral
O Átomo Quântico é uma plataforma social de gratidão que utiliza gamificação para incentivar o bem-estar mental. O sistema registra "fótons" por interações positivas, permitindo a evolução de nível do usuário.

## 2. Arquitetura do Sistema

### 2.1 Frontend
- **React 19**: Utilização de hooks e padrões modernos de componentes funcionais.
- **Zustand**: Gerenciamento de estado global para o progresso do usuário (`userProgressStore`).
- **React Router 7**: Roteamento dinâmico com suporte a rotas protegidas (`PrivateRoute`).

### 2.2 Backend (Firebase)
- **Authentication**: Email/Senha e integração com Google (preparado).
- **Firestore**: 
  - `users`: Armazena fótons, streaks, nível e dados de perfil.
  - `entries`: Coleção de posts de gratidão.
  - `entries/{id}/likes`: Subcoleção para controle de curtidas únicas.
  - `entries/{id}/comments`: Subcoleção para as respostas dos posts.

## 3. Lógica de Gamificação

### Pontuação
- Criar Post: `+10 Fótons`
- Dar Curtida: `+1 Fóton`
- Comentar: `+3 Fótons`
- Receber Curtida: `+2 Fótons`

### Níveis (7 Estágios)
1. **Observador Quântico** (0+)
2. **Partícula Emergente** (30+)
3. **Núcleo Estável** (80+)
4. **Viajante Cósmico** (200+)
5. **Explorador Galáctico** (500+)
6. **Mestre da Coerência** (1000+)
7. **Entidade de Luz** (2500+)

## 4. UI Estilo Modern Feed (Twitter/X)
A interface foi redesenhada para focar na legibilidade:
- **GratitudeCard**: Componente reutilizável para exibição de posts com ações de like/comment integradas.
- **GratitudeInput**: Input minimalista no topo do feed para postagem rápida.
- **Optimistic UI**: Curtidas são refletidas na interface antes da conclusão da transação no banco de dados.

## 5. Deployment e PWA
- **Hosting**: Firebase Hosting.
- **Build Tool**: Vite (otimizado para produção).
- **Service Worker**: Gerado para suporte offline básico e instalação mobile.
