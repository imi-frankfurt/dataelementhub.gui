import TextValidation from '~/components/validation/text'
import NumericValidation from '~/components/validation/numeric'
import DateTimeValidation from '~/components/validation/datetime'
import ItemDefinition from '~/components/item/item-definition'
// import defined from '~/components/validation/Defined.vue'
export default {
  defaultDataElement () {
    return {
      identification: {
        elementType: 'DATAELEMENT',
        status: 'DRAFT'
      },
      definitions: [{
        designation: ItemDefinition.props.designation.default,
        definition: ItemDefinition.props.definition.default,
        language: ItemDefinition.props.language.default
      }],
      slots: [],
      valueDomain: {
        type: 'STRING'
      },
      concepts: []
    }
  },
  defaultTextValidation () {
    return {
      useRegEx: TextValidation.props.useRegEx.default,
      regEx: TextValidation.props.regEx.default,
      useMaximumLength: TextValidation.props.useMaximumLength.default,
      maximumLength: TextValidation.props.maximumLength.default
    }
  },
  defaultNumericIntegerValidation () {
    return {
      useMinimum: NumericValidation.props.useMinimum.default,
      minimum: NumericValidation.props.minimum.default,
      useMaximum: NumericValidation.props.useMaximum.default,
      maximum: NumericValidation.props.maximum.default,
      unitOfMeasure: NumericValidation.props.unitOfMeasure.default,
      type: 'INTEGER'
    }
  },
  defaultNumericFloatValidation () {
    return {
      useMinimum: NumericValidation.props.useMinimum.default,
      minimum: NumericValidation.props.minimum.default,
      useMaximum: NumericValidation.props.useMaximum.default,
      maximum: NumericValidation.props.maximum.default,
      unitOfMeasure: NumericValidation.props.unitOfMeasure.default,
      type: 'FLOAT'
    }
  },
  defaultDateTimeValidation () {
    return {
      date: DateTimeValidation.props.dateFormat.default,
      time: DateTimeValidation.props.timeFormat.default,
      hourFormat: DateTimeValidation.props.hourFormat.default
    }
  },
  defaultDateValidation () {
    return {
      date: DateTimeValidation.props.dateFormat.default
    }
  },
  defaultTimeValidation () {
    return {
      time: DateTimeValidation.props.timeFormat.default
    }
  },
  defaultPermittedValuesValueDomain () {
    return [
      {
        value: undefined,
        meanings: []
      }
    ]
  },
  defaultDefinedValueDomain () {
    return [
      {
        identification: {
          elementType: 'DEFINED_VALUE_DOMAIN',
          status: 'DRAFT'
        },
        definitions: [{
          designation: ItemDefinition.props.designation.default,
          definition: ItemDefinition.props.definition.default,
          language: ItemDefinition.props.language.default
        }],
        valueDomainReferenceDTO: {
          codeSystem: {
            version: '',
            sourceId: ''
          },
          subsetUri: ''
        },
        definedPermittedValues: [
          {
            identification: {
              elementType: 'DEFINED_PERMISSIBLE_VALUE',
              status: 'DRAFT'
            },
            definitions: [{
              designation: ItemDefinition.props.designation.default,
              definition: ItemDefinition.props.definition.default,
              language: ItemDefinition.props.language.default
            }],
            value: undefined
          }
        ]
      }
    ]
  },
  defaultDefinedPermittedValuesValueDomain () {
    return [
      {
        identification: {
          elementType: 'DEFINED_PERMISSIBLE_VALUE',
          status: 'DRAFT'
        },
        definitions: [{
          designation: ItemDefinition.props.designation.default,
          definition: ItemDefinition.props.definition.default,
          language: ItemDefinition.props.language.default
        }],
        value: undefined
      }
    ]
  }
}
