import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { GetTimesheets, GetTimesheetsByPatientId } from './timesheets.actions';
import { tap } from 'rxjs/operators';
import { TimesheetsService } from '../../../dashboard/services/timesheets.service';
import { convertMomentDate } from '../../../shared/helpers/date-format';
import { removeEmptyObjectValues } from '../../../shared/helpers/other';
import { FiltersKeyEnum } from '../../../shared/enums/filtersKey.enum';
import { FiltersState } from '../../../dashboard/store/filters/filters.state';

export interface TimesheetsStateModel {
  list: any[];
  listByPatientId: any;
  total: number;
  totalByPatientId: number;
}

const defaults: TimesheetsStateModel = {
  listByPatientId: [],
  totalByPatientId: 0,
  list: [],
  total: 0,
};

@State<TimesheetsStateModel>({
  name: 'timesheets',
  defaults,
})
@Injectable()
export class TimesheetsState {
  store = inject(Store);
  timesheetsService = inject(TimesheetsService);

  @Selector()
  static list(state: TimesheetsStateModel) {
    return state.list;
  }

  @Selector()
  static total(state: TimesheetsStateModel) {
    return state.total;
  }

  @Selector()
  static listByPatientId(state: TimesheetsStateModel) {
    return state.listByPatientId;
  }

  @Selector()
  static totalByPatientId(state: TimesheetsStateModel) {
    return state.totalByPatientId;
  }

  @Action(GetTimesheets)
  getList(ctx: StateContext<TimesheetsStateModel>) {
    const filtersValue = this.store.selectSnapshot(FiltersState.filters[FiltersKeyEnum.TimeSheets].model);
    return this.timesheetsService.getTimesheets(this.getFilters(filtersValue)).pipe(
      tap(({ data, total }) => {
        ctx.patchState({
          listByPatientId: data,
          totalByPatientId: total,
        });
      }),
    );
  }

  @Action(GetTimesheetsByPatientId)
  getListByPatientId(ctx: StateContext<TimesheetsStateModel>, { patientId }: GetTimesheetsByPatientId) {
    const filtersValue = this.store.selectSnapshot(FiltersState.filters[FiltersKeyEnum.PatientTimesheets].model);
    return this.timesheetsService.getTimesheets(this.getFilters(filtersValue, patientId)).pipe(
      tap(({ data, total }) => {
        ctx.patchState({ list: data, total });
      }),
    );
  }

  protected getFilters(data, patientId?: string) {
    const { caregivers, statuses, search, perPage, dir, order, coordinators, dateFrom, dateTo, page } = data || {};

    const trimmedSearch = typeof search === 'string' ? search.trim() : search;

    const params: Record<string, any> = {
      page,
      perPage,
      ...(dateFrom ? { dateFrom: convertMomentDate(dateFrom, 'YYYY-MM-DD') } : {}),
      ...(dateTo ? { dateTo: convertMomentDate(dateTo, 'YYYY-MM-DD') } : {}),
      ...(Array.isArray(caregivers) && caregivers.length ? { 'caregivers[]': caregivers } : {}),
      ...(Array.isArray(statuses) && statuses.length ? { 'statuses[]': statuses } : {}),
      ...(Array.isArray(coordinators) && coordinators.length ? { 'coordinators[]': coordinators } : {}),
      ...(trimmedSearch ? { search: trimmedSearch } : {}),
      ...(order && dir ? { order, dir } : {}),
      ...(patientId ? { patientId } : {}),
    };

    return removeEmptyObjectValues(params);
  }
}
