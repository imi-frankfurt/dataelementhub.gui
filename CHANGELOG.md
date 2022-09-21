# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - UNRELEASED
### Added
- Add conceptAssociations to dataElement dialog [https://github.com/mig-frankfurt/dataelementhub.gui/issues/1]
- Add about and help pages [https://github.com/mig-frankfurt/dataelementhub.gui/issues/4]
- Update treeView after adding, editing or deleting an element [https://github.com/mig-frankfurt/dataelementhub.gui/issues/8]
- Add definition table to group detail view [https://github.com/mig-frankfurt/dataelementhub.gui/issues/14]
- Add permittedValues table [https://github.com/mig-frankfurt/dataelementhub.gui/issues/38]
- Add scrollbar to the treeView [https://github.com/mig-frankfurt/dataelementhub.gui/issues/41]
- Translate the dehub to german [https://github.com/mig-frankfurt/dataelementhub.gui/issues/42]
- Add slots table to dataElementGroup detail view [https://github.com/mig-frankfurt/dataelementhub.gui/issues/64]

### Changed
- Adjust definitions structure [https://github.com/mig-frankfurt/dataelementhub.gui/issues/11]
- Public namespaces require no login [https://github.com/mig-frankfurt/dataelementhub.gui/issues/19]
- Hide subElements in main view [https://github.com/mig-frankfurt/dataelementhub.gui/issues/25]
- Update dataElementGroup members [https://github.com/mig-frankfurt/dataelementhub.gui/issues/33]
- Redesign detailViews [https://github.com/mig-frankfurt/dataelementhub.gui/issues/40]
- Design makeover [https://github.com/mig-frankfurt/dataelementhub.gui/issues/47]
- Update the treeView completely from the backend [https://github.com/mig-frankfurt/dataelementhub.gui/issues/49]
- Auto release valueDomain with its associated dataElement [https://github.com/mig-frankfurt/dataelementhub.gui/issues/62]
- Record members should not be editable if the record is released [https://github.com/mig-frankfurt/dataelementhub.gui/issues/74]
- Allow updating dataElementGroups even if they contain outdated members [https://github.com/mig-frankfurt/dataelementhub.gui/issues/76]
- Design improvements [https://github.com/mig-frankfurt/dataelementhub.gui/issues/82]
- Set maxWidth to the table of dataElementGroup members [https://github.com/mig-frankfurt/dataelementhub.gui/issues/88]
- Set maxWidth to the table of enumerated valueDomains [https://github.com/mig-frankfurt/dataelementhub.gui/issues/90]

### Deprecated
### Removed
- Remove unused code [https://github.com/mig-frankfurt/dataelementhub.gui/issues/84]

### Fixed
- Groups members are not loaded properly [https://github.com/mig-frankfurt/dataelementhub.gui/issues/2]
- Clear dialogs after closing them [https://github.com/mig-frankfurt/dataelementhub.gui/issues/6]
- Backend messages are not shown properly [https://github.com/mig-frankfurt/dataelementhub.gui/issues/13]
- Element activation in treeView is not working properly [https://github.com/mig-frankfurt/dataelementhub.gui/issues/21]
- Navigation drawer is not displayed properly [https://github.com/mig-frankfurt/dataelementhub.gui/issues/27]
- Add element button is not working properly [https://github.com/mig-frankfurt/dataelementhub.gui/issues/35]
- Outdated elements can be added as dataElementGroup members [https://github.com/mig-frankfurt/dataelementhub.gui/issues/36]
- DataElementGroup members are not visible in the update dialog [https://github.com/mig-frankfurt/dataelementhub.gui/issues/56]
- Hide create edit and delete buttons for unLogged users [https://github.com/mig-frankfurt/dataelementhub.gui/issues/58]
- Public namespaces are saved as hidden [https://github.com/mig-frankfurt/dataelementhub.gui/issues/66]
- OUTDATED elements are not allowed to be edited [https://github.com/mig-frankfurt/dataelementhub.gui/issues/68]
- Available Element paths are not displayed in the search view [https://github.com/mig-frankfurt/dataelementhub.gui/issues/70]
- Releasing members from the dataElementGroup dialog leads to errors [https://github.com/mig-frankfurt/dataelementhub.gui/issues/78]
- Time and enumerated value domains are not passing backend validation [https://github.com/mig-frankfurt/dataelementhub.gui/issues/80]

### Security
- Allow to set OAuth ClientID via ENV [https://github.com/mig-frankfurt/dataelementhub.gui/issues/29]
- Secure cookies [https://github.com/mig-frankfurt/dataelementhub.gui/issues/53]
- Handle invalid token [https://github.com/mig-frankfurt/dataelementhub.gui/issues/72]
- Update dependencies [https://github.com/mig-frankfurt/dataelementhub.gui/issues/86]

## [1.0.0-alpha] - 2021-09-30
### Added
- Add a view containing all elements
- Add detail view to describe all element parts
- Enable the navigation to parent elements from the detail view
- Enable creating, deleting and editing elements
- Enable releasing dataElementGroup members from the dataElementGroup dialog
- Add search functionality
### Changed
### Deprecated
### Removed
### Fixed
### Security
