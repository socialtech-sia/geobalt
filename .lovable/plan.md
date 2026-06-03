## GeoBalt Admin / CMS — план реализации

Полнофункциональная админ-панель на `/admin` (русский UI), в том же приложении и Supabase. Публичный сайт остаётся на латышском.

### Этап 1 — База данных и хранилище
- Миграция:
  - `ALTER products ADD is_active boolean DEFAULT true`
  - Таблицы: `profiles` (id=auth.uid, email, full_name, role), `settings` (id=1, single-row: `notification_emails text[]`, `send_lead_autoreply`, контакты, промо-поля), `lead_notes`
  - Enum `app_role` (admin, editor) + `user_roles` таблица + `has_role()` SECURITY DEFINER функция (по best-practice безопасности)
  - Триггер на `auth.users` → создаёт `profiles` запись
  - `leads.status` ограничить значениями new/in_progress/won/lost
  - RLS: публично читается только `is_active = true`; писать в content-таблицы могут admin/editor; `settings` — только admin; `leads` SELECT/UPDATE/DELETE — admin/editor
- Storage buckets (public read, write для admin/editor): `product-images`, `brand-logos`, `blog-covers`
- Сидим строку `settings` (id=1) с базовыми значениями

### Этап 2 — Auth и защита роутов
- Supabase Auth (email + password, без публичной регистрации)
- `/admin/login` — минимальная тёмная форма
- Layout `_authenticated` уже существует — добавлю `/admin` ветку, которая проверяет роль через `has_role()` и редиректит на сайт, если не admin/editor
- Корневой `onAuthStateChange` listener (если ещё нет)

### Этап 3 — Admin Shell
- Sidebar (Дашборд, Продукты, Категории, Бренды, Отзывы, Блог, Заявки, Настройки) + top bar (user, "Выйти", "↗ Сайт", бейдж новых заявок)
- Tailwind/shadcn — плотнее, утилитарный, но те же токены

### Этап 4 — Контентные модули
1. **Дашборд** `/admin` — KPI-карточки + последние заявки
2. **Продукты** — таблица с inline toggles (Активен, ★), drag-reorder, поиск/фильтры; редактор с секциями (основное, иконочные спеки, repeatable product_specs, загрузка фото с drag-drop + primary/reorder, флаги доступности)
3. **Категории / Бренды** — таблица + редактор, drag-reorder, загрузка лого, защита от удаления при наличии связей
4. **Отзывы / Блог** — CRUD с превью, markdown body, загрузка cover
5. **Заявки (mini-CRM)** — список с фильтрами/поиском/highlight новых, экспорт CSV, drawer/страница с историей заметок (`lead_notes`), смена статуса, mailto/tel quick-actions, удаление

### Этап 5 — Настройки `/admin/settings` (только admin)
- Email-получатели заявок (chips add/remove, валидация)
- Toggle авто-ответа клиенту
- Контакты сайта (phone, email, адрес LV, часы работы LV)
- Промо-баннер (enable + upload + title/text/cta)
- Опциональные feature toggles

### Этап 6 — Интеграция с публичным сайтом
- Header/Footer/Contacts читают `settings` вместо хардкода
- Каталог/Home/Product показывают только `is_active = true`
- Homepage promo-секция читает `settings.promo_*` (скрывается если выключено)
- Edge function `send-lead-email` (если/когда появится) будет читать `settings.notification_emails` — пока готовим Settings UI

### Технические детали
- Server-side privileged операции через `createServerFn` + `requireSupabaseAuth` с проверкой роли
- Загрузка файлов — напрямую из браузера в Supabase Storage (RLS на `storage.objects`)
- Все админ-формы — `react-hook-form` + `zod`
- Drag-and-drop — `@dnd-kit/core` + `@dnd-kit/sortable`
- Markdown — простой textarea + preview (`react-markdown`)
- CSV экспорт — клиентский, без зависимостей
- Защита от потери данных при редактировании (unsaved-changes guard)

### Что НЕ входит в этот заход
- Сам edge function `send-lead-email` (по спеке делается отдельно в Claude Code; здесь только UI получателей)
- Multi-tenant / editor role permissions detail — MVP с одним admin, но схема `user_roles` уже готова к editor

### Вопросы перед стартом
1. **Первый admin** — какой email использовать для первой учётной записи (создать пользователя и присвоить role=admin в миграции)? Или зарегистрировать вручную после деплоя?
2. **MVP объём** — реализовать всё сразу (большой объём, ~15+ файлов), или начать с этапов 1–3 + Продукты + Заявки + Настройки, а Категории/Бренды/Отзывы/Блог CRUD добавить вторым заходом?
