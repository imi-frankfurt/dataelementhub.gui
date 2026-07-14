import ItemDefinition from '~/components/item/item-definition'

export default {
  buildUrn (namespaceId, elementType, identifier, version) {
    return 'urn:' + namespaceId + ':' + elementType.toLowerCase() + ':' + identifier + ':' + version
  },
  cutString (str, len) {
    return str.length > len ? str.substring(0, len) + '..' : str
  },
  getStatusColor (status) {
    if (status.toUpperCase() === 'OUTDATED') {
      return '#ff9999'
    } else if (status.toUpperCase() === 'RELEASED') {
      return '#9dfc91'
    } else if (status.toUpperCase() === 'DRAFT') {
      return '#8a8a8a'
    }
  },
  // Find an element type and return it
  findElementType (urn) {
    const regEx = /\b(?:namespace|dataelement|dataelementgroup|record)\b/
    const ret = regEx.exec(urn)
    if (ret.length === 1) {
      return ret[0]
    } else {
      return null
    }
  },
  isNamespace (urn) {
    return urn.toUpperCase().includes('NAMESPACE')
  },
  preferredLanguage () {
    return 'de,en-US;q=0.7,en;q=0.3'
  },
  // Return all element types
  elementTypes () {
    return [
      'DATAELEMENT',
      'DATAELEMENTGROUP',
      'NAMESPACE',
      'RECORD'
    ]
  },
  // Return element statuses
  elementStatuses (exclude = []) {
    return [
      'DRAFT',
      'RELEASED',
      'OUTDATED'
    ].filter(function (status) {
      return !exclude.includes(status)
    })
  },
  // Return all Element value domains
  elementValueDomains () {
    return ['STRING', 'NUMERIC', 'BOOLEAN', 'ENUMERATED', 'DATETIME', 'DATE',
      'TIME', 'TBD']
  },
  numericValueDomains () {
    return ['INTEGER', 'FLOAT']
  },
  // Define Default Axios Params Serializer
  paramsSerializer (params) {
    const Qs = require('qs')
    return Qs.stringify(params, { arrayFormat: 'repeat' })
  },
  // Return a default Namespace
  defaultNamespace () {
    return {
      identification: {
        elementType: 'NAMESPACE',
        status: 'DRAFT',
        hideNamespace: false
      },
      definitions: [
        ItemDefinition.data().defaultDefinition
      ],
      slots: []
    }
  },
  // Return a default Data Element
  defaultDataElement () {
    return {
      identification: {
        elementType: 'DATAELEMENT',
        status: 'DRAFT'
      },
      definitions: [
        ItemDefinition.data().defaultDefinition
      ],
      valueDomainUrn: '',
      valueDomain: {
        type: 'STRING',
        text: {
          useRegEx: false,
          regEx: null,
          useMaximumLength: false
        }
      },
      slots: [],
      conceptAssociations: []
    }
  },
  defaultEnumeratedValueDomain () {
    return {
      identification: {
        elementType: 'ENUMERATED_VALUE_DOMAIN',
        status: 'DRAFT'
      },
      definitions: [
        ItemDefinition.data().defaultDefinition
      ],
      type: 'ENUMERATED',
      permittedValues: [
        {
          identification: {
            elementType: 'PERMISSIBLE_VALUE',
            status: 'DRAFT'
          },
          definitions: [
            ItemDefinition.data().defaultDefinition
          ],
          value: 'value'
        }
      ]
    }
  },
  defaultGroup () {
    return {
      identification: {
        elementType: 'DATAELEMENTGROUP',
        status: 'DRAFT'
      },
      definitions: [
        ItemDefinition.data().defaultDefinition
      ],
      slots: [],
      members: []
    }
  },
  defaultRecord () {
    return {
      identification: {
        elementType: 'RECORD',
        status: 'DRAFT'
      },
      definitions: [
        ItemDefinition.data().defaultDefinition
      ],
      slots: [],
      members: []
    }
  }
}
