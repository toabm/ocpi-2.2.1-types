# @toabm/ocpi-2.2.1-types

TypeScript types and [class-validator](https://github.com/typestack/class-validator) DTOs for the [OCPI 2.2.1](https://github.com/ocpi/ocpi) protocol (Open Charge Point Interface).

## Install

```bash
npm install @toabm/ocpi-2.2.1-types
```

`class-validator`, `class-transformer`, and `reflect-metadata` are installed automatically as dependencies.

## Usage

```typescript
import { validate } from 'class-validator';
import { VersionDto, VersionEnum } from '@toabm/ocpi-2.2.1-types';

const version = new VersionDto();
version.version = VersionEnum.v2_2_1;
version.url = 'https://example.com/ocpi/2.2.1/';

const errors = await validate(version);
```

Each DTO is a plain class decorated with `class-validator`/`class-transformer` decorators, so it works standalone with no framework (NestJS or otherwise) required.

## License

MIT
