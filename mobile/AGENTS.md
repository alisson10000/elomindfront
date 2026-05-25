# AGENTS.md

## Visão geral do projeto

Aplicativo mobile construído com Expo e React Native, usando `expo-router` para navegação baseada em arquivos. O projeto possui fluxos separados para autenticação, cliente e terapeuta.

O app se comunica com uma API HTTP própria via `axios`, usa `AsyncStorage` para persistência local e integra notificações push do Expo.

Na arquitetura atual:

- autenticação e sessão foram centralizadas em `lib/session.ts`, `lib/auth.ts` e `lib/auth-routes.ts`
- a camada de serviços e contratos foi organizada em `lib/services/` e `lib/types/`
- rotas estáticas frequentes foram centralizadas em `constants/routes.ts`
- componentes base reutilizáveis foram padronizados em `components/`
- existe estrutura inicial de testes automatizados com Jest e React Native Testing Library
- a limpeza de template removeu arquivos não referenciados e reduziu logs de debug excessivos

Não identificado no projeto:

- uso ativo de Firebase em código de aplicação
- Redux
- Zustand
- Context API para estado global
- `babel.config.*`
- `metro.config.*`
- `app.config.*`

## Stack principal

- Expo (`expo`)
- React Native
- React 19
- TypeScript
- Expo Router (`expo-router`)
- React Navigation (indiretamente, via Expo Router e dependências `@react-navigation/*`)
- Axios
- AsyncStorage (`@react-native-async-storage/async-storage`)
- Expo Notifications
- Expo EAS Build
- Jest
- React Native Testing Library

## Estrutura de pastas

- `app/`: rotas e telas do app com convenção do `expo-router`
- `app/(auth)/`: login, convite, recuperação de senha e consentimento LGPD
- `app/(client)/`: fluxo do cliente
- `app/(client)/(tabs)/`: abas principais do cliente
- `app/(therapist)/`: fluxo do terapeuta
- `app/(therapist)/(tabs)/`: abas principais do terapeuta
- `components/`: componentes reutilizáveis de UI
- `components/__tests__/`: testes de componentes base
- `constants/`: tema e constantes globais
- `constants/routes.ts`: rotas estáticas reutilizadas com tipagem segura
- `hooks/`: hooks simples de apoio
- `lib/`: autenticação, sessão, storage, helpers e comunicação com API
- `lib/services/`: serviços por domínio
- `lib/types/`: contratos TypeScript
- `lib/__tests__/`: testes de helpers e funções puras
- `styles/`: estilos por domínio/tela usando `StyleSheet` e `makeStyles(theme)`
- `assets/`: recursos estáticos
- `android/`: projeto Android nativo gerado/prebuild do Expo
- `firebase/`: pasta existente, sem uso ativo identificado no app
- `scripts/`: scripts auxiliares
- `.expo/`: artefatos locais; não tratar como código-fonte de negócio

## Arquitetura

Arquitetura predominante:

- UI em `app/` e `components/`
- regras de acesso, sessão, storage e chamadas HTTP em `lib/`
- tema central em `constants/theme.ts`
- estilos por tela em `styles/`

Padrões identificados:

- estado de tela local com `useState`, `useEffect`, `useMemo` e params de rota
- sem store global central
- tema resolvido com `useColorScheme()` + `Colors[colorScheme ?? "light"]`
- estilos gerados por tela com `makeStyles(theme)`

Base atual de auth/sessão:

- `lib/session.ts`: token, role, email lembrado e `sessionOnly`
- `lib/auth.ts`: login, logout e restauração de sessão
- `lib/auth-routes.ts`: decisão pura da rota inicial e rota por role
- `lib/token.ts` e `lib/remember.ts`: camadas de compatibilidade para código legado

Base atual de serviços/API:

- `lib/api.ts`: cliente HTTP central com interceptors
- `lib/services/auth-service.ts`: recuperação e redefinição de senha
- `lib/services/invitation-service.ts`: convite e cadastro por convite
- `lib/services/consent-service.ts`: consentimento LGPD
- `lib/services/user-service.ts`: leitura de clientes
- `lib/push-token-api.ts`: persistência do token de push
- `lib/types/*`: contratos de payload e resposta

