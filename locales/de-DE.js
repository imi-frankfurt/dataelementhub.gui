export default {
  global: {
    appName: 'DataElementHub',
    mainMenu: {
      home: 'Home',
      mainView: 'Hauptansicht',
      namespaces: 'Namespaces',
      dataElements: 'Data Elements',
      groups: 'Groups',
      records: 'Records',
      valueSets: 'Value Sets',
      workspace: {
        workspace: 'Workspace',
        staging: 'Staging',
        drafts: 'Drafts',
        validate: 'Validate'
      },
      view: {
        view: 'View',
        myData: 'My data',
        public: 'Public data',
        valueSets: 'Value Sets'
      },
      tools: {
        tools: 'Tools',
        namespaceComparison: 'Namespace Vergleich',
        mapping: 'Mapping',
        visualizer: 'Visualizer',
        importExport: 'Importieren / Exportieren',
        search: 'Suche'
      },
      settings: 'Einstellungen',
      about: 'App Informationen',
      help: 'Hilfe'
    },
    alerts: {
      warning: 'WARNUNG!',
      defineLanguage: 'Bevorzugte Sprache ist nicht definiert.'
    },
    button: {
      save: 'Speichern',
      cancel: 'Beenden',
      add: 'Hinzufügen',
      create: 'Erstellen',
      edit: 'Editieren',
      delete: 'Löschen',
      close: 'Schließen',
      showInTreeView: 'IM TREEVIEW ZEIGEN'
    },
    addItem: 'ARTIKEL HINZUFÜGEN',
    dragAndDrop: 'einfach ziehen und ablegen',
    metaData: 'Meta Daten',
    status: 'Status',
    noItems: 'Keine Artikel verfügbar',
    addNamespaces: 'Fügen Sie neue Namespaces hinzu, indem Sie auf die Schaltfläche NAMESPACE ERSTELLEN klicken',
    type: 'Typ',
    namespace: 'Namespace',
    identifier: 'Identifier',
    revision: 'Revision',
    urn: 'URN',
    namespaceIdentifier: 'NAMESPACE IDENTIFIER',
    elementIdentifier: 'ELEMENT IDENTIFIER',
    elementVersion: 'ELEMENT VERSION',
    elementType: 'ELEMENT TYPE',
    hidden: 'Hidden',
    property: 'Property',
    properties: 'Eigenschaften',
    of: 'von',
    cancel: 'Abbrechen',
    definition: 'Definition',
    definitions: 'Definitions',
    designation: 'Designation',
    designations: 'Designations',
    slot: 'Slot',
    slots: 'Slots',
    valueDomain: 'Value Domain',
    valueDomains: 'Value Domains',
    valueDomainNotEditable: 'Value Domains kann im Moment nicht bearbeitet werden.',
    language: 'Language',
    languages: 'Languages',
    name: 'Name',
    value: 'Wert',
    prefix: 'Präfix',
    baseUrl: 'Base-URL',
    relation: 'Beziehung',
    relations: 'Beziehungen',
    yes: 'Ja',
    no: 'Nein',
    searchText: 'Suche Text',
    elementTypes: 'Element Typen',
    elementStatuses: 'Element status',
    filter: 'Ergebnisse filtern ...',
    notYetImplemented: 'Noch nicht implementiert ...',
    system: 'System',
    text: 'Text',
    term: 'Begriff',
    linkType: 'Link-Typ',
    version: 'Version',
    conceptAssociation: 'Concept Association',
    conceptAssociations: 'Concept Associations',
    member: 'Member',
    members: 'Members',
    logout: 'Ausloggen',
    regEx: 'RegEx',
    minimum: 'Minimum',
    maximum: 'Maximum',
    range: 'Bereich',
    maximumLength: 'Maximale Länge',
    date: 'Datum',
    time: 'Zeit',
    hourFormat: 'Uhr-Format',
    frontend: 'Frontend',
    backend: 'Backend',
    address: {
      name1: 'Universitätsklinikum Frankfurt',
      name2: 'Medical Informatics Group (MIG)',
      additionToAddress: 'Haus 33C 2 OG R216-R220',
      street: 'Theodor-Stern-Kai 7',
      zip: '60590',
      city: 'Frankfurt',
      web: 'https://www.mig-frankfurt.de'
    },
    table: {
      header: {
        id: 'Identifier',
        actions: 'Actions'
      },
      loading: 'Daten werden geladen. Bitte warten ...'
    },
    unreleasedMembersDialog: {
      message1: 'Released Groups und Records können nur released' +
        ' members enthalten!',
      message2: 'Bitte releasen Sie diese Memebrs zuerst:'
    },
    itemDialog: {
      deleteItemTitle: 'Sind Sie sicher, dass Sie diesen Artikel Element möchten?',
      snackbar: {
        deleteFailure: 'Dieses Element konnte nicht gelöscht werden!',
        deleteSuccess: 'Element gelöscht!',
        saveFailure: 'Dieses Element konnte nicht gespeichert werden!',
        saveSuccess: 'Element gespeichert!'
      }
    },
    select: {
      namespace: 'Wählen Sie ein Namespace ...',
      valueDomain: 'Wählen Sie ein Value Domain ...'
    },
    form: {
      validation: {
        messages: {
          requiredField: 'Dieses Feld ist erforderlich',
          definitionRequired: 'Definition ist erforderlich',
          designationRequired: 'Designation ist erforderlich',
          languageRequired: 'Language ist erforderlich',
          regExRequired: 'RegEx ist erforderlich',
          maximumLengthRequired: 'Maximale Länge ist erforderlich',
          minimumRequired: 'Minimum ist erforderlich',
          maximumRequired: 'Maximum ist erforderlich',
          unitOfMeasureRequired: 'Maßeinheit ist erforderlich',
          valueIsRequired: 'Wert ist erforderlich',
          namespaceIsRequired: 'Namespace ist erforderlich',
          nameIsRequired: 'Name ist erforderlich',
          maxChars: 'Maximum Chars überschritten'
        }
      },
      placeholder: {
        date: 'Datum eingeben',
        time: 'Uhrzeit eingeben',
        hourFormat: 'Uhrzeitformat eingeben',
        regEx: 'RegEx eingeben',
        maximumLength: 'Maximale Länge eingeben',
        minimum: 'Minimum eingeben',
        maximum: 'Maximum eingeben',
        value: 'Wert eingeben'
      },
      label: {
        useRegEx: 'RegEx verwenden',
        useMaximumLength: 'Maximale Länge verwenden',
        useMinimum: 'Minimum verwenden',
        useMaximum: 'Maximum verwenden',
        unitOfMeasure: 'Maßeinheit'
      }
    }
  },
  pages: {
    home: {
      title: 'Home',
      subtitle: '',
      content: {
        howdy: 'Willkommen beim Data Element Hub (DEHub)!',
        preAlpha: 'Was Sie hier sehen, ist eine Alpha-Version der neuen Data Element Hub GUI. Erwarten Sie also keine voll funktionsfähige fehlerfreie Version. Wir arbeiten kontinuierlich an der Verbesserung der Software.',
        bugReport: 'Wenn Sie auf einen Fehler stoßen, können Sie gerne ein Issue im Projekt-Repository erstellen, das Sie hier finden (<a href="https://github.com/mig-frankfurt/dataelementhub.gui" target="_blank">https://github.com/mig-frankfurt/dataelementhub.gui</a>) .',
        dockerImage: 'Von Zeit zu Zeit wird es ein neues Release des entsprechenden Docker-Images geben. Überprüfen Sie das also unbedingt auch.',
        thanks: 'Weitere Informationen finden Sie unter <a href="https://dataelementhub.de" target="_blank">https://dataelementhub.de</a><br><br><b>Danke!</b>'
      }
    },
    namespaces: {
      title: 'Namespaces',
      subtitle: '',
      itemDialog: {
        title: {
          create: 'Namespace Erstellen',
          update: 'Namespace updaten'
        },
        form: {
          publicNamespace: 'Öffentlicher Namespace'
        }
      },
      actions: {
        createNamespace: 'Namespace Erstellen'
      },
      table: {
        header: {
          designation: 'Designation',
          revision: 'Revision',
          status: 'Status'
        }
      },
      grantedNamespacesReadSubtitle: 'Readable Namespaces',
      grantedNamespacesWriteSubtitle: 'Writeable Namespaces',
      grantedNamespacesAdminSubtitle: 'Admin Namespaces',
      messages: {
        namespaceCreated: 'Namespace wurde erstellt'
      }
    },
    dataElements: {
      title: 'Data Elements',
      subtitle: '',
      itemDialog: {
        title: {
          create: 'Data Element Erstellen',
          update: 'Data Element Updaten'
        }
      },
      actions: {
        createDataElement: 'Datenelement Erstellen'
      },
      grantedDataElements: 'Verfügbare Data Elements',
      messages: {
        dataElementSaved: 'Data Element wurde erstellt'
      }
    },
    groups: {
      title: 'Data Element Groups',
      subtitle: '',
      itemDialog: {
        title: {
          create: 'Data Element Group Erstellen',
          update: 'Data Element Group Updaten'
        }
      },
      actions: {
        createDataElementGroup: 'Data Element Group Erstellen'
      },
      grantedDataElementGroups: 'Verfügbare Data Element Groups',
      messages: {
        dataElementGroupSaved: 'Data Element Group wurde erstellt'
      }
    },
    records: {
      title: 'Records',
      subtitle: '',
      itemDialog: {
        title: {
          create: 'Record Erstellen',
          update: 'Record Updaten'
        }
      },
      actions: {
        createRecord: 'Record Erstellen'
      },
      grantedRecords: 'Verfügbare Records',
      messages: {
        recordSaved: 'Record wurde gespeichert'
      }
    },
    valueSets: {
      title: 'Value Sets',
      subtitle: ''
    },
    workspace: {
      staging: {
        title: 'Staging Elements',
        subtitle: ''
      },
      drafts: {
        title: 'Drafts',
        subtitle: ''
      },
      validate: {
        title: 'Validate',
        subtitle: ''
      }
    },
    view: {
      myData: {
        title: 'My Data',
        subtitle: ''
      },
      public: {
        title: 'Public Data',
        subtitle: ''
      },
      valueSets: {
        title: 'Value Sets',
        subtitle: ''
      }
    },
    tools: {
      namespaceComparison: {
        title: 'Namespace Vergleich',
        subtitle: ''
      },
      mapping: {
        title: 'Mapping',
        subtitle: ''
      },
      visualizer: {
        title: 'Visualizer',
        subtitle: ''
      },
      importExport: {
        title: 'Import & Export',
        subtitle: ''
      },
      search: {
        title: 'Search',
        subtitle: '',
        elementSections: 'Element sections',
        searchResult: 'Search result'
      }
    },
    settings: {
      title: 'Einstellungen',
      subtitle: ''
    },
    about: {
      title: 'Über das Data Element Hub',
      subtitle: ''
    },
    help: {
      title: 'Hilfe',
      subtitle: ''
    },
    login: {
      title: 'Anmeldung',
      subtitle: '',
      infoAlert: {
        text: 'Um das DEHub nutzen zu können, müssen Sie sich gegen eine <abbr title="Single Sign On">SSO Server</abbr> authentifizieren. Die aktuelle <abbr title="Single Sign On">SSO Server</abbr> wird von der Medical Informatics Group (MIG) betrieben.'
      },
      loginButton: 'Klicken Sie hier, um sich mit SSO anzumelden'
    }
  }
}
