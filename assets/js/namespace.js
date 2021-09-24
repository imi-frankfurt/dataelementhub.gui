export default {
  castToListViewItem (ns) {
    const obj = {
      identifier: ns.identification.identifier,
      revision: ns.identification.revision,
      status: ns.identification.status
    }

    if (ns.definitions === undefined) {
      obj.definition = {
        designation: ns.definition.designation,
        definition: ns.definition.definition,
        language: ns.definition.language
      }
    } else {
      obj.definition = {
        designation: ns.definitions[0].designation,
        definition: ns.definitions[0].definition,
        language: ns.definitions[0].language
      }
    }

    return obj
  },
  defaultNamespace () {
    return {
      identification: {
        elementType: 'NAMESPACE',
        status: 'DRAFT',
        hideNamespace: false
      },
      definitions: [],
      slots: []
    }
  }
}