## Navegação

Grupos de rota principais:

- `/(auth)`
- `/(client)`
- `/(therapist)`

Layouts principais:

- `app/_layout.tsx`: stack raiz e listeners de notificações
- `app/(auth)/_layout.tsx`: stack do fluxo de autenticação
- `app/(client)/(tabs)/_layout.tsx`: tabs do cliente
- `app/(therapist)/(tabs)/_layout.tsx`: tabs do terapeuta

Padrão de navegação:

- `router.push`, `router.replace`, `router.back`
- `useRouter()` e `useLocalSearchParams()` em telas com detalhe/edição
- rotas estáticas frequentes centralizadas em `constants/routes.ts`
- para rotas dinâmicas, preferir `router.push({ pathname, params })`
- evitar `router.push(... as any)` e `router.replace(... as any)` em rotas estáticas

Estado atual do `as any`:

- foi reduzido nos fluxos estáticos e frequentes
- ainda permanece em rotas dinâmicas antigas, principalmente detalhes/edições de `client` e `therapist`
- antes de remover um `as any` restante, validar params reais, fallback de `canGoBack()` e compatibilidade com `expo-router`

## Telas

Fluxo `auth`:

- `login`
- `forgot-password`
- `reset-password`
- `invite-code`
- `invite-signup`
- `consent-lgpd`

Fluxo `client`:

- home/tab inicial
- perfil
- reflexões: listagem, criação, detalhe, edição
- sonhos: criação e detalhe
- privacidade/LGPD

Fluxo `therapist`:

- home/tab inicial
- perfil
- clientes
- reflexões pendentes e detalhe
- feedbacks e detalhes
- sonhos por cliente e detalhe
- anamnese por cliente
- convite de cliente
- exclusão/LGPD

Padrão de telas:

- componente funcional por arquivo
- tema resolvido no topo do componente
- estilos vindos de `styles/...`
- feedback ao usuário com `Alert`
- chamadas assíncronas na própria tela ou delegadas a `lib/`

Observação:

- `app/modal.tsx` ainda existe como rota do template, então não foi removido por segurança

## Componentes

Componentes base atuais:

- `components/AppButton.tsx`
- `components/AppInput.tsx`
- `components/FormField.tsx`
- `components/LoadingState.tsx`
- `components/EmptyState.tsx`
- `components/ErrorState.tsx`
- `components/Button.tsx`
- `components/Card.tsx`
- `components/Screen.tsx`

Padrão de componentes:

- componentes simples, focados em apresentação
- tema aplicado internamente com `Colors` e `useColorScheme`
- baixo acoplamento com regra de negócio
- quando houver repetição de botão, input, label de formulário ou estados de lista, preferir os componentes base antes de duplicar JSX
- ajustar visual por props e estilos antes de criar nova variação de componente

Arquivos de template removidos por estarem sem referência no projeto:

- `components/external-link.tsx`
- `components/haptic-tab.tsx`
- `components/hello-wave.tsx`
- `components/parallax-scroll-view.tsx`
- `components/ui/collapsible.tsx`
- `components/ui/icon-symbol.tsx`
- `components/ui/icon-symbol.ios.tsx`

## Serviços e comunicação com API

Principal ponto de entrada:

- `lib/api.ts`

Padrão de API:

- instância única de `axios`
- `baseURL` montada por plataforma e variáveis `EXPO_PUBLIC_*`
- interceptors para anexar token Bearer e tratar `401`/`403`

Módulos de domínio em `lib/`:

- `reflections.ts`
- `dreams.ts`
- `feedback.ts`
- `anamnesis.ts`
- `users.ts`
- `invitations.ts`
- `dateDeletion.ts`
- `adminDeletion.ts`
- `push-notifications.ts`
- `push-token-api.ts`
- `services/auth-service.ts`
- `services/consent-service.ts`
- `services/invitation-service.ts`
- `services/user-service.ts`
- `setup-push-token.ts`
- `session.ts`
- `auth.ts`
- `auth-routes.ts`
- `token.ts`
- `remember.ts`
- `authRole.ts`
- `types/auth.ts`
- `types/consent.ts`
- `types/invitation.ts`
- `types/notification.ts`
- `types/user.ts`

