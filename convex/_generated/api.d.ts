/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as academicYears from "../academicYears.js";
import type * as attendance from "../attendance.js";
import type * as classes from "../classes.js";
import type * as feeStructure from "../feeStructure.js";
import type * as financialReports from "../financialReports.js";
import type * as generateInvoices from "../generateInvoices.js";
import type * as grades from "../grades.js";
import type * as payments from "../payments.js";
import type * as promotions from "../promotions.js";
import type * as students from "../students.js";
import type * as subjects from "../subjects.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  academicYears: typeof academicYears;
  attendance: typeof attendance;
  classes: typeof classes;
  feeStructure: typeof feeStructure;
  financialReports: typeof financialReports;
  generateInvoices: typeof generateInvoices;
  grades: typeof grades;
  payments: typeof payments;
  promotions: typeof promotions;
  students: typeof students;
  subjects: typeof subjects;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
