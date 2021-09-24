import TextValidation from '~/components/validation/text'
import NumericValidation from '~/components/validation/numeric'
import DateTimeValidation from '~/components/validation/datetime'
import ItemDefinition from '~/components/item/item-definition'
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
      }
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
  }
}