Chamadas centralizadas identificadas:

- `POST /auth/login`
- `GET /auth/me`
- `GET /consents/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /invitations/validate`
- `POST /invitations/signup`
- `POST /invitations`
- `POST /consents`
- `GET /users/clients`
- `POST /push-tokens/`

Observação:

- ainda existem módulos de domínio em `lib/` consumidos diretamente por telas, como `dreams.ts`, `reflections.ts`, `feedback.ts` e `anamnesis.ts`
- eles já passam pelo cliente HTTP central e são compatíveis com a arquitetura atual

## Autenticação e sessão

Padrão identificado:

- login via `POST /auth/login`
- consulta complementar a `GET /auth/me` para descobrir `role`
- persistência central da sessão via `lib/session.ts`
- persistência auxiliar de `user_role`, email lembrado e flag de sessão temporária

Fluxo de entrada:

- `app/index.tsx` chama `restoreSession()` em `lib/auth.ts`
- `getInitialRouteFromSession()` em `lib/auth-routes.ts` define a rota inicial
- sem sessão autenticada: `/(auth)/login`
- com sessão autenticada: área correta conforme `role`

Fluxo de logout:

- `logout()` em `lib/auth.ts`
- limpeza central de token, role e `sessionOnly`

Controle de role:

- `client`
- `therapist`

Consentimento LGPD:

- para cliente, o login valida `GET /consents/me`
- sem consentimento aceito, redireciona para `/(auth)/consent-lgpd`

## Gerenciamento de estado

Padrão identificado:

- estado local por tela com hooks React
- persistência local com `AsyncStorage`
- autenticação e sessão coordenadas por `lib/session.ts` e `lib/auth.ts`

Não identificado no projeto:

- Redux
- Zustand
- store global central
- Context API de domínio

## Estilização

Padrão identificado:

- `StyleSheet.create`
- `makeStyles(theme)` por tela/feature
- tema central em `constants/theme.ts`
- suporte a `light` e `dark`
- cores e tokens visuais centralizados em `Colors`

Organização:

- `styles/auth/...`
- `styles/client/...`
- `styles/therapist/...`

## Variáveis de ambiente

Variáveis identificadas:

- `EXPO_PUBLIC_API_MODE`
- `EXPO_PUBLIC_ANDROID_TARGET`
- `EXPO_PUBLIC_API_URL_DEVICE`
- `EXPO_PUBLIC_API_URL_DEVICE_PROD`
- `EXPO_PUBLIC_API_URL_ANDROID_EMULATOR`
- `EXPO_PUBLIC_API_URL_ANDROID_EMULATOR_PROD`
- `EXPO_PUBLIC_API_URL_WEB`
- `EXPO_PUBLIC_API_URL_WEB_PROD`
- `EXPO_PUBLIC_ADMIN_KEY`

Observações:

- não expor valores reais em commits, documentação ou logs extras
- `lib/api.ts` usa fallbacks locais e de produção se variáveis estiverem ausentes
- `EXPO_PUBLIC_ADMIN_KEY` deve ser tratado como sensível

## Comandos úteis

Instalação:

- `npm install`

Execução:

- `npm run start`
- `npm run android`
- `npm run ios`
- `npm run web`

Lint:

- `npm run lint`

Testes:

- `npm run test`
- `npm run test:watch`

Validação de tipos:

- `npx tsc --noEmit`

Scripts auxiliares:

- `npm run reset-project`

Build:

- EAS configurado em `eas.json`
- perfis identificados: `development`, `preview`, `production`

Infra de testes:

- `jest.config.js`: preset `jest-expo` com alias `@/`
- `jest.setup.ts`: setup global leve para ambiente de teste

## Padrões de código

