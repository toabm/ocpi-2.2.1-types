// Full Credentials registration handshake between two OCPI parties, per OCPI 2.2.1 section
// 7.1.1 / Figure 22 ("The OCPI registration process"):
//   1. Sender fetches the Receiver's supported versions.
//   2. Sender fetches version details (endpoints) for the mutually supported version.
//   3. Sender POSTs its own Credentials (with a freshly generated token) to the Receiver's
//      `credentials` endpoint.
//   4. Receiver responds with its own Credentials, including a new token the Sender must use
//      for every request from now on -- the bootstrap token is discarded.
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CredentialsDto,
  InterfaceRoleEnum,
  ModuleIDEnum,
  RoleEnum,
  VersionDetailDto,
  VersionDto,
  VersionEnum
} from '../index';

describe('Scenario: Credentials registration handshake', () => {
  it('walks through version discovery and the two-way credentials exchange', async () => {
    // 1. Sender GETs the Receiver's /versions endpoint.
    const availableVersions = plainToInstance(VersionDto, [
      { version: VersionEnum.v2_1_1, url: 'https://receiver.example.com/ocpi/2.1.1/' },
      { version: VersionEnum.v2_2_1, url: 'https://receiver.example.com/ocpi/2.2.1/' }
    ]);
    for (const version of availableVersions) {
      expect(await validate(version)).toHaveLength(0);
    }

    // Sender picks the latest mutually supported version.
    const chosenVersion = availableVersions.find(v => v.version === VersionEnum.v2_2_1);
    expect(chosenVersion?.url).toBe('https://receiver.example.com/ocpi/2.2.1/');

    // 2. Sender GETs that version's details to discover the `credentials` endpoint URL.
    const versionDetail = plainToInstance(VersionDetailDto, {
      version: VersionEnum.v2_2_1,
      endpoints: [
        {
          identifier: ModuleIDEnum.credentials,
          role: InterfaceRoleEnum.SENDER,
          url: 'https://receiver.example.com/ocpi/2.2.1/credentials'
        },
        {
          identifier: ModuleIDEnum.locations,
          role: InterfaceRoleEnum.SENDER,
          url: 'https://receiver.example.com/ocpi/2.2.1/locations'
        }
      ]
    });
    expect(await validate(versionDetail)).toHaveLength(0);

    const credentialsEndpoint = versionDetail.endpoints.find(e => e.identifier === ModuleIDEnum.credentials);
    expect(credentialsEndpoint?.url).toBe('https://receiver.example.com/ocpi/2.2.1/credentials');

    // 3. Sender POSTs its own Credentials to that endpoint, handing the Receiver a freshly
    // generated CREDENTIALS_TOKEN_B to use for all future requests to the Sender.
    const senderCredentials = plainToInstance(CredentialsDto, {
      token: 'CREDENTIALS_TOKEN_B',
      url: 'https://sender.example.com/ocpi/versions',
      roles: [
        {
          role: RoleEnum.EMSP,
          business_details: { name: 'Example eMSP' },
          party_id: 'EXA',
          country_code: 'NL'
        }
      ]
    });
    expect(await validate(senderCredentials)).toHaveLength(0);

    // 4. Receiver replies with its own Credentials, handing back CREDENTIALS_TOKEN_C for the
    // Sender to use from now on.
    const receiverCredentials = plainToInstance(CredentialsDto, {
      token: 'CREDENTIALS_TOKEN_C',
      url: 'https://receiver.example.com/ocpi/versions',
      roles: [
        {
          role: RoleEnum.CPO,
          business_details: { name: 'Example CPO' },
          party_id: 'REC',
          country_code: 'DE'
        }
      ]
    });
    expect(await validate(receiverCredentials)).toHaveLength(0);

    // The bootstrap token is now obsolete; the Sender persists token C for future requests.
    expect(receiverCredentials.token).not.toBe(senderCredentials.token);
  });

  it('registration fails fast if the Sender omits its roles when POSTing Credentials', async () => {
    const invalidCredentials = plainToInstance(CredentialsDto, {
      token: 'CREDENTIALS_TOKEN_B',
      url: 'https://sender.example.com/ocpi/versions'
      // roles intentionally omitted
    });
    const errors = await validate(invalidCredentials);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('registration fails fast if the version-discovery URL is malformed', async () => {
    const invalidVersion = plainToInstance(VersionDto, { version: VersionEnum.v2_2_1, url: 'not-a-url' });
    const errors = await validate(invalidVersion);
    expect(errors.length).toBeGreaterThan(0);
  });
});
