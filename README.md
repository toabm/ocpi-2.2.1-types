# @ablamun/ocpi-2.2.1-types

TypeScript types and [class-validator](https://github.com/typestack/class-validator) DTOs for the [OCPI 2.2.1](https://github.com/ocpi/ocpi) protocol (Open Charge Point Interface).

Every OCPI object (locations, sessions, tokens, tariffs, CDRs, commands, credentials, versions...) is shipped as a `class-validator`/`class-transformer` decorated class, not a bare TypeScript interface. That means you get runtime request/response validation for free, not just compile-time type shapes.

## Available types, by OCPI module

Types are organized to match the [OCPI 2.2.1 specification](https://github.com/ocpi/ocpi)'s own module structure. `ChargingProfiles` and `HubClientInfo` modules are not covered yet.

<details>
<summary><strong>Versions</strong> — protocol version negotiation</summary>

- `VersionDto` — Top-level object describing one supported OCPI version and where to find its details
- `VersionDetailDto` — Full detail for a version: which modules/roles it supports and their endpoint URLs
- `EndpointDto` — A single module endpoint's role, module ID, and URL
- `VersionEnum` — Supported OCPI protocol versions, 2.0 through 2.2.1
- `ModuleIDEnum` — The modules an implementation can support (locations, sessions, tokens, commands...)
- `InterfaceRoleEnum` — Whether an endpoint is the sender or receiver side of a module

</details>

<details>
<summary><strong>Credentials</strong> — registration handshake between parties</summary>

- `CredentialsDto` — Registration payload: auth token, versions URL, and the party's role(s)
- `CredentialsRoleDto` — One market role (CPO, eMSP, HUB...) a party fulfills, with its business details and IDs
- `RoleEnum` — The market roles a party can play (CPO, EMSP, HUB, NAP, NSP, OTHER, SCSP)

</details>

<details>
<summary><strong>Locations</strong> — charging locations, EVSEs, and connectors</summary>

- `LocationDto` — A charging location: address, coordinates, opening hours, and its EVSEs
- `EvseDto` — A single EVSE at a location, with its status, connectors, and capabilities
- `ConnectorDto` — A physical connector on an EVSE (plug type, power, voltage/amperage)
- `BusinessDetailsDto` — Operator/owner/sub-operator company info shown for a location
- `GeoLocationDto` — WGS-84 coordinates of a location or EVSE
- `AdditionalGeoLocationDto` — An extra point of interest near a location (entrance, parking spot, etc.)
- `PublishTokenTypeDto` — A Token that's allowed to see a non-published (private) location
- `StatusScheduleDto` — A scheduled future EVSE status change, for trip-planning purposes
- `DisplayTextDto` — Multi-language human-readable text
- `ImageDto` — A photo or logo (charger, entrance, network, operator...)
- `RegularHoursDto` — One weekday's regular opening hours
- `ExceptionalPeriodDto` — A one-off date/time range that overrides the regular opening hours
- `HoursDto` — A location's full opening-hours schedule (24/7 flag plus regular/exceptional periods)
- `EnergySourceDto` — One energy source (solar, wind, coal...) and its share of the energy mix
- `EnvironmentalImpactDto` — One environmental impact value (CO2, nuclear waste) per kWh
- `EnergyMixDto` — A location's or tariff's energy mix: sources, environmental impact, and supplier
- `ParkingTypeEnum` — General type of parking at a location (garage, street, driveway...)
- `FacilityEnum` — Kind of facility the location is near/part of (hotel, mall, train station...)
- `EnergySourceCategoryEnum` — Category of energy source (nuclear, coal, solar, wind...)
- `EmissionType` — Category of environmental impact being measured (CO2, nuclear waste)
- `StatusEnum` — Current operating status of an EVSE/connector (available, charging, blocked...)
- `CapabilityEnum` — A functionality an EVSE supports (reservable, RFID reader, remote start/stop...)
- `ParkingRestrictionEnum` — A restriction on who/what may park at the spot (EV-only, disabled, customers...)
- `ImageCategoryEnum` — What an image depicts (charger, entrance, location, operator logo...)
- `ConnectorTypeEnum` — Physical connector standard (CCS, CHAdeMO, Type 2, Tesla...)
- `ConnectorFormatEnum` — Connector's physical format: socket or attached cable
- `PowerTypeEnum` — Power type delivered by a connector (AC single/multi-phase, DC)

</details>

<details>
<summary><strong>Sessions</strong> — active/completed charging sessions</summary>

- `SessionDto` — An active or completed charging session at a location
- `ChargingPreferencesDto` — A driver's smart-charging preferences for a session (target energy, departure time...)
- `AuthMethodEnum` — How the driver was authenticated to start the session (whitelist, command, real-time request)
- `ProfileTypeEnum` — The driver's charging profile preference (cheap, fast, green, regular)
- `SessionStatusEnum` — Current lifecycle state of a session (pending, active, completed, invalid...)
- `ChargingPreferencesResponseEnum` — How the CPO responded to submitted charging preferences

</details>

<details>
<summary><strong>CDRs</strong> — Charge Detail Records (billing)</summary>

- `CdrDto` — The finalized Charge Detail Record for a completed session, used for billing
- `CdrDimensionDto` — One measured value for a period (energy, current, time...) and its magnitude
- `CdrLocationDto` — The relevant subset of Location info embedded in a CDR
- `CdrTokenDto` — The relevant subset of Token info embedded in a CDR
- `ChargingPeriodDto` — A time-bounded slice of a session, with the dimension values measured during it
- `SignedDataDto` — Cryptographically signed metering data attached to a CDR
- `SignedValueDto` — One individual signed meter reading (start/intermediate/end)
- `CdrDimensionTypeEnum` — The kind of value a ChargingPeriod dimension represents (energy, power, current, state of charge...)

</details>

<details>
<summary><strong>Tariffs</strong> — pricing</summary>

- `TariffDto` — A pricing scheme made of one or more elements, with optional restrictions
- `TariffElementDto` — One priced component (e.g. a per-kWh energy cost) plus the conditions it applies under
- `PriceComponentDto` — The price and billing step size for one priced dimension (energy, time, flat fee...)
- `PriceDto` — An amount, split into excluding/including VAT
- `TariffRestrictionsDto` — Conditions that narrow when a TariffElement applies (time of day, min/max kWh, day of week...)
- `TariffTypeEnum` — Purpose of a tariff (ad-hoc payment, cheap/fast/green profile, regular)
- `DayOfWeekEnum` — A day of the week, used in tariff restrictions
- `TariffDimensionTypeEnum` — The dimension a price component charges for (energy, time, parking time, flat fee)
- `ReservationRestrictionTypeEnum` — Reservation-related restriction type (a reservation, or one that has expired)

</details>

<details>
<summary><strong>Tokens</strong> — driver authorization tokens (RFID cards, app users...)</summary>

- `TokenDto` — A driver's authorization credential (RFID card, app user, ad-hoc ID)
- `AuthorizationInfoDto` — The result of an authorization check: whether, and where, a Token may charge
- `LocationReferencesDto` — References to the Location/EVSEs a Token's authorization is scoped to
- `EnergyContractDto` — A driver's own energy supplier/contract info, if usable at the Charge Point
- `AllowedTypeEnum` — Whether a Token is allowed to charge, and why not if it isn't
- `TokenTypeEnum` — Kind of Token (RFID card, app-generated user ID, one-time ad-hoc ID...)
- `WhitelistTypeEnum` — Whether/how a Token may be whitelisted for offline use

</details>

<details>
<summary><strong>Commands</strong> — remote start/stop, reservations, unlock</summary>

- `StartSessionDto` — Request the CPO to remotely start a session on an EVSE/connector
- `StopSessionDto` — Request the CPO to remotely stop an ongoing session
- `ReserveNowDto` — Request the CPO to reserve an EVSE for a Token, starting now
- `CancelReservationDto` — Request the CPO to cancel an existing reservation
- `UnlockConnectorDto` — Request the CPO to unlock a connector (help-desk use only)
- `CommandResponseDto` — The CPO's immediate accept/reject response to a submitted command
- `CommandResultDto` — The Charge Point's eventual outcome of an accepted command, reported back asynchronously
- `CommandDto` — Union type of all five command payloads above
- `CommandType` — The five remote command types (start/stop session, reserve, cancel, unlock)
- `CommandResultType` — Possible outcomes reported back for an executed command
- `CommandResponseType` — Possible immediate accept/reject responses to a command request

</details>

<details>
<summary><strong>Shared</strong> — used across multiple modules</summary>

- `OcpiResponseDto` — The envelope every OCPI response is wrapped in (`data`, `status_code`, `timestamp`...)
- `OCPIStatusCodesEnum` — Four-digit OCPI status codes, distinct from HTTP status codes
- `OcpiStatusMessagesEnum` — Human-readable messages matching each `OCPIStatusCodesEnum` value
- `OperationResult` — Whether a PUT/PATCH resulted in a newly created object or an update to an existing one
- `validateAll` — Helper function to validate an array of DTOs in one call

</details>

## Install

```bash
npm install @ablamun/ocpi-2.2.1-types
```

`class-validator`, `class-transformer`, and `reflect-metadata` are installed automatically as dependencies — no NestJS or any other framework required.

## Quick example: validating a DTO

```typescript
import { validate } from 'class-validator';
import { VersionDto, VersionEnum } from '@ablamun/ocpi-2.2.1-types';

const version = new VersionDto();
version.version = VersionEnum.v2_2_1;
version.url = 'https://example.com/ocpi/2.2.1/';

const errors = await validate(version);
if (errors.length > 0) {
  // errors[].constraints describes exactly which field failed and why
}
```

## Real-world example: sending a START_SESSION command

A common OCPI flow: an eMSP asks a CPO to remotely start a charging session on behalf of a driver, by `POST`-ing a `StartSessionDto` to the CPO's `commands` module endpoint. The CPO responds immediately with a `CommandResponseDto` (`ACCEPTED`/`REJECTED`/...) wrapped in the standard `OcpiResponseDto` envelope, and later reports the actual outcome asynchronously via a `CommandResultDto` POSTed back to your `response_url`.

```typescript
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CommandResponseDto,
  CommandType,
  OcpiResponseDto,
  StartSessionDto,
  TokenDto,
  TokenTypeEnum,
  WhitelistTypeEnum
} from '@ablamun/ocpi-2.2.1-types';

// The Token identifying which driver/contract is authorized to start this session.
const token: TokenDto = {
  country_code: 'NL',
  party_id: 'TNM',
  uid: '012345678',
  type: TokenTypeEnum.RFID,
  contract_id: 'NL8ACC12E46L89',
  visual_number: 'DF000-2001-8999-1',
  issuer: 'TheNewMotion',
  group_id: 'DF000-2001-8999',
  valid: true,
  whitelist: WhitelistTypeEnum.ALWAYS,
  last_updated: new Date().toISOString()
};

const startSessionDto = plainToInstance(StartSessionDto, {
  // Where the CPO should POST the async CommandResultDto once the session actually starts (or fails to).
  response_url: 'https://your-emsp.example.com/ocpi/emsp/2.2.1/commands/START_SESSION/result/req-123',
  token,
  location_id: 'LOC1',
  evse_uid: 'EVSE1'
});

// Validate before sending -- catches malformed payloads before they hit the wire.
const errors = await validate(startSessionDto);
if (errors.length > 0) {
  throw new Error(`Invalid StartSessionDto: ${JSON.stringify(errors)}`);
}

// POST it to the CPO's commands endpoint (obtained from their /versions handshake).
const response = await fetch(`${cpoCommandsEndpointUrl}/${CommandType.START_SESSION}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Token ${cpoAuthToken}` },
  body: JSON.stringify(startSessionDto)
});

const { data: commandResponse }: OcpiResponseDto<CommandResponseDto> = await response.json();

// Validate the CPO's immediate response too -- don't trust the wire.
const responseErrors = await validate(plainToInstance(CommandResponseDto, commandResponse));
if (responseErrors.length > 0) {
  throw new Error(`CPO returned an invalid CommandResponseDto: ${JSON.stringify(responseErrors)}`);
}

if (commandResponse.result === 'ACCEPTED') {
  // The CPO accepted the command; the real outcome (started/failed/timed out) will
  // arrive later as a CommandResultDto POSTed to `response_url` above.
}
```

The same pattern applies to the other command types (`StopSessionDto`, `ReserveNowDto`, `CancelReservationDto`, `UnlockConnectorDto`) — see `CommandType` for the full list.

## Validating arrays of DTOs

For endpoints that return lists (e.g. all Locations, all Tariffs), the bundled `validateAll` helper saves you a manual `.map()`:

```typescript
import { plainToInstance } from 'class-transformer';
import { LocationDto, validateAll } from '@ablamun/ocpi-2.2.1-types';

const locations = plainToInstance(LocationDto, plainLocationArrayFromApi);
const errorsPerLocation = await validateAll(locations); // ValidationError[][]
```

## License

MIT