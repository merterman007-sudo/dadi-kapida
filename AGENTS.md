# Dadi Kapida CRM Engineering Guidelines

- Use TypeScript strict mode everywhere.
- Write production-ready, maintainable code.
- Avoid unnecessary over-engineering.
- This product is an internal CRM, not a SaaS product.
- Do not implement multi-tenant architecture.
- Do not implement external candidate/family portals in v1.
- Use clean module boundaries and consistent controller/service/dto layering.
- Always keep Prisma migrations in sync with schema changes.
- Apply auth and permission checks for every protected endpoint.
- Never log sensitive personal data.
- Run typecheck/lint/test after meaningful changes.
- Create a short implementation plan before major changes.
- Avoid adding unnecessary dependencies.
- Prioritize long-term maintainability and operational clarity.
