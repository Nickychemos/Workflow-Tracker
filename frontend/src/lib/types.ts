export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "NEED_MORE_INFO"
  | "APPROVED"
  | "REJECTED"

export type ApplicationType =
  | "RECORDATION"
  | "RENEWAL"
  | "CHANGE_OF_OWNERSHIP"
  | "CHANGE_OF_NAME"
  | "DISCONTINUATION"

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  UNDER_REVIEW: "Under Review",
  NEED_MORE_INFO: "Need More Information",
  APPROVED: "Approved",
  REJECTED: "Rejected",
}

export const APPLICATION_TYPE_LABELS: Record<ApplicationType, string> = {
  RECORDATION: "Recordation",
  RENEWAL: "Renewal",
  CHANGE_OF_OWNERSHIP: "Change of Ownership",
  CHANGE_OF_NAME: "Change of Name",
  DISCONTINUATION: "Discontinuation",
}

export interface ApplicationListItem {
  id: string
  tracking_number: string
  applicant_name: string
  company_name: string
  application_type: ApplicationType
  status: ApplicationStatus
  created_at: string
}

export interface Application extends ApplicationListItem {
  applicant_email: string
  description: string
  reviewer_comment: string
  updated_at: string
  submitted_at: string | null
  reviewed_at: string | null
}

export type DecisionValue = "APPROVED" | "REJECTED" | "NEED_MORE_INFO"
