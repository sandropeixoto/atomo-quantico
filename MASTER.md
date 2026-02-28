# Master Design System & UI Patterns - Átomo Quântico

Este documento define os padrões visuais e comportamentais (UX/UI) adotados para garantir a consistência do projeto.

## 🎨 Paleta de Cores (Theme 4.0)

Baseado em um ambiente espacial quântico:
- **Background**: `#0D0B1A` (Profundo, reduz fadiga visual).
- **Primary (Cards)**: `#1A1829` (Sutilmente mais claro que o fundo).
- **Secondary (Acento Principal)**: `#9F50FF` (Violeta vibrante).
- **Accent (Destaque)**: `#00E5FF` (Azul neon para interações quânticas).
- **Text Primary**: `#FFFFFF`.
- **Text Secondary**: `#B0B0B0`.

## 🏗️ Padrões de Layout

### 1. Grid e Max-Width
- **Desktop**: Conteúdo centralizado com `max-w-7xl` ou `max-w-3xl` para feeds focados.
- **Mobile**: Layout **Edge-to-Edge** (`px-2` ou `px-1`) para maximizar o espaço de leitura.

### 2. Cards (GratitudeCard)
- Bordas arredondadas: `rounded-2xl`.
- Border: `1px solid gray-800`.
- Hover: Escurecimento ou brilho sutil `hover:bg-white/[0.02]`.

## 🖱️ Micro-Interações

- **Tap Feedback**: Botões interativos devem usar `whileTap={{ scale: 0.8 }}`.
- **Transições de Página**: Uso de `Framer Motion` para entradas suaves.
- **Reward Animation**: Ganho de fótons deve ser visualizado com animações flutuantes ascendentes.

## ⌨️ Inputs e Formulários

- **Criação de Post**: Estilo Twitter (sem bordas internas, focado na tipografia).
- **Botões**: `rounded-full` com tipografia em negrito (`font-bold`).

## 📱 Mobile-First Rules

1.  **Toque**: Área mínima de clique de `44x44px`.
2.  **Back Button**: Sempre presente em páginas internas no canto superior esquerdo.
3.  **Scroll**: Sticky Header com transparência ou cor sólida opaca para manter contexto.
