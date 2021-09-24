import ItemDefinition from '~/components/item/item-definition'
export default {
  buildUrn (namespaceId, elementType, identifier, version) {
    return 'urn:' + namespaceId + ':' + elementType.toLowerCase() + ':' + identifier + ':' + version
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
  elementStatuses () {
    return [
      'DRAFT',
      'RELEASED'
    ]
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
        hideNamespace: true
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
      valueDomain: {
        type: 'STRING',
        text: {
          useRegEx: false,
          regEx: null,
          useMaximumLength: false
        }
      },
      slots: []
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
