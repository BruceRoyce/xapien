import { XapError } from "@/api/lib/xapError";

export type FetchReturnType<T> = T | XapError | false;

export type XapRequestPayload<PL> = PL & { failCode?: number };

export type XapResponse<T> = (
	| {
			success: true;
			data: T;
			error: never;
	  }
	| {
			success: false;
			data: never;
			error: XapError;
	  }
) & { statusCode?: number };

// Fragment for common date fields
export type DateFields = {
	date_created: string;
	date_updated: string;
	date_deleted?: string | null;
};

// Account entity response type
export type Account = {
	id: number;
	name: string;
	root_email_address: string;
	image_url: string | null;
	credit_remaining: number;
	is_active: boolean;
	is_suspended: boolean;
	notes: string | null;
} & DateFields;

// User entity response type
export type User = {
	id: number;
	account_id: number;
	email_address: string;
	credit: number;
	name: string | null;
	is_active: boolean;
	is_suspended: boolean;
	access_level: "super" | "admin" | "user";
	notes: string | null;
} & DateFields;

// Plan entity response type
export type Plan = {
	id: number;
	name: string;
	description: string | null;
	credit: number;
	price: number;
	interval: "monthly" | "one-off" | "trial";
	is_active: boolean;
} & DateFields;

// Query entity response type
export type Query = {
	id: number;
	user_id: number;
	query: string;
	result: string;
	credit_cost: number;
	status: "draft" | "pending" | "processing" | "completed" | "failed" | "abandoned";
} & DateFields;

// Order entity response type
export type Order = {
	id: number;
	account_id: number;
	plan_id: number;
	status: "in-basket" | "failed" | "abandoned" | "placed" | "cancelled";
} & DateFields;

// PaymentMethod entity response type
export type PaymentMethod = {
	id: number;
	account_id: number;
	nickname: string;
	payment_supplier_client_id: string;
	payment_supplier: "stripe" | "paypal";
	is_current: boolean;
	is_default: boolean;
	is_active: boolean;
} & DateFields;

// Subscription entity response type
export type Subscription = {
	id: number;
	account_id: number;
	payment_methods_id: number;
	charged_amount: number;
	order_id: number;
	status: "succeeded" | "failed" | "pending";
	attempt_count: number;
	interval_start_date: string;
	interval_end_date: string;
	// We don't update or delete the records for this entity
	date_created: string;
};

// Auth entity response type
export type Auth = {
	id: number;
	email_address: string;
	password_hash: string;
	salt: string;
	is_verified: boolean;
	otp_secret: string | null;
	otp_enabled: string | null;
	history: string | null;
	date_created: string;
	date_updated: string;
};
