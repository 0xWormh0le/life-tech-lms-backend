import { DataSource } from 'typeorm'
import { USState } from '../../domain/entities/codex/USState'
import { Errorable, E } from '../../domain/usecases/shared/Errors'

const US_STATES: { [key in USState['id']]: USState } = {
  AL: { id: 'AL', abbreviation: 'AL', name: 'Alabama' },
  AK: { id: 'AK', abbreviation: 'AK', name: 'Alaska' },
  AZ: { id: 'AZ', abbreviation: 'AZ', name: 'Arizona' },
  AR: { id: 'AR', abbreviation: 'AR', name: 'Arkansas' },
  CA: { id: 'CA', abbreviation: 'CA', name: 'California' },
  CO: { id: 'CO', abbreviation: 'CO', name: 'Colorado' },
  CT: { id: 'CT', abbreviation: 'CT', name: 'Connecticut' },
  DE: { id: 'DE', abbreviation: 'DE', name: 'Delaware' },
  FL: { id: 'FL', abbreviation: 'FL', name: 'Florida' },
  GA: { id: 'GA', abbreviation: 'GA', name: 'Georgia' },
  HI: { id: 'HI', abbreviation: 'HI', name: 'Hawaii' },
  ID: { id: 'ID', abbreviation: 'ID', name: 'Idaho' },
  IL: { id: 'IL', abbreviation: 'IL', name: 'Illinois' },
  IN: { id: 'IN', abbreviation: 'IN', name: 'Indiana' },
  IA: { id: 'IA', abbreviation: 'IA', name: 'Iowa' },
  KS: { id: 'KS', abbreviation: 'KS', name: 'Kansas' },
  KY: { id: 'KY', abbreviation: 'KY', name: 'Kentucky' },
  LA: { id: 'LA', abbreviation: 'LA', name: 'Louisiana' },
  ME: { id: 'ME', abbreviation: 'ME', name: 'Maine' },
  MD: { id: 'MD', abbreviation: 'MD', name: 'Maryland' },
  MA: { id: 'MA', abbreviation: 'MA', name: 'Massachusetts' },
  MI: { id: 'MI', abbreviation: 'MI', name: 'Michigan' },
  MN: { id: 'MN', abbreviation: 'MN', name: 'Minnesota' },
  MS: { id: 'MS', abbreviation: 'MS', name: 'Mississippi' },
  MO: { id: 'MO', abbreviation: 'MO', name: 'Missouri' },
  MT: { id: 'MT', abbreviation: 'MT', name: 'Montana' },
  NB: { id: 'NB', abbreviation: 'NB', name: 'Nebraska' },
  NV: { id: 'NV', abbreviation: 'NV', name: 'Nevada' },
  NH: { id: 'NH', abbreviation: 'NH', name: 'New Hampshire' },
  NJ: { id: 'NJ', abbreviation: 'NJ', name: 'New Jersey' },
  NM: { id: 'NM', abbreviation: 'NM', name: 'New Mexico' },
  NY: { id: 'NY', abbreviation: 'NY', name: 'New York' },
  NC: { id: 'NC', abbreviation: 'NC', name: 'North Carolina' },
  ND: { id: 'ND', abbreviation: 'ND', name: 'North Dakota' },
  OH: { id: 'OH', abbreviation: 'OH', name: 'Ohio' },
  OK: { id: 'OK', abbreviation: 'OK', name: 'Oklahoma' },
  OR: { id: 'OR', abbreviation: 'OR', name: 'Oregon' },
  PA: { id: 'PA', abbreviation: 'PA', name: 'Pennsylvania' },
  RI: { id: 'RI', abbreviation: 'RI', name: 'Rhode Island' },
  SC: { id: 'SC', abbreviation: 'SC', name: 'South Carolina' },
  SD: { id: 'SD', abbreviation: 'SD', name: 'South Dakota' },
  TN: { id: 'TN', abbreviation: 'TN', name: 'Tennessee' },
  TX: { id: 'TX', abbreviation: 'TX', name: 'Texas' },
  UT: { id: 'UT', abbreviation: 'UT', name: 'Utah' },
  VT: { id: 'VT', abbreviation: 'VT', name: 'Vermont' },
  VA: { id: 'VA', abbreviation: 'VA', name: 'Virginia' },
  WA: { id: 'WA', abbreviation: 'WA', name: 'Washington' },
  WV: { id: 'WV', abbreviation: 'WV', name: 'West Virginia' },
  WI: { id: 'WI', abbreviation: 'WI', name: 'Wisconsin' },
  WY: { id: 'WY', abbreviation: 'WY', name: 'Wyoming' },
  DC: { id: 'DC', abbreviation: 'DC', name: 'Washington, D.C.' },
}

export class StateRepository {
  constructor(private typeormDataSource: DataSource) {}

  async getUSStateById(
    id: string,
  ): Promise<
    Errorable<USState, E<'NotFoundError'> | E<'UnknownRuntimeError'>>
  > {
    const usState = US_STATES[id]

    if (!usState) {
      return {
        hasError: true,
        error: {
          type: 'NotFoundError',
          message: `given state id ${id} not exist`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: usState,
    }
  }

  /*
   * deprecated. Use getUSStateById
   */
  async getStateByAbbreviation(
    stateAbbreviation: string,
  ): Promise<Errorable<string, E<'NotFoundError'> | E<'UnknownRuntimeError'>>> {
    const usState = await this.getUSStateById(stateAbbreviation)

    if (usState.hasError) {
      return {
        hasError: true,
        error: {
          type: 'NotFoundError',
          message: `given state stateAbbreviation ${stateAbbreviation} not exist`,
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: usState.value.id,
    }
  }
}
