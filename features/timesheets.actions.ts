export class GetTimesheets {
  static readonly type = '[Timesheets] Get list';
}

export class GetTimesheetsByPatientId {
  static readonly type = '[ Timesheets] Get list by patient Id';
  constructor(public patientId: string) {}
}
