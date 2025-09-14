const TYPES = {
  IGreetingService: Symbol.for("IGreetingService"),
  IGreetingController: Symbol.for("IGreetingController"),
  IScannerController: Symbol.for("IScannerController"),
  IScannerRepository: Symbol.for("IScannerRepository"),
  IScannerService: Symbol.for("IScannerService"),
  ISummaryController: Symbol.for("ISummaryController"),
  ISummaryRepository: Symbol.for("ISummaryRepository"),
  ISummaryService: Symbol.for("ISummaryService"),
  IMigrationController: Symbol.for("IMigrationController"),
  IMigrationRepository: Symbol.for("IMigrationRepository"),
  IMigrationService: Symbol.for("IMigrationService"),
  IProfileRepository: Symbol.for("IProfileRepository"),
  IProfileService: Symbol.for("IProfileService"),
  IProfileController: Symbol.for("IProfileController"),
  SQLiteDatabase: Symbol.for("SQLiteDatabase"),
};

export { TYPES };
