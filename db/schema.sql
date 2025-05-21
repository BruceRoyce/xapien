BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "accounts" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"root_email_address"	TEXT NOT NULL UNIQUE,
	"image_url"	TEXT DEFAULT NULL,
	"is_active"	BOOLEAN DEFAULT TRUE,
	"is_suspended"	BOOLEAN DEFAULT FALSE,
	"notes"	TEXT DEFAULT NULL,
	"date_created"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_updated"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_deleted"	TIMESTAMP DEFAULT NULL,
	"credit_remaining"	INTEGER DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "auth" (
	"id"	INTEGER,
	"email_address"	TEXT NOT NULL UNIQUE,
	"password_hash"	TEXT NOT NULL,
	"salt"	TEXT NOT NULL,
	"is_verified"	BOOLEAN DEFAULT TRUE,
	"otp_secret"	TEXT DEFAULT NULL,
	"otp_enabled"	TEXT DEFAULT NULL,
	"history"	TEXT DEFAULT NULL,
	"date_created"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_updated"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("email_address") REFERENCES "users"("email_address") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "orders" (
	"id"	INTEGER,
	"account_id"	INTEGER NOT NULL,
	"plan_id"	INTEGER NOT NULL,
	"status"	TEXT DEFAULT 'in-basket' CHECK("status" IN ('in-basket', 'failed', 'abandoned', 'placed', 'cancelled')),
	"date_created"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_updated"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_deleted"	TIMESTAMP DEFAULT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE,
	FOREIGN KEY("plan_id") REFERENCES "plans"("id")
);
CREATE TABLE IF NOT EXISTS "payment_methods" (
	"id"	INTEGER,
	"account_id"	INTEGER NOT NULL,
	"nickname"	TEXT NOT NULL,
	"payment_supplier_client_id"	TEXT NOT NULL UNIQUE,
	"payment_supplier"	TEXT NOT NULL CHECK("payment_supplier" IN ('stripe', 'paypal')),
	"is_current"	BOOLEAN DEFAULT FALSE,
	"is_default"	BOOLEAN DEFAULT FALSE,
	"is_active"	BOOLEAN DEFAULT TRUE,
	"date_created"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_updated"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_deleted"	TIMESTAMP DEFAULT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("account_id") REFERENCES "accounts"("id")
);
CREATE TABLE IF NOT EXISTS "plans" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL UNIQUE,
	"description"	TEXT DEFAULT NULL,
	"credit"	INTEGER NOT NULL DEFAULT 0,
	"price"	INTEGER NOT NULL,
	"interval"	TEXT NOT NULL DEFAULT 'monthly' CHECK("interval" IN ('monthly', 'one-off', 'trial')),
	"is_active"	BOOLEAN DEFAULT TRUE,
	"date_created"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_updated"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_deleted"	TIMESTAMP DEFAULT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "queries" (
	"id"	INTEGER,
	"user_id"	INTEGER NOT NULL,
	"query"	TEXT NOT NULL,
	"result"	TEXT NOT NULL,
	"credit_cost"	INTEGER NOT NULL DEFAULT 1,
	"status"	TEXT DEFAULT 'pending' CHECK("status" IN ('draft', 'pending', 'processing', 'completed', 'failed', 'abandoned')),
	"date_created"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_updated"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_deleted"	TIMESTAMP DEFAULT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id"	INTEGER,
	"account_id"	INTEGER NOT NULL,
	"payment_method_id"	INTEGER NOT NULL,
	"order_id"	INTEGER NOT NULL,
	"status"	TEXT DEFAULT 'pending' CHECK("status" IN ('succeeded', 'failed', 'pending')),
	"attempt_count"	INTEGER DEFAULT 1,
	"date_created"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"interval_start_date"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"interval_end_date"	TIMESTAMP DEFAULT NULL,
	"charged_amount"	INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE,
	FOREIGN KEY("order_id") REFERENCES "orders"("id"),
	FOREIGN KEY("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER,
	"account_id"	INTEGER NOT NULL,
	"email_address"	TEXT NOT NULL UNIQUE,
	"credit"	INTEGER DEFAULT 0,
	"name"	TEXT DEFAULT NULL,
	"is_active"	BOOLEAN DEFAULT TRUE,
	"is_suspended"	BOOLEAN DEFAULT FALSE,
	"access_level"	TEXT DEFAULT 'user' CHECK("access_level" IN ('super', 'admin', 'user')),
	"notes"	TEXT DEFAULT NULL,
	"date_created"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_updated"	TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	"date_deleted"	TIMESTAMP DEFAULT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	FOREIGN KEY("account_id") REFERENCES "accounts"("id")
);
INSERT INTO "accounts" ("id","name","root_email_address","image_url","is_active","is_suspended","notes","date_created","date_updated","date_deleted","credit_remaining") VALUES (1,'Xapien','super@xapien.com','/logos/xapien_ai_logo.jpg',1,0,NULL,'2025-05-17 16:47:07','2025-05-17 16:47:07',NULL,1000);
INSERT INTO "accounts" ("id","name","root_email_address","image_url","is_active","is_suspended","notes","date_created","date_updated","date_deleted","credit_remaining") VALUES (2,'Hey you!','client@example.com','/logos/rh.jpg',1,0,NULL,'2025-05-17 16:47:54','2025-05-17 16:47:54',NULL,37);
INSERT INTO "accounts" ("id","name","root_email_address","image_url","is_active","is_suspended","notes","date_created","date_updated","date_deleted","credit_remaining") VALUES (4,'ACME','client@acme.com','/logos/acme.webp',1,0,NULL,'2025-05-17 17:01:31','2025-05-17 17:01:31',NULL,36);
INSERT INTO "payment_methods" ("id","account_id","nickname","payment_supplier_client_id","payment_supplier","is_current","is_default","is_active","date_created","date_updated","date_deleted") VALUES (1,2,'VisaCard','6768-325-656-763245','stripe',1,1,1,'2025-05-19 20:59:53','2025-05-19 20:59:53',NULL);
INSERT INTO "payment_methods" ("id","account_id","nickname","payment_supplier_client_id","payment_supplier","is_current","is_default","is_active","date_created","date_updated","date_deleted") VALUES (2,4,'Amex','879879-76786567-876876','stripe',1,1,1,'2025-05-19 21:00:50','2025-05-19 21:00:50',NULL);
INSERT INTO "payment_methods" ("id","account_id","nickname","payment_supplier_client_id","payment_supplier","is_current","is_default","is_active","date_created","date_updated","date_deleted") VALUES (3,1,'Bottomless','y78365-yueywty-87867','stripe',1,1,1,'2025-05-19 21:01:35','2025-05-19 21:01:35',NULL);
INSERT INTO "plans" ("id","name","description","credit","price","interval","is_active","date_created","date_updated","date_deleted") VALUES (1,'Ultimate','Our best super-duper plan including 1000 reports per month',1000,200,'monthly',1,'2025-05-17 16:56:19','2025-05-17 16:56:19',NULL);
INSERT INTO "plans" ("id","name","description","credit","price","interval","is_active","date_created","date_updated","date_deleted") VALUES (2,'Enterprise','Go crazy with 500 reports per month in Enterprise plan.',500,150,'monthly',1,'2025-05-17 16:56:51','2025-05-17 16:56:51',NULL);
INSERT INTO "plans" ("id","name","description","credit","price","interval","is_active","date_created","date_updated","date_deleted") VALUES (3,'Basic','Medium use? 100 reports per month in this plan',100,100,'monthly',1,'2025-05-17 16:57:13','2025-05-17 16:57:13',NULL);
INSERT INTO "plans" ("id","name","description","credit","price","interval","is_active","date_created","date_updated","date_deleted") VALUES (4,'Lite','20 months per month',20,80,'monthly',1,'2025-05-17 16:57:38','2025-05-17 16:57:38',NULL);
INSERT INTO "plans" ("id","name","description","credit","price","interval","is_active","date_created","date_updated","date_deleted") VALUES (5,'Trial','10 reports in 2 weeks whichever comes sooner',10,0,'monthly',1,'2025-05-17 16:58:20','2025-05-17 16:58:20',NULL);
INSERT INTO "plans" ("id","name","description","credit","price","interval","is_active","date_created","date_updated","date_deleted") VALUES (6,'Top-up',NULL,1,0,'monthly',1,'2025-05-17 16:58:55','2025-05-17 16:58:55',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (1,2,'admin@example.com',0,'James',1,0,'admin',NULL,'2025-05-17 16:51:57','2025-05-17 16:51:57',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (2,2,'user1@example.com',0,'Sara',1,0,'user',NULL,'2025-05-17 16:53:04','2025-05-17 16:53:04',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (3,2,'user2@example.com',0,'Robert',1,0,'user',NULL,'2025-05-17 16:53:53','2025-05-17 16:53:53',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (4,2,'user3@example.com',0,'Michael',1,0,'user',NULL,'2025-05-17 16:54:20','2025-05-17 16:54:20',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (5,1,'super@xapien.com',0,'Reece',1,0,'super',NULL,'2025-05-17 16:55:29','2025-05-17 16:55:29',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (6,4,'client@acme.com',0,'Clark',1,0,'admin',NULL,'2025-05-17 17:48:12','2025-05-17 17:48:12',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (7,4,'no1@acme.com',0,'Bruce',1,0,'user',NULL,'2025-05-17 17:48:12','2025-05-17 17:48:12',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (8,4,'no2@acme.com',0,'Joe',1,0,'user',NULL,'2025-05-17 17:48:12','2025-05-17 17:48:12',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (9,4,'no3@acme.com',0,'Jim',1,0,'user',NULL,'2025-05-17 17:48:12','2025-05-17 17:48:12',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (10,4,'no4@acme.com',0,'Jack',1,0,'user',NULL,'2025-05-17 17:48:12','2025-05-17 17:48:12',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (11,4,'no5@acme.com',0,'Jullia',1,0,'user',NULL,'2025-05-17 17:48:12','2025-05-17 17:48:12',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (12,4,'no6@acme.com',0,'Molly',1,0,'user',NULL,'2025-05-17 17:48:12','2025-05-17 17:48:12',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (13,4,'no7@acme.com',0,'Debra',1,0,'user',NULL,'2025-05-17 17:48:12','2025-05-17 17:48:12',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (14,4,'no9@acme.com',0,'Mo',1,0,'user',NULL,'2025-05-17 17:48:12','2025-05-17 17:48:12',NULL);
INSERT INTO "users" ("id","account_id","email_address","credit","name","is_active","is_suspended","access_level","notes","date_created","date_updated","date_deleted") VALUES (15,4,'no10@acme.com',0,'Matt',1,0,'user',NULL,'2025-05-17 17:48:12','2025-05-17 17:48:12',NULL);
CREATE INDEX IF NOT EXISTS "idx_auth_email_address" ON "auth" (
	"email_address"
);
CREATE INDEX IF NOT EXISTS "idx_plans_name" ON "plans" (
	"name"
);
CREATE INDEX IF NOT EXISTS "idx_queries_status" ON "queries" (
	"status"
);
CREATE INDEX IF NOT EXISTS "idx_queries_user_id" ON "queries" (
	"user_id"
);
CREATE INDEX IF NOT EXISTS "idx_users_email_address" ON "users" (
	"email_address"
);
COMMIT;
