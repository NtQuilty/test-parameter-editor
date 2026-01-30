# Test Parameter Editor

Редактор параметров с динамической формой и валидацией.

## Быстрый старт

```bash
# Установка зависимостей
pnpm i

# Запуск тестов
pnpm test

# Запуск dev-сервера
pnpm run dev
```

## Вывод тестов

```
 DEV  v4.0.18

 ✓ src/DynamicForm.test.tsx (10 tests) 30ms

 Test Files  1 passed (1)
      Tests  10 passed (10)
   Start at  17:19:51
   Duration  496ms (transform 24ms, setup 37ms, import 61ms, tests 30ms, environment 300ms)
```

## Доступные скрипты

```bash
pnpm run dev      # Запуск dev-сервера (Vite)
pnpm test         # Запуск тестов (Vitest)
pnpm run build    # Сборка для продакшена
pnpm run preview  # Предпросмотр production
pnpm run lint     # Проверка кода (Biome)
pnpm run format   # Форматирование кода (Biome)
```

## Технологии

- React 19.2
- TypeScript 5.9
- Vite (bundler)
- Vitest (тестирование)
- React Testing Library
