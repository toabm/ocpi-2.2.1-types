// 🚫 Do not import this file directly. Use `types/index.ts` instead.
import { validate } from 'class-validator';
import { VersionDto, VersionEnum } from '../../index';

describe('VersionDto', () => {
  const versionDtoArrayOK = [
    {
      version: '2.1.1',
      url: 'https://www.server.com/ocpi/2.1.1/'
    },
    {
      version: '2.2',
      url: 'https://www.server.com/ocpi/2.2/'
    }
  ];

  const getDTOsArray = (): VersionDto[] => {
    const dtos = [new VersionDto(), new VersionDto()];
    dtos[0].version = versionDtoArrayOK[0].version as VersionEnum;
    dtos[0].url = versionDtoArrayOK[0].url;
    dtos[1].version = versionDtoArrayOK[1].version as VersionEnum;
    dtos[1].url = versionDtoArrayOK[1].url;
    return dtos;
  };

  it('It should validate a valid instance', async () => {
    const dtos = getDTOsArray();
    for (const dto of dtos) {
      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    }
  });

  it('Should fail validating if url is missing', async () => {
    const dtos = getDTOsArray();
    // @ts-expect-error Error tests
    dtos[1].url = undefined;
    // @ts-expect-error Error tests
    dtos[1].version = 'sdfsdf';
    const errors = await validate(dtos[1]);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('Should fail validating if version attr is not a string', async () => {
    const dtos = getDTOsArray();
    // @ts-expect-error Error tests
    dtos[0].version = 123;

    const errors = await validate(dtos[0]);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('Should fail if version attribute is too long.', async () => {
    const dto = new VersionDto();
    // @ts-expect-error Error tests
    dto.version = 'v2.1.1'.repeat(50);

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