- usar TypeScript
- preferir imports com alias `@/`
- manter lógica de API em `lib/`
- manter estilos em `styles/`
- respeitar a separação por domínio: `auth`, `client`, `therapist`
- preferir `AppButton`, `AppInput`, `FormField`, `LoadingState`, `EmptyState` e `ErrorState`
- para rotas dinâmicas, preferir `pathname` + `params`
- novos testes não devem depender de API real
- manter arquivos de código, JSON e Markdown em UTF-8
- ao corrigir textos, preferir caracteres válidos em UTF-8 e evitar sequências corrompidas

## Regras para agentes de IA

### Como trabalhar neste projeto

1. Ler a rota, a tela e os módulos `lib/` relacionados antes de editar.
2. Confirmar em qual fluxo a mudança acontece: `auth`, `client` ou `therapist`.
3. Verificar impacto em:
   - telas
   - rotas
   - serviços/API
   - tipos
   - storage
   - notificações/permissões
4. Se alterar endpoint, payload, resposta ou autenticação, revisar todos os usos do módulo correspondente.
5. Se alterar rota ou params, revisar `router.push`, `router.replace`, `useRouter`, `useLocalSearchParams` e `constants/routes.ts`.
6. Se alterar componentes base, revisar telas de `auth`, `client` e `therapist` que dependem deles.
7. Se alterar login/logout/sessão, revisar obrigatoriamente:
   - `app/index.tsx`
   - `app/_layout.tsx`
   - `app/(auth)/login.tsx`
   - `lib/auth.ts`
   - `lib/auth-routes.ts`
   - `lib/session.ts`
   - `lib/token.ts`
   - `lib/remember.ts`
   - `lib/api.ts`
8. Antes de remover qualquer arquivo:
   - verificar imports diretos
   - verificar rotas ativas em `app/`
   - verificar referências indiretas em layouts, helpers e testes
   - se houver dúvida, manter o arquivo e documentar como suspeito
9. Antes de concluir, rodar pelo menos `npm run lint`, `npm run test` e `npx tsc --noEmit` quando a alteração envolver código.

Regras adicionais:

- não refatorar em massa sem pedido explícito
- não mover rotas do `app/` sem revisar toda a navegação
- não alterar estrutura de `AsyncStorage` sem plano de migração
- não duplicar regras de API em várias telas se puder centralizar em `lib/`
- não introduzir `as any` em navegação estática quando houver rota tipada simples
- não remover arquivos só por “parecer template”; confirmar antes que não há rota nem import ativo
- ao limpar logs, manter erros úteis e remover mensagens de debug excessivas

## Arquivos sensíveis

Evitar alteração sem necessidade clara:

- `.env`
- `app.json`
- `eas.json`
- `google-services.json`
- `android/`
- `app/_layout.tsx`
- `app/index.tsx`
- `lib/api.ts`
- `lib/auth.ts`
- `lib/auth-routes.ts`
- `lib/session.ts`
- `lib/services/`
- `lib/types/`
- módulos de push notification em `lib/`

Cuidados:

- mudanças nesses arquivos podem quebrar bootstrap, sessão, build, push, roteamento inicial ou integração com backend
- se precisar alterar algum deles, documentar o motivo e revisar impactos cruzados

## Checklist antes de finalizar

- confirmei o fluxo afetado: `auth`, `client` ou `therapist`
- revisei impacto em telas, rotas, serviços e tipos
- confirmei que nenhuma rota ativa foi removida
- verifiquei referências antes de remover arquivos
- mantive compatibilidade com o `expo-router`
- mantive ou atualizei a tipagem TypeScript necessária
- confirmei UTF-8 válido nos arquivos alterados
- corrigi textos corrompidos quando encontrados
- verifiquei se a mudança afeta login, logout, token, `user_role` ou `AsyncStorage`
- verifiquei se a mudança afeta notificações push
- rodei `npm run lint`
- rodei `npm run test`
- rodei `npx tsc --noEmit`
- descrevi o que foi removido, o que foi corrigido e o que ficou por segurança
